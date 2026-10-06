import re
from collections.abc import Mapping

from ..models import LearningResource
from .base import BasePreparationGenerator


class OtherGenerator(BasePreparationGenerator):
    """Create a bounded, source-grounded custom study artifact from allowed formats."""

    def generate(self, resource: LearningResource, options: Mapping[str, object]) -> dict:
        source = self.require_source_text(resource)
        request = str(options.get("other_request", "")).strip()
        if not 5 <= len(request) <= 240:
            raise ValueError("Describe the custom material you want in 5–240 characters.")
        sentences = list(dict.fromkeys(
            part.strip() for part in re.split(r"(?<=[.!?])\s+|\n+", source)
            if len(part.strip()) >= 30
        ))
        if not sentences:
            raise ValueError("The selected source does not contain enough text for custom material.")
        output_format = str(options.get("other_format", "study_guide"))
        format_titles = {
            "study_guide": "Study guide",
            "glossary": "Source glossary",
            "outline": "Topic outline",
            "practice_prompts": "Practice prompts",
        }
        sections = [{
            "heading": f"{format_titles[output_format]} · {resource.title}",
            "content": " ".join(sentences[:8]),
            "source_sentences": min(8, len(sentences)),
        }]
        if len(sentences) > 8:
            sections.append({
                "heading": "Further details",
                "content": " ".join(sentences[8:16]),
                "source_sentences": min(8, len(sentences) - 8),
            })
        return self.validate_result({
            "title": f"{resource.title} — {format_titles[output_format]}",
            "requested_material": request,
            "format": output_format,
            "language": options.get("language", "en"),
            "sections": sections,
            "grounding": "Custom material uses only extracted statements from the selected source. This deterministic template does not call an external AI provider.",
        })
