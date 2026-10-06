import base64
import html
from collections.abc import Mapping
from mimetypes import guess_type
from pypdf import PdfReader

from ..models import LearningResource
from .base import BasePreparationGenerator


class ImageGenerator(BasePreparationGenerator):
    def generate(self, resource: LearningResource, options: Mapping[str, object]) -> dict:
        mode = str(options.get("image_mode", "diagram"))
        if mode in {"source_image", "extracted_image"}:
            if resource.resource_type == LearningResource.ResourceType.IMAGE and resource.file:
                image = resource.file.read()
                resource.file.seek(0)
                mime = resource.mime_type or "image/png"
                return self.validate_result({"title": resource.title, "image_mode": "source_image", "mime_type": mime, "image_data": base64.b64encode(image).decode("ascii"), "alt": resource.title, "grounding": "Original user-uploaded source image; it has not been overwritten or generated."})
            if mode == "extracted_image" and resource.resource_type == LearningResource.ResourceType.PDF:
                with resource.file.open("rb") as stream:
                    reader = PdfReader(stream)
                    for page_number, page in enumerate(reader.pages, start=1):
                        if page.images:
                            image = page.images[0]
                            mime = guess_type(image.name)[0] or "image/png"
                            return self.validate_result({"title": f"{resource.title} — page {page_number}", "image_mode": mode, "mime_type": mime, "image_data": base64.b64encode(image.data).decode("ascii"), "alt": f"Image extracted from page {page_number} of {resource.title}", "source_page": page_number})
            raise ValueError("No source image is available for this resource. Upload an image or choose diagram/illustration.")

        title = html.escape(resource.title[:100])
        source_text = self.source_text(resource)
        if len(source_text.strip()) < 30:
            raise ValueError("Creating a source-based visual requires readable text in the selected resource.")
        excerpt = html.escape(source_text[:180] or resource.description[:180])
        label = html.escape(str(options.get("style", "educational"))[:60])
        width, height = {
            "1:1": (540, 540),
            "4:3": (720, 540),
            "16:9": (960, 540),
            "9:16": (304, 540),
        }.get(str(options.get("aspect_ratio", "16:9")), (960, 540))
        title_label = f'<text x="120" y="165" font-family="sans-serif" font-size="38" font-weight="700" fill="#285d4c">{title}</text>' if options.get("labels", True) else ""
        caption_label = f'<text x="120" y="220" font-family="sans-serif" font-size="20" fill="#758078">{label.title()} · source-based visual</text>' if options.get("labels", True) else ""
        svg = (
            "".join([
                f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 960 540" preserveAspectRatio="xMidYMid meet">',
                '<rect width="960" height="540" rx="32" fill="#f0f5ef"/>',
                '<rect x="70" y="65" width="820" height="410" rx="24" fill="#fffefa" stroke="#dce7dd" stroke-width="3"/>',
                title_label,
                caption_label,
                '<circle cx="205" cy="340" r="56" fill="#d9eade"/><circle cx="480" cy="340" r="56" fill="#e9dfcf"/><circle cx="755" cy="340" r="56" fill="#dfe5f1"/>',
                '<path d="M270 340h140m-12-12 12 12-12 12M545 340h140m-12-12 12 12-12 12" fill="none" stroke="#54836a" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>',
                f'<text x="120" y="440" font-family="sans-serif" font-size="18" fill="#52645a">{excerpt}</text></svg>',
            ])
        )
        return self.validate_result({
            "title": f"{resource.title} — {mode.replace('_', ' ').title()}",
            "image_mode": mode,
            "style": options.get("style", "educational"),
            "aspect_ratio": options.get("aspect_ratio", "16:9"),
            "labels": bool(options.get("labels", True)),
            "mime_type": "image/svg+xml",
            "svg": svg,
            "alt": f"Source-based educational {mode.replace('_', ' ')} for {resource.title}",
            "grounding": "Diagram labels are drawn from the selected resource; this is a template-based SVG, not a generative image model.",
        })
