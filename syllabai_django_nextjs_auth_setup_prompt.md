# SyllabAI --- Django + Next.js Setup & Teacher/Student Authentication Implementation Prompt

## Role

You are a senior full-stack engineer responsible for setting up the
initial production-ready architecture of **SyllabAI**, an AI-powered
education platform where:

-   Teachers upload notes/PDFs.
-   Teachers can create/manage educational content.
-   Students consume notes and generated learning materials.
-   The platform will later generate Q&A, quizzes, flashcards,
    summaries, and animations from educational documents.

For this task, implement only the **foundation, Django backend, Next.js
frontend, and authentication/authorization system**.

Do not implement the AI/RAG/PDF-to-quiz pipeline yet.

------------------------------------------------------------------------

# 1. Core Requirement

Build SyllabAI with:

``` text
Frontend
    Next.js
    TypeScript
    App Router
    Tailwind CSS

Backend
    Django
    Django REST Framework
    PostgreSQL
    JWT Authentication

Architecture
    Teacher and Student must have clearly separated
    frontend routes, backend permissions, serializers,
    services, and dashboard logic.
```

The authentication system must not treat teachers and students as merely
two UI roles.

They must have **different backend authorization rules and different
application flows**.

------------------------------------------------------------------------

# 2. User Roles

SyllabAI initially has two main roles:

``` text
TEACHER
STUDENT
```

Use a custom Django User model.

Example:

``` text
User
├── id
├── email
├── password
├── first_name
├── last_name
├── role
├── is_active
├── is_staff
├── is_superuser
├── date_joined
└── updated_at
```

Role choices:

``` python
TEACHER = "teacher"
STUDENT = "student"
```

Do not use Django's default username-based authentication.

Use:

``` text
email + password
```

for authentication.

------------------------------------------------------------------------

# 3. Backend Project Setup

Create a Django project with a clean production-oriented structure.

Recommended structure:

``` text
backend/
├── manage.py
├── config/
│   ├── __init__.py
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── apps/
│   ├── accounts/
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── managers.py
│   │   ├── serializers.py
│   │   ├── permissions.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── services.py
│   │   ├── tests/
│   │   └── __init__.py
│   │
│   └── common/
│       ├── permissions.py
│       ├── exceptions.py
│       └── utils.py
│
├── requirements/
│   ├── base.txt
│   ├── development.txt
│   └── production.txt
│
├── .env.example
├── .gitignore
└── README.md
```

Do not put all Django logic into `views.py`.

Use:

``` text
Models
Serializers
Views
Services
Permissions
```

with clear responsibilities.

------------------------------------------------------------------------

# 4. Django Packages

Install and configure at minimum:

``` text
Django
djangorestframework
djangorestframework-simplejwt
django-cors-headers
psycopg
python-dotenv
```

Use PostgreSQL as the primary database.

Do not use SQLite for the actual application architecture.

SQLite may only be used temporarily for isolated local experiments if
absolutely necessary.

------------------------------------------------------------------------

# 5. Custom User Model

Create a custom user model using:

``` python
AbstractBaseUser
PermissionsMixin
BaseUserManager
```

The user manager must support:

``` python
create_user()
create_superuser()
```

Authentication identifier:

``` text
email
```

Normalize email before saving.

Example responsibility:

``` text
UserManager
    ├── create_user()
    └── create_superuser()

User
    ├── email
    ├── password
    ├── role
    ├── profile fields
    └── Django permission fields
```

Set:

``` python
AUTH_USER_MODEL = "accounts.User"
```

Do this before creating migrations.

------------------------------------------------------------------------

# 6. Role Validation

The backend must never trust the frontend for role authorization.

Bad:

``` text
Frontend sends:
role = "teacher"
```

and backend blindly accepts it.

Correct:

``` text
Backend creates user with validated role.
Backend determines permissions from authenticated user.role.
```

The frontend is only responsible for presentation and navigation.

The backend is the source of truth.

------------------------------------------------------------------------

# 7. Registration

Create separate registration endpoints.

## Teacher Registration

``` http
POST /api/v1/auth/teacher/register/
```

Request:

``` json
{
  "email": "teacher@example.com",
  "password": "StrongPassword123!",
  "first_name": "John",
  "last_name": "Doe"
}
```

The backend must automatically assign:

``` text
role = teacher
```

Do not allow the client to override this.

------------------------------------------------------------------------

## Student Registration

``` http
POST /api/v1/auth/student/register/
```

Request:

