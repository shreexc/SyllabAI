from pathlib import PurePath

from django.conf import settings
from rest_framework import serializers

from .models import LearningResource, PreparationRequest
from .services.scanning import scan_upload
from .services.upload import validate_upload


class LearningResourceSerializer(serializers.ModelSerializer):
    owner_id = serializers.UUIDField(read_only=True)
    page_count = serializers.IntegerField(source="metadata.page_count", read_only=True, allow_null=True)
    chunk_count = serializers.IntegerField(source="metadata.chunk_count", read_only=True, allow_null=True)
    preview = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    relevant_pages = serializers.SerializerMethodField()
    security_scan_status = serializers.CharField(source="metadata.security_scan_status", read_only=True)

    class Meta:
        model = LearningResource
        fields = ("id", "owner_id", "title", "description", "resource_type", "source_type", "source_url", "source_provider", "license_name", "mime_type", "file_size", "status", "processing_error", "resource_version", "page_count", "chunk_count", "preview", "file_url", "relevant_pages", "security_scan_status", "created_at", "updated_at")
        read_only_fields = fields

    def get_preview(self, resource: LearningResource) -> str:
        return " ".join(resource.chunks.filter(resource_version=resource.resource_version).values_list("text", flat=True)[:2])[:500]

    def get_file_url(self, resource: LearningResource) -> str | None:
        if not resource.file:
            return None
        request = self.context.get("request")
        url = f"/api/v1/learning/resources/{resource.id}/file/"
        return request.build_absolute_uri(url) if request else url

    def get_relevant_pages(self, resource: LearningResource) -> list[int]:
        return list(resource.chunks.filter(resource_version=resource.resource_version, page_number__isnull=False).order_by("page_number").values_list("page_number", flat=True).distinct()[:20])


class UploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    title = serializers.CharField(max_length=240, required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True, max_length=3000)

    def validate_file(self, uploaded):
        try:
            self.file_info = validate_upload(uploaded)
        except Exception as error:
            if hasattr(error, "message_dict"):
                raise serializers.ValidationError(error.message_dict.get("file", error.messages)) from error
            raise
        return uploaded

    def create(self, validated_data):
        uploaded = validated_data.pop("file")
        file_info = self.file_info
        return LearningResource.objects.create(
            owner=self.context["request"].user,
            title=validated_data.get("title", "").strip() or PurePath(uploaded.name).stem[:240],
            description=validated_data.get("description", "").strip(),
            file=uploaded,
            resource_type=file_info["resource_type"],
            mime_type=file_info["mime_type"],
            file_size=file_info["file_size"],
            status=LearningResource.Status.PROCESSING,
            metadata={"security_scan_status": scan_upload(uploaded)},
        )


