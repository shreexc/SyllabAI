"""Hardened production settings."""

import os

from .base import *  # noqa: F403

if not os.environ.get("SECRET_KEY") or SECRET_KEY == "unsafe-development-key-change-before-deploy":
	raise RuntimeError("Set a unique SECRET_KEY before running production settings.")
if not ALLOWED_HOSTS:
	raise RuntimeError("Set ALLOWED_HOSTS before running production settings.")
if LEARNING_MALWARE_SCANNER == "disabled":
	raise RuntimeError("Configure a malware scanner before enabling user file uploads in production.")

DEBUG = False
JWT_COOKIE_SECURE = True
JWT_COOKIE_SAMESITE = "None"
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = "None"
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"
SECURE_HSTS_SECONDS = int(os.environ.get("SECURE_HSTS_SECONDS", "31536000"))
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
