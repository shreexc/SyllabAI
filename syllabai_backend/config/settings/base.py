"""Shared settings for all SyllabAI environments."""

import os
from datetime import timedelta
from pathlib import Path
from urllib.parse import urlparse

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

SECRET_KEY = os.environ.get("SECRET_KEY", "unsafe-development-key-change-before-deploy")
DEBUG = os.environ.get("DEBUG", "False").lower() in {"1", "true", "yes"}
ALLOWED_HOSTS = [host.strip() for host in os.environ.get("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",") if host.strip()]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",
    "drf_spectacular",
    "apps.accounts.apps.AccountsConfig",
    "apps.learning.apps.LearningConfig",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [],
    "APP_DIRS": True,
    "OPTIONS": {"context_processors": [
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
    ]},
}]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"


def database_config() -> dict[str, object]:
    """Build a PostgreSQL connection from DATABASE_URL; SQLite is never implicit."""
    url = urlparse(os.environ.get("DATABASE_URL", "postgresql://syllabai:syllabai@localhost:5433/syllabai"))
    if url.scheme not in {"postgres", "postgresql"}:
        raise RuntimeError("DATABASE_URL must be a PostgreSQL URL (postgresql://...).")
    return {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": url.path.lstrip("/"),
        "USER": url.username or "",
        "PASSWORD": url.password or "",
        "HOST": url.hostname or "localhost",
        "PORT": str(url.port or 5432),
        "CONN_MAX_AGE": int(os.environ.get("DB_CONN_MAX_AGE", "60")),
        "OPTIONS": {"sslmode": os.environ.get("DB_SSLMODE", "prefer")},
    }


DATABASES = {"default": database_config()}

AUTH_USER_MODEL = "accounts.User"
AUTHENTICATION_BACKENDS = ["django.contrib.auth.backends.ModelBackend"]
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ["apps.accounts.authentication.CookieJWTAuthentication"],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {"anon": "60/hour", "user": "1000/hour", "auth": "10/minute"},
    "EXCEPTION_HANDLER": "apps.common.exceptions.api_exception_handler",
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=int(os.environ.get("JWT_ACCESS_TOKEN_LIFETIME_MINUTES", "15"))),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=int(os.environ.get("JWT_REFRESH_TOKEN_LIFETIME_DAYS", "7"))),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

JWT_COOKIE_SECURE = os.environ.get("JWT_COOKIE_SECURE", "false").lower() in {"1", "true", "yes"}
JWT_COOKIE_SAMESITE = os.environ.get("JWT_COOKIE_SAMESITE", "Lax")
JWT_ACCESS_COOKIE_NAME = "access_token"
JWT_REFRESH_COOKIE_NAME = "refresh_token"
JWT_ACCESS_COOKIE_PATH = "/"
JWT_REFRESH_COOKIE_PATH = "/"
JWT_COOKIE_DOMAIN = os.environ.get("JWT_COOKIE_DOMAIN") or None

CORS_ALLOWED_ORIGINS = [origin.strip() for origin in os.environ.get("CORS_ALLOWED_ORIGINS", "").split(",") if origin.strip()]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = ["accept", "authorization", "content-type", "x-csrftoken", "x-requested-with"]
CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in os.environ.get("CSRF_TRUSTED_ORIGINS", "").split(",") if origin.strip()]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

MEDIA_ROOT = Path(os.environ.get("PRIVATE_MEDIA_ROOT", BASE_DIR / "private_media"))
MEDIA_URL = ""
FILE_UPLOAD_PERMISSIONS = 0o600
FILE_UPLOAD_MAX_MEMORY_SIZE = 8 * 1024 * 1024
DATA_UPLOAD_MAX_MEMORY_SIZE = 8 * 1024 * 1024
LEARNING_MAX_UPLOAD_BYTES = int(os.environ.get("LEARNING_MAX_UPLOAD_BYTES", str(20 * 1024 * 1024)))
LEARNING_MAX_PDF_PAGES = int(os.environ.get("LEARNING_MAX_PDF_PAGES", "250"))
LEARNING_MAX_IMAGE_PIXELS = int(os.environ.get("LEARNING_MAX_IMAGE_PIXELS", "40000000"))
LEARNING_MAX_DOCX_UNCOMPRESSED_BYTES = int(os.environ.get("LEARNING_MAX_DOCX_UNCOMPRESSED_BYTES", str(100 * 1024 * 1024)))
LEARNING_MAX_EXTRACTED_CHARACTERS = int(os.environ.get("LEARNING_MAX_EXTRACTED_CHARACTERS", "2100000"))
LEARNING_MAX_QUIZ_QUESTIONS = int(os.environ.get("LEARNING_MAX_QUIZ_QUESTIONS", "50"))
LEARNING_MAX_FLASHCARDS = int(os.environ.get("LEARNING_MAX_FLASHCARDS", "100"))
LEARNING_MAX_ANIMATION_SECONDS = int(os.environ.get("LEARNING_MAX_ANIMATION_SECONDS", "300"))
LEARNING_MAX_ACTIVE_PREPARATIONS = int(os.environ.get("LEARNING_MAX_ACTIVE_PREPARATIONS", "3"))
LEARNING_MAX_NOTE_POINTS = int(os.environ.get("LEARNING_MAX_NOTE_POINTS", "18"))
LEARNING_TASKS_EAGER = os.environ.get("LEARNING_TASKS_EAGER", "false").lower() in {"1", "true", "yes"}
LEARNING_MALWARE_SCANNER = os.environ.get("LEARNING_MALWARE_SCANNER", "disabled")
CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379/0")
CELERY_RESULT_BACKEND = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379/1")
CELERY_WORKER_CONCURRENCY = int(os.environ.get("CELERY_WORKER_CONCURRENCY", "2"))

SPECTACULAR_SETTINGS = {
    "TITLE": "SyllabAI API",
    "DESCRIPTION": "Role-separated authentication and dashboard foundation.",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}
