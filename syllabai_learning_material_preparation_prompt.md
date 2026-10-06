# SyllabAI — Search / Upload Learning Material → Quiz, Short Notes, Flashcards, Images & Animation

## Purpose

You are a senior full-stack engineer extending the existing **SyllabAI** project.

The existing project already has:

- Django + Django REST Framework
- PostgreSQL
- Custom Django User model
- Separate Teacher and Student roles
- JWT authentication with secure HTTP-only cookies
- Role-based backend permissions
- Next.js + TypeScript + App Router
- Tailwind CSS
- Separate Teacher and Student frontend routes/components
- Existing document/RAG architecture:
  - PDF/text extraction
  - cleaning
  - chunking
  - Gemini embeddings
  - PostgreSQL + pgvector
  - Gemini LLM

**Do not rewrite or replace the existing authentication or RAG architecture.**

This prompt adds the **Learning Material Search / Upload and Preparation system**.

---

# 1. Main Product Flow

Build a system where a Teacher or Student can:

1. Search for a learning resource.
2. Upload a PDF, image, document, or supported file.
3. Select what they want to prepare.
4. Configure preparation options.
5. Start preparation.
6. Track processing status.
7. View the generated result.

The main flow is:

```text
Search OR Upload
       ↓
Select Resource
       ↓
What do you want to prepare?
       ↓
┌────────────┬─────────────┬────────────┬──────────┬───────────┐
│ Quiz       │ Short Notes │ Flashcards │ Images   │ Animation │
└────────────┴─────────────┴────────────┴──────────┴───────────┘
       ↓
Configure Options
       ↓
Prepare
       ↓
Processing
       ↓
Validation
       ↓
Result
```

---

# 2. Important Architecture Principle

Do not treat this as:

```text
PDF → LLM → Result
```

Instead use:

```text
Resource
   ↓
Document Intelligence
   ↓
Structured Document + Chunks
   ↓
Existing RAG/pgvector
   ↓
Preparation Generator
   ↓
Validation
   ↓
Stored Result
```

Search and upload are only ways to select/create a `LearningResource`.

The selected resource then goes through the same preparation pipeline.

---

# 3. Output Types

Create a controlled enum.

Backend:

```python
class PreparationType(models.TextChoices):
    QUIZ = "quiz", "Quiz"
    SHORT_NOTE = "short_note", "Short Note"
    FLASHCARD = "flashcard", "Flashcard"
    IMAGE = "image", "Image"
    ANIMATION = "animation", "Animation"
```

Frontend:

```typescript
type PreparationType =
  | "quiz"
  | "short_note"
  | "flashcard"
  | "image"
  | "animation";
```

Never trust arbitrary output-type strings from the client.

Only one primary preparation type should be selected per request in V1.

---

# 4. Existing Project Integration

Extend the existing project instead of creating a second application.

Recommended backend addition:

```text
backend/
└── apps/
    ├── accounts/
    ├── common/
    └── learning/
        ├── migrations/
        ├── admin.py
        ├── apps.py
        ├── models.py
        ├── serializers.py
        ├── permissions.py
        ├── urls.py
        ├── views.py
        ├── services/
        │   ├── search.py
        │   ├── upload.py
        │   ├── extraction.py
        │   ├── preparation.py
        │   └── generation.py
        ├── generators/
        │   ├── base.py
        │   ├── quiz.py
        │   ├── short_notes.py
        │   ├── flashcards.py
        │   ├── images.py
        │   └── animation.py
        ├── selectors/
        │   └── resources.py
        ├── tasks/
        │   └── processing.py
        └── tests/
```

Recommended frontend addition:

```text
frontend/
├── app/
│   ├── teacher/
│   │   └── prepare/
│   │       └── page.tsx
│   └── student/
│       └── prepare/
│           └── page.tsx
│
├── components/
│   ├── preparation/
│   │   ├── PreparationPage.tsx
│   │   ├── SearchResource.tsx
│   │   ├── FileUpload.tsx
│   │   ├── OutputTypeSelector.tsx
│   │   ├── ResourceResults.tsx
│   │   ├── ResourcePreview.tsx
│   │   ├── PreparationOptions.tsx
│   │   ├── ProcessingStatus.tsx
│   │   └── PreparationResult.tsx
│   ├── teacher/
│   └── student/
│
├── hooks/
│   ├── useResourceSearch.ts
│   ├── useFileUpload.ts
│   └── usePreparation.ts
│
├── types/
│   └── learning.ts
│
└── lib/
    └── api.ts
```

