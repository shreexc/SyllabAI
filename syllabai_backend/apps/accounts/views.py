from django.conf import settings
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import OpenApiResponse, extend_schema

from apps.common.utils import success_response
from .authentication import CookieJWTAuthentication
from .permissions import IsStudent, IsTeacher
from .csrf import enforce_csrf
from .serializers import EmptySerializer, LoginSerializer, ProfileSerializer, RegistrationSerializer, UserSerializer
from .services import authenticate_user, create_token_pair


def set_auth_cookies(response, access_token: str, refresh_token: str | None = None, role: str | None = None):
    response.set_cookie(
        settings.JWT_ACCESS_COOKIE_NAME,
        access_token,
        max_age=int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()),
        httponly=True,
        secure=settings.JWT_COOKIE_SECURE,
        samesite=settings.JWT_COOKIE_SAMESITE,
        path=settings.JWT_ACCESS_COOKIE_PATH,
        domain=settings.JWT_COOKIE_DOMAIN,
    )
    if refresh_token is not None:
        response.set_cookie(
            settings.JWT_REFRESH_COOKIE_NAME,
            refresh_token,
            max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
            httponly=True,
            secure=settings.JWT_COOKIE_SECURE,
            samesite=settings.JWT_COOKIE_SAMESITE,
            path=settings.JWT_REFRESH_COOKIE_PATH,
            domain=settings.JWT_COOKIE_DOMAIN,
        )
    if role is not None:
        response.set_cookie(
            "user_role",
            role,
            max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
            httponly=False,
            secure=settings.JWT_COOKIE_SECURE,
            samesite=settings.JWT_COOKIE_SAMESITE,
            path="/",
            domain=settings.JWT_COOKIE_DOMAIN,
        )
    return response


def clear_auth_cookies(response):
    response.delete_cookie(settings.JWT_ACCESS_COOKIE_NAME, path=settings.JWT_ACCESS_COOKIE_PATH, domain=settings.JWT_COOKIE_DOMAIN, samesite=settings.JWT_COOKIE_SAMESITE)
    response.delete_cookie(settings.JWT_REFRESH_COOKIE_NAME, path=settings.JWT_REFRESH_COOKIE_PATH, domain=settings.JWT_COOKIE_DOMAIN, samesite=settings.JWT_COOKIE_SAMESITE)
    response.delete_cookie("user_role", path="/", domain=settings.JWT_COOKIE_DOMAIN, samesite=settings.JWT_COOKIE_SAMESITE)
    return response


class AuthThrottleMixin:
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth"


class CsrfTokenView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    @extend_schema(
        summary="Initialize browser CSRF protection",
        description="Sets the CSRF cookie and returns a token required in X-CSRFToken for cookie-authenticated mutations.",
        responses={200: OpenApiResponse(description="CSRF token initialized.")},
    )
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        return success_response("CSRF token ready.", {"csrf_token": get_token(request)})