``` json
{
  "email": "student@example.com",
  "password": "StrongPassword123!",
  "first_name": "Alex",
  "last_name": "Smith"
}
```

The backend automatically assigns:

``` text
role = student
```

Do not accept arbitrary role input.

------------------------------------------------------------------------

# 8. Login

Create separate login endpoints.

## Teacher Login

``` http
POST /api/v1/auth/teacher/login/
```

## Student Login

``` http
POST /api/v1/auth/student/login/
```

Both accept:

``` json
{
  "email": "user@example.com",
  "password": "password"
}
```

The backend must verify:

1.  User exists.
2.  Password is correct.
3.  User is active.
4.  User belongs to the correct role.

For example:

A student must not be able to authenticate through:

``` text
/api/v1/auth/teacher/login/
```

and receive a teacher session.

Return an appropriate `403` or authentication error.

------------------------------------------------------------------------

# 9. JWT Authentication

Use:

``` text
djangorestframework-simplejwt
```

Use:

``` text
Access Token
Refresh Token
```

Prefer secure HTTP-only cookies for browser authentication.

Recommended cookies:

``` text
access_token
refresh_token
```

Configure:

``` text
HttpOnly
Secure in production
SameSite
appropriate expiration
```

Do not store JWT access/refresh tokens in:

``` text
localStorage
sessionStorage
```

unless there is a documented architectural reason.

------------------------------------------------------------------------

# 10. Authentication Endpoints

Create:

``` text
POST /api/v1/auth/teacher/register/
POST /api/v1/auth/student/register/

POST /api/v1/auth/teacher/login/
POST /api/v1/auth/student/login/

POST /api/v1/auth/logout/

POST /api/v1/auth/token/refresh/

GET  /api/v1/auth/me/

GET  /api/v1/auth/teacher/me/
GET  /api/v1/auth/student/me/
```

Expected behavior:

``` text
/me/
/teacher/me/
/student/me/
```

must return the authenticated user's information.

Role-specific endpoints must reject the wrong role.

------------------------------------------------------------------------

# 11. Logout

Implement:

``` http
POST /api/v1/auth/logout/
```

Logout should:

1.  Clear authentication cookies.
2.  Invalidate/blacklist refresh token if refresh-token blacklisting is
    enabled.
3.  Return a successful response.

Do not rely only on frontend logout.

------------------------------------------------------------------------

# 12. Backend Permissions

Create dedicated permissions.

Example:

``` python
class IsTeacher(BasePermission):
    ...
```

and:

``` python
class IsStudent(BasePermission):
    ...
```

Also create:

``` python
class IsTeacherOrReadOnly(...)
```

if needed later.

Example:

``` text
Teacher endpoint
    ↓
IsAuthenticated
    ↓
IsTeacher
    ↓
Allow
```

Student attempting the endpoint:

``` text
IsAuthenticated
    ↓
IsTeacher
    ↓
403 Forbidden
```

------------------------------------------------------------------------

# 13. Separate Teacher and Student APIs

Do not create one giant endpoint such as:

``` text
/api/dashboard/
```

that contains all role logic.

Prefer:

``` text
/api/v1/teacher/
├── dashboard/
├── profile/
├── notes/
├── quizzes/
├── flashcards/
└── animations/

 /api/v1/student/
├── dashboard/
├── profile/
├── notes/
├── quizzes/
├── flashcards/
└── animations/
```

For this initial task, only implement dashboard/profile placeholders
where necessary.

Future AI functionality will be added later.

------------------------------------------------------------------------

# 14. Teacher Backend Responsibilities

Teachers will eventually be able to:

``` text
Upload notes
Create/manage courses
Generate quizzes
Generate flashcards
Generate Q&A
Generate animations
View student analytics
Manage educational content
```

For now, prepare the architecture but do not implement these features.

Teacher endpoints should be protected with:

``` python
IsAuthenticated
IsTeacher
```

------------------------------------------------------------------------

# 15. Student Backend Responsibilities

Students will eventually be able to:

``` text
View assigned notes
Ask questions
Practice quizzes
Review flashcards
Watch educational animations
Track learning progress
```

For now, prepare the architecture but do not implement the AI features.

Student endpoints should be protected with:

``` python
IsAuthenticated
IsStudent
```

------------------------------------------------------------------------

# 16. Frontend Project Setup

Create a Next.js application using:

``` text
Next.js
TypeScript
App Router
Tailwind CSS
```

Recommended structure:

