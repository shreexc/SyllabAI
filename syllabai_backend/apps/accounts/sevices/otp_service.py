
import secrets
from datetime import timedelta

from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from apps.accounts.models import EmailOTP
from .brevo_email import send_otp_email


OTP_EXPIRY_MINUTES = 20
OTP_RESEND_SECONDS = 60
OTP_MAX_ATTEMPTS = 5


def issue_otp(user, purpose: str) -> None:
    now = timezone.now()

    with transaction.atomic():
        # Serialize OTP issuance for this account.
        user.__class__.objects.select_for_update().get(pk=user.pk)

        latest = EmailOTP.objects.filter(
            user=user,
            purpose=purpose,
            created_at__gte=now - timedelta(seconds=OTP_RESEND_SECONDS),
        ).first()

        if latest:
            raise ValidationError(
                {"detail": "Please wait before requesting another code."}
            )

        EmailOTP.objects.filter(
            user=user,
            purpose=purpose,
            used_at__isnull=True,
        ).update(used_at=now)

        code = f"{secrets.randbelow(1_000_000):06d}"

        otp = EmailOTP(
            user=user,
            purpose=purpose,
            code_hash="",
            expires_at=now + timedelta(minutes=OTP_EXPIRY_MINUTES),
        )
        otp.set_code(code)
        otp.save()

    # Send after the database transaction commits.
    # If delivery fails, the caller should handle the error
    # without exposing the OTP or API key.
    send_otp_email(user.email, code, purpose)


def verify_otp(user, purpose: str, code: str):
    with transaction.atomic():
        otp = (
            EmailOTP.objects.select_for_update()
            .filter(
                user=user,
                purpose=purpose,
                used_at__isnull=True,
            )
            .order_by("-created_at")
            .first()
        )

        if otp is None or otp.expires_at <= timezone.now():
            raise ValidationError({"code": ["Invalid or expired code."]})

        if otp.attempts >= OTP_MAX_ATTEMPTS:
            raise ValidationError(
                {"code": ["Too many attempts. Request a new code."]}
            )

        otp.attempts += 1
        otp.save(update_fields=["attempts"])

        if not otp.check_code(code):
            raise ValidationError({"code": ["Invalid or expired code."]})

        otp.used_at = timezone.now()
        otp.save(update_fields=["used_at"])

        return otp
