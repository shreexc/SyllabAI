from django.contrib.auth import get_user_model
from django.test import TestCase
import json
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from apps.accounts.services import create_token_pair

User = get_user_model()


class AuthFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.teacher_payload = {
            "email": "teacher@example.com",
            "password": "StrongTeacherPass123!",
            "first_name": "Tess",
            "last_name": "Teacher",
        }
        self.student_payload = {
            "email": "student@example.com",
            "password": "StrongStudentPass123!",
            "first_name": "Sam",
            "last_name": "Student",
        }

    def test_api_root_and_favicon_are_handled(self):
        root = self.client.get("/")
        self.assertEqual(root.status_code, 200)
        self.assertEqual(json.loads(root.content)["service"], "SyllabAI API")
        self.assertEqual(self.client.get("/favicon.ico").status_code, 204)

    def test_development_cors_allows_local_frontend_origins_with_credentials(self):
        for origin in ("http://localhost:3000", "http://127.0.0.1:3000"):
            response = self.client.options(
                "/api/v1/auth/csrf/",
                HTTP_ORIGIN=origin,
                HTTP_ACCESS_CONTROL_REQUEST_METHOD="GET",
                HTTP_ACCESS_CONTROL_REQUEST_HEADERS="content-type,x-csrftoken",
            )
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response["Access-Control-Allow-Origin"], origin)
            self.assertEqual(response["Access-Control-Allow-Credentials"], "true")

    def test_teacher_registration_assigns_role_and_http_only_cookies(self):
        response = self.client.post("/api/v1/auth/teacher/register/", self.teacher_payload, format="json")
        self.assertEqual(response.status_code, 201)
        user = User.objects.get(email="teacher@example.com")
        self.assertEqual(user.role, User.Role.TEACHER)
        self.assertTrue(response.cookies["access_token"]["httponly"])
        self.assertNotIn("password", response.data["data"]["user"])

    def test_student_registration_assigns_role_despite_role_override(self):
        response = self.client.post(
            "/api/v1/auth/student/register/",
            {**self.student_payload, "role": "teacher"},
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(User.objects.get(email="student@example.com").role, User.Role.STUDENT)

    def test_duplicate_email_and_invalid_password_are_rejected(self):
        User.objects.create_user(email="teacher@example.com", password="StrongTeacherPass123!", first_name="Tess", last_name="Teacher", role="teacher")
        duplicate = self.client.post("/api/v1/auth/teacher/register/", self.teacher_payload, format="json")
        self.assertEqual(duplicate.status_code, 400)
        invalid = self.client.post("/api/v1/auth/student/register/", {**self.student_payload, "password": "123"}, format="json")
        self.assertEqual(invalid.status_code, 400)

    def test_login_requires_role_match_and_valid_credentials(self):
        User.objects.create_user(email="teacher@example.com", password=self.teacher_payload["password"], first_name="Tess", last_name="Teacher", role="teacher")
        User.objects.create_user(email="student@example.com", password=self.student_payload["password"], first_name="Sam", last_name="Student", role="student")
        self.assertEqual(self.client.post("/api/v1/auth/teacher/login/", {"email": "teacher@example.com", "password": self.teacher_payload["password"]}, format="json").status_code, 200)
        self.assertEqual(self.client.post("/api/v1/auth/teacher/login/", {"email": "student@example.com", "password": self.student_payload["password"]}, format="json").status_code, 403)
        self.assertEqual(self.client.post("/api/v1/auth/student/login/", {"email": "teacher@example.com", "password": self.teacher_payload["password"]}, format="json").status_code, 403)
        self.assertEqual(self.client.post("/api/v1/auth/student/login/", {"email": "student@example.com", "password": "wrong"}, format="json").status_code, 401)

    def test_inactive_user_cannot_login(self):
        User.objects.create_user(email="inactive@example.com", password="StrongTeacherPass123!", first_name="In", last_name="Active", role="teacher", is_active=False)
        response = self.client.post("/api/v1/auth/teacher/login/", {"email": "inactive@example.com", "password": "StrongTeacherPass123!"}, format="json")
        self.assertEqual(response.status_code, 401)

    def test_role_permissions_and_me_endpoints(self):
        teacher = User.objects.create_user(email="teacher@example.com", password="StrongTeacherPass123!", first_name="Tess", last_name="Teacher", role="teacher")
        student = User.objects.create_user(email="student@example.com", password="StrongStudentPass123!", first_name="Sam", last_name="Student", role="student")
        unauthenticated = self.client.get("/api/v1/teacher/dashboard/")
        self.assertEqual(unauthenticated.status_code, 401)
        self.client.force_authenticate(teacher)
        self.assertEqual(self.client.get("/api/v1/teacher/dashboard/").status_code, 200)
        self.assertEqual(self.client.get("/api/v1/student/dashboard/").status_code, 403)
        self.assertEqual(self.client.get("/api/v1/auth/teacher/me/").status_code, 200)
        self.client.force_authenticate(student)
        self.assertEqual(self.client.get("/api/v1/student/dashboard/").status_code, 200)
        self.assertEqual(self.client.get("/api/v1/teacher/dashboard/").status_code, 403)
        self.assertEqual(self.client.get("/api/v1/auth/student/me/").status_code, 200)

    def test_logout_clears_auth_cookies(self):
        response = self.client.post("/api/v1/auth/logout/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.cookies["access_token"].value, "")
        self.assertEqual(response.cookies["refresh_token"].value, "")

    def test_refresh_rotates_token_and_rejects_reuse(self):
        user = User.objects.create_user(email="rotate@example.com", password="StrongTeacherPass123!", first_name="Rae", last_name="Rotate", role="teacher")
        refresh = RefreshToken.for_user(user)
        old_token = str(refresh)
        self.client.cookies["refresh_token"] = old_token
        response = self.client.post("/api/v1/auth/token/refresh/")
        self.assertEqual(response.status_code, 200)
        rotated = response.cookies["refresh_token"].value
        self.assertNotEqual(rotated, old_token)
        self.client.cookies["refresh_token"] = old_token
        reused = self.client.post("/api/v1/auth/token/refresh/")
        self.assertEqual(reused.status_code, 401)

    def test_cookie_mutations_require_csrf_token(self):
        client = APIClient(enforce_csrf_checks=True)
        client.cookies["refresh_token"] = str(RefreshToken.for_user(
            User.objects.create_user(email="csrf@example.com", password="StrongTeacherPass123!", first_name="Casey", last_name="Safe", role="teacher")
        ))
        rejected = client.post("/api/v1/auth/logout/")
        self.assertEqual(rejected.status_code, 403)
        csrf_response = client.get("/api/v1/auth/csrf/")
        token = csrf_response.data["data"]["csrf_token"]
        accepted = client.post("/api/v1/auth/logout/", HTTP_X_CSRFTOKEN=token)
        self.assertEqual(accepted.status_code, 200)

    def test_registration_requires_csrf_token(self):
        client = APIClient(enforce_csrf_checks=True)
        rejected = client.post("/api/v1/auth/teacher/register/", self.teacher_payload, format="json")
        self.assertEqual(rejected.status_code, 403)
        token = client.get("/api/v1/auth/csrf/").data["data"]["csrf_token"]
        accepted = client.post(
            "/api/v1/auth/teacher/register/",
            self.teacher_payload,
            format="json",
            HTTP_X_CSRFTOKEN=token,
        )
        self.assertEqual(accepted.status_code, 201)

    def test_cookie_jwt_authenticates_browser_dashboard(self):
        user = User.objects.create_user(email="cookie@example.com", password="StrongTeacherPass123!", first_name="Cookie", last_name="Teacher", role="teacher")
        access, refresh = create_token_pair(user)
        self.client.cookies["access_token"] = access
        self.client.cookies["refresh_token"] = refresh
        response = self.client.get("/api/v1/teacher/dashboard/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["data"]["user"]["id"], str(user.id))
