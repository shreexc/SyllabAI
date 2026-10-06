from rest_framework.permissions import BasePermission


class IsTeacher(BasePermission):
    message = "This endpoint is available to teachers only."

    def has_permission(self, request, view) -> bool:
        return bool(request.user and request.user.is_authenticated and request.user.role == "teacher")


class IsStudent(BasePermission):
    message = "This endpoint is available to students only."

    def has_permission(self, request, view) -> bool:
        return bool(request.user and request.user.is_authenticated and request.user.role == "student")


class IsTeacherOrReadOnly(BasePermission):
    message = "Only teachers may modify this resource."

    def has_permission(self, request, view) -> bool:
        return bool(
            request.user and request.user.is_authenticated
            and (request.method in {"GET", "HEAD", "OPTIONS"} or request.user.role == "teacher")
        )