``` text
frontend/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── teacher/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── dashboard/
│   │       └── page.tsx
│   │
│   ├── student/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── dashboard/
│   │       └── page.tsx
│   │
│   └── layout.tsx
│
├── components/
│   ├── auth/
│   │   ├── TeacherLoginForm.tsx
│   │   ├── TeacherRegisterForm.tsx
│   │   ├── StudentLoginForm.tsx
│   │   └── StudentRegisterForm.tsx
│   │
│   ├── teacher/
│   ├── student/
│   └── shared/
│
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   └── constants.ts
│
├── hooks/
│   ├── useCurrentUser.ts
│   ├── useTeacherAuth.ts
│   └── useStudentAuth.ts
│
├── types/
│   ├── auth.ts
│   ├── teacher.ts
│   └── student.ts
│
├── middleware.ts
├── .env.local.example
└── package.json
```

------------------------------------------------------------------------

# 17. Separate Teacher and Student Frontend Code

This is mandatory.

Do not create:

``` text
components/AuthForm.tsx
```

with hundreds of:

``` typescript
if (role === "teacher") ...
else if (role === "student") ...
```

Instead create:

``` text
components/auth/TeacherLoginForm.tsx
components/auth/TeacherRegisterForm.tsx

components/auth/StudentLoginForm.tsx
components/auth/StudentRegisterForm.tsx
```

Similarly:

``` text
hooks/useTeacherAuth.ts
hooks/useStudentAuth.ts
```

and:

``` text
app/teacher/...
app/student/...
```

Shared low-level utilities are allowed.

For example:

``` text
lib/api.ts
lib/auth.ts
components/shared/Button.tsx
components/shared/Input.tsx
```

But role-specific business logic must remain separated.

------------------------------------------------------------------------

# 18. Teacher Login Flow

Teacher visits:

``` text
/teacher/login
```

Flow:

``` text
Teacher
 ↓
TeacherLoginForm
 ↓
POST /api/v1/auth/teacher/login/
 ↓
Django
 ↓
Validate credentials
 ↓
Verify role = teacher
 ↓
Set secure cookies
 ↓
Return user
 ↓
Frontend redirects
 ↓
/teacher/dashboard
```

If user is a student:

``` text
403
 ↓
Show:
"This account is registered as a student."
```

Do not redirect the student to the teacher dashboard.

------------------------------------------------------------------------

# 19. Student Login Flow

Student visits:

``` text
/student/login
```

Flow:

``` text
Student
 ↓
StudentLoginForm
 ↓
POST /api/v1/auth/student/login/
 ↓
Django
 ↓
Validate credentials
 ↓
Verify role = student
 ↓
Set secure cookies
 ↓
Return user
 ↓
/student/dashboard
```

------------------------------------------------------------------------

# 20. Route Protection

Use Next.js middleware where appropriate.

Protect:

``` text
/teacher/*
/student/*
```

But remember:

> Next.js middleware is NOT the final authorization layer.

Backend permissions remain mandatory.

Frontend protection improves UX.

Backend protection provides security.

------------------------------------------------------------------------

# 21. Teacher Route Rules

Teacher routes:

``` text
/teacher/dashboard
/teacher/profile
/teacher/notes
/teacher/quizzes
/teacher/flashcards
/teacher/animations
```

If unauthenticated:

``` text
→ /teacher/login
```

If authenticated student:

``` text
→ /student/dashboard
```

Do not expose teacher UI to students.

------------------------------------------------------------------------

# 22. Student Route Rules

Student routes:

``` text
/student/dashboard
/student/profile
/student/notes
/student/quizzes
/student/flashcards
/student/animations
```

If unauthenticated:

``` text
→ /student/login
```

If authenticated teacher:

``` text
→ /teacher/dashboard
```

------------------------------------------------------------------------

# 23. Auth State

Create a reliable authentication state.

The frontend should know:

``` typescript
type UserRole = "teacher" | "student";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}
```

Use a clean auth mechanism.

Do not expose JWT secrets to the browser.

Do not put private backend secrets in:

``` text
NEXT_PUBLIC_*
```

------------------------------------------------------------------------

# 24. API Client

Create:

``` text
lib/api.ts
```

Configure the API client to send credentials:

``` text
withCredentials: true
```

The API base URL must come from:

``` text
NEXT_PUBLIC_API_URL
```

Example:

``` env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Do not hardcode production URLs.

------------------------------------------------------------------------

# 25. Environment Variables

Backend `.env.example`:

``` env
DEBUG=True

SECRET_KEY=change-me

DATABASE_URL=postgresql://user:password@localhost:5432/syllabai

ALLOWED_HOSTS=localhost,127.0.0.1