Shared UI components are allowed. Teacher and Student business logic must remain separated.

---

# 5. Preparation Page

Create:

```text
/teacher/prepare
/student/prepare
```

The page should contain:

```text
Prepare Learning Material

[ Search learning material... ]

OR

[ Upload PDF / Image / Document ]

What do you want to prepare?

[ Quiz ]
[ Short Notes ]
[ Flashcards ]
[ Images ]
[ Animation ]

[ Preparation Options ]

[ Prepare ]
```

After preparation begins, show status:

```text
Preparing your material...

✓ Reading source
✓ Finding relevant content
● Generating content
○ Validating result
```

The UI must never appear frozen during long-running jobs.

---

# 6. Supported Input Types

Initially support:

```text
PDF
PNG
JPG
JPEG
WEBP
TXT
DOCX
```

Design the system so additional formats can be added later.

Validate:

- File extension
- MIME type
- File size
- Actual file content where practical

Never trust the filename extension alone.

---

# 7. Search Flow

Example:

```text
User searches:
"Human heart"

Selects:
Quiz
```

API:

```http
GET /api/v1/learning/search/?q=human%20heart&type=quiz
```

Supported `type` values:

```text
quiz
short_note
flashcard
image
animation
```

Search should find/select a source. It should **not** generate the final educational content.

Conceptually:

```text
Search
  ↓
Resource candidates
  ↓
User selects resource
  ↓
Preparation
```

---

# 8. Search Result UI

Each result should display:

```text
Title
Resource type
Source
Description
Relevant sections/pages
Preview
Use this resource
```

Example:

```text
┌──────────────────────────────────────┐
│ Human Cardiovascular System          │
│ PDF · 42 pages                       │
│                                      │
│ Anatomy and physiology of the heart │
│                                      │
│ Relevant sections:                   │
│ • Chambers                           │
│ • Valves                             │
│ • Cardiac cycle                      │
│                                      │
│ [Preview] [Use this resource]        │
└──────────────────────────────────────┘
```

For external resources, respect copyright, licensing, robots/access restrictions, and terms of service. Do not silently download or permanently store copyrighted third-party files without appropriate rights.

---

# 9. Upload Flow

Upload API:

```http
POST /api/v1/learning/resources/upload/
```

Use multipart form data.

Example:

```text
file = heart.pdf
title = Human Heart
```

Backend flow:

```text
Authenticate
 ↓
Check permission
 ↓
Validate file
 ↓
Store privately
 ↓
Create LearningResource
 ↓
Create processing job
 ↓
Extract content
 ↓
Process document
```

Return quickly for long-running processing:

```json
{
  "success": true,
  "data": {
    "resource_id": "uuid",
    "status": "processing"
  }
}
```

Do not block the request while processing a large document.

---

# 10. LearningResource Model

Create a source-resource model similar to:

```python
class LearningResource(models.Model):
    id = UUIDField(...)
    owner = ForeignKey(User, ...)
    title = CharField(...)
    resource_type = CharField(...)
    source_type = CharField(...)
    file = FileField(...)
    mime_type = CharField(...)
    file_size = BigIntegerField(...)
    status = CharField(...)
    created_at = DateTimeField(...)
    updated_at = DateTimeField(...)
```

Possible source types:

```text
upload
external
generated
```

Possible statuses:

```text
uploaded
processing
ready
failed
```

Do not store very large extracted documents in an ordinary relational field if object/blob storage is more appropriate.

---

# 11. PreparationRequest Model

Create a separate model:

```python
class PreparationRequest(models.Model):
    id = UUIDField(...)
    user = ForeignKey(User, ...)
    resource = ForeignKey(LearningResource, ...)
    preparation_type = CharField(...)
    status = CharField(...)
    options = JSONField(...)
    result = JSONField(...)
    error_message = TextField(...)
    created_at = DateTimeField(...)
    completed_at = DateTimeField(...)
```

