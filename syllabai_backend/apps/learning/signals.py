from django.db.models.signals import post_delete
from django.dispatch import receiver

from .models import LearningResource, PreparationRequest


@receiver(post_delete, sender=LearningResource)
def delete_resource_files(sender, instance: LearningResource, **kwargs) -> None:
    for stored_file in (instance.file, instance.processed_text_file):
        if stored_file:
            stored_file.delete(save=False)


@receiver(post_delete, sender=PreparationRequest)
def delete_preparation_file(sender, instance: PreparationRequest, **kwargs) -> None:
    if instance.result_file:
        instance.result_file.delete(save=False)
