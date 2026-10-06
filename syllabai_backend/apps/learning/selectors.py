from uuid import UUID

from rest_framework.exceptions import NotFound

from .models import LearningResource, PreparationRequest


def owned_resources(user):
    return LearningResource.objects.filter(owner=user)


def get_owned_resource(user, resource_id: UUID) -> LearningResource:
    try:
        return owned_resources(user).get(id=resource_id)
    except LearningResource.DoesNotExist as error:
        raise NotFound("Learning resource not found.") from error


def get_owned_preparation(user, preparation_id: UUID) -> PreparationRequest:
    try:
        return PreparationRequest.objects.select_related("resource").get(user=user, id=preparation_id)
    except PreparationRequest.DoesNotExist as error:
        raise NotFound("Preparation request not found.") from error
