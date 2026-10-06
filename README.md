# SyllabAI
SyllabAI is a AI powered education platform which is dedicated to students as well as teachers for their study materials. Where teachers can create subjects, share the notes, and create quizzes for students for normal tests. Whereas students can add their notes, create animation for study feasibility, create practice quizzes, and get a help bot for them to get through tough parts of the notes.

## Authentication and learning preparation

This repository contains a Django REST Framework/PostgreSQL API in `syllabai_backend/` and the Next.js App Router client in `syllabai_frontend/`. Teacher and student authentication, permissions, learning-resource search/upload, and preparation workflows are kept role-separated. There is no Gemini/RAG/pgvector integration in the existing repository: preparation uses deterministic extractive generation, template SVG diagrams, and a storyboard-to-animated-SVG renderer; MP4 generation and external-resource search remain future integrations.

### Local run

1. From `syllabai_backend/`, start PostgreSQL and Redis with `docker compose up -d db redis` (PostgreSQL port 5433), copy `.env.example` to `.env`, and replace `SECRET_KEY` for any non-local use.
2. Activate/create the backend virtual environment, then install `requirements/development.txt`.
3. From `syllabai_backend/`, run `python manage.py migrate`, `python manage.py createsuperuser`, and `python manage.py runserver`. In a second terminal run `celery -A config worker --loglevel=info`.
4. Copy `syllabai_frontend/.env.local.example` to `syllabai_frontend/.env.local`, then from `syllabai_frontend/` run `npm install` and `npm run dev`.
5. Open `http://localhost:3000`; Swagger documentation is at `http://localhost:8000/api/docs/`.

Open `/teacher/prepare` or `/student/prepare` after login to search your ready private sources or upload supported material, choose an output, and track the async job. For backend checks run `python manage.py test apps.accounts.tests apps.learning.tests`; for frontend checks run `npm run lint && npm run typecheck && npm test && npm run build`.
