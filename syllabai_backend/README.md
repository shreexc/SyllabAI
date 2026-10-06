# SyllabAI backend

Django REST API for role-separated teacher/student accounts and private learning-material preparation. The application requires PostgreSQL; there is no implicit SQLite configuration. This repository does **not** contain the previously assumed Gemini/RAG/pgvector pipeline; current preparation generators are deterministic and source-extractive, not LLM-powered.

## Setup

1. Start PostgreSQL and Redis with `docker compose up -d db redis` (PostgreSQL host port 5433 avoids colliding with a local PostgreSQL on 5432), or set `DATABASE_URL` to your PostgreSQL URL.
2. Copy `.env.example` to `.env` and replace `SECRET_KEY` and database credentials.
3. Create/activate a virtual environment and install `requirements/development.txt`.
4. Run migrations with `python manage.py migrate`.
5. Create an admin with `python manage.py createsuperuser`.
6. Run the API with `python manage.py runserver` and a worker in a second terminal with `celery -A config worker --loglevel=info`; default worker concurrency is capped at two.

Settings defaults to `config.settings.development`; deploy with `DJANGO_SETTINGS_MODULE=config.settings.production`. Production settings enforce HTTPS and secure cookies. Browser mutations authenticated by cookies require a CSRF token from `GET /api/v1/auth/csrf/`; send it as `X-CSRFToken` and use credentialed requests.

## API

- Teacher/student registration: `POST /api/v1/auth/{teacher|student}/register/`
- Teacher/student login: `POST /api/v1/auth/{teacher|student}/login/`
- Logout/refresh/current user: `/api/v1/auth/logout/`, `/api/v1/auth/token/refresh/`, `/api/v1/auth/me/`
- Role profiles/current user: `/api/v1/{teacher|student}/profile/`, `/api/v1/auth/{teacher|student}/me/`
- Role dashboards: `/api/v1/{teacher|student}/dashboard/`
- Search own ready sources: `GET /api/v1/learning/{teacher|student}/search/?q=heart&type=quiz`
- Upload private files: `POST /api/v1/learning/{teacher|student}/resources/upload/` (multipart form data)
- Resource status/file: `GET /api/v1/learning/{teacher|student}/resources/{id}/` and `/file/`
- Create/poll/cancel preparations: `POST /api/v1/learning/{teacher|student}/preparations/`, `GET .../{id}/`, `POST .../{id}/cancel/`
- Stream private image/storyboard result: `GET /api/v1/learning/{teacher|student}/preparations/{id}/result-file/`
- OpenAPI schema and Swagger UI: `/api/schema/` and `/api/docs/`

Access and refresh tokens are HttpOnly cookies. Refresh tokens rotate and are blacklisted after rotation/logout. Login and registration have an authentication throttle; general anonymous/user throttles are configured in DRF settings. Resource files live under a private filesystem storage root (no public media route), are limited by extension, MIME, file signature, size, PDF page count, DOCX expansion and extracted-character limits, and are never executed. `LEARNING_MALWARE_SCANNER` accepts `disabled` for development or a dotted-path callable that receives the upload and must return `clean`; production settings refuse to start when scanning is disabled.

Preparation jobs run asynchronously via Redis/Celery. The supported output types are quiz, short notes, flashcards, images, animation/storyboard, and **Other** (a bounded custom request with study-guide, glossary, outline, or practice-prompt formats). Current output is source-grounded and deterministic: extractive quiz/notes/flashcards/custom sections, template-based SVG diagrams, and animated SVG storyboards. The animation renderer is not an MP4 renderer. Gemini credentials/provider, OCR, external web search, pgvector embeddings/RAG retrieval, and MP4 rendering are not configured because no such pre-existing implementation exists in this repository. External search is therefore limited to the authenticated user's own ready resources; the URL/source/license fields support a future rights-aware provider.

## Verification

Run `python manage.py check`, `python manage.py test apps.accounts.tests apps.learning.tests`, and `python manage.py spectacular --validate --file /tmp/syllabai-openapi.yaml` after configuring PostgreSQL and applying migrations.
