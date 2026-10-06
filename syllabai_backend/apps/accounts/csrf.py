from django.http import HttpRequest
from rest_framework.authentication import CSRFCheck
from rest_framework.exceptions import PermissionDenied


def enforce_csrf(request) -> None:
    django_request: HttpRequest = getattr(request, "_request", request)
    check = CSRFCheck(lambda _request: None)
    check.process_request(django_request)
    reason = check.process_view(django_request, None, (), {})
    if reason:
        raise PermissionDenied(f"CSRF validation failed: {reason}")