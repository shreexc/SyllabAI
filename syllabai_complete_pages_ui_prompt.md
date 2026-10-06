# SyllabAI — Complete Frontend Pages & Generated Learning Experience Implementation Prompt

## 1. Role

You are a senior full-stack engineer and product UI engineer extending the existing **SyllabAI** project.

SyllabAI is an AI-powered education platform where:

- Teachers and students authenticate separately.
- Users can search or upload learning resources.
- A resource can be prepared as:
  - Quiz
  - Short Notes
  - Flashcards
  - Images
  - Animation
- The existing backend performs document processing, RAG retrieval, and AI generation.
- The frontend must display the generated learning experience in polished, production-quality pages.

This prompt covers the complete **frontend experience after the RAG/API pipeline performs its work**, plus updates to:

- Landing page
- Teacher dashboard
- Student dashboard
- Teacher profile
- Student profile
- Notes pages
- Quiz pages
- Flashcard pages
- Image pages
- Animation pages
- Preparation/history pages

Do not rewrite the existing authentication system or RAG architecture.

---

# 2. Existing Architecture That Must Be Preserved

The existing project contains:

```text
Backend
- Django
- Django REST Framework
- PostgreSQL
- Custom User model
- Teacher role
- Student role
- JWT authentication
- Secure HTTP-only cookies
- Role-based permissions
- Existing learning/resource APIs
- Existing document extraction
- Existing chunking
- Gemini embeddings
- PostgreSQL + pgvector
- RAG
- Gemini generation
- Async processing architecture

Frontend
- Next.js
- TypeScript
- App Router
- Tailwind CSS
- Teacher routes
- Student routes
- Authentication middleware
- Existing API client
```

Do not create another authentication mechanism.

Do not create another RAG pipeline.

Reuse existing APIs and services.

---

# 3. Main User Experience

The final SyllabAI user journey should be:

```text
Landing Page
     ↓
Teacher / Student Login
     ↓
Dashboard
     ↓
Prepare Learning Material
     ↓
Search / Upload Resource
     ↓
Select:
   Quiz
   Short Notes
   Flashcards
   Images
   Animation
     ↓
Configure
     ↓
Prepare
     ↓
Backend processing
     ↓
Document extraction
     ↓
RAG retrieval
     ↓
Gemini generation
     ↓
Validation
     ↓
Stored result
     ↓
Frontend Result Page
```

The frontend must clearly communicate this process to users.

---

# 4. Design Philosophy

SyllabAI should feel like a modern education product rather than an AI demo.

Use:

- Clean layout
- Strong typography
- Spacious cards
- Clear hierarchy
- Responsive design
- Accessible controls
- Subtle animations
- Clear loading states
- Clear empty states
- Clear error states
- Consistent navigation
- Consistent spacing
- Consistent components

Avoid:

- Excessive gradients
- Excessive glassmorphism
- Too many colors
- Huge decorative elements
- Cluttered dashboards
- AI-generated-looking random UI
- Excessive animations

The interface should prioritize learning.

---

# 5. Global Application Structure

Use separate layouts for authenticated areas.

Recommended:

```text
frontend/
├── app/
│   ├── page.tsx
│   │
│   ├── (auth)/
│   │   ├── teacher/
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── student/
│   │       ├── login/
│   │       └── register/
│   │
│   ├── teacher/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   ├── prepare/
│   │   ├── notes/
│   │   ├── quizzes/
│   │   ├── flashcards/
│   │   ├── images/
│   │   ├── animations/
│   │   ├── history/
│   │   └── profile/
│   │
│   └── student/
│       ├── layout.tsx
│       ├── dashboard/
│       ├── prepare/
│       ├── notes/
│       ├── quizzes/
│       ├── flashcards/
│       ├── images/
│       ├── animations/
│       ├── history/
│       └── profile/
│
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── dashboard/
│   ├── preparation/
│   ├── notes/
│   ├── quiz/
│   ├── flashcards/
│   ├── images/
│   ├── animation/
│   ├── profile/
│   └── shared/
│
├── hooks/
├── lib/
├── types/
└── middleware.ts
```

Teacher and Student pages can share visual components, but their business logic and permissions must remain separate.

---

# 6. Global Authenticated Layout

Teacher and Student applications should have:

```text
┌──────────────────────────────────────────────────────────┐
│ SyllabAI       Search...                 🔔  Avatar      │
├───────────────┬──────────────────────────────────────────┤
│ Dashboard     │                                          │
│ Prepare       │                                          │
│ Notes         │               Page Content               │
│ Quizzes       │                                          │
│ Flashcards    │                                          │
│ Images        │                                          │
│ Animations    │                                          │
│ History       │                                          │
│               │                                          │
│ Profile       │                                          │
│ Settings      │                                          │
│               │                                          │
│ Logout        │                                          │
└───────────────┴──────────────────────────────────────────┘
```

Desktop:

- Sidebar navigation.

Mobile:

- Bottom navigation or collapsible sidebar.

The current user's role determines the available navigation.

---

# 7. Landing Page

Route:

```text
/
```

Create a professional SyllabAI landing page.

## Hero

Headline:

```text
Turn your learning material into smarter study tools.
```

Supporting text:

```text
Upload or search your study material and transform it into
short notes, quizzes, flashcards, images and educational
animations with AI.
```

Primary CTA:

```text
Start Learning
```

Secondary CTA:

```text
For Teachers
```

Do not claim unrealistic AI accuracy.

---

# 8. Landing Page Sections

Create:

```text
Hero
↓
How SyllabAI Works
↓
Learning Formats
↓
For Students
↓
For Teachers
↓
AI + RAG explanation
↓
Benefits
↓
FAQ
↓
Final CTA
↓
Footer
```

## How it works

Show:

```text
1. Search or Upload
2. Choose what to prepare
3. Let SyllabAI process the material
4. Study the result
```

Use visual cards.

---

# 9. Learning Formats Section

Show five cards:

```text
Quiz
Test your understanding.

Short Notes
Get concise study material.

Flashcards
Memorize important concepts.

Images
Visualize difficult concepts.

Animation
Understand processes visually.
```

Each card should have:

- Icon
- Title
- Description
- Example
- CTA

---

# 10. Teacher Dashboard

Route:

```text
/teacher/dashboard
```

Teacher dashboard should prioritize content creation.

Layout:

```text
Good morning, Teacher

[ Prepare Material ]

Overview
┌────────────┬────────────┬────────────┬────────────┐
│ Resources  │ Quizzes    │ Flashcards │ Students   │
│ 24         │ 18         │ 42         │ 126        │
└────────────┴────────────┴────────────┴────────────┘

Recent Resources
────────────────────────────────────
Human Heart.pdf
Photosynthesis.pdf
Cell Biology.pdf

Recent Generated Content
────────────────────────────────────
Quiz: Human Heart
Flashcards: Cell Biology
Short Notes: Photosynthesis

Quick Actions
[ Upload Material ]
[ Search Material ]
[ Create Quiz ]
[ Create Flashcards ]
```

Do not show fake statistics in production.

Use API data.

If API data is unavailable, show an explicit empty state rather than fabricated numbers.

---

# 11. Student Dashboard

Route:

```text
/student/dashboard
```

Student dashboard should prioritize studying.

Layout:

```text
Welcome back, Student

[ Continue Learning ]

Your Study Overview
┌──────────────┬──────────────┬──────────────┐
│ Notes        │ Quizzes      │ Flashcards   │
│ 12           │ 8            │ 120          │
└──────────────┴──────────────┴──────────────┘

Continue Learning
────────────────────────────────────
Human Heart Quiz          65%
Cell Biology Flashcards   40%

Recent Materials
────────────────────────────────────
Human Heart
Photosynthesis
Respiratory System

Quick Actions
[ Prepare Material ]
[ Start Quiz ]
[ Review Flashcards ]
```

Again, use actual API data.

---

# 12. Prepare Page

Teacher:

```text
/teacher/prepare
```

Student:

```text
/student/prepare
```

The existing preparation flow should remain the central creation entry point.

Layout:

```text
Prepare Learning Material

Search or upload a resource

[ Search... ]

OR

[ Upload PDF / Document / Image ]

What do you want to prepare?

[ Quiz ]
[ Short Notes ]
[ Flashcards ]
[ Images ]
[ Animation ]

Selected Resource
────────────────────────────
Human Heart.pdf
42 pages
Ready

Preparation Options
────────────────────────────
...

[ Prepare ]
```

After submission:

```text
Preparing...

Reading material       ✓
Finding relevant info  ✓
Generating content     ●
Validating result      ○
```

When complete, navigate to the correct result page.

---

# 13. Notes System

Use "Short Notes" as a first-class learning object.

Recommended routes:

```text
/teacher/notes
/teacher/notes/[id]

/student/notes
/student/notes/[id]
```

---

# 14. Notes List Page

Example:

```text
My Notes

[ Search notes... ] [ Filter ]

┌──────────────────────────────────────┐
│ Human Heart                          │
│ Biology · 8 min read                 │
│                                      │
│ Summary of chambers, valves and      │
│ circulation.                         │
│                                      │
│ [Open Notes]                         │
└──────────────────────────────────────┘
```

Support:

```text
Search
Filter
Sort
Pagination/infinite loading
Empty state
```

---

# 15. Note Detail Page

Route:

```text
/notes/[id]
```

Layout:

```text
Human Heart

Source:
Human Heart.pdf

Generated by SyllabAI
────────────────────────────────────

Overview

The human heart is a muscular organ...

Key Points

• Four chambers
• Four major valves
• Pulmonary circulation
• Systemic circulation

Important Terms

SA Node
Natural pacemaker of the heart.

AV Node
...

Related Material

[ Take Quiz ]
[ Study Flashcards ]
[ View Images ]
[ Watch Animation ]
```

If the note is source-grounded, show source/page references where available.

Do not invent citations.

---

# 16. Note Reading Experience

The note page should support:

```text
Reading progress
Font controls if appropriate
Copy
Save/bookmark
Related resources
Source references
```

Keep the reading experience distraction-free.

---

# 17. Quiz System

Routes:

```text
/teacher/quizzes
/teacher/quizzes/[id]

/student/quizzes
/student/quizzes/[id]

/student/quizzes/[id]/attempt
```

Teacher and Student views should differ.

---

# 18. Quiz List Page

Show:

```text
My Quizzes

[ Search ] [ Filter by subject ] [ Difficulty ]

Quiz Card

Human Heart
10 Questions
Medium
Created from: Human Heart.pdf

[Open]
```

Teacher cards can include:

```text
Edit
Duplicate
Share
View Analytics
```

Student cards can include:

```text
Start Quiz
Review
Best Score
Attempts
```

Only show actions allowed by backend permissions.

---

# 19. Quiz Detail Page

Before starting:

```text
Human Heart Quiz

10 Questions
Medium
Estimated time: 8 minutes

Based on:
Human Heart.pdf

Topics:
Chambers
Valves
Circulation

[ Start Quiz ]
```

---

# 20. Quiz Attempt Page

Route:

```text
/student/quizzes/[id]/attempt
```

Layout:

```text
Question 4 of 10

Which chamber pumps oxygenated blood
into systemic circulation?

○ Right atrium
○ Right ventricle
○ Left atrium
○ Left ventricle

[Previous]                  [Next]
```

Show:

```text
Progress
Question navigation
Timer if enabled
Submit
```

Do not expose correct answers before submission.

---

# 21. Quiz Result Page

After submission:

```text
Quiz Complete

8 / 10

80%

Great work!

Question Review
────────────────────────

✓ Question 1
Correct

✗ Question 2
Incorrect

Explanation:
...

[Try Again]
[Back to Quiz]
```

Use backend result data.

Never calculate sensitive grading rules differently in the frontend.

---

# 22. Flashcard System

Routes:

```text
/teacher/flashcards
/teacher/flashcards/[id]

/student/flashcards
/student/flashcards/[id]
```

---

# 23. Flashcard List Page

Example:

```text
Flashcard Decks

Human Heart
20 cards
Biology

[Study]

Photosynthesis
15 cards
Biology

[Study]
```

Student view should emphasize study.

Teacher view can include management actions.

---

# 24. Flashcard Study Page

Route:

```text
/student/flashcards/[id]
```

Layout:

```text
Human Heart
Card 4 / 20

┌────────────────────────────────────────┐
│                                        │
│ What is the function of the SA node?  │
│                                        │
│              Tap to reveal             │
│                                        │
└────────────────────────────────────────┘

[ ← Previous ]       [ Reveal ]       [ Next → ]
```

After reveal:

```text
The SA node acts as the heart's
natural pacemaker.

[Again] [Hard] [Good] [Easy]
```

Store review results through the backend.

---

