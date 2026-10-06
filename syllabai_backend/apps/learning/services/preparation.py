import hashlib
import json
import base64
import binascii

from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.files.base import ContentFile
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from ..generators.animation_renderer import AnimationRenderer
from ..generators.base import generator_for
from ..models import LearningResource, PreparationRequest
from ..selectors import get_owned_resource
from .validation import validate_preparation_output


def cache_key_for(resource: LearningResource, preparation_type: str, options: dict) -> str:
    value = {
        "resource_id": str(resource.id),
        "resource_version": resource.resource_version,
        "preparation_type": preparation_type,
        "options": options,
        "generator": "extractive-1",
        "prompt": "source-extractive-1",
    }
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(",", ":")).encode()).hexdigest()


@transaction.atomic
def create_preparation(*, user, resource_id, preparation_type: str, options: dict) -> tuple[PreparationRequest, bool]:
    user = get_user_model().objects.select_for_update().get(pk=user.pk)
    resource = get_owned_resource(user, resource_id)
    if resource.status != LearningResource.Status.READY:
        raise ValidationError({"resource_id": ["Resource processing must complete successfully before preparation."]})
    active_jobs = PreparationRequest.objects.filter(
        user=user,
        status__in=[PreparationRequest.Status.PENDING, PreparationRequest.Status.PROCESSING],
    ).count()
    if active_jobs >= settings.LEARNING_MAX_ACTIVE_PREPARATIONS:
        raise ValidationError({"preparation": [f"You already have {active_jobs} active preparations. Wait for one to finish before starting another."]})
    key = cache_key_for(resource, preparation_type, options)
    previous = PreparationRequest.objects.filter(user=user, cache_key=key, status=PreparationRequest.Status.COMPLETED).first()
    if previous:
        cached = PreparationRequest.objects.create(
            user=user, resource=resource, preparation_type=preparation_type,
            status=PreparationRequest.Status.COMPLETED, options=options, result=previous.result,
            generator_version=previous.generator_version, prompt_version=previous.prompt_version,
            model_name=previous.model_name, cache_key=key, completed_at=timezone.now(),
        )
        if previous.result_file:
            previous.result_file.open("rb")
            try:
                cached.result_file.save(previous.result_file.name.rsplit("/", 1)[-1], ContentFile(previous.result_file.read()), save=True)
            finally:
                previous.result_file.close()
        return cached, False
    preparation = PreparationRequest.objects.create(
        user=user,
        resource=resource,
        preparation_type=preparation_type,
        options=options,
        cache_key=key,
    )
    return preparation, True


def process_preparation(preparation_id: str) -> None:
    with transaction.atomic():
        preparation = PreparationRequest.objects.select_for_update().select_related("resource").get(id=preparation_id)
        if preparation.status != PreparationRequest.Status.PENDING:
            return
        preparation.status = PreparationRequest.Status.PROCESSING
        preparation.save(update_fields=["status"])
    try:
        resource = preparation.resource
        if resource.status != LearningResource.Status.READY:
            raise ValueError("The selected resource is no longer ready.")
        generator = generator_for(preparation.preparation_type)
        result = generator.validate_result(generator.generate(resource, preparation.options))
        result = validate_preparation_output(preparation.preparation_type, result, resource)
        image_data = result.pop("image_data", None)
        svg_markup = result.pop("svg", None)
        animation_specification = None
        if preparation.preparation_type == PreparationRequest.PreparationType.ANIMATION:
            animation_specification = result
            rendered_svg = AnimationRenderer().render(animation_specification)
            image_data = base64.b64encode(rendered_svg).decode("ascii")
            result["scene_count"] = len(animation_specification["scenes"])
        result_file = None
        if svg_markup is not None:
            if not isinstance(svg_markup, str) or not svg_markup.startswith("<svg"):
                raise ValueError("The generated SVG payload was invalid.")
            result_file = ContentFile(svg_markup.encode("utf-8"), name="result.svg")
            result["mime_type"] = "image/svg+xml"
        elif image_data is not None:
            try:
                binary = base64.b64decode(image_data, validate=True)
            except (ValueError, binascii.Error) as error:
                raise ValueError("The generated image payload was invalid.") from error
            mime = "image/svg+xml" if animation_specification is not None else result.get("mime_type", "application/octet-stream")
            extension = {"image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp", "image/svg+xml": ".svg"}.get(mime, ".bin")
            if animation_specification is not None:
                result["mime_type"] = mime
            result_file = ContentFile(binary, name=f"result{extension}")
        with transaction.atomic():
            current = PreparationRequest.objects.select_for_update().get(id=preparation_id)
            if current.status == PreparationRequest.Status.CANCELLED:
                return
            current.result = result
            if result_file is not None:
                current.result_file.save(result_file.name, result_file, save=False)
            current.status = PreparationRequest.Status.COMPLETED
            current.completed_at = timezone.now()
            current.generator_version = generator.version
            current.prompt_version = generator.prompt_version
            current.model_name = generator.model_name
            current.save(update_fields=["result", "result_file", "status", "completed_at", "generator_version", "prompt_version", "model_name"])
    except Exception as error:
        PreparationRequest.objects.filter(id=preparation_id, status=PreparationRequest.Status.PROCESSING).update(
            status=PreparationRequest.Status.FAILED,
            error_message=str(error)[:1000],
            completed_at=timezone.now(),
        )
