from abc import ABC, abstractmethod
from collections.abc import Mapping

from rest_framework.exceptions import ValidationError

from ..models import LearningResource, PreparationRequest


class BasePreparationGenerator(ABC):
    version = "extractive-1"
    prompt_version = "source-extractive-1"
    model_name = "extractive-source"

    @abstractmethod
    def generate(self, resource: LearningResource, options: Mapping[str, object]) -> dict:
        raise NotImplementedError

    @staticmethod
    def source_text(resource: LearningResource) -> str:
        return "\n".join(resource.chunks.filter(resource_version=resource.resource_version).values_list("text", flat=True))

    @classmethod
    def require_source_text(cls, resource: LearningResource) -> str:
        text = cls.source_text(resource)
        if len(text.strip()) < 30:
            raise ValueError("This preparation needs readable text in the selected resource.")
        return text

    @staticmethod
    def validate_result(result: object) -> dict:
        if not isinstance(result, dict) or not result:
            raise ValidationError("Generator returned an empty or invalid result.")
        return result


def generator_for(preparation_type: str) -> BasePreparationGenerator:
    from . import AnimationGenerator, FlashcardGenerator, ImageGenerator, OtherGenerator, QuizGenerator, ShortNoteGenerator

    mapping = {
        PreparationRequest.PreparationType.QUIZ: QuizGenerator,
        PreparationRequest.PreparationType.SHORT_NOTE: ShortNoteGenerator,
        PreparationRequest.PreparationType.FLASHCARD: FlashcardGenerator,
        PreparationRequest.PreparationType.IMAGE: ImageGenerator,
        PreparationRequest.PreparationType.ANIMATION: AnimationGenerator,
        PreparationRequest.PreparationType.OTHER: OtherGenerator,
    }
    generator = mapping.get(preparation_type)
    if generator is None:
        raise ValidationError({"preparation_type": ["Unsupported preparation type."]})
    return generator()
