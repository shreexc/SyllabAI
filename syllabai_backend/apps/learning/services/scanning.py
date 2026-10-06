"""Malware scanner integration point; uploaded files are never executed."""

from django.conf import settings
from django.utils.module_loading import import_string


def scan_upload(upload) -> str:
    """Run an optional dotted-path scanner returning ``clean`` or ``infected``."""
    scanner_path = settings.LEARNING_MALWARE_SCANNER
    if scanner_path == "disabled":
        upload.seek(0)
        return "not_configured"
    scanner = import_string(scanner_path)
    state = scanner(upload)
    upload.seek(0)
    if state != "clean":
        raise ValueError("The uploaded file did not pass malware scanning.")
    return "clean"