class RegistrationView(AuthThrottleMixin, APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    role = ""

    @extend_schema(
        summary="Register role account",
        description="Creates an account with the role fixed by this endpoint (never accepted from request data) and sets HttpOnly access/refresh cookies. Browser requests require CSRF.",
        request=RegistrationSerializer,
        responses={201: OpenApiResponse(description="Account created; response data contains the created user.")},
        auth=[],
    )
    def post(self, request):
        enforce_csrf(request)
        serializer = RegistrationSerializer(data=request.data, context={"role": self.role})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        access, refresh = create_token_pair(user)
        response = success_response("Registration successful.", {"user": UserSerializer(user).data}, status.HTTP_201_CREATED)
        return set_auth_cookies(response, access, refresh, user.role)


class TeacherRegistrationView(RegistrationView):
    role = "teacher"


class StudentRegistrationView(RegistrationView):
    role = "student"


class RoleLoginView(AuthThrottleMixin, APIView):
    permission_classes = [AllowAny]
    authentication_classes = [CookieJWTAuthentication]
    role = ""

    @extend_schema(
        summary="Sign in to role account",
        description="Verifies email, password, active status, and the endpoint's role. Successful login sets HttpOnly access/refresh cookies; other roles are forbidden. Browser requests require CSRF.",
        request=LoginSerializer,
        responses={200: OpenApiResponse(description="Signed in; response data contains the user."), 401: OpenApiResponse(description="Invalid credentials or inactive account."), 403: OpenApiResponse(description="Account has a different role.")},
        auth=[],
    )
    def post(self, request):
        enforce_csrf(request)
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate_user(expected_role=self.role, **serializer.validated_data)
        access, refresh = create_token_pair(user)
        response = success_response("Login successful.", {"user": UserSerializer(user).data})
        return set_auth_cookies(response, access, refresh, user.role)


class TeacherLoginView(RoleLoginView):
    role = "teacher"


class StudentLoginView(RoleLoginView):
    role = "student"


class LogoutView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    @extend_schema(
        summary="Sign out",
        description="Blacklists the refresh token when present and clears access, refresh, and navigation-hint cookies. Cookie requests require CSRF.",
        request=EmptySerializer,
        responses={200: OpenApiResponse(description="Signed out and cookies cleared.")},
        auth=[],
    )
    def post(self, request):
        enforce_csrf(request)
        refresh = request.COOKIES.get(settings.JWT_REFRESH_COOKIE_NAME)
        if refresh:
            try:
                RefreshToken(refresh).blacklist()
            except TokenError:
                pass
        return clear_auth_cookies(success_response("Logout successful."))


class RefreshView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    @extend_schema(
        summary="Refresh JWT cookies",
        description="Rotates the HttpOnly refresh token, blacklists the prior token, and sets new access/refresh cookies. Cookie requests require CSRF.",
        request=EmptySerializer,
        responses={200: OpenApiResponse(description="JWT cookies refreshed."), 401: OpenApiResponse(description="Missing or invalid refresh token.")},
        auth=[],
    )
    def post(self, request):
        enforce_csrf(request)
        raw_refresh = request.COOKIES.get(settings.JWT_REFRESH_COOKIE_NAME)
        if not raw_refresh:
            response = success_response("Refresh token is required.", status=status.HTTP_401_UNAUTHORIZED)
            return clear_auth_cookies(response)
        serializer = TokenRefreshSerializer(data={"refresh": raw_refresh})
        try:
            serializer.is_valid(raise_exception=True)
        except (InvalidToken, TokenError):
            response = success_response("Refresh token is invalid or has already been used.", status=status.HTTP_401_UNAUTHORIZED)
            return clear_auth_cookies(response)
        response = success_response("Token refreshed.")
        return set_auth_cookies(response, serializer.validated_data["access"], serializer.validated_data.get("refresh"))


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Get current account",
        description="Returns the authenticated user. Requires a valid access cookie or Bearer JWT.",
        responses={200: OpenApiResponse(description="Current user in response data."), 401: OpenApiResponse(description="Authentication required.")},
    )
    def get(self, request):
        return success_response("Current user loaded.", {"user": UserSerializer(request.user).data})


class RoleCurrentUserView(CurrentUserView):
    role_permission = None

    def get_permissions(self):
        return [permission() for permission in (IsAuthenticated, self.role_permission)]


class TeacherCurrentUserView(RoleCurrentUserView):
    role_permission = IsTeacher


class StudentCurrentUserView(RoleCurrentUserView):
    role_permission = IsStudent


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    role_permission = None

    def get_permissions(self):
        return [permission() for permission in (IsAuthenticated, self.role_permission)]

    @extend_schema(
        summary="Get role profile",
        description="Returns the authenticated role's profile. Requires authentication and the matching teacher/student role.",
        responses={200: OpenApiResponse(description="Profile in response data."), 401: OpenApiResponse(description="Authentication required."), 403: OpenApiResponse(description="Wrong role.")},
    )
    def get(self, request):
        return success_response("Profile loaded.", {"user": ProfileSerializer(request.user).data})

    @extend_schema(
        summary="Update role profile",
        description="Updates first_name and/or last_name only. Email and role cannot be changed here; cookie requests require CSRF.",
        request=ProfileSerializer,
        responses={200: OpenApiResponse(description="Updated profile in response data."), 401: OpenApiResponse(description="Authentication required."), 403: OpenApiResponse(description="Wrong role.")},
    )
    def patch(self, request):
        serializer = ProfileSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return success_response("Profile updated.", {"user": serializer.data})


