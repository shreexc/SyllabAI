from django.db.models import F, Q
from rest_framework.exceptions import ValidationError

from ..models import LearningResource, PreparationRequest
from ..selectors import owned_resources


def search_resources(user, query: str, preparation_type: str = "", limit: int = 20) -> list[LearningResource]:
    if preparation_type and preparation_type not in PreparationRequest.PreparationType.values:
        raise ValidationError({"type": ["Choose quiz, short_note, flashcard, image, or animation."]})
    term = query.strip()
    queryset = owned_resources(user).filter(status=LearningResource.Status.READY)
    if term:
        queryset = queryset.filter(
            Q(title__icontains=term)
            | Q(description__icontains=term)
            | Q(chunks__text__icontains=term, chunks__resource_version=F("resource_version"))
        ).distinct()
    return list(queryset.order_by("-created_at")[:limit])
