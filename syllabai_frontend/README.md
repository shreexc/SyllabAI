# SyllabAI frontend

Next.js 16 App Router and TypeScript client. Teacher/student screens, authentication forms, and auth hooks are intentionally separated by role.

## Local setup

1. Copy `.env.local.example` to `.env.local`; set `NEXT_PUBLIC_API_URL=http://localhost:8000`.
2. Install with `npm install`.
3. Start PostgreSQL and Django as described in `../syllabai_backend/README.md`.
4. Run `npm run dev`, then open `http://localhost:3000`.

The browser API client uses `credentials: "include"` and the environment-provided API origin. JWT access/refresh tokens remain in HttpOnly cookies (never browser storage). The client initializes CSRF from Django and sends `X-CSRFToken` for mutations. The readable `user_role` cookie is only a navigation hint used by Next.js Proxy; the Django API remains the authorization boundary.

Authentication feedback uses a global Sonner toast viewport. Success/errors are announced as dismissible toasts; login failures offer retry, and wrong-role responses offer a direct switch to the matching sign-in flow. Validation errors include backend field details when provided.

Authenticated preparation pages live at `/teacher/prepare` and `/student/prepare`. They share search/upload/output/options/progress/result UI while role-specific hooks call role-scoped APIs. Upload requests use multipart `FormData` through the credentialed API client; polling tracks upload and preparation status. Results include interactive quiz answer checking, flip-through flashcards, structured notes, private image previews/downloads, and animated-SVG storyboard playback. The current backend does not configure Gemini, external web search, OCR, pgvector/RAG, or MP4 rendering.

## Validation

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