# 25. Flashcard Progress

Show:

```text
20 cards
12 reviewed
6 known
4 need review
```

Use actual review data.

Do not fabricate progress.

---

# 26. Image System

Routes:

```text
/teacher/images
/teacher/images/[id]

/student/images
/student/images/[id]
```

Image types:

```text
Source image
Extracted image
Generated diagram
Infographic
Illustration
Flowchart
```

---

# 27. Image Gallery

Create a responsive grid:

```text
Images

[ Search ]

┌─────────┐ ┌─────────┐ ┌─────────┐
│ Image   │ │ Image   │ │ Image   │
│         │ │         │ │         │
└─────────┘ └─────────┘ └─────────┘

┌─────────┐ ┌─────────┐ ┌─────────┐
│ Image   │ │ Image   │ │ Image   │
│         │ │         │ │         │
└─────────┘ └─────────┘ └─────────┘
```

Each image card should display:

```text
Title
Type
Source
Created date
```

---

# 28. Image Detail Page

Show:

```text
Human Heart — Labeled Diagram

[Large Image]

Source:
Human Heart.pdf

Type:
Generated Diagram

[Save]
[Share]
[Use in Notes]
```

If the image was AI-generated, label it clearly.

Do not represent generated images as original source material.

---

# 29. Animation System

Routes:

```text
/teacher/animations
/teacher/animations/[id]

/student/animations
/student/animations/[id]
```

---

# 30. Animation List Page

Example:

```text
Animations

Blood Circulation
1:30
Biology

Photosynthesis
2:10
Biology

Cell Division
1:45
Biology
```

Use thumbnail/poster images.

---

# 31. Animation Detail Page

Layout:

```text
Blood Circulation

┌─────────────────────────────────────┐
│                                     │
│             VIDEO PLAYER            │
│                                     │
│              ▶                      │
│                                     │
└─────────────────────────────────────┘

1:30 · Educational

About this animation

This animation explains how blood
moves through pulmonary and systemic
circulation.

Based on:
Human Circulation.pdf

Related Learning
[Short Notes]
[Quiz]
[Flashcards]
```

---

# 32. Animation Processing Page

While animation is being generated:

```text
Creating your animation

✓ Reading source
✓ Extracting concepts
✓ Creating storyboard
✓ Preparing scenes
● Rendering video
○ Finalizing

Estimated progress: 72%
```

Only show progress percentages if the backend can provide meaningful progress.

Do not fake percentages.

---

# 33. History Page

Routes:

```text
/teacher/history
/student/history
```

Show all preparation requests.

Example:

```text
Preparation History

Human Heart
Quiz
Completed
2 hours ago

Photosynthesis
Flashcards
Completed
Yesterday

Cell Division
Animation
Processing
Today
```

Filters:

```text
All
Quiz
Short Notes
Flashcards
Images
Animation
```

---

# 34. Preparation Detail / Job Page

Route:

```text
/preparations/[id]
```

This page should be useful when a job is still processing.

States:

```text
Pending
Processing
Completed
Failed
Cancelled
```

Completed jobs should redirect or link to the final content page.

Failed jobs should show:

```text
We couldn't prepare this material.

Reason:
The document could not be processed.

[Try Again]
```

Do not expose internal stack traces.

---

# 35. Profile Page

Teacher:

```text
/teacher/profile
```

Student:

```text
/student/profile
```

Profile layout:

```text
Profile

┌──────────────────────────────────────┐
│          Avatar                       │
│        John Doe                       │
│      teacher@example.com              │
│                                      │
│ [Edit Profile]                       │
└──────────────────────────────────────┘

Personal Information

First Name
Last Name
Email
Role

Account

Joined
Last updated

Security

[Change Password]
[Logout]
```

Role should be displayed but not editable by the user.

Teacher cannot change themselves into Student through the frontend.

Role changes must be an authorized backend/admin operation.

---

# 36. Student Profile

Use the same foundation but student-specific information.

Possible sections:

```text
Personal Information
Learning Statistics
Recent Activity
Saved Materials
Account
Security
```

Example:

```text
Learning Overview

Notes studied: 24
Quizzes completed: 18
Flashcards reviewed: 320
Animations watched: 12
```

Use real API values.

---

# 37. Edit Profile

Create a clean form:

```text
First Name
Last Name
Profile Image

[Save Changes]
```

