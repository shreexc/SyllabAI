from uuid import UUID

from django.db import transaction
from django.utils import timezone
from django.http import FileResponse
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from apps.accounts.csrf import enforce_csrf
from apps.accounts.permissions import IsStudent, IsTeacher
from apps.accounts.serializers import EmptySerializer
from apps.common.utils import success_response
from .models import LearningResource, PreparationRequest
from .permissions import IsLearningUser
from .selectors import get_owned_preparation, get_owned_resource
from .serializers import LearningResourceSerializer, PreparationCreateSerializer, PreparationRequestSerializer, UploadSerializer
from .services.preparation import create_preparation
from .services.search import search_resources
from .tasks import enqueue_preparation, enqueue_resource


class LearningView(APIView):
    permission_classes = [IsAuthenticated, IsLearningUser]
    required_role = None

    def get_permissions(self):
        permissions = [permission() for permission in self.permission_classes]
        if self.required_role == "teacher":
            permissions.append(IsTeacher())
        elif self.required_role == "student":
            permissions.append(IsStudent())
        return permissions


class SearchView(LearningView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "user"

    @extend_schema(
        summary="Search owned learning resources",
        description="Returns ready resources owned by the authenticated user. Search selects a source only; it does not generate educational content.",
        responses={200: LearningResourceSerializer(many=True)},
    )
    def get(self, request):
        query = request.query_params.get("q", "")
        preparation_type = request.query_params.get("type", "")
        resources = search_resources(request.user, query, preparation_type)
        return success_response("Resources found.", {"results": LearningResourceSerializer(resources, many=True).data, "query": query, "preparation_type": preparation_type})


class UploadView(LearningView):
    parser_classes = [MultiPartParser, FormParser]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "user"

    @extend_schema(
        summary="Upload private learning resource",
        description="Validates and stores an allowed file privately, then queues extraction/chunking. Ownership is assigned from the authenticated user, never from request data.",
        request=UploadSerializer,
        responses={202: OpenApiResponse(description="Resource accepted; its extraction job is processing asynchronously.")},
    )
    def post(self, request):
        enforce_csrf(request)
        serializer = UploadSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        resource = serializer.save()
        transaction.on_commit(lambda: enqueue_resource(str(resource.id)))
        return success_response("Upload accepted; processing started.", {"resource": LearningResourceSerializer(resource).data}, status.HTTP_202_ACCEPTED)


class ResourceDetailView(LearningView):
    @extend_schema(summary="Get owned resource status and preview", responses={200: LearningResourceSerializer})
    def get(self, request, resource_id: UUID):
        resource = get_owned_resource(request.user, resource_id)
        return success_response("Resource loaded.", {"resource": LearningResourceSerializer(resource).data})


class ResourceFileView(LearningView):
    @extend_schema(
        summary="Stream an owned resource file privately",
        responses={200: OpenApiResponse(response=OpenApiTypes.BINARY, description="Private resource bytes; the user must own the resource."), 404: OpenApiResponse(description="Resource not found or has no file.")},
    )
    def get(self, request, resource_id: UUID):
        resource = get_owned_resource(request.user, resource_id)
        if not resource.file:
            raise NotFound("The resource has no stored file.")
        response = FileResponse(resource.file.open("rb"), content_type=resource.mime_type or "application/octet-stream")
        response["Content-Disposition"] = f'inline; filename="{resource.file.name.rsplit("/", 1)[-1]}"'
        response["X-Content-Type-Options"] = "nosniff"
        response["Cache-Control"] = "private, no-store"
        return response


class PreparationCollectionView(LearningView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "user"

    @extend_schema(
        summary="List the authenticated user's preparation history",
        description="Returns only preparation requests owned by the current user. Optional preparation_type and status filters may be used; at most 100 newest items are returned.",
        responses={200: PreparationRequestSerializer(many=True)},
    )
    def get(self, request):
        queryset = PreparationRequest.objects.filter(user=request.user).select_related("resource")
        preparation_type = request.query_params.get("type")
        if preparation_type:
            if preparation_type not in PreparationRequest.PreparationType.values:
                raise ValidationError({"type": ["Choose a supported preparation type."]})
            queryset = queryset.filter(preparation_type=preparation_type)
        state = request.query_params.get("status")
        if state:
            if state not in PreparationRequest.Status.values:
                raise ValidationError({"status": ["Choose a supported preparation status."]})
            queryset = queryset.filter(status=state)
        items = list(queryset.order_by("-created_at")[:100])
        return success_response("Preparation history loaded.", {"results": PreparationRequestSerializer(items, many=True, context={"request": request}).data, "count": len(items)})

    @extend_schema(
        summary="Create a preparation job",
        description="Validates resource ownership, type-specific bounded options, then persists and queues an asynchronous preparation. Completed exact-version results may be served from cache.",
        request=PreparationCreateSerializer,
        responses={202: PreparationRequestSerializer},
    )
    def post(self, request):
        enforce_csrf(request)
        serializer = PreparationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        preparation, queue_job = create_preparation(user=request.user, **serializer.validated_data)
        if queue_job:
            transaction.on_commit(lambda: enqueue_preparation(str(preparation.id)))
        response_status = status.HTTP_202_ACCEPTED if queue_job else status.HTTP_200_OK
        return success_response("Preparation queued." if queue_job else "Matching preparation result reused.", {"preparation": PreparationRequestSerializer(preparation).data}, response_status)


class PreparationDetailView(LearningView):
    @extend_schema(summary="Get owned preparation status and result", responses={200: PreparationRequestSerializer})
    def get(self, request, preparation_id: UUID):
        preparation = get_owned_preparation(request.user, preparation_id)
        return success_response("Preparation status loaded.", {"preparation": PreparationRequestSerializer(preparation).data})


class PreparationCancelView(LearningView):
    @extend_schema(
        summary="Cancel an owned pending or processing preparation",
        description="Atomically transitions only the authenticated user's pending/processing request to cancelled.",
        request=EmptySerializer,
        responses={200: PreparationRequestSerializer, 404: OpenApiResponse(description="Preparation request not found.")},
    )
    def post(self, request, preparation_id: UUID):
        enforce_csrf(request)
        preparation = get_owned_preparation(request.user, preparation_id)
        if preparation.status in {PreparationRequest.Status.PENDING, PreparationRequest.Status.PROCESSING}:
            updated = PreparationRequest.objects.filter(
                id=preparation.id,
                user=request.user,
                status__in=[PreparationRequest.Status.PENDING, PreparationRequest.Status.PROCESSING],
            ).update(status=PreparationRequest.Status.CANCELLED, completed_at=timezone.now())
            if updated:
                preparation.status = PreparationRequest.Status.CANCELLED
                preparation.completed_at = timezone.now()
        return success_response("Preparation cancelled." if preparation.status == PreparationRequest.Status.CANCELLED else "Preparation is already finished.", {"preparation": PreparationRequestSerializer(preparation).data})


class PreparationResultFileView(LearningView):
    @extend_schema(
        summary="Stream a private owned preparation image",
        responses={200: OpenApiResponse(response=OpenApiTypes.BINARY, description="Private generated/extracted image or SVG storyboard bytes."), 404: OpenApiResponse(description="Preparation result file not found.")},
    )
    def get(self, request, preparation_id: UUID):
        preparation = get_owned_preparation(request.user, preparation_id)
        if not preparation.result_file:
            raise NotFound("This preparation has no image file.")
        response = FileResponse(preparation.result_file.open("rb"), content_type=preparation.result.get("mime_type", "application/octet-stream"))
        response["Content-Disposition"] = f'inline; filename="{preparation.result_file.name.rsplit("/", 1)[-1]}"'
        response["X-Content-Type-Options"] = "nosniff"
        response["Cache-Control"] = "private, no-store"
        return response


class TeacherSearchView(SearchView):
    required_role = "teacher"


class StudentSearchView(SearchView):
    required_role = "student"


class TeacherUploadView(UploadView):
    required_role = "teacher"


class StudentUploadView(UploadView):
    required_role = "student"


class TeacherResourceDetailView(ResourceDetailView):
    required_role = "teacher"


class StudentResourceDetailView(ResourceDetailView):
    required_role = "student"


class TeacherResourceFileView(ResourceFileView):
    required_role = "teacher"


class StudentResourceFileView(ResourceFileView):
    required_role = "student"


class TeacherPreparationCollectionView(PreparationCollectionView):
    required_role = "teacher"


class StudentPreparationCollectionView(PreparationCollectionView):
    required_role = "student"


class TeacherPreparationDetailView(PreparationDetailView):
    required_role = "teacher"


class StudentPreparationDetailView(PreparationDetailView):
    required_role = "student"


class TeacherPreparationCancelView(PreparationCancelView):
    required_role = "teacher"


class StudentPreparationCancelView(PreparationCancelView):
    required_role = "student"


class ResourceCollectionView(LearningView):
    @extend_schema(summary="List owned learning resources", responses={200: LearningResourceSerializer(many=True)})
    def get(self, request):
        resources = LearningResource.objects.filter(owner=request.user).order_by("-created_at")
        return success_response("Resources loaded.", {"results": LearningResourceSerializer(resources, many=True, context={"request": request}).data, "count": resources.count()})


class TeacherResourceCollectionView(ResourceCollectionView):
    required_role = "teacher"


class StudentResourceCollectionView(ResourceCollectionView):
    required_role = "student"


class QuizAttemptView(LearningView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "user"

    def post(self, request, preparation_id: UUID):
        enforce_csrf(request)
        preparation = get_owned_preparation(request.user, preparation_id)
        if preparation.preparation_type != PreparationRequest.PreparationType.QUIZ:
            raise ValidationError({"detail": "This preparation is not a quiz."})
        user_answers = request.data.get("answers", {})
        questions = preparation.result.get("questions", [])
        total = len(questions)
        score = 0
        review = []
        for q in questions:
            qid = str(q.get("id"))
            expected = str(q.get("answer", "")).strip().casefold()
            submitted = str(user_answers.get(qid, "")).strip().casefold()
            is_correct = bool(submitted and submitted == expected)
            if is_correct:
                score += 1
            review.append({
                "id": q.get("id"),
                "question": q.get("question"),
                "type": q.get("type"),
                "user_answer": user_answers.get(qid, ""),
                "correct_answer": q.get("answer"),
                "is_correct": is_correct,
                "explanation": q.get("explanation", ""),
            })
        percentage = round((score / total) * 100) if total > 0 else 0
        
        attempts = preparation.options.get("attempts", [])
        attempts.append({
            "score": score,
            "total": total,
            "percentage": percentage,
            "created_at": timezone.now().isoformat(),
        })
        preparation.options["attempts"] = attempts
        preparation.save(update_fields=["options"])

        return success_response("Quiz evaluated.", {
            "score": score,
            "total": total,
            "percentage": percentage,
            "review": review,
        })


class TeacherQuizAttemptView(QuizAttemptView):
    required_role = "teacher"


class StudentQuizAttemptView(QuizAttemptView):
    required_role = "student"


class FlashcardReviewView(LearningView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "user"

    def post(self, request, preparation_id: UUID):
        enforce_csrf(request)
        preparation = get_owned_preparation(request.user, preparation_id)
        if preparation.preparation_type != PreparationRequest.PreparationType.FLASHCARD:
            raise ValidationError({"detail": "This preparation is not a flashcard deck."})
        card_id = str(request.data.get("card_id", ""))
        rating = str(request.data.get("rating", "")).strip().lower()
        if rating not in {"again", "hard", "good", "easy"}:
            raise ValidationError({"rating": ["Choose one of: again, hard, good, easy."]})
        
        reviews = preparation.options.get("reviews", {})
        reviews[card_id] = rating
        preparation.options["reviews"] = reviews
        preparation.save(update_fields=["options"])

        cards = preparation.result.get("cards", [])
        total = len(cards)
        reviewed = len(reviews)
        known = sum(1 for r in reviews.values() if r in {"good", "easy"})
        need_review = sum(1 for r in reviews.values() if r in {"again", "hard"})

        return success_response("Flashcard review recorded.", {
            "total": total,
            "reviewed": reviewed,
            "known": known,
            "need_review": need_review,
            "reviews": reviews,
        })


class TeacherFlashcardReviewView(FlashcardReviewView):
    required_role = "teacher"


class StudentFlashcardReviewView(FlashcardReviewView):
    required_role = "student"


class TeacherPreparationResultFileView(PreparationResultFileView):
    required_role = "teacher"


class StudentPreparationResultFileView(PreparationResultFileView):
    required_role = "student"

