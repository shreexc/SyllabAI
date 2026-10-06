from rest_framework.permissions import BasePermission


class IsLearningUser(BasePermission):
    message = "A teacher or student account is required."

    def has_permission(self, request, view) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in {"teacher", "student"}
        )