Statuses:

```text
pending
processing
completed
failed
cancelled
```

One resource can produce multiple preparations:

```text
Human Heart.pdf
    ├── Quiz
    ├── Flashcards
    ├── Short Notes
    └── Animation
```

Do not put all generated content directly into `LearningResource`.

---

# 12. Preparation API

Create:

```http
POST /api/v1/learning/preparations/
GET  /api/v1/learning/preparations/{id}/
POST /api/v1/learning/preparations/{id}/cancel/
```

Request:

```json
{
  "resource_id": "uuid",
  "preparation_type": "quiz",
  "options": {
    "count": 10,
    "difficulty": "medium",
    "question_types": ["mcq", "true_false"]
  }
}
```

Backend must:

1. Authenticate user.
2. Check resource access.
3. Validate preparation type.
4. Validate options according to preparation type.
5. Create `PreparationRequest`.
6. Queue processing.
7. Return the request ID and current status.

---

# 13. Preparation Options

## Quiz

Support:

```text
Number of questions
Difficulty
Question types
Selected topic/section
Language
```

Example:

```json
{
  "count": 10,
  "difficulty": "medium",
  "question_types": ["mcq", "true_false"],
  "language": "en"
}
```

## Short Notes

Support:

```text
Length
Difficulty
Language
Style
```

Example:

```json
{
  "length": "medium",
  "difficulty": "student",
  "language": "en",
  "style": "bullet_points"
}
```

## Flashcards

Support:

```text
Number of cards
Difficulty
Language
```

Example:

```json
{
  "count": 20,
  "difficulty": "medium",
  "language": "en"
}
```

## Images

Support:

```text
Image mode
Style
Labels
Aspect ratio
```

Possible modes:

```text
source_image
extracted_image
diagram
infographic
illustration
flowchart
```

Do not silently replace an existing source image with a generated image.

## Animation

Support:

```text
Duration
Difficulty
Style
Language
Animation type
```

Example:

```json
{
  "duration": 120,
  "difficulty": "beginner",
  "style": "educational",
  "language": "en",
  "animation_type": "concept_explanation"
}
```

---

# 14. Reuse Existing Document/RAG Pipeline

The existing SyllabAI architecture already has:

```text
PDF
 ↓
Text extraction
 ↓
Cleaning
 ↓
Chunking
 ↓
Gemini embeddings
 ↓
PostgreSQL + pgvector
 ↓
RAG
 ↓
Gemini
```

**Reuse these services.**

Do not create a second PDF extraction/chunking/embedding system.

The new flow should be:

```text
LearningResource
       ↓
Existing Document Processor
       ↓
Structured Document + Chunks
       ↓
Existing Embeddings
       ↓
pgvector
       ↓
Preparation Generator
```

If the existing implementation is not yet modular, refactor it into reusable services rather than duplicating code.

---

# 15. Output-Specific Generators

Create a common interface:

```python
class BasePreparationGenerator:
    def generate(self, resource, options):
        raise NotImplementedError
```

Then implement:

```text
QuizGenerator
ShortNoteGenerator
FlashcardGenerator
ImageGenerator
AnimationGenerator
```

Each generator should be independent.

This makes future output types easy to add.

---

# 16. Quiz Generator

Pipeline:

```text
Resource
 ↓
Retrieve relevant sections/chunks
 ↓
Generate structured questions
 ↓
Validate schema
 ↓
Validate grounding
 ↓
Detect duplicates
 ↓
Save quiz
```

Questions must be grounded in the selected source when source-grounded generation is requested.

Do not make the quiz generator depend directly on an HTTP request.

It should operate as a service.

---

# 17. Short Notes Generator

Pipeline:

```text
Resource
 ↓
Relevant sections
 ↓
Summarization
 ↓
Structured short notes
 ↓
Validation
 ↓
Save
```

Example result:

```json
{
  "title": "Human Heart",
  "summary": "...",
  "key_points": [
    "...",
    "...",
    "..."
  ],
  "important_terms": [
    {
      "term": "SA node",
      "meaning": "..."
    }
  ]
}
```

