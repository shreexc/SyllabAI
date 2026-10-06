import re
from collections.abc import Mapping

from django.conf import settings

from ..models import LearningResource
from .base import BasePreparationGenerator


class ShortNoteGenerator(BasePreparationGenerator):
    def generate(self, resource: LearningResource, options: Mapping[str, object]) -> dict:
        text = self.require_source_text(resource)
        paragraphs = list(dict.fromkeys(" ".join(part.split()) for part in re.split(r"(?<=[.!?])\s+|\n+", text) if len(part.strip()) > 30))
        maximum = min({"short": 5, "medium": 10, "long": settings.LEARNING_MAX_NOTE_POINTS}.get(str(options.get("length", "medium")), 10), settings.LEARNING_MAX_NOTE_POINTS)
        key_points = paragraphs[:maximum]
        terms: list[dict[str, str]] = []
        for paragraph in paragraphs:
            for term in re.findall(r"\b[A-Z][a-zA-Z-]{3,}(?:\s+[A-Z][a-zA-Z-]{3,})?\b", paragraph):
                if term.casefold() != resource.title.casefold() and all(existing["term"] != term for existing in terms):
                    terms.append({"term": term, "meaning": paragraph[:360]})
                if len(terms) >= 8:
                    break
            if len(terms) >= 8:
                break
        return self.validate_result({
            "title": resource.title,
            "summary": " ".join(key_points[:3]),
            "key_points": key_points,
            "important_terms": terms,
            "language": options.get("language", "en"),
            "style": options.get("style", "bullet_points"),
            "paragraph": " ".join(key_points) if options.get("style") == "paragraph" else "",
            "grounding": "Notes are extractive and derived from the selected resource.",
        })
