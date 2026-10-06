import re
from collections.abc import Mapping

from ..models import LearningResource
from .base import BasePreparationGenerator


class AnimationGenerator(BasePreparationGenerator):
    def generate(self, resource: LearningResource, options: Mapping[str, object]) -> dict:
        text = self.require_source_text(resource)
        sentences = list(dict.fromkeys(part.strip() for part in re.split(r"(?<=[.!?])\s+|\n+", text) if len(part.strip()) > 30))
        duration = int(options.get("duration", 90))
        scene_count = min(len(sentences), max(1, min(duration // 10, 8)))
        scene_duration, extra_seconds = divmod(duration, scene_count)
        scenes = [{
            "type": "concept_explanation" if index else "intro",
            "duration": scene_duration + (1 if index < extra_seconds else 0),
            "narration": sentence[:500],
            "visual": "title_card" if index == 0 else "concept_card",
            "source_chunk": index,
        } for index, sentence in enumerate(sentences[:scene_count])]
        return self.validate_result({
            "title": f"{resource.title} — Storyboard",
            "duration": duration,
            "style": options.get("style", "educational"),
            "difficulty": options.get("difficulty", "beginner"),
            "language": options.get("language", "en"),
            "animation_type": options.get("animation_type", "concept_explanation"),
            "status": "storyboard_ready",
            "rendered_video": False,
            "scenes": scenes,
            "renderer": "svg-storyboard-1",
            "grounding": "Storyboard narration is selected from extracted source statements. The output is a browser-playable animated SVG storyboard, not an MP4 video.",
        })