---

# 18. Flashcard Generator

Pipeline:

```text
Resource
 ↓
Concept extraction
 ↓
Important facts
 ↓
Flashcard generation
 ↓
Schema validation
 ↓
Duplicate detection
 ↓
Save deck
```

Example:

```json
{
  "title": "Human Heart Flashcards",
  "cards": [
    {
      "front": "What is the SA node?",
      "back": "The natural pacemaker of the heart."
    }
  ]
}
```

---

# 19. Image Workflow

Support four separate use cases:

```text
1. Search/find existing image
2. Extract image from uploaded PDF/document
3. Generate educational diagram
4. Generate educational illustration
```

The selected `image_mode` must determine the workflow.

Do not call image generation when the user selected source/extracted image.

Keep image generation server-side.

---

# 20. Animation Workflow

Animation is different from quiz/notes/flashcards.

Do not ask the LLM to directly produce an arbitrary video.

Use:

```text
Source
 ↓
Concept extraction
 ↓
Animation specification
 ↓
Specification validation
 ↓
Animation renderer
 ↓
Video
```

Example specification:

```json
{
  "title": "Blood Circulation",
  "duration": 90,
  "scenes": [
    {
      "type": "intro",
      "duration": 10
    },
    {
      "type": "blood_flow",
      "from": "heart",
      "to": "lungs",
      "duration": 20
    }
  ]
}
```

The renderer may later use:

```text
Manim
Remotion
HTML/CSS/SVG
or another dedicated renderer
```

The renderer must remain independent of the LLM.

---

# 21. Async Processing

Long-running work must be asynchronous.

Use an appropriate task system, such as:

```text
Celery + Redis
```

or another project-approved worker architecture.

Do not block a Django HTTP request while:

- Processing a large PDF
- Generating many questions
- Generating images
- Rendering animation/video

Flow:

```text
POST /preparations/
        ↓
PreparationRequest created
        ↓
status = pending
        ↓
Worker
        ↓
status = processing
        ↓
Generator
        ↓
Validation
        ↓
status = completed
```

Failure:

```text
processing → failed
```

Cancellation:

```text
pending/processing → cancelled
```

---

# 22. Frontend Processing State

Use explicit states:

```text
IDLE
RESOURCE_SELECTED
OPTIONS_SELECTED
SUBMITTING
PENDING
PROCESSING
COMPLETED
FAILED
CANCELLED
```

Display progress appropriately.

For example:

```text
Preparing your quiz...

✓ Reading source
✓ Selecting relevant content
● Generating questions
○ Validating questions
```

For animation:

```text
Reading content
      ↓
Creating storyboard
      ↓
Generating scenes
      ↓
Rendering animation
      ↓
Finalizing video
```

Initial status updates can use polling:

```http
GET /api/v1/learning/preparations/{id}/
```

Later, WebSocket/SSE/realtime updates can be introduced.

---

# 23. Result UI

After completion, render output-specific results.

## Quiz

```text
Title
Question count
Difficulty
Start Quiz
```

## Short Notes

```text
Title
Summary
Key points
Important terms
```

## Flashcards

```text
Deck title
Card count
Start studying
```

## Images

```text
Image preview
Image type
Save/share/download actions
```

## Animation

```text
Video preview
Title
Duration
Play
```

---

# 24. Teacher/Student Separation

Use:

```text
/teacher/prepare
/student/prepare
```

Teacher and Student permissions must remain separate.

Teacher may eventually:

```text
Upload resources
Create reusable learning materials
Share resources with students
Create classroom material
```

Student may eventually:

```text
Upload personal study material
Prepare study material
Study generated content
```

Do not assume students can access teacher-private resources.

Every backend request must verify actual ownership/access.

Never rely on frontend role checks for security.

---

# 25. Shared UI vs Separate Business Logic

Shared UI is encouraged:

```text
SearchResource
FileUpload
OutputTypeSelector
ResourceResults
ProcessingStatus
```

But do not create one giant role-dependent component.

Avoid:

