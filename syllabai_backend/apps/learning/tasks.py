from celery import shared_task
from django.conf import settings


@shared_task(bind=True, max_retries=2, default_retry_delay=30)
def process_resource_task(self, resource_id: str) -> None:
    from .services.extraction import process_resource

    try:
        process_resource(resource_id)
    except Exception as error:
        if self.request.retries < self.max_retries:
            raise self.retry(exc=error)


@shared_task(bind=True, max_retries=1, default_retry_delay=20)
def process_preparation_task(self, preparation_id: str) -> None:
    from .services.preparation import process_preparation

    try:
        process_preparation(preparation_id)
    except Exception as error:
        if self.request.retries < self.max_retries:
            from .models import PreparationRequest

            PreparationRequest.objects.filter(id=preparation_id, status=PreparationRequest.Status.FAILED).update(
                status=PreparationRequest.Status.PENDING,
                error_message="",
                completed_at=None,
            )
            raise self.retry(exc=error)


def enqueue_resource(resource_id: str) -> None:
    try:
        if settings.LEARNING_TASKS_EAGER:
            process_resource_task.apply(args=[resource_id])
        else:
            process_resource_task.delay(resource_id)
    except Exception:
        from .models import LearningResource

        LearningResource.objects.filter(id=resource_id).update(status=LearningResource.Status.FAILED, processing_error="Background worker unavailable; try again later.")


def enqueue_preparation(preparation_id: str) -> None:
    try:
        if settings.LEARNING_TASKS_EAGER:
            process_preparation_task.apply(args=[preparation_id])
        else:
            process_preparation_task.delay(preparation_id)
    except Exception:
        from .models import PreparationRequest

        PreparationRequest.objects.filter(id=preparation_id).update(status=PreparationRequest.Status.FAILED, error_message="Background worker unavailable; try again later.")