Email and role should be read-only unless the backend explicitly supports changing them.

Use:

```http
PATCH /api/v1/accounts/me/
```

or the project's existing profile endpoint.

Do not create duplicate account APIs if one already exists.

---

# 38. Dashboard API Integration

Dashboard pages must consume backend APIs.

Possible endpoints:

```http
GET /api/v1/teacher/dashboard/
GET /api/v1/student/dashboard/
```

If these do not exist, create role-specific endpoints.

Teacher response may include:

```json
{
  "resources_count": 24,
  "quizzes_count": 18,
  "flashcards_count": 42,
  "recent_resources": [],
  "recent_preparations": []
}
```

Student response may include:

```json
{
  "notes_count": 12,
  "quizzes_count": 8,
  "flashcards_count": 120,
  "recent_activity": [],
  "continue_learning": []
}
```

Do not use hardcoded dashboard numbers.

---

# 39. API → UI Data Flow

The frontend architecture should be:

```text
Page
 ↓
Hook
 ↓
API client
 ↓
Django API
 ↓
PostgreSQL / RAG / AI result
 ↓
Typed API response
 ↓
React state
 ↓
UI
```

For generated content:

```text
Prepare
 ↓
POST /preparations/
 ↓
Preparation ID
 ↓
Poll preparation status
 ↓
status = completed
 ↓
Fetch result
 ↓
Navigate to result page
```

---

# 40. Generated Content Data Contracts

Create strong types.

Example:

```typescript
interface Note {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  importantTerms: {
    term: string;
    meaning: string;
  }[];
  source?: {
    resourceId: string;
    page?: number;
  }[];
}
```

Quiz:

```typescript
interface Quiz {
  id: string;
  title: string;
  description?: string;
  questionCount: number;
  difficulty: string;
  sourceResourceId?: string;
}
```

Flashcard:

```typescript
interface Flashcard {
  id: string;
  front: string;
  back: string;
}
```

Animation:

```typescript
interface Animation {
  id: string;
  title: string;
  duration?: number;
  videoUrl: string;
  thumbnailUrl?: string;
}
```

Use the project's actual backend response names if they already exist.

Do not blindly rename API fields just for frontend preference.

---

# 41. Loading States

Every page that calls an API must have:

```text
Loading skeleton
```

Do not immediately show empty content while loading.

Examples:

```text
Dashboard skeleton
Note skeleton
Quiz skeleton
Flashcard skeleton
Animation skeleton
Profile skeleton
```

---

# 42. Empty States

Every collection page needs an empty state.

Example:

```text
No flashcard decks yet.

Create your first deck from a PDF,
note, or learning resource.

[Prepare Flashcards]
```

Do not leave blank white space.

---

# 43. Error States

Use friendly errors:

```text
Something went wrong.

We couldn't load your quizzes.

[Try Again]
```

Never expose:

```text
500 Internal Server Error
Traceback...
```

to the user.

Log technical errors on the backend.

---

# 44. Responsive Design

All pages must work on:

```text
Mobile
Tablet
Desktop
Large desktop
```

Pay special attention to:

```text
Quiz questions
Flashcards
Video player
PDF/source preview
Sidebar
Tables
Dashboard cards
```

On mobile:

```text
Sidebar → drawer/bottom navigation
```

---

# 45. Accessibility

Implement:

- Keyboard navigation
- Focus states
- Proper labels
- Semantic buttons
- Accessible forms
- Alt text for meaningful images
- Captions/transcripts where available for animation
- Good contrast
- Reduced-motion consideration

Do not use icons without accessible labels.

---

# 46. Navigation Relationships

Every generated resource should link to related resources.

For example:

```text
Human Heart

[Short Notes]
[Take Quiz]
[Study Flashcards]
[View Images]
[Watch Animation]
```

This creates a connected learning experience.

---

# 47. Learning Resource Detail

Create a reusable resource detail component.

Show:

```text
Title
Type
Source
Pages
Processing status
Created date

Available learning formats:

[Notes]
[Quiz]
[Flashcards]
[Images]
[Animation]
```

If a format has not been generated yet:

```text
[Generate Quiz]
```

If it already exists:

```text
[Open Quiz]
```

---

# 48. Content Relationship Model

Conceptually:

```text
LearningResource
      │
      ├── Notes
      ├── Quizzes
      ├── Flashcard Decks
      ├── Images
      └── Animations
```