```typescript
if (role === "teacher") {
   // hundreds of lines
} else {
   // hundreds of lines
}
```

Instead keep:

```text
Teacher page
   ↓
Teacher-specific hook/service
   ↓
Shared preparation components

Student page
   ↓
Student-specific hook/service
   ↓
Shared preparation components
```

---

# 26. Resource Access Security

Never allow:

```text
GET /resources/{id}
```

to return another user's private resource simply because the UUID is known.

Every request must verify:

```text
authenticated user
+
ownership/access policy
```

Use Django permissions/services/selectors.

The frontend must never be the only authorization layer.

---

# 27. Search vs Generation

Keep these responsibilities strictly separate.

```text
SEARCH
"What resource should I use?"

GENERATION
"What educational material should I create from it?"
```

Architecture:

```text
Search
 ↓
Resource candidates
 ↓
Resource selection
 ↓
Preparation Request
 ↓
Generation
```

Do not combine search and AI generation into one giant endpoint.

---

# 28. Avoid Duplicate Document Processing

If:

```text
Human Heart.pdf
```

has already been:

```text
extracted
cleaned
chunked
embedded
```

reuse the processed data.

For example:

```text
Human Heart.pdf
      │
      ├── Quiz → existing chunks
      ├── Flashcards → existing chunks
      ├── Short Notes → existing chunks
      └── Animation → existing structured content
```

Do not re-extract and re-embed the same source for every output request unless the source version has changed.

---

# 29. Versioning and Caching

Track:

```text
resource_version
generator_version
prompt_version
model
```

A preparation result should be traceable to the exact source and generation configuration that created it.

A cache key can conceptually contain:

```text
resource_id
resource_version
preparation_type
options_hash
model_version
prompt_version
```

Do not reuse stale results after a resource changes.

---

# 30. AI Provider Abstraction

Keep Gemini as the primary provider, but avoid coupling every service directly to the Gemini SDK.

Use an abstraction such as:

```python
class AIProvider:
    def generate_structured(self, prompt, schema):
        ...
```

Then:

```text
GeminiProvider
FutureProvider
```

Only implement the provider(s) actually needed now.

Do not add unnecessary complexity.

---

# 31. Prompt Management

Do not put large generation prompts inside Django views.

Use dedicated prompt modules/files:

```text
prompts/
├── quiz/
├── short_notes/
├── flashcards/
├── images/
└── animation/
```

Every generated result should be traceable to a prompt version.

---

# 32. Validation

Every AI-generated result must follow:

```text
LLM
 ↓
Structured JSON
 ↓
Schema validation
 ↓
Business validation
 ↓
Grounding validation
 ↓
Duplicate validation
 ↓
Database
```

If validation fails:

```text
Controlled retry
```

Use a finite retry count.

Never retry indefinitely.

---

# 33. Security Requirements

Implement:

- Authentication required.
- Teacher/Student authorization.
- Private file storage.
- File extension validation.
- MIME validation.
- File size limits.
- Malware/security scanning architecture placeholder.
- Rate limiting architecture.
- No AI API keys in frontend.
- No storage credentials in frontend.
- No arbitrary filesystem paths.
- No arbitrary code execution from uploaded files.
- Never execute uploaded documents/files.
- Sanitize extracted content where required.

---

# 34. Cost Protection

Make limits configurable:

```text
Maximum upload size
Maximum document pages
Maximum quiz questions
Maximum flashcards
Maximum short-note length
Maximum animation duration
Maximum concurrent jobs
```

Do not allow a single request to accidentally create an unbounded AI bill.

---

# 35. Frontend Types

Create strong TypeScript types.

Example:

```typescript
export type PreparationType =
  | "quiz"
  | "short_note"
  | "flashcard"
  | "image"
  | "animation";

export type ResourceType =
  | "pdf"
  | "image"
  | "txt"
  | "docx";

export type PreparationStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";
```

Also create types for:

```text
LearningResource
SearchResult
PreparationRequest
PreparationOptions
PreparationResult
ProcessingStatus
```

Avoid `any` for API data.

---

# 36. API Endpoints

Create at minimum:

