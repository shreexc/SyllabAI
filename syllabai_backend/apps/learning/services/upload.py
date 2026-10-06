import mimetypes
from pathlib import PurePath
from zipfile import BadZipFile, ZipFile

from django.conf import settings
from django.core.exceptions import ValidationError
from PIL import Image, UnidentifiedImageError
from pypdf import PdfReader

SUPPORTED = {
    ".pdf": ("application/pdf", "pdf"),
    ".png": ("image/png", "image"),
    ".jpg": ("image/jpeg", "image"),
    ".jpeg": ("image/jpeg", "image"),
    ".webp": ("image/webp", "image"),
    ".txt": ("text/plain", "txt"),
    ".docx": ("application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"),
}


def validate_upload(upload):
    extension = PurePath(upload.name).suffix.lower()
    spec = SUPPORTED.get(extension)
    if spec is None:
        raise ValidationError({"file": ["Supported formats are PDF, PNG, JPG, JPEG, WEBP, TXT and DOCX."]})
    expected_mime, resource_type = spec
    if upload.size <= 0 or upload.size > settings.LEARNING_MAX_UPLOAD_BYTES:
        raise ValidationError({"file": [f"File size must be between 1 byte and {settings.LEARNING_MAX_UPLOAD_BYTES // (1024 * 1024)} MB."]})

    start = upload.read(16)
    upload.seek(0)
    detected_mime = None
    try:
        if extension == ".pdf":
            if not start.startswith(b"%PDF-"):
                raise ValueError("The file does not contain a valid PDF signature.")
            reader = PdfReader(upload, strict=True)
            if reader.is_encrypted:
                raise ValueError("Encrypted PDFs are not supported.")
            if len(reader.pages) > settings.LEARNING_MAX_PDF_PAGES:
                raise ValueError(f"PDF exceeds the {settings.LEARNING_MAX_PDF_PAGES}-page limit.")
        elif resource_type == "image":
            with Image.open(upload) as image:
                detected_mime = Image.MIME.get(image.format)
                if image.width * image.height > settings.LEARNING_MAX_IMAGE_PIXELS:
                    raise ValueError("Image dimensions exceed the configured pixel limit.")
                image.verify()
        elif extension == ".docx":
            with ZipFile(upload) as archive:
                members = archive.infolist()
                uncompressed_bytes = sum(member.file_size for member in members)
                if uncompressed_bytes > settings.LEARNING_MAX_DOCX_UNCOMPRESSED_BYTES:
                    raise ValueError("The DOCX expands beyond the configured document limit.")
                if "[Content_Types].xml" not in archive.namelist() or "word/document.xml" not in archive.namelist():
                    raise ValueError("The document is not a valid DOCX file.")
            detected_mime = expected_mime
        else:
            upload.read().decode("utf-8")
            detected_mime = "text/plain"
    except (ValueError, BadZipFile, UnidentifiedImageError, OSError) as error:
        raise ValidationError({"file": [str(error) or "The file content is invalid."]}) from error
    finally:
        upload.seek(0)

    if resource_type == "image" and detected_mime != expected_mime:
        raise ValidationError({"file": ["The file content does not match its extension and MIME type."]})
    if resource_type in {"txt", "docx"} and detected_mime != expected_mime:
        raise ValidationError({"file": ["The file content does not match its extension and MIME type."]})
    reported_mime = (getattr(upload, "content_type", "") or mimetypes.guess_type(upload.name)[0] or expected_mime).lower()
    if reported_mime not in {expected_mime, "application/octet-stream"} and not (extension in {".jpg", ".jpeg"} and reported_mime == "image/jpg"):
        raise ValidationError({"file": ["The declared MIME type does not match the file content."]})
    return {"resource_type": resource_type, "mime_type": expected_mime, "file_size": upload.size}