All generated objects should retain their source resource.

This allows:

```text
"Related Learning"
```

to work throughout the application.

---

# 49. RAG Source References

Where the backend provides source metadata, show:

```text
Source
Human Heart.pdf · Page 12
```

or:

```text
Based on:
Human Heart.pdf
```

For note/Q&A content, source references should be clickable when possible.

Do not invent page numbers.

If page information is unavailable, omit it.

---

# 50. Q&A / AI Assistant Integration

The existing RAG assistant should be accessible from relevant learning pages.

For example:

```text
Human Heart Notes

[Ask SyllabAI about this note]
```

The assistant should remain scoped to the selected resource when the backend supports that context.

Example:

```text
POST /api/v1/chat/
{
  "resource_id": "uuid",
  "message": "Why is the left ventricle thicker?"
}
```

Do not create another chatbot implementation if one already exists.

---

# 51. Teacher Content Management

Teacher pages should provide management actions where authorized:

```text
Open
Edit metadata
Duplicate
Share
Delete
Generate another format
```

Deletion must always require backend authorization.

Do not implement destructive deletion using only frontend state.

---

# 52. Student Learning Actions

Student pages should emphasize:

```text
Study
Continue
Review
Take Quiz
Review Flashcards
Watch Animation
Ask Question
```

Avoid unnecessary content-management actions.

---

# 53. Search Across User Content

Authenticated search can later support:

```text
Notes
Quizzes
Flashcards
Images
Animations
Resources
```

For now, create a reusable search UI that can consume role-specific APIs.

Do not expose another user's private content.

---

# 54. Page-Level API Requirements

Create or reuse appropriate endpoints:

```text
Dashboard:
GET /api/v1/teacher/dashboard/
GET /api/v1/student/dashboard/

Profile:
GET/PATCH /api/v1/accounts/me/

Resources:
GET /api/v1/learning/resources/
GET /api/v1/learning/resources/{id}/

Notes:
GET /api/v1/learning/notes/
GET /api/v1/learning/notes/{id}/

Quizzes:
GET /api/v1/learning/quizzes/
GET /api/v1/learning/quizzes/{id}/
POST /api/v1/learning/quizzes/{id}/attempts/

Flashcards:
GET /api/v1/learning/flashcards/
GET /api/v1/learning/flashcards/{id}/
POST /api/v1/learning/flashcards/{id}/reviews/

Images:
GET /api/v1/learning/images/
GET /api/v1/learning/images/{id}/

Animations:
GET /api/v1/learning/animations/
GET /api/v1/learning/animations/{id}/

Preparation:
POST /api/v1/learning/preparations/
GET /api/v1/learning/preparations/{id}/
```

If equivalent endpoints already exist, reuse them instead of duplicating APIs.

---

# 55. Frontend Folder Structure

Use:

```text
frontend/
├── app/
│   ├── page.tsx
│   │
│   ├── teacher/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── prepare/page.tsx
│   │   ├── notes/page.tsx
│   │   ├── notes/[id]/page.tsx
│   │   ├── quizzes/page.tsx
│   │   ├── quizzes/[id]/page.tsx
│   │   ├── flashcards/page.tsx
│   │   ├── flashcards/[id]/page.tsx
│   │   ├── images/page.tsx
│   │   ├── images/[id]/page.tsx
│   │   ├── animations/page.tsx
│   │   ├── animations/[id]/page.tsx
│   │   ├── history/page.tsx
│   │   └── profile/page.tsx
│   │
│   └── student/
│       ├── layout.tsx
│       ├── dashboard/page.tsx
│       ├── prepare/page.tsx
│       ├── notes/page.tsx
│       ├── notes/[id]/page.tsx
│       ├── quizzes/page.tsx
│       ├── quizzes/[id]/page.tsx
│       ├── quizzes/[id]/attempt/page.tsx
│       ├── flashcards/page.tsx
│       ├── flashcards/[id]/page.tsx
│       ├── images/page.tsx
│       ├── images/[id]/page.tsx
│       ├── animations/page.tsx
│       ├── animations/[id]/page.tsx
│       ├── history/page.tsx
│       └── profile/page.tsx
│
├── components/
│   ├── dashboard/
│   ├── preparation/
│   ├── notes/
│   ├── quiz/
│   ├── flashcards/
│   ├── images/
│   ├── animation/
│   ├── profile/
│   ├── navigation/
│   └── shared/
│
├── hooks/
├── lib/
├── types/
└── middleware.ts
```

