from django.contrib.auth import authenticate, get_user_model
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import validate_email
from django.db import IntegrityError, transaction
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied, ValidationError
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


def register_user(*, email: str, password: str, first_name: str, last_name: str, role: str):
    normalized_email = User.objects.normalize_email(email).strip().lower()
    try:
        validate_email(normalized_email)
    except DjangoValidationError as error:
        raise ValidationError({"email": list(error.messages)}) from error
    if User.objects.filter(email__iexact=normalized_email).exists():
        raise ValidationError({"email": ["A user with this email already exists."]})
    user = User(email=normalized_email, first_name=first_name.strip(), last_name=last_name.strip(), role=role)
    try:
        user.full_clean(exclude=("password", "last_login"))
        user.set_password(password)
        with transaction.atomic():
            user.save()
    except DjangoValidationError as error:
        raise ValidationError(error.message_dict) from error
    except IntegrityError as error:
        raise ValidationError({"email": ["A user with this email already exists."]}) from error
    return user


def authenticate_user(*, email: str, password: str, expected_role: str):
    normalized_email = User.objects.normalize_email(email).strip().lower()
    existing_user = User.objects.filter(email__iexact=normalized_email).first()
    if existing_user is not None and not existing_user.is_active:
        raise AuthenticationFailed("This account is inactive.")
    user = authenticate(username=normalized_email, password=password)
    if user is None:
        raise AuthenticationFailed("Invalid email or password.")
    if not user.is_active:
        raise AuthenticationFailed("This account is inactive.")
    if user.role != expected_role:
        other_role = "student" if expected_role == "teacher" else "teacher"
        raise PermissionDenied(f"This account is registered as a {other_role}.")
    return user


def create_token_pair(user) -> tuple[str, str]:
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token), str(refresh)