```http
GET  /api/v1/learning/search/
POST /api/v1/learning/resources/upload/
GET  /api/v1/learning/resources/{id}/

POST /api/v1/learning/preparations/
GET  /api/v1/learning/preparations/{id}/
POST /api/v1/learning/preparations/{id}/cancel/
```

Use the existing authentication and cookie system.

Do not create a second authentication mechanism.

---

# 37. API Error Format

Use the existing project's consistent response format.

Example:

```json
{
  "success": false,
  "message": "This file type is not supported.",
  "errors": {
    "file": [
      "Supported formats are PDF, PNG, JPG, JPEG, WEBP, TXT and DOCX."
    ]
  }
}
```

For processing failure:

```json
{
  "success": false,
  "message": "Preparation failed.",
  "data": {
    "preparation_id": "uuid",
    "status": "failed"
  }
}
```

Never expose internal stack traces.

---

# 38. Tests

Backend tests must cover:

## Upload

```text
Authenticated user can upload.
Unauthenticated user cannot upload.
Invalid file rejected.
Oversized file rejected.
Resource created.
Ownership enforced.
```

## Search

```text
Search works.
Empty search handled.
Invalid preparation type rejected.
Unauthorized resources excluded.
```

## Preparation

```text
Valid preparation accepted.
Invalid resource rejected.
Wrong owner rejected.
Invalid preparation type rejected.
Invalid options rejected.
Job created.
Status changes correctly.
Failure handled.
Cancellation handled.
```

## Role separation

```text
Teacher can use teacher preparation APIs.
Student can use student preparation APIs.
Student cannot access teacher-private resources.
Teacher cannot access student-private resources unless explicitly authorized.
```

## AI

Mock AI providers in normal unit tests.

Do not call the real Gemini API in ordinary automated tests.

---

# 39. Frontend Tests

Test:

```text
Output type selection
Search
File upload
File validation
Resource selection
Preparation options
Submit
Loading state
Processing state
Failure state
Completed state
Teacher route protection
Student route protection
```

---

# 40. Development Order

Implement incrementally.

## Step 1 — Inspect Existing Project

Before changing code, inspect:

```text
Django apps
User model
Authentication
Permissions
API client
Next.js routes
Middleware
Existing document processing
Existing RAG
PostgreSQL/pgvector
```

Do not assume these systems are missing.

## Step 2 — Learning App

Create:

```text
apps/learning/
```

## Step 3 — Models

Create:

```text
LearningResource
PreparationRequest
```

## Step 4 — File Validation

Implement:

```text
extension
MIME
size
content validation where practical
```

## Step 5 — Upload API

Implement:

```text
POST /resources/upload/
```

## Step 6 — Search API

Implement:

```text
GET /search/
```

## Step 7 — Resource Access

Implement:

```text
GET /resources/{id}/
```

## Step 8 — Preparation API

Implement:

```text
POST /preparations/
GET /preparations/{id}/
```

## Step 9 — Async Processing

Add worker/task processing.

## Step 10 — Integrate Existing Document/RAG Services

Reuse existing extraction, chunking, embeddings and pgvector.

## Step 11 — Generator Interfaces

Create:

```text
QuizGenerator
ShortNoteGenerator
FlashcardGenerator
ImageGenerator
AnimationGenerator
```

## Step 12 — Implement Generators

Implement each one incrementally.

## Step 13 — Frontend

Create:

```text
/teacher/prepare
/student/prepare
```

Then:

```text
Search
Upload
Output selector
Options
Processing state
Result
```

## Step 14 — Testing

Run backend and frontend tests.

## Step 15 — Security Review

Verify authorization, private resources, file validation and secret handling.

---

# 41. Example End-to-End Teacher Flow

```text
Teacher Login
    ↓
/teacher/prepare
    ↓
Select "Quiz"
    ↓
Search "Human Heart"
    ↓
Search Results
    ↓
Select "Human Heart.pdf"
    ↓
Configure:
    10 questions
    Medium
    MCQ
    ↓
Prepare
    ↓
POST /preparations/
    ↓
Job created
    ↓
Processing
    ↓
Existing RAG/document pipeline
    ↓
QuizGenerator
    ↓
Validation
    ↓
Completed
    ↓
Quiz result
```

