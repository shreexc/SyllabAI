from django.conf import settings
from rest_framework.authentication import get_authorization_header
from rest_framework_simplejwt.authentication import JWTAuthentication

from .csrf import enforce_csrf


class CookieJWTAuthentication(JWTAuthentication):
    """Authenticate from the HttpOnly access cookie and require CSRF for cookie writes."""

    def authenticate(self, request):
        raw_token = request.COOKIES.get(settings.JWT_ACCESS_COOKIE_NAME)
        if raw_token:
            enforce_csrf(request)
        else:
            raw_token = self.get_raw_token(get_authorization_header(request))
        if raw_token is None:
            return None
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token

    def authenticate_header(self, request) -> str:
        return "Bearer"

