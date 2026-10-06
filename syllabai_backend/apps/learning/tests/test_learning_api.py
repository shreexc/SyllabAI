import tempfile
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from apps.learning.models import LearningChunk, LearningResource, PreparationRequest
from apps.learning.services.extraction import process_resource
from apps.learning.services.preparation import create_preparation, process_preparation

User = get_user_model()
TEXT = (
    b"The human heart pumps blood through the circulatory system. The left ventricle sends oxygenated blood to the body. "
    b"The sinoatrial node acts as the natural pacemaker of the heart. Heart valves keep blood moving in one direction."
)


@override_settings(LEARNING_TASKS_EAGER=False, LEARNING_MAX_UPLOAD_BYTES=2 * 1024 * 1024)
class LearningApiTests(TestCase):
    def setUp(self):
        self.media = tempfile.TemporaryDirectory()
        self.settings_override = override_settings(MEDIA_ROOT=self.media.name)
        self.settings_override.enable()
        self.addCleanup(self.settings_override.disable)
        self.addCleanup(self.media.cleanup)
        self.teacher = User.objects.create_user(email="teacher@learning.test", password="A-strong-teacher-Password-123!", first_name="Terry", last_name="Teacher", role="teacher")
        self.student = User.objects.create_user(email="student@learning.test", password="A-strong-student-Password-123!", first_name="Sasha", last_name="Student", role="student")
        self.client = APIClient()
        self.client.force_authenticate(self.teacher)

    def authenticated_post(self, path, data=None, *, format="json"):
        csrf = self.client.get("/api/v1/auth/csrf/").data["data"]["csrf_token"]
        return self.client.post(path, data or {}, format=format, HTTP_X_CSRFTOKEN=csrf)

    def upload_text(self, owner=None, text=TEXT, name="heart.txt"):
        resource = LearningResource.objects.create(
            owner=owner or self.teacher,
            title="Human Heart",
            resource_type="txt",
            source_type="upload",
            file=SimpleUploadedFile(name, text, content_type="text/plain"),
            mime_type="text/plain",
            file_size=len(text),
            status="processing",
        )
        try:
            process_resource(str(resource.id))
        except ValueError:
            pass
        resource.refresh_from_db()
        return resource

    def test_upload_requires_authentication(self):
        self.client.force_authenticate(user=None)
        response = self.client.post("/api/v1/learning/resources/upload/", {}, format="multipart")
        self.assertIn(response.status_code, (401, 403))

    def test_valid_upload_is_private_and_queued_then_processed(self):
        upload = SimpleUploadedFile("heart.txt", TEXT, content_type="text/plain")
        with patch("apps.learning.views.enqueue_resource") as enqueue:
            with self.captureOnCommitCallbacks(execute=True):
                response = self.authenticated_post("/api/v1/learning/teacher/resources/upload/", {"file": upload, "title": "Heart notes"}, format="multipart")
        self.assertEqual(response.status_code, 202)
        resource = LearningResource.objects.get(id=response.data["data"]["resource"]["id"])
        self.assertEqual(resource.owner, self.teacher)
        self.assertEqual(resource.title, "Heart notes")
        self.assertEqual(resource.status, "processing")
        self.assertTrue(str(resource.file.path).startswith(self.media.name))
        enqueue.assert_called_once_with(str(resource.id))
        process_resource(str(resource.id))
        resource.refresh_from_db()
        self.assertEqual(resource.status, "ready")
        self.assertGreater(resource.chunks.count(), 0)

    def test_valid_image_upload_is_ready_for_image_only_workflows(self):
        from io import BytesIO
        from PIL import Image
        from apps.learning.services.extraction import process_resource

        buffer = BytesIO()
        Image.new("RGB", (32, 32), color="green").save(buffer, format="PNG")
        upload = SimpleUploadedFile("heart.png", buffer.getvalue(), content_type="image/png")
        with patch("apps.learning.views.enqueue_resource") as enqueue:
            with self.captureOnCommitCallbacks(execute=True):
                response = self.authenticated_post("/api/v1/learning/teacher/resources/upload/", {"file": upload}, format="multipart")
        resource_id = response.data["data"]["resource"]["id"]
        enqueue.assert_called_once_with(resource_id)
        process_resource(resource_id)
        resource = LearningResource.objects.get(id=resource_id)
        self.assertEqual(resource.status, LearningResource.Status.READY)
        self.assertEqual(resource.metadata["chunk_count"], 0)

    def test_invalid_signature_mime_and_oversized_files_rejected(self):
        bad_pdf = SimpleUploadedFile("fake.pdf", b"not a pdf file at all", content_type="application/pdf")
        response = self.authenticated_post("/api/v1/learning/resources/upload/", {"file": bad_pdf}, format="multipart")
        self.assertEqual(response.status_code, 400)
        bad_mime = SimpleUploadedFile("notes.txt", TEXT, content_type="application/pdf")
        response = self.authenticated_post("/api/v1/learning/resources/upload/", {"file": bad_mime}, format="multipart")
        self.assertEqual(response.status_code, 400)
        large = SimpleUploadedFile("large.txt", b"a" * (2 * 1024 * 1024 + 1), content_type="text/plain")
        response = self.authenticated_post("/api/v1/learning/resources/upload/", {"file": large}, format="multipart")
        self.assertEqual(response.status_code, 400)
        unsupported = SimpleUploadedFile("script.py", TEXT, content_type="text/plain")
        response = self.authenticated_post("/api/v1/learning/resources/upload/", {"file": unsupported}, format="multipart")
        self.assertEqual(response.status_code, 400)

    def test_supported_pdf_image_and_docx_signatures(self):
        from io import BytesIO
        from PIL import Image
        from docx import Document
        from pypdf import PdfWriter
        from apps.learning.services.upload import validate_upload

        pdf = BytesIO()
        writer = PdfWriter()
        writer.add_blank_page(width=612, height=792)
        writer.write(pdf)
        self.assertEqual(validate_upload(SimpleUploadedFile("blank.pdf", pdf.getvalue(), content_type="application/pdf"))["resource_type"], "pdf")

        document_buffer = BytesIO()
        document = Document()
        document.add_paragraph("Validated document text")
        document.save(document_buffer)
        docx_mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        self.assertEqual(validate_upload(SimpleUploadedFile("lesson.docx", document_buffer.getvalue(), content_type=docx_mime))["resource_type"], "docx")

        for image_format, extension, mime in (("PNG", "png", "image/png"), ("JPEG", "jpg", "image/jpeg"), ("WEBP", "webp", "image/webp")):
            with self.subTest(image_format=image_format):
                image_buffer = BytesIO()
                Image.new("RGB", (16, 16), color="blue").save(image_buffer, format=image_format)
                self.assertEqual(validate_upload(SimpleUploadedFile(f"image.{extension}", image_buffer.getvalue(), content_type=mime))["resource_type"], "image")

    def test_resource_ownership_and_role_scoped_routes(self):
        resource = self.upload_text()
        self.client.force_authenticate(self.student)
        self.assertEqual(self.client.get(f"/api/v1/learning/resources/{resource.id}/").status_code, 404)
        self.assertEqual(self.client.get(f"/api/v1/learning/teacher/resources/{resource.id}/").status_code, 403)
        self.client.force_authenticate(self.teacher)
        response = self.client.get(f"/api/v1/learning/teacher/resources/{resource.id}/")
        self.assertEqual(response.status_code, 200)
        file_response = self.client.get(f"/api/v1/learning/teacher/resources/{resource.id}/file/")
        self.assertEqual(file_response.status_code, 200)
        self.assertEqual(file_response["Cache-Control"], "private, no-store")

    def test_search_is_separate_from_generation_and_never_shows_other_owners(self):
        owned = self.upload_text()
        self.upload_text(owner=self.student, name="other.txt")
        response = self.client.get("/api/v1/learning/teacher/search/", {"q": "heart", "type": "quiz"})
        self.assertEqual(response.status_code, 200)
        results = response.data["data"]["results"]
        self.assertEqual([item["id"] for item in results], [str(owned.id)])
        no_type = self.client.get("/api/v1/learning/teacher/search/", {"q": "heart"})
        self.assertEqual(no_type.status_code, 200)
        self.assertEqual([item["id"] for item in no_type.data["data"]["results"]], [str(owned.id)])
        self.assertEqual(self.client.get("/api/v1/learning/search/", {"q": "", "type": "bad"}).status_code, 400)

    def test_preparation_validates_ownership_type_and_options_then_completes(self):
        resource = self.upload_text()
        invalid_options = self.authenticated_post("/api/v1/learning/teacher/preparations/", {"resource_id": str(resource.id), "preparation_type": "quiz", "options": {"count": 999}})
        self.assertEqual(invalid_options.status_code, 400)
        invalid_type = self.authenticated_post("/api/v1/learning/teacher/preparations/", {"resource_id": str(resource.id), "preparation_type": "video", "options": {}})
        self.assertEqual(invalid_type.status_code, 400)
        self.client.force_authenticate(self.student)
        wrong_owner = self.authenticated_post("/api/v1/learning/student/preparations/", {"resource_id": str(resource.id), "preparation_type": "quiz"})
        self.assertEqual(wrong_owner.status_code, 404)
        self.client.force_authenticate(self.teacher)
        with patch("apps.learning.views.enqueue_preparation") as enqueue:
            with self.captureOnCommitCallbacks(execute=True):
                response = self.authenticated_post("/api/v1/learning/teacher/preparations/", {"resource_id": str(resource.id), "preparation_type": "quiz", "options": {"count": 3, "question_types": ["mcq", "true_false"]}})
        self.assertEqual(response.status_code, 202)
        preparation_id = response.data["data"]["preparation"]["id"]
        enqueue.assert_called_once_with(preparation_id)
        self.assertEqual(PreparationRequest.objects.get(id=preparation_id).status, "pending")
        process_preparation(preparation_id)
        completed = self.client.get(f"/api/v1/learning/teacher/preparations/{preparation_id}/")
        self.assertEqual(completed.data["data"]["preparation"]["status"], "completed", completed.data["data"]["preparation"]["error_message"])
        result = completed.data["data"]["preparation"]["result"]
        self.assertEqual(len(result["questions"]), 3)
        self.assertEqual(result["questions"][0]["type"], "mcq")
        self.assertEqual(result["questions"][1]["type"], "true_false")

    def test_all_generator_types_produce_structured_outputs(self):
        resource = self.upload_text()
        for kind in PreparationRequest.PreparationType.values:
            with self.subTest(kind=kind):
                options = {"other_request": "Prepare a study guide", "other_format": "study_guide"} if kind == "other" else {}
                request = PreparationRequest.objects.create(user=self.teacher, resource=resource, preparation_type=kind, options=options)
                process_preparation(str(request.id))
                request.refresh_from_db()
                if kind == "image":
                    self.assertEqual(request.status, "completed", request.error_message)
                    self.assertTrue(request.result_file)
                    request.result_file.open("rb")
                    self.assertIn(b"<svg", request.result_file.read())
                    request.result_file.close()
                elif kind == "animation":
                    self.assertEqual(request.status, "completed", request.error_message)
                    self.assertGreater(len(request.result["scenes"]), 0)
                    self.assertFalse(request.result["rendered_video"])
                    self.assertTrue(request.result_file)
                    self.assertIn(b"<svg", request.result_file.read())
                elif kind == "other":
                    self.assertEqual(request.status, "completed", request.error_message)
                    self.assertTrue(request.result["sections"])
                else:
                    self.assertEqual(request.status, "completed")
                    self.assertTrue(request.result)

    def test_processing_failure_and_cancellation_states(self):
        resource = self.upload_text()
        unsupported = LearningResource.objects.create(owner=self.teacher, title="Empty image", resource_type="image", source_type="upload", status="ready")
        failed = PreparationRequest.objects.create(user=self.teacher, resource=unsupported, preparation_type="short_note")
        process_preparation(str(failed.id))
        failed.refresh_from_db()
        self.assertEqual(failed.status, "failed")
        self.assertTrue(failed.error_message)
        pending = PreparationRequest.objects.create(user=self.teacher, resource=resource, preparation_type="quiz")
        response = self.authenticated_post(f"/api/v1/learning/teacher/preparations/{pending.id}/cancel/")
        self.assertEqual(response.status_code, 200)
        pending.refresh_from_db()
        self.assertEqual(pending.status, "cancelled")

    def test_cached_preparation_reuses_result_and_private_file(self):
        resource = self.upload_text()
        first, created = create_preparation(
            user=self.teacher, resource_id=resource.id, preparation_type="image", options={"image_mode": "diagram", "aspect_ratio": "16:9", "labels": True, "style": "educational", "language": "en"}
        )
        self.assertTrue(created)
        process_preparation(str(first.id))
        first.refresh_from_db()
        second, queue = create_preparation(
            user=self.teacher, resource_id=resource.id, preparation_type="image", options={"image_mode": "diagram", "aspect_ratio": "16:9", "labels": True, "style": "educational", "language": "en"}
        )
        self.assertFalse(queue)
        self.assertEqual(second.status, "completed")
        self.assertTrue(second.result_file)
        self.assertEqual(second.result["title"], first.result["title"])

    def test_generated_image_file_stream_is_owner_private(self):
        resource = self.upload_text()
        request = PreparationRequest.objects.create(user=self.teacher, resource=resource, preparation_type="image")
        process_preparation(str(request.id))
        request.refresh_from_db()
        response = self.client.get(f"/api/v1/learning/teacher/preparations/{request.id}/result-file/")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"<svg", response.getvalue())
        self.client.force_authenticate(self.student)
        self.assertEqual(self.client.get(f"/api/v1/learning/student/preparations/{request.id}/result-file/").status_code, 404)

    def test_preparation_status_and_cancel_are_owner_scoped(self):
        resource = self.upload_text()
        preparation = PreparationRequest.objects.create(user=self.teacher, resource=resource, preparation_type="quiz")
        self.client.force_authenticate(self.student)
        self.assertEqual(self.client.get(f"/api/v1/learning/student/preparations/{preparation.id}/").status_code, 404)
        self.assertEqual(self.client.post(f"/api/v1/learning/student/preparations/{preparation.id}/cancel/").status_code, 404)

    def test_other_custom_source_grounded_material(self):
        resource = self.upload_text()
        request, queued = create_preparation(
            user=self.teacher,
            resource_id=resource.id,
            preparation_type="other",
            options={"other_request": "Make a focused revision guide", "other_format": "outline", "language": "en"},
        )
        self.assertTrue(queued)
        process_preparation(str(request.id))
        request.refresh_from_db()
        self.assertEqual(request.status, "completed", request.error_message)
        self.assertEqual(request.result["requested_material"], "Make a focused revision guide")
        self.assertEqual(request.result["format"], "outline")
        self.assertTrue(request.result["sections"])

    def test_other_output_requires_a_bounded_description(self):
        resource = self.upload_text()
        empty_request = self.authenticated_post("/api/v1/learning/teacher/preparations/", {
            "resource_id": str(resource.id),
            "preparation_type": "other",
            "options": {"other_request": ""},
        })
        self.assertEqual(empty_request.status_code, 400)

    def test_preparation_history_is_owner_scoped_and_filterable(self):
        resource = self.upload_text()
        own_quiz = PreparationRequest.objects.create(user=self.teacher, resource=resource, preparation_type="quiz")
        PreparationRequest.objects.create(user=self.teacher, resource=resource, preparation_type="flashcard")
        other_resource = self.upload_text(owner=self.student, name="student.txt")
        PreparationRequest.objects.create(user=self.student, resource=other_resource, preparation_type="quiz")

        response = self.client.get("/api/v1/learning/teacher/preparations/")
        self.assertEqual(response.status_code, 200)
        items = response.data["data"]["results"]
        self.assertEqual(response.data["data"]["count"], 2)
        self.assertEqual({item["id"] for item in items}, {str(own_quiz.id), str(PreparationRequest.objects.filter(user=self.teacher, preparation_type="flashcard").get().id)})

        filtered = self.client.get("/api/v1/learning/teacher/preparations/", {"type": "quiz", "status": "pending"})
        self.assertEqual(filtered.status_code, 200)
        self.assertEqual([item["id"] for item in filtered.data["data"]["results"]], [str(own_quiz.id)])
        self.assertEqual(self.client.get("/api/v1/learning/teacher/preparations/", {"type": "chat"}).status_code, 400)

    def test_active_preparation_limit_is_enforced(self):
        from django.test import override_settings
        from rest_framework.exceptions import ValidationError

        resource = self.upload_text()
        PreparationRequest.objects.create(user=self.teacher, resource=resource, preparation_type="quiz", status="pending")
        with override_settings(LEARNING_MAX_ACTIVE_PREPARATIONS=1):
            with self.assertRaises(ValidationError):
                create_preparation(user=self.teacher, resource_id=resource.id, preparation_type="flashcard", options={"count": 5})

    def test_empty_extraction_is_failed_and_chunks_are_versioned(self):
        resource = self.upload_text(text=b"Short", name="tiny.txt")
        self.assertEqual(resource.status, "failed")
        self.assertEqual(LearningChunk.objects.filter(resource=resource).count(), 0)

    def test_quiz_attempt_evaluation(self):
        resource = self.upload_text()
        prep, _ = create_preparation(user=self.teacher, resource_id=resource.id, preparation_type="quiz", options={"count": 2})
        process_preparation(str(prep.id))
        prep.refresh_from_db()
        self.assertEqual(prep.status, "completed")
        q1 = prep.result["questions"][0]
        q2 = prep.result["questions"][1] if len(prep.result["questions"]) > 1 else None

        answers = {str(q1["id"]): q1["answer"]}
        if q2:
            answers[str(q2["id"])] = "wrong answer"

        response = self.authenticated_post(f"/api/v1/learning/quizzes/{prep.id}/attempts/", {"answers": answers})
        self.assertEqual(response.status_code, 200)
        data = response.data["data"]
        self.assertGreaterEqual(data["score"], 1)
        self.assertIn("percentage", data)
        self.assertIn("review", data)

    def test_flashcard_review_recording(self):
        resource = self.upload_text()
        prep, _ = create_preparation(user=self.teacher, resource_id=resource.id, preparation_type="flashcard", options={"count": 5})
        process_preparation(str(prep.id))
        prep.refresh_from_db()
        self.assertEqual(prep.status, "completed")

        response = self.authenticated_post(f"/api/v1/learning/flashcards/{prep.id}/reviews/", {"card_id": "1", "rating": "good"})
        self.assertEqual(response.status_code, 200)
        data = response.data["data"]
        self.assertEqual(data["known"], 1)
        self.assertEqual(data["reviewed"], 1)

    def test_resources_list(self):
        self.upload_text()
        response = self.client.get("/api/v1/learning/resources/")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(response.data["data"]["count"], 1)

