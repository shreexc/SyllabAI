import uuid
from pathlib import PurePath

from django.conf import settings
from django.db import models


def private_resource_path(instance: "LearningResource", filename: str) -> str:
    return f"learning/{instance.owner_id}/{instance.id}/{filename}"


def private_text_path(instance: "LearningResource", filename: str) -> str:
    return f"learning/{instance.owner_id}/{instance.id}/processed/{filename}"


def private_result_path(instance: "PreparationRequest", filename: str) -> str:
    suffix = PurePath(filename).suffix.lower() or ".bin"
    return f"learning/results/{instance.user_id}/{instance.id}/result{suffix}"


class LearningResource(models.Model):
    class ResourceType(models.TextChoices):
        PDF = "pdf", "PDF"
        IMAGE = "image", "Image"
        TXT = "txt", "Text"
        DOCX = "docx", "Word document"
        EXTERNAL = "external", "External resource"

    class SourceType(models.TextChoices):
        UPLOAD = "upload", "Upload"
        EXTERNAL = "external", "External"
        GENERATED = "generated", "Generated"

    class Status(models.TextChoices):
        UPLOADED = "uploaded", "Uploaded"
        PROCESSING = "processing", "Processing"
        READY = "ready", "Ready"
        FAILED = "failed", "Failed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="learning_resources")
    title = models.CharField(max_length=240)
    description = models.TextField(blank=True)
    resource_type = models.CharField(max_length=12, choices=ResourceType.choices)
    source_type = models.CharField(max_length=12, choices=SourceType.choices, default=SourceType.UPLOAD)
    file = models.FileField(upload_to=private_resource_path, blank=True, max_length=512)
    processed_text_file = models.FileField(upload_to=private_text_path, blank=True, max_length=512)
    source_url = models.URLField(max_length=1000, blank=True)
    source_provider = models.CharField(max_length=64, blank=True)
    license_name = models.CharField(max_length=120, blank=True)
    mime_type = models.CharField(max_length=120, blank=True)
    file_size = models.BigIntegerField(default=0)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.UPLOADED)
    processing_error = models.TextField(blank=True)
    resource_version = models.PositiveIntegerField(default=1)
    processor_version = models.CharField(max_length=32, default="extract-1")
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["owner", "status", "created_at"])]

    def __str__(self) -> str:
        return self.title



class LearningChunk(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    resource = models.ForeignKey(LearningResource, on_delete=models.CASCADE, related_name="chunks")
    resource_version = models.PositiveIntegerField()
    index = models.PositiveIntegerField()
    text = models.TextField()
    page_number = models.PositiveIntegerField(null=True, blank=True)
    content_hash = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["index"]
        constraints = [models.UniqueConstraint(fields=["resource", "resource_version", "index"], name="learning_chunk_version_index_uniq")]
        indexes = [models.Index(fields=["resource", "resource_version"])]


class PreparationRequest(models.Model):
    class PreparationType(models.TextChoices):
        QUIZ = "quiz", "Quiz"
        SHORT_NOTE = "short_note", "Short Note"
        FLASHCARD = "flashcard", "Flashcard"
        IMAGE = "image", "Image"
        ANIMATION = "animation", "Animation"
        OTHER = "other", "Other"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PROCESSING = "processing", "Processing"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"
        CANCELLED = "cancelled", "Cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="preparations")
    resource = models.ForeignKey(LearningResource, on_delete=models.CASCADE, related_name="preparations")
    preparation_type = models.CharField(max_length=16, choices=PreparationType.choices)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.PENDING)
    options = models.JSONField(default=dict, blank=True)
    result = models.JSONField(default=dict, blank=True)
    result_file = models.FileField(upload_to=private_result_path, blank=True, max_length=512)
    error_message = models.TextField(blank=True)
    generator_version = models.CharField(max_length=32, default="generator-1")
    prompt_version = models.CharField(max_length=32, default="source-template-1")
    model_name = models.CharField(max_length=120, default="source-grounded-local")
    cache_key = models.CharField(max_length=64, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["user", "status", "created_at"])]

    def __str__(self) -> str:
        return f"{self.get_preparation_type_display()} for {self.resource.title}"