CORS_ALLOWED_ORIGINS=http://localhost:3000

JWT_ACCESS_TOKEN_LIFETIME_MINUTES=15
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7
```

Frontend:

``` env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Never commit real secrets.

------------------------------------------------------------------------

# 26. Security Requirements

Implement:

-   CSRF protection appropriate for cookie-based authentication.
-   CORS configuration.
-   Secure cookies in production.
-   HttpOnly cookies.
-   Password hashing through Django.
-   Password validation.
-   Rate limiting strategy placeholder.
-   Proper 401 and 403 responses.
-   No secrets in Git.
-   No JWT secrets in frontend code.
-   No role authorization based only on frontend state.

------------------------------------------------------------------------

# 27. Error Response Format

Use a consistent API response format.

Example:

``` json
{
  "success": false,
  "message": "Invalid credentials.",
  "errors": {
    "email": [
      "Invalid email or password."
    ]
  }
}
```

Successful response:

``` json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": "uuid",
      "email": "teacher@example.com",
      "role": "teacher"
    }
  }
}
```

Keep response structures consistent across authentication endpoints.

------------------------------------------------------------------------

# 28. UUIDs

Prefer UUID primary keys for user-facing entities.

For example:

``` python
id = models.UUIDField(
    primary_key=True,
    default=uuid.uuid4,
    editable=False
)
```

Do not expose sequential integer IDs unnecessarily.

------------------------------------------------------------------------

# 29. Admin

Register the custom User model in Django Admin.

Admin should allow administrators to:

``` text
View users
Search users
Filter by role
Activate/deactivate users
View email
View date joined
```

Never display raw passwords.

------------------------------------------------------------------------

# 30. Testing

Write backend tests for:

### Registration

``` text
Teacher can register.
Student can register.
Duplicate email rejected.
Invalid password rejected.
Client cannot override role.
```

### Login

``` text
Teacher can log in through teacher endpoint.
Student can log in through student endpoint.
Student cannot log in through teacher endpoint.
Teacher cannot log in through student endpoint.
Wrong password rejected.
Inactive user rejected.
```

### Authorization

``` text
Teacher can access teacher endpoint.
Student cannot access teacher endpoint.

Student can access student endpoint.
Teacher cannot access student endpoint.

Unauthenticated user gets 401.
Wrong authenticated role gets 403.
```

### Logout

``` text
Logout clears authentication.
Refresh token cannot be reused if blacklist is enabled.
```

------------------------------------------------------------------------

# 31. Frontend Testing

At minimum test:

``` text
Teacher login
Teacher registration
Student login
Student registration
Protected teacher route
Protected student route
Logout
Wrong-role redirect
Unauthenticated redirect
```

------------------------------------------------------------------------

# 32. API Documentation

Set up API documentation using a suitable OpenAPI-compatible Django
package.

Document:

``` text
Teacher registration
Student registration
Teacher login
Student login
Logout
Refresh
Me
Teacher protected endpoints
Student protected endpoints
```

The API documentation must clearly indicate required authentication and
permissions.

------------------------------------------------------------------------

# 33. Do Not Implement Yet

Do NOT implement:

``` text
PDF processing
PDF-to-text
Embeddings
pgvector
RAG
Gemini
Quiz generation
Flashcard generation
Animation generation
AI chat
File upload
Course management
Student analytics
Payment
Notifications
```

Prepare the architecture so these can be added later without rewriting
authentication.

------------------------------------------------------------------------

# 34. Important Architectural Principle

Keep these responsibilities separate:

``` text
Authentication
    ↓
Who are you?

Authorization
    ↓
What are you allowed to do?

Business Logic
    ↓
What does the application do?

AI Services
    ↓
How does SyllabAI generate educational content?
```

Do not mix these layers.

------------------------------------------------------------------------

# 35. Recommended Backend Flow

``` text
HTTP Request
     ↓
URL
     ↓
View
     ↓
Authentication
     ↓
Permission
     ↓
Serializer
     ↓
Service
     ↓
Model
     ↓
Database
     ↓
Serializer
     ↓
Response
```

------------------------------------------------------------------------

# 36. Recommended Frontend Flow

``` text
Page
 ↓
Role-specific component
 ↓
Hook
 ↓
API client
 ↓
Django API
 ↓
Authentication cookie
 ↓
Response
 ↓
State update
 ↓
Redirect/UI
```

------------------------------------------------------------------------

# 37. Development Order

Implement in this exact order.

## Step 1

Create Django project.

## Step 2

Configure PostgreSQL.

## Step 3

Create custom User model.

