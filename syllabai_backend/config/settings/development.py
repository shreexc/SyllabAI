"""Local development settings."""

import os

from .base import *  # noqa: F403

DEBUG = True

# The frontend and API use different ports in local development. CORS must
# allow both common loopback spellings because browsers treat their origins
# as distinct, and credentialed requests require an exact origin match.
CORS_ALLOWED_ORIGINS = [
	origin.strip()
	for origin in os.environ.get(
		"CORS_ALLOWED_ORIGINS",
		"http://localhost:3000,http://127.0.0.1:3000",
	).split(",")
	if origin.strip()
]
CSRF_TRUSTED_ORIGINS = [
	origin.strip()
	for origin in os.environ.get(
		"CSRF_TRUSTED_ORIGINS",
		"http://localhost:3000,http://127.0.0.1:3000",
	).split(",")
	if origin.strip()
]