---

# 56. Reusable Components

Create reusable components such as:

```text
AppSidebar
MobileNavigation
Topbar
PageHeader
SearchInput
ResourceCard
PreparationCard
StatCard
EmptyState
ErrorState
LoadingSkeleton
SourceBadge
DifficultyBadge
StatusBadge
Modal
ConfirmDialog
Button
Input
Select
Tabs
ProgressBar
```

Do not duplicate these components across Teacher and Student pages.

---

# 57. Page Implementation Pattern

Each page should follow:

```text
Server/Page Component
       ↓
Data fetching or hook
       ↓
Loading state
       ↓
Error state
       ↓
Empty state
       ↓
Content components
```

Keep API logic out of presentation components.

---

# 58. State Management

Use the project's existing state management approach if one already exists.

Do not add Redux/Zustand/etc. unnecessarily if the existing architecture does not require it.

For server data, prefer a proper server-state/data-fetching approach if already used.

Avoid duplicating server data across many client stores.

---

# 59. Do Not Fake AI Results

During development, mock data may be used only behind an explicit development/mock mode.

Production UI must consume actual API responses.

Never silently hardcode:

```text
80%
24 quizzes
120 flashcards
```

unless these values come from backend data.

---

# 60. SEO / Landing Page

The landing page should include:

```text
metadata
title
description
Open Graph metadata
```

Use SyllabAI branding.

Do not overclaim:

Bad:

```text
The world's most accurate AI education platform.
```

Prefer:

```text
Turn your learning material into personalized study tools.
```

---

# 61. Performance

Optimize:

- Images
- Video loading
- API calls
- Lists
- Pagination
- Search debounce
- Skeleton loading
- Lazy loading
- Large document previews

Do not load all generated resources on the dashboard.

Use pagination or limits.

---

# 62. Security

Frontend must never be considered the security boundary.

Backend remains responsible for:

```text
Authentication
Authorization
Ownership
Resource access
Quiz grading
Preparation permissions
```

Do not expose:

```text
AI API keys
Database credentials
Storage secrets
JWT signing secrets
```

in the frontend.

---

# 63. Testing

Write tests for:

## Landing

```text
Hero renders
CTAs work
Responsive layout
```

## Dashboard

```text
Correct API data shown
Loading state
Empty state
Error state
Role-specific content
```

## Notes

```text
List loads
Detail loads
Source shown
Related resources work
```

## Quiz

```text
List loads
Detail loads
Attempt works
Submission works
Results display
```

## Flashcards

```text
Deck loads
Reveal works
Review works
Progress updates
```

## Images

```text
Gallery loads
Detail loads
Preview works
```

## Animation

```text
List loads
Detail loads
Video player works
Processing state works
```

## Profile

```text
Profile loads
Edit works
Role cannot be changed
```

---

# 64. Error Handling

Every page must support:

```text
Loading
Success
Empty
Error
```

Example:

```text
Unable to load your notes.

Please try again.

[Retry]
```

Do not expose raw backend errors.

---

# 65. Mobile Requirements

On mobile:

```text
Dashboard
Notes
Quiz
Flashcards
Animation
Profile
```

must remain usable without horizontal scrolling.

Quiz options must be large enough to tap.

Flashcards must fit the viewport.

Video must be responsive.

Navigation must remain accessible.

---

# 66. Visual Relationship Between Pages

The design system should be consistent.

Example:

```text
Dashboard
   ↓
Resource Card
   ↓
Resource Detail
   ↓
Prepare
   ↓
Generated Content
   ↓
Related Content
```

A student should always understand:

```text
Where this content came from
What they can do next
How it relates to their learning material
```

---

# 67. Final User Experience Example

A student uploads:

```text
cardiovascular.pdf
```

Then selects:

```text
Quiz
```

Backend:

```text
Upload
 ↓
Document extraction
 ↓
Chunking
 ↓
Embeddings
 ↓
pgvector
 ↓
RAG
 ↓
Gemini
 ↓
Quiz JSON
 ↓
Validation
 ↓
Database
```

Frontend:

```text
/student/prepare
       ↓
Processing screen
       ↓
Completed
       ↓
/student/quizzes/{id}
       ↓
Quiz overview
       ↓
Start
       ↓
/student/quizzes/{id}/attempt
       ↓
Questions
       ↓
Submit
       ↓
Result
       ↓
Related:
[Short Notes]
[Flashcards]
[Images]
[Animation]
```

This is the intended complete learning experience.

---

# 68. Development Order

Implement in this order:

## Phase 1

Inspect existing project.

Do not code until you understand:

```text
Authentication
API client
RAG
Preparation API
Existing components
Routing
```

## Phase 2

Create/update design system.

## Phase 3

Update landing page.

## Phase 4

Build authenticated layouts/navigation.

## Phase 5

Update Teacher dashboard.

## Phase 6

Update Student dashboard.

## Phase 7

Update profile pages.

## Phase 8

Build Notes pages.

## Phase 9

Build Quiz pages.

## Phase 10

Build Flashcard pages.

## Phase 11

Build Image pages.

## Phase 12

Build Animation pages.

## Phase 13

Build Preparation History.

## Phase 14

Connect all pages to real APIs.

## Phase 15

Implement loading/empty/error states.

## Phase 16

Responsive design.

## Phase 17

Accessibility.

## Phase 18

Testing.

## Phase 19

Performance optimization.

---

# 69. Definition of Done

The feature is complete only when:

### Landing

- Professional landing page exists.
- Teacher CTA works.
- Student CTA works.
- Responsive.
- SEO metadata exists.

### Dashboard

- Teacher dashboard uses real API data.
- Student dashboard uses real API data.
- Quick actions work.
- Recent content works.
- Empty/loading/error states work.

### Profile

- Teacher profile works.
- Student profile works.
- Edit profile works.
- Role is protected.
- Security section works.

### Notes

- List works.
- Detail works.
- Source references work.
- Related content works.

### Quiz

- List works.
- Detail works.
- Attempt works.
- Submission works.
- Results work.
- Teacher management actions respect permissions.

### Flashcards

- Deck list works.
- Study page works.
- Reveal works.
- Review works.
- Progress works.

### Images

- Gallery works.
- Detail works.
- Source/generated labeling works.

### Animation

- List works.
- Detail works.
- Video playback works.
- Processing state works.

### Preparation

- Search works.
- Upload works.
- Output selection works.
- Options work.
- Processing works.
- Results route correctly.

### Architecture

- Existing authentication preserved.
- Existing RAG preserved.
- Existing API client reused.
- Teacher/Student authorization preserved.
- No duplicate AI pipeline.
- No hardcoded production data.
- No exposed secrets.

---

# 70. Final Instruction to the Coding Agent

You are modifying an existing SyllabAI project.

Before writing code:

1. Inspect the existing repository.
2. Read the existing authentication architecture.
3. Read the existing preparation/resource APIs.
4. Read the existing RAG/document processing code.
5. Read the existing Next.js routing and components.
6. Identify reusable components.
7. Identify existing API response structures.
8. Do not create duplicate APIs where existing APIs already satisfy the requirement.
9. Preserve Teacher/Student separation.
10. Explain any architectural change before implementing it.

Then implement page-by-page.

For each page:

1. Create the route.
2. Create/reuse API hook.
3. Define TypeScript types.
4. Implement loading state.
5. Implement error state.
6. Implement empty state.
7. Implement real content.
8. Implement responsive layout.
9. Add related-content navigation.
10. Test the page.

Do not generate a huge monolithic component.

Keep code modular.

The final SyllabAI experience should feel like a complete educational platform:

```text
                 SYLLABAI

                    │
              Learning Resource
                    │
        ┌───────────┼───────────┐
        ↓           ↓           ↓
      Search      Upload       Existing
        │           │           │
        └───────────┼───────────┘
                    ↓
               Preparation
                    │
      ┌─────────────┼──────────────┐
      ↓             ↓              ↓
    Notes          Quiz        Flashcards
      │             │              │
      └─────────────┼──────────────┘
                    ↓
             Images / Animation
                    │
                    ↓
              Learning Experience
                    │
        ┌───────────┼────────────┐
        ↓           ↓            ↓
      Study       Practice     Review
```

The goal is not just to display AI-generated text.

The goal is to turn the RAG/API output into a **complete, connected learning experience** for SyllabAI.