## Step 4

Create UserManager.

## Step 5

Configure DRF.

## Step 6

Configure JWT.

## Step 7

Configure secure cookie authentication.

## Step 8

Create Teacher registration.

## Step 9

Create Student registration.

## Step 10

Create Teacher login.

## Step 11

Create Student login.

## Step 12

Create logout.

## Step 13

Create refresh.

## Step 14

Create `/me/`.

## Step 15

Create Teacher permissions.

## Step 16

Create Student permissions.

## Step 17

Create protected test endpoints.

## Step 18

Write backend tests.

## Step 19

Create Next.js project.

## Step 20

Create API client.

## Step 21

Create Teacher authentication pages.

## Step 22

Create Student authentication pages.

## Step 23

Create Teacher dashboard.

## Step 24

Create Student dashboard.

## Step 25

Create middleware.

## Step 26

Test complete authentication flow.

------------------------------------------------------------------------

# 38. Definition of Done

The task is complete only when:

### Backend

-   Django runs successfully.
-   PostgreSQL connects successfully.
-   Custom User model works.
-   Email authentication works.
-   Teacher registration works.
-   Student registration works.
-   Teacher login works.
-   Student login works.
-   JWT access/refresh works.
-   Cookies work correctly.
-   Logout works.
-   `/me/` works.
-   Teacher permissions work.
-   Student permissions work.
-   Wrong-role access returns 403.
-   Unauthenticated access returns 401.
-   Tests pass.

### Frontend

-   Next.js runs successfully.
-   Teacher registration works.
-   Student registration works.
-   Teacher login works.
-   Student login works.
-   Teacher dashboard exists.
-   Student dashboard exists.
-   Teacher routes are protected.
-   Student routes are protected.
-   Wrong-role navigation is handled.
-   Logout works.
-   Authentication state survives page refresh.
-   No JWT is stored in localStorage.
-   API communication uses environment variables.

------------------------------------------------------------------------

# 39. Code Quality Rules

Follow these rules strictly:

1.  Use TypeScript strict mode.
2.  Use Python type hints where practical.
3.  Follow Django conventions.
4.  Follow DRF conventions.
5.  Keep views thin.
6.  Put business logic into services.
7.  Keep serializers responsible for validation/serialization.
8.  Keep permissions separate.
9.  Avoid duplicated authentication logic.
10. Do not use giant files.
11. Do not hardcode secrets.
12. Do not hardcode API URLs.
13. Do not trust frontend role information.
14. Do not store JWT tokens in localStorage.
15. Do not create unnecessary abstractions.
16. Write tests alongside important functionality.
17. Use meaningful names.
18. Add comments only where they explain non-obvious decisions.

------------------------------------------------------------------------

# 40. Final Expected Architecture

The final project should conceptually look like:

``` text
SyllabAI/
│
├── backend/
│   │
│   ├── config/
│   │
│   ├── apps/
│   │   ├── accounts/
│   │   └── common/
│   │
│   ├── requirements/
│   ├── .env.example
│   └── manage.py
│
│
└── frontend/
    │
    ├── app/
    │   ├── (public)/
    │   ├── teacher/
    │   │   ├── login/
    │   │   ├── register/
    │   │   └── dashboard/
    │   │
    │   └── student/
    │       ├── login/
    │       ├── register/
    │       └── dashboard/
    │
    ├── components/
    │   ├── auth/
    │   │   ├── teacher/
    │   │   └── student/
    │   ├── teacher/
    │   ├── student/
    │   └── shared/
    │
    ├── hooks/
    ├── lib/
    ├── types/
    ├── middleware.ts
    └── .env.local.example
```

------------------------------------------------------------------------

# Final Instruction to the Coding Agent

Do not rush into implementing everything in one large code dump.

Work incrementally.

For each major step:

1.  Explain what you are implementing.
2.  Show the relevant files.
3.  Write the complete code.
4.  Explain why the code is structured that way.
5.  Run or describe the appropriate test.
6.  Fix errors before moving to the next step.
7.  Do not silently change the architecture.
8.  Preserve the strict separation between Teacher and Student code.
9.  If a security decision is required, choose the safer
    production-oriented approach and explain it.
10. At the end, provide exact commands for running the backend,
    frontend, PostgreSQL, migrations, tests, and development servers.

The resulting code should be a clean foundation for adding SyllabAI's
future:

``` text
PDF
 ↓
Document Processing
 ↓
RAG
 ↓
Q&A
Quiz
Flashcards
Animation
```

without requiring a rewrite of the authentication architecture.
