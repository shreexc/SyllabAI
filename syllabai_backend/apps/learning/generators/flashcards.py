import re
from collections.abc import Mapping

from ..models import LearningResource
from .base import BasePreparationGenerator


class FlashcardGenerator(BasePreparationGenerator):
    def generate(self, resource: LearningResource, options: Mapping[str, object]) -> dict:
        text = self.require_source_text(resource)
        statements = [" ".join(part.split()) for part in re.split(r"(?<=[.!?])\s+|\n+", text) if len(part.strip()) > 30]
        cards = []
        seen: set[str] = set()
        for source_index, statement in enumerate(statements):
            terms = re.findall(r"\b[A-Z][a-zA-Z-]{3,}\b", statement)
            term = terms[-1] if terms else next((word.strip(".,:;()") for word in statement.split() if len(word) > 8), "Key idea")
            if term.casefold() in seen:
                continue
            seen.add(term.casefold())
            cards.append({"id": len(cards) + 1, "front": f"What does the source explain about {term}?", "back": statement, "source_sentence": source_index})
            if len(cards) >= int(options.get("count", 20)):
                break
        return self.validate_result({
            "title": f"{resource.title} Flashcards",
            "count": len(cards),
            "difficulty": options.get("difficulty", "medium"),
            "language": options.get("language", "en"),
            "cards": cards,
            "grounding": "Flashcard answers are derived directly from extracted source statements.",
        })
