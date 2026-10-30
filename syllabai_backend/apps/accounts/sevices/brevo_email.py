
import requests
from django.conf import settings


def send_otp_email(email: str, otp: str, purpose: str) -> None:
    templates = {
        "verify_email": (
            "Verify your SyllabAI email",
            "Use this code to verify your email address.",
        ),
        "reset_password": (
            "Reset your SyllabAI password",
            "Use this code to reset your password.",
        ),
    }

    if purpose not in templates:
        raise ValueError("Unsupported OTP purpose.")

    subject, message = templates[purpose]

    response = requests.post(
        "https://api.brevo.com/v3/smtp/email",
        headers={
            "accept": "application/json",
            "api-key": settings.BREVO_API_KEY,
            "content-type": "application/json",
        },
        json={
            "sender": {
                "name": settings.BREVO_SENDER_NAME,
                "email": settings.BREVO_SENDER_EMAIL,
            },
            "to": [{"email": email}],
            "subject": subject,
            "textContent": (
                f"{message}\n\n"
                f"Your code is: {otp}\n"
                "It expires in 20 minutes. "
                "Do not share this code with anyone."
            ),
        },
        timeout=10,
    )
    response.raise_for_status()