class TeacherProfileView(ProfileView):
    role_permission = IsTeacher


class StudentProfileView(ProfileView):
    role_permission = IsStudent


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]
    role_permission = None
    role = ""

    def get_permissions(self):
        return [permission() for permission in (IsAuthenticated, self.role_permission)]

    @extend_schema(
        summary="Get role dashboard placeholder",
        description="Role-separated protected dashboard placeholder. Requires authentication and the matching teacher/student role; learning features are not implemented yet.",
        responses={200: OpenApiResponse(description="Dashboard role, user, and summary placeholder."), 401: OpenApiResponse(description="Authentication required."), 403: OpenApiResponse(description="Wrong role.")},
    )
    def get(self, request):
        return success_response(
            "Dashboard loaded.",
            {"role": self.role, "user": UserSerializer(request.user).data, "summary": {}},
        )


class TeacherDashboardView(DashboardView):
    role_permission = IsTeacher
    role = "teacher"

    def get(self, request):
        from apps.learning.models import LearningResource, PreparationRequest
        from apps.learning.serializers import LearningResourceSerializer, PreparationRequestSerializer

        resources = LearningResource.objects.filter(owner=request.user)
        preparations = PreparationRequest.objects.filter(user=request.user)
        summary = {
            "resources_count": resources.count(),
            "quizzes_count": preparations.filter(preparation_type="quiz", status="completed").count(),
            "flashcards_count": preparations.filter(preparation_type="flashcard", status="completed").count(),
            "notes_count": preparations.filter(preparation_type="short_note", status="completed").count(),
            "animations_count": preparations.filter(preparation_type="animation", status="completed").count(),
            "images_count": preparations.filter(preparation_type="image", status="completed").count(),
            "students_count": 0,
            "recent_resources": LearningResourceSerializer(resources.order_by("-created_at")[:5], many=True, context={"request": request}).data,
            "recent_preparations": PreparationRequestSerializer(preparations.select_related("resource").order_by("-created_at")[:5], many=True, context={"request": request}).data,
        }
        return success_response(
            "Dashboard loaded.",
            {"role": self.role, "user": UserSerializer(request.user).data, "summary": summary},
        )


class StudentDashboardView(DashboardView):
    role_permission = IsStudent
    role = "student"

    def get(self, request):
        from apps.learning.models import LearningResource, PreparationRequest
        from apps.learning.serializers import LearningResourceSerializer, PreparationRequestSerializer

        resources = LearningResource.objects.filter(owner=request.user)
        preparations = PreparationRequest.objects.filter(user=request.user)
        summary = {
            "notes_count": preparations.filter(preparation_type="short_note", status="completed").count(),
            "quizzes_count": preparations.filter(preparation_type="quiz", status="completed").count(),
            "flashcards_count": preparations.filter(preparation_type="flashcard", status="completed").count(),
            "animations_count": preparations.filter(preparation_type="animation", status="completed").count(),
            "images_count": preparations.filter(preparation_type="image", status="completed").count(),
            "recent_materials": LearningResourceSerializer(resources.order_by("-created_at")[:5], many=True, context={"request": request}).data,
            "recent_activity": PreparationRequestSerializer(preparations.select_related("resource").order_by("-created_at")[:5], many=True, context={"request": request}).data,
            "continue_learning": PreparationRequestSerializer(preparations.filter(status="completed").select_related("resource").order_by("-completed_at")[:5], many=True, context={"request": request}).data,
        }
        return success_response(
            "Dashboard loaded.",
            {"role": self.role, "user": UserSerializer(request.user).data, "summary": summary},
        )