---

# 42. Example Student Flow

```text
Student Login
    ↓
/student/prepare
    ↓
Select "Flashcards"
    ↓
Upload physiology.pdf
    ↓
File validation
    ↓
Private storage
    ↓
Document processing
    ↓
Configure:
    20 cards
    Medium
    ↓
Prepare
    ↓
FlashcardGenerator
    ↓
Validation
    ↓
Completed
    ↓
Flashcard deck
```

---

# 43. Example Animation Flow

```text
Teacher
    ↓
/teacher/prepare
    ↓
Select Animation
    ↓
Search "Blood circulation"
    ↓
Select source
    ↓
Configure:
    90 seconds
    Educational
    Beginner
    ↓
Prepare
    ↓
Document analysis
    ↓
Concept extraction
    ↓
Animation specification
    ↓
Validate specification
    ↓
Animation renderer
    ↓
Video
```

---

# 44. Final Architecture

The feature should become:

```text
                         SyllabAI
                            │
                    Search / Upload
                            │
                            ↓
                    LearningResource
                            │
                            ↓
                   Document Processor
                            │
               ┌────────────┴────────────┐
               ↓                         ↓
        Structured Document            Chunks
               │                         │
               │                    Embeddings
               │                         │
               │                      pgvector
               │                         │
               └────────────┬────────────┘
                            ↓
                   Preparation Engine
                            │
          ┌─────────┬───────┼───────┬─────────┐
          ↓         ↓       ↓       ↓         ↓
        Quiz   Short Notes Flashcard Images Animation
          │         │       │       │         │
          └─────────┴───────┼───────┴─────────┘
                            ↓
                       Validation
                            ↓
                         Storage
                            ↓
                            UI
```

---

# 45. Definition of Done

The feature is complete only when:

### Search

- User can search learning resources.
- User must select the desired preparation type.
- Search results display correctly.
- User can preview/select a resource.

### Upload

- User can upload supported files.
- File validation works.
- Files are stored privately.
- `LearningResource` is created.
- Processing status is tracked.

### Preparation

- Quiz works.
- Short Notes works.
- Flashcards works.
- Images workflow works.
- Animation workflow works.
- Each type has appropriate options.
- Preparation requests are persisted.
- Long-running work is asynchronous.
- Status is visible.

### AI

- Existing RAG/document processing is reused.
- Generators are separated.
- Structured output is validated.
- Grounding is checked where appropriate.
- Failed generation is handled.
- Duplicate processing is minimized.

### Security

- Teacher/student authorization works.
- Users cannot access unauthorized resources.
- Uploaded files are validated.
- AI secrets remain server-side.
- Uploaded files are never executed.

### Frontend

- `/teacher/prepare` works.
- `/student/prepare` works.
- Search works.
- Upload works.
- Output selection works.
- Options work.
- Processing state works.
- Results display correctly.
- Errors are user-friendly.

---

# 46. Final Instruction to the Coding Agent

You are extending an existing SyllabAI codebase.

**Do not rebuild authentication.**

**Do not rebuild the existing RAG/document pipeline.**

**Do not create duplicate Teacher/Student authentication or authorization.**

Before writing code:

1. Inspect the existing repository.
2. Identify existing authentication.
3. Identify existing permissions.
4. Identify existing document processing.
5. Identify existing embeddings/pgvector.
6. Identify existing Gemini integration.
7. Reuse existing services.
8. Identify conflicts before modifying files.
9. Explain the integration plan.
10. Implement incrementally.
11. Run tests after each major stage.
12. Do not silently replace existing architecture.

The final user journey must be:

```text
Login
  ↓
Teacher / Student dashboard
  ↓
Prepare Learning Material
  ↓
Search OR Upload
  ↓
Select Resource
  ↓
Select:
  ├── Quiz
  ├── Short Notes
  ├── Flashcards
  ├── Images
  └── Animation
  ↓
Configure Options
  ↓
Prepare
  ↓
Processing
  ↓
Validation
  ↓
Result
```

Build this as a reusable learning-content preparation platform, not as a collection of unrelated AI API calls.