class PreparationCreateSerializer(serializers.Serializer):
    resource_id = serializers.UUIDField()
    preparation_type = serializers.ChoiceField(choices=PreparationRequest.PreparationType.choices)
    options = serializers.DictField(required=False, default=dict)

    def validate_options(self, options):
        kind = self.initial_data.get("preparation_type")
        errors: dict[str, list[str]] = {}
        allowed: dict[str, set[str]] = {
            "quiz": {"count", "difficulty", "question_types", "topic", "language"},
            "short_note": {"length", "difficulty", "language", "style"},
            "flashcard": {"count", "difficulty", "language"},
            "image": {"image_mode", "style", "labels", "aspect_ratio"},
            "animation": {"duration", "difficulty", "style", "language", "animation_type"},
            "other": {"other_request", "other_format", "language"},
        }
        extra = set(options) - allowed.get(kind, set())
        if extra:
            errors["options"] = [f"Unsupported options: {', '.join(sorted(extra))}."]
        def choice(name: str, values: set[str], default: str) -> None:
            value = options.get(name, default)
            if not isinstance(value, str) or value not in values:
                errors[name] = [f"Choose one of: {', '.join(sorted(values))}."]
            else:
                options[name] = value
        def count(name: str, default: int, maximum: int) -> None:
            value = options.get(name, default)
            if isinstance(value, bool) or not isinstance(value, int) or value < 1 or value > maximum:
                errors[name] = [f"Must be an integer from 1 to {maximum}."]
            else:
                options[name] = value
        if kind == "quiz":
            count("count", 10, settings.LEARNING_MAX_QUIZ_QUESTIONS)
            choice("difficulty", {"easy", "medium", "hard"}, "medium")
            types = options.get("question_types", ["fill_in_blank"])
            valid_types = {"mcq", "true_false", "fill_in_blank"}
            if not isinstance(types, list) or not types or any(not isinstance(value, str) for value in types) or set(types) - valid_types:
                errors["question_types"] = ["Choose one or more of mcq, true_false, fill_in_blank."]
            else:
                options["question_types"] = list(dict.fromkeys(types))
        elif kind == "short_note":
            choice("length", {"short", "medium", "long"}, "medium")
            choice("difficulty", {"student", "beginner", "intermediate", "advanced"}, "student")
            choice("style", {"bullet_points", "paragraph"}, "bullet_points")
        elif kind == "flashcard":
            count("count", 20, settings.LEARNING_MAX_FLASHCARDS)
            choice("difficulty", {"easy", "medium", "hard"}, "medium")
        elif kind == "image":
            choice("image_mode", {"source_image", "extracted_image", "diagram", "infographic", "illustration", "flowchart"}, "diagram")
            choice("aspect_ratio", {"1:1", "4:3", "16:9", "9:16"}, "16:9")
            if "labels" in options and not isinstance(options["labels"], bool):
                errors["labels"] = ["Must be a boolean."]
        elif kind == "animation":
            duration = options.get("duration", 90)
            if isinstance(duration, bool) or not isinstance(duration, int) or not 10 <= duration <= settings.LEARNING_MAX_ANIMATION_SECONDS:
                errors["duration"] = [f"Must be an integer from 10 to {settings.LEARNING_MAX_ANIMATION_SECONDS} seconds."]
            else:
                options["duration"] = duration
            choice("difficulty", {"beginner", "intermediate", "advanced"}, "beginner")
            choice("animation_type", {"concept_explanation", "process", "timeline"}, "concept_explanation")
        elif kind == "other":
            request = options.get("other_request", "")
            if not isinstance(request, str) or not 5 <= len(request.strip()) <= 240:
                errors["other_request"] = ["Describe the material you want (5–240 characters)."]
            else:
                options["other_request"] = request.strip()
            choice("other_format", {"study_guide", "glossary", "outline", "practice_prompts"}, "study_guide")
        if "language" in options and (not isinstance(options["language"], str) or len(options["language"]) > 12 or not options["language"].strip()):
            errors["language"] = ["Language must be a short language code or name."]
        options.setdefault("language", "en")
        if errors:
            raise serializers.ValidationError(errors)
        return options


class PreparationRequestSerializer(serializers.ModelSerializer):
    resource = LearningResourceSerializer(read_only=True)
    progress = serializers.SerializerMethodField()
    result = serializers.SerializerMethodField()

    class Meta:
        model = PreparationRequest
        fields = ("id", "resource", "preparation_type", "status", "options", "result", "error_message", "generator_version", "prompt_version", "model_name", "created_at", "completed_at", "progress")
        read_only_fields = fields

    def get_progress(self, preparation: PreparationRequest) -> dict:
        if preparation.status == PreparationRequest.Status.COMPLETED:
            step = 4
        elif preparation.status == PreparationRequest.Status.FAILED:
            step = 4
        elif preparation.status == PreparationRequest.Status.PROCESSING:
            step = 3
        elif preparation.status == PreparationRequest.Status.PENDING:
            step = 1
        else:
            step = 0
        return {"step": step, "total": 4, "label": preparation.status}

    def get_result(self, preparation: PreparationRequest) -> dict:
        result = dict(preparation.result)
        if preparation.result_file:
            request = self.context.get("request")
            role = getattr(getattr(request, "user", None), "role", "")
            if role not in {"teacher", "student"}:
                role = "teacher" if preparation.user.role == "teacher" else "student"
            url = f"/api/v1/learning/{role}/preparations/{preparation.id}/result-file/"
            result["image_url"] = request.build_absolute_uri(url) if request else url
        return result
