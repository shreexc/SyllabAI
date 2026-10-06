# SyllabAI — Functional Requirements Document

## Document Control

| Field | Details |
|---|---|
| Document ID | SAB-DOC-008 |
| Document Name | Functional Requirements Document |
| File Name | `08-functional-requirements.md` |
| Product | SyllabAI |
| Document Type | Functional Requirements |
| SDLC Stage | Requirements Engineering |
| Status | Draft — Functional Requirements Baseline Candidate |
| Version | 1.0 |
| Previous Document | `07-srs.md` |
| Next Document | `09-non-functional-requirements.md` |
| Development Status | No production coding yet |
| Product Owner | TBD |
| Project Manager | TBD |
| Technical Lead | TBD |
| QA Lead | TBD |
| Prepared By | SyllabAI Team |
| Last Updated | 2026-10-03 |

---

# 1. Purpose

This document defines the detailed functional requirements of SyllabAI.

The SRS establishes the overall software requirements. This document goes one level deeper and defines the expected functional behavior of the system in a structured, uniquely identifiable, and testable format.

The requirements in this document are intended to become the bridge between:

```text
Product Need
     ↓
Functional Requirement
     ↓
User Story
     ↓
Development Task
     ↓
Code
     ↓
Test Case
     ↓
Bug / Defect
     ↓
Acceptance
```

Every functional requirement has a unique identifier so that it can be traced throughout the SDLC.

---

# 2. Functional Requirement Standard

## 2.1 Requirement Statement Format

Functional requirements should use the following structure:

```text
FR-<MODULE>-<NUMBER>

The system shall <required behavior>.
```

Example:

```text
FR-AUTH-001

The system shall allow an eligible user to create an account
using the approved registration information.
```

---

## 2.2 Requirement Characteristics

Every requirement should be:

- Unique
- Clear
- Atomic where practical
- Testable
- Feasible
- Necessary
- Traceable
- Prioritized
- Consistent with the approved scope

---

# 3. Requirement Priority

| Priority | Meaning |
|---|---|
| MUST | Required for the approved MVP |
| SHOULD | Important, but may be deferred without invalidating the core MVP |
| COULD | Useful enhancement |
| FUTURE | Not planned for the current release |

---

# 4. Requirement ID Catalogue

| Module | ID Prefix |
|---|---|
| Authentication | `FR-AUTH-xxx` |
| Student | `FR-STUDENT-xxx` |
| Teacher | `FR-TEACHER-xxx` |
| Institution | `FR-INSTITUTION-xxx` |
| Platform Administration | `FR-ADMIN-xxx` |
| Subject | `FR-SUBJECT-xxx` |
| Materials | `FR-MATERIAL-xxx` |
| PDF | `FR-PDF-xxx` |
| Video | `FR-VIDEO-xxx` |
| Assignment | `FR-ASSIGNMENT-xxx` |
| Submission | `FR-SUBMISSION-xxx` |
| Quiz | `FR-QUIZ-xxx` |
| AI Assistant | `FR-AI-xxx` |
| Notification | `FR-NOTIFICATION-xxx` |
| Progress | `FR-PROGRESS-xxx` |
| Search | `FR-SEARCH-xxx` |
| Content Moderation | `FR-MODERATION-xxx` |
| File Management | `FR-FILE-xxx` |
| Profile | `FR-PROFILE-xxx` |
| Audit | `FR-AUDIT-xxx` |

---

# 5. Authentication Functional Requirements

## FR-AUTH-001 — User Registration

**Priority:** MUST  
**Actor:** Student / Teacher / Authorized User

The system shall allow an eligible user to create a SyllabAI account using the approved registration information.

### Acceptance Criteria

- Required registration fields are validated.
- Invalid registration information is rejected.
- Duplicate account identifiers are rejected or handled according to the account policy.
- A valid registration creates an account.
- The account receives the appropriate initial state.

### Dependencies

- User model
- Authentication service
- Validation system

---

## FR-AUTH-002 — Mobile Number Registration

**Priority:** MUST if mobile authentication is approved  
**Actor:** Student / Teacher

The system shall allow a user to register using a verified mobile number when mobile authentication is enabled.

### Acceptance Criteria

- Mobile number format is validated.
- Verification is required before the number is considered verified.
- Invalid verification attempts are rejected.
- A verified number can be associated with the account.

---

## FR-AUTH-003 — Email Registration

**Priority:** SHOULD

The system should support email-based registration where enabled by the approved authentication design.

---

## FR-AUTH-004 — Mobile Number Verification

**Priority:** MUST if mobile registration is enabled

The system shall verify a user's mobile number using the approved verification mechanism.

### Acceptance Criteria

- Verification code/request is generated.
- Verification code is validated.
- Invalid or expired codes are rejected.
- Successful verification changes the account verification state.

---

## FR-AUTH-005 — User Login

**Priority:** MUST

The system shall authenticate a registered user using the approved authentication mechanism.

### Acceptance Criteria

- Valid credentials result in authenticated access.
- Invalid credentials are rejected.
- Authentication failures do not reveal sensitive credential information.
- Appropriate authentication state is created.

---

## FR-AUTH-006 — Logout

**Priority:** MUST

The system shall allow an authenticated user to securely log out.

### Acceptance Criteria

- The active authentication state is invalidated or terminated according to the selected architecture.
- Protected resources are no longer accessible using the terminated session/token state.

---

## FR-AUTH-007 — Access Token Management

**Priority:** MUST if token-based authentication is used

The system shall manage authentication tokens according to the approved security architecture.

---

## FR-AUTH-008 — Refresh Authentication

**Priority:** MUST if refresh-token authentication is used

The system shall allow a valid refresh mechanism to obtain renewed authentication credentials according to the configured security policy.

---

## FR-AUTH-009 — Password Creation

**Priority:** MUST if password authentication is enabled

The system shall allow an eligible user to create a password that satisfies the configured password policy.

---

## FR-AUTH-010 — Password Change

**Priority:** MUST if password authentication is enabled

The system shall allow an authenticated user to change their password after satisfying the required security checks.

---

## FR-AUTH-011 — Password Reset

**Priority:** MUST if password authentication is enabled

The system shall provide a secure password-reset process.

---

## FR-AUTH-012 — Account Verification State

**Priority:** SHOULD

The system should maintain account verification states such as:

```text
Unverified
Verified
Suspended
Deactivated
```

---

## FR-AUTH-013 — Role-Based Authorization

**Priority:** MUST

The system shall enforce authorization based on the user's assigned role.

Supported primary roles:

- Student
- Teacher
- Institution Administrator
- Platform Administrator

---

## FR-AUTH-014 — Unauthorized Access Prevention

**Priority:** MUST

The system shall deny access when an authenticated user attempts to perform an action outside their permissions.

---

## FR-AUTH-015 — Account Suspension

**Priority:** SHOULD

Authorized administrators should be able to suspend an account according to platform rules.

---

# 6. Student Functional Requirements

## FR-STUDENT-001 — Student Profile Creation

**Priority:** MUST  
**Actor:** Student

The system shall create a student profile associated with the student's authenticated account.

---

## FR-STUDENT-002 — Student Profile Update

**Priority:** MUST

The system shall allow a student to update permitted profile information.

---

## FR-STUDENT-003 — Student Profile View

**Priority:** MUST

The system shall allow a student to view their own profile information.

---

## FR-STUDENT-004 — Student Subject Access

**Priority:** MUST

The system shall allow a student to access subjects for which the student has valid access.

---

## FR-STUDENT-005 — Student Material Access

**Priority:** MUST

The system shall allow an authorized student to access published learning materials associated with accessible subjects.

---

## FR-STUDENT-006 — Student Assignment Access

**Priority:** MUST

The system shall allow an authorized student to view assignments published to the student.

---

## FR-STUDENT-007 — Student Quiz Access

**Priority:** MUST

The system shall allow an authorized student to access published quizzes available to them.

---

## FR-STUDENT-008 — Student AI Access

**Priority:** MUST

The system shall allow an authorized student to use the AI learning assistant.

---

## FR-STUDENT-009 — Student Progress View

**Priority:** SHOULD

The system should allow students to view permitted basic learning progress information.

---

## FR-STUDENT-010 — Student Notifications

**Priority:** SHOULD

The system should allow students to view relevant notifications.

---

# 7. Teacher Functional Requirements

## FR-TEACHER-001 — Teacher Profile Creation

**Priority:** MUST

The system shall create a teacher profile associated with the teacher's authenticated account.

---

## FR-TEACHER-002 — Teacher Profile Update

**Priority:** MUST

The system shall allow teachers to update permitted profile information.

---

## FR-TEACHER-003 — Teacher Subject Creation

**Priority:** MUST

The system shall allow an authorized teacher to create a subject space.

---

## FR-TEACHER-004 — Teacher Subject Management

**Priority:** MUST

The system shall allow an authorized teacher to manage subjects owned or assigned to the teacher.

---

## FR-TEACHER-005 — Teacher Material Creation

**Priority:** MUST

The system shall allow an authorized teacher to create educational materials within permitted subjects.

---

## FR-TEACHER-006 — Teacher PDF Upload

**Priority:** MUST

The system shall allow an authorized teacher to upload PDF resources to a permitted subject.

---

## FR-TEACHER-007 — Teacher Video Resource Creation

**Priority:** SHOULD

The system should allow an authorized teacher to create video resources.

---

## FR-TEACHER-008 — Teacher Assignment Creation

**Priority:** MUST

The system shall allow an authorized teacher to create assignments for permitted subjects.

---

## FR-TEACHER-009 — Teacher Submission Review

**Priority:** MUST

The system shall allow an authorized teacher to review student submissions.

---

## FR-TEACHER-010 — Teacher Feedback

**Priority:** MUST

The system shall allow an authorized teacher to provide feedback on student submissions.

---

## FR-TEACHER-011 — Teacher Quiz Creation

**Priority:** MUST

The system shall allow an authorized teacher to create quizzes.

---

## FR-TEACHER-012 — Teacher Quiz Management

**Priority:** MUST

The system shall allow an authorized teacher to update, publish, or manage quizzes owned by the teacher.

---

## FR-TEACHER-013 — Teacher Student Activity View

**Priority:** SHOULD

The system should allow an authorized teacher to view permitted student learning activity.

---

## FR-TEACHER-014 — Teacher Progress View

**Priority:** SHOULD

The system should allow an authorized teacher to view permitted basic student progress information.

---

# 8. Institution Administrator Requirements

## FR-INSTITUTION-001 — Institution Profile

**Priority:** SHOULD

The system should maintain an institution profile when institution functionality is enabled.

---

## FR-INSTITUTION-002 — Institution User Management

**Priority:** SHOULD

An authorized institution administrator should be able to manage users belonging to the institution according to permission rules.

---

## FR-INSTITUTION-003 — Institution Teacher Management

**Priority:** SHOULD

An authorized institution administrator should be able to manage institution-associated teachers.

---

## FR-INSTITUTION-004 — Institution Student Management

**Priority:** SHOULD

An authorized institution administrator should be able to manage institution-associated students.

---

## FR-INSTITUTION-005 — Institution Subject Oversight

**Priority:** SHOULD

An authorized institution administrator should be able to view or manage institution-associated subject structures where enabled.

---

## FR-INSTITUTION-006 — Institution Access Boundary

**Priority:** MUST

Institution administrators shall not automatically have unrestricted platform-wide administrative privileges.

---

# 9. Platform Administrator Requirements

## FR-ADMIN-001 — User Management

**Priority:** MUST

The system shall allow authorized platform administrators to manage user accounts.

---

## FR-ADMIN-002 — Role Management

**Priority:** MUST

The system shall allow authorized administrators to manage supported user roles according to role-assignment rules.

---

## FR-ADMIN-003 — Account Status Management

**Priority:** MUST

Authorized platform administrators shall be able to change supported account states.

---

## FR-ADMIN-004 — Content Management

**Priority:** MUST

Authorized administrators shall be able to manage content according to moderation and operational rules.

---

## FR-ADMIN-005 — Subject Administration

**Priority:** SHOULD

Authorized platform administrators should be able to manage subject records where required for platform operations.

---

## FR-ADMIN-006 — Administrative Dashboard

**Priority:** SHOULD

The system should provide authorized platform administrators with an administrative dashboard containing approved operational information.

---

## FR-ADMIN-007 — Administrative Access Control

**Priority:** MUST

Administrative functions shall be accessible only to authorized administrative users.

---

## FR-ADMIN-008 — Administrative Action Audit

**Priority:** MUST

Security-sensitive administrative actions shall generate appropriate audit information.

---

# 10. Profile Functional Requirements

## FR-PROFILE-001 — Profile View

**Priority:** MUST

The system shall allow an authenticated user to view profile information they are authorized to access.

---

## FR-PROFILE-002 — Profile Update

**Priority:** MUST

The system shall allow users to update fields they are authorized to modify.

---

## FR-PROFILE-003 — Profile Image

**Priority:** SHOULD

The system should allow users to upload or update a profile image where enabled.

---

## FR-PROFILE-004 — Profile Privacy

**Priority:** MUST

The system shall prevent unauthorized users from viewing restricted profile information.

---

## FR-PROFILE-005 — Profile Validation

**Priority:** MUST

The system shall validate profile data according to field-specific rules.

---

# 11. Subject Functional Requirements

## FR-SUBJECT-001 — Subject Creation

**Priority:** MUST

The system shall allow authorized teachers to create a subject space.

---

## FR-SUBJECT-002 — Subject Name

**Priority:** MUST

Each subject shall have a valid name.

---

## FR-SUBJECT-003 — Subject Description

**Priority:** SHOULD

The system should allow authorized teachers to define a subject description.

---

## FR-SUBJECT-004 — Subject Ownership

**Priority:** MUST

The system shall associate each managed subject with an authorized teacher or approved owner.

---

## FR-SUBJECT-005 — Subject Update

**Priority:** MUST

Authorized subject owners shall be able to update permitted subject information.

---

## FR-SUBJECT-006 — Subject Archive

**Priority:** SHOULD

Authorized users should be able to archive a subject according to lifecycle rules.

---

## FR-SUBJECT-007 — Subject Access Control

**Priority:** MUST

The system shall enforce access rules for each subject.

---

## FR-SUBJECT-008 — Subject Resource Association

**Priority:** MUST

The system shall allow authorized resources to be associated with a subject.

---

## FR-SUBJECT-009 — Subject Assignment Association

**Priority:** MUST

The system shall allow assignments to be associated with a subject.

---

## FR-SUBJECT-010 — Subject Quiz Association

**Priority:** MUST

The system shall allow quizzes to be associated with a subject.

---

# 12. Material Functional Requirements

## FR-MATERIAL-001 — Material Creation

**Priority:** MUST

The system shall allow an authorized teacher to create a learning material.

---

## FR-MATERIAL-002 — Material Title

**Priority:** MUST

Each learning material shall have a valid title.

---

## FR-MATERIAL-003 — Material Description

**Priority:** SHOULD

The system should allow a teacher to provide a material description.

---

## FR-MATERIAL-004 — Material Subject Association

**Priority:** MUST

Each material shall be associated with an approved subject.

---

## FR-MATERIAL-005 — Material Publication

**Priority:** MUST

Authorized teachers shall be able to publish a learning material.

---

## FR-MATERIAL-006 — Material Draft State

**Priority:** SHOULD

The system should support draft materials that are not yet visible to students.

---

## FR-MATERIAL-007 — Material Update

**Priority:** MUST

Authorized content owners shall be able to update permitted material information.

---

## FR-MATERIAL-008 — Material Archive

**Priority:** SHOULD

Authorized content owners should be able to archive materials.

---

## FR-MATERIAL-009 — Material Access Control

**Priority:** MUST

The system shall enforce access permissions when students request materials.

---

# 13. PDF Functional Requirements

## FR-PDF-001 — PDF Upload

**Priority:** MUST

The system shall allow authorized teachers to upload PDF educational resources.

---

## FR-PDF-002 — PDF File Validation

**Priority:** MUST

The system shall validate uploaded files according to supported file type, size, and security rules.

---

## FR-PDF-003 — PDF Storage

**Priority:** MUST

The system shall store approved PDF resources using the configured storage mechanism.

---

## FR-PDF-004 — PDF Metadata

**Priority:** SHOULD

The system should store metadata including:

- Title
- Subject
- Owner
- Upload date
- File size
- Status

---

## FR-PDF-005 — PDF Subject Association

**Priority:** MUST

Each PDF resource shall be associated with an approved subject or material.

---

## FR-PDF-006 — PDF Student Access

**Priority:** MUST

Authorized students shall be able to view or download permitted PDF resources.

---

## FR-PDF-007 — PDF Access Protection

**Priority:** MUST

The system shall prevent unauthorized users from accessing protected PDF resources.

---

## FR-PDF-008 — PDF Replacement

**Priority:** SHOULD

Authorized content owners should be able to replace a PDF while preserving required resource metadata and audit information.

---

# 14. Video Functional Requirements

## FR-VIDEO-001 — Video Resource Creation

**Priority:** SHOULD

The system should allow authorized teachers to create video learning resources.

---

## FR-VIDEO-002 — Video Title

**Priority:** SHOULD

Each video resource should have a title.

---

## FR-VIDEO-003 — Video Description

**Priority:** COULD

The system may support descriptions for video resources.

---

## FR-VIDEO-004 — External Video URL

**Priority:** SHOULD

The system should support approved external video URLs.

---

## FR-VIDEO-005 — Video Subject Association

**Priority:** SHOULD

Video resources should be associated with an approved subject.

---

## FR-VIDEO-006 — Student Video Access

**Priority:** SHOULD

Authorized students should be able to access published video resources.

---

# 15. Assignment Functional Requirements

## FR-ASSIGNMENT-001 — Assignment Creation

**Priority:** MUST

The system shall allow authorized teachers to create assignments.

---

## FR-ASSIGNMENT-002 — Assignment Title

**Priority:** MUST

Each assignment shall have a valid title.

---

## FR-ASSIGNMENT-003 — Assignment Description

**Priority:** MUST

Each assignment shall support instructions or a description.

---

## FR-ASSIGNMENT-004 — Assignment Subject

**Priority:** MUST

Each assignment shall be associated with an approved subject.

---

## FR-ASSIGNMENT-005 — Assignment Due Date

**Priority:** MUST

The system shall support a configured assignment due date.

---

## FR-ASSIGNMENT-006 — Assignment Draft

**Priority:** SHOULD

Teachers should be able to save an assignment as a draft before publication.

---

## FR-ASSIGNMENT-007 — Assignment Publication

**Priority:** MUST

Authorized teachers shall be able to publish assignments to authorized students.

---

## FR-ASSIGNMENT-008 — Assignment Access

**Priority:** MUST

Authorized students shall be able to view published assignments.

---

## FR-ASSIGNMENT-009 — Assignment Update

**Priority:** MUST

Authorized teachers shall be able to update permitted assignment information according to lifecycle rules.

---

## FR-ASSIGNMENT-010 — Assignment Archive

**Priority:** SHOULD

Authorized teachers should be able to archive assignments.

---

# 16. Submission Functional Requirements

## FR-SUBMISSION-001 — Assignment Submission

**Priority:** MUST

The system shall allow an authorized student to submit an assignment.

---

## FR-SUBMISSION-002 — Submission Content

**Priority:** MUST

The system shall support the approved submission format(s) for each assignment.

---

## FR-SUBMISSION-003 — Submission Timestamp

**Priority:** MUST

The system shall record the submission date and time.

---

## FR-SUBMISSION-004 — Submission Status

**Priority:** MUST

The system shall maintain an appropriate submission status.

Example:

```text
Not Submitted
Submitted
Late
Under Review
Reviewed
```

---

## FR-SUBMISSION-005 — Submission Update

**Priority:** SHOULD

The system should allow a student to update/resubmit an assignment when the assignment rules permit it.

---

## FR-SUBMISSION-006 — Teacher Submission Access

**Priority:** MUST

Authorized teachers shall be able to access submissions belonging to assignments they manage.

---

## FR-SUBMISSION-007 — Submission Feedback

**Priority:** MUST

Authorized teachers shall be able to provide feedback on student submissions.

---

## FR-SUBMISSION-008 — Submission Result

**Priority:** SHOULD

The system should allow authorized teachers to record an appropriate result or grade when grading is enabled.

---

# 17. Quiz Functional Requirements

## FR-QUIZ-001 — Quiz Creation

**Priority:** MUST

The system shall allow authorized teachers to create quizzes.

---

## FR-QUIZ-002 — Quiz Title

**Priority:** MUST

Each quiz shall have a valid title.

---

## FR-QUIZ-003 — Quiz Description

**Priority:** SHOULD

The system should allow a teacher to define quiz instructions or description.

---

## FR-QUIZ-004 — Quiz Subject Association

**Priority:** MUST

Each quiz shall be associated with an approved subject.

---

## FR-QUIZ-005 — Question Creation

**Priority:** MUST

Authorized teachers shall be able to create supported quiz questions.

---

## FR-QUIZ-006 — Multiple Choice Question

**Priority:** MUST

The MVP shall support multiple-choice questions.

---

## FR-QUIZ-007 — Correct Answer Configuration

**Priority:** MUST

Authorized teachers shall be able to define the correct answer for supported objective questions.

---

## FR-QUIZ-008 — Quiz Publication

**Priority:** MUST

Authorized teachers shall be able to publish a quiz.

---

## FR-QUIZ-009 — Quiz Access

**Priority:** MUST

Authorized students shall be able to access published quizzes.

---

## FR-QUIZ-010 — Quiz Attempt

**Priority:** MUST

The system shall allow authorized students to attempt an available quiz.

---

## FR-QUIZ-011 — Answer Recording

**Priority:** MUST

The system shall record student answers during a quiz attempt according to the configured workflow.

---

## FR-QUIZ-012 — Quiz Submission

**Priority:** MUST

The system shall allow a student to submit a quiz attempt.

---

## FR-QUIZ-013 — Automatic Scoring

**Priority:** MUST

The system shall automatically score supported objective questions.

---

## FR-QUIZ-014 — Quiz Result

**Priority:** MUST

The system shall generate a quiz result after a completed attempt according to configured rules.

---

## FR-QUIZ-015 — Attempt Limit

**Priority:** SHOULD

The system should support a configurable maximum number of attempts.

---

## FR-QUIZ-016 — Quiz Availability Period

**Priority:** SHOULD

The system should support configurable quiz opening and closing dates.

---

## FR-QUIZ-017 — Quiz Review

**Priority:** SHOULD

The system should allow authorized teachers to review quiz results.

---

# 18. AI Assistant Functional Requirements

## FR-AI-001 — AI Question Submission

**Priority:** MUST

The system shall allow an authorized student to submit an educational question to the AI assistant.

---

## FR-AI-002 — AI Request Processing

**Priority:** MUST

The system shall send an approved AI request to the configured AI service.

---

## FR-AI-003 — AI Response

**Priority:** MUST

The system shall return an AI-generated response when the configured AI service successfully processes the request.

---

## FR-AI-004 — AI Loading State

**Priority:** MUST

The system shall communicate an appropriate processing state while an AI response is being generated.

---

## FR-AI-005 — AI Failure Handling

**Priority:** MUST

The system shall provide an understandable error or fallback state when the AI service fails or is unavailable.

---

## FR-AI-006 — Subject Context

**Priority:** SHOULD

The system should provide relevant subject context to the AI assistant when such context is available and approved.

---

## FR-AI-007 — Learning Material Context

**Priority:** SHOULD

The system should allow AI responses to use authorized learning-material context where the AI/RAG functionality supports it.

---

## FR-AI-008 — Conversation Context

**Priority:** SHOULD

The system should maintain appropriate conversation context during an AI session.

---

## FR-AI-009 — AI Response Identification

**Priority:** SHOULD

The system should identify AI-generated responses as AI-generated content.

---

## FR-AI-010 — AI Safety Controls

**Priority:** MUST

The system shall apply approved safety controls to AI interactions.

---

## FR-AI-011 — AI Authorization

**Priority:** MUST

Only authorized users shall be able to access the AI assistant.

---

## FR-AI-012 — AI Usage Logging

**Priority:** SHOULD

The system should record appropriate operational information for AI usage monitoring while respecting privacy requirements.

---

## FR-AI-013 — AI Context Access Control

**Priority:** MUST

The AI subsystem shall not retrieve or expose educational materials that the requesting user is not authorized to access.

---

# 19. Notification Functional Requirements

## FR-NOTIFICATION-001 — Notification Creation

**Priority:** SHOULD

The system should create notifications for configured system or learning events.

---

## FR-NOTIFICATION-002 — Assignment Notification

**Priority:** SHOULD

The system should generate a notification when a relevant assignment is published or updated.

---

## FR-NOTIFICATION-003 — Quiz Notification

**Priority:** SHOULD

The system should generate notifications for configured quiz events.

---

## FR-NOTIFICATION-004 — Feedback Notification

**Priority:** SHOULD

The system should notify students when relevant assignment feedback becomes available.

---

## FR-NOTIFICATION-005 — System Notification

**Priority:** SHOULD

The system should support important system notifications.

---

## FR-NOTIFICATION-006 — Notification List

**Priority:** SHOULD

The system should allow users to view their notifications.

---

## FR-NOTIFICATION-007 — Read/Unread State

**Priority:** SHOULD

The system should maintain notification read/unread status.

---

## FR-NOTIFICATION-008 — Notification Authorization

**Priority:** MUST

A user shall only be able to access their own notifications or notifications explicitly authorized for them.

---

# 20. Progress Functional Requirements

## FR-PROGRESS-001 — Learning Activity Recording

**Priority:** MUST

The system shall record approved learning activities required for basic progress tracking.

---

## FR-PROGRESS-002 — Assignment Progress

**Priority:** MUST

The system shall track relevant assignment completion/submission status.

---

## FR-PROGRESS-003 — Quiz Performance

**Priority:** MUST

The system shall associate quiz results with the corresponding student and quiz.

---

## FR-PROGRESS-004 — Subject Progress

**Priority:** SHOULD

The system should provide basic subject-level progress information.

---

## FR-PROGRESS-005 — Student Progress View

**Priority:** SHOULD

Students should be able to view their permitted progress information.

---

## FR-PROGRESS-006 — Teacher Progress View

**Priority:** SHOULD

Authorized teachers should be able to view permitted progress information for relevant students.

---

## FR-PROGRESS-007 — Progress Accuracy

**Priority:** MUST

Progress information shall be calculated from approved underlying learning activity data.

---

# 21. Search Functional Requirements

## FR-SEARCH-001 — Resource Search

**Priority:** SHOULD

The system should allow authorized users to search relevant educational resources.

---

## FR-SEARCH-002 — Subject Search

**Priority:** SHOULD

The system should allow users to find accessible subjects.

---

## FR-SEARCH-003 — Search Authorization

**Priority:** MUST

Search results shall only include resources and subjects that the requesting user is authorized to discover.

---

## FR-SEARCH-004 — Search Filtering

**Priority:** SHOULD

The system should support filtering by relevant fields such as subject or resource type.

---

# 22. File Management Requirements

## FR-FILE-001 — File Upload

**Priority:** MUST

Authorized users shall be able to upload supported files through approved workflows.

---

## FR-FILE-002 — File Type Validation

**Priority:** MUST

The system shall validate uploaded files against approved file types.

---

## FR-FILE-003 — File Size Validation

**Priority:** MUST

The system shall enforce configured maximum file-size limits.

---

## FR-FILE-004 — File Access Control

**Priority:** MUST

The system shall enforce authorization before allowing access to protected files.

---

## FR-FILE-005 — File Metadata

**Priority:** SHOULD

The system should store required file metadata.

---

## FR-FILE-006 — File Deletion

**Priority:** MUST

Authorized users shall be able to delete files when permitted by content lifecycle and retention rules.

---

# 23. Content Moderation Requirements

## FR-MODERATION-001 — Content Review

**Priority:** MUST

Authorized administrators shall be able to review content requiring moderation.

---

## FR-MODERATION-002 — Content Action

**Priority:** MUST

Authorized administrators shall be able to take approved moderation actions.

Possible actions include:

- Approve
- Hide
- Remove
- Restrict
- Escalate

---

## FR-MODERATION-003 — Moderation Authorization

**Priority:** MUST

Only authorized administrators shall perform moderation actions.

---

## FR-MODERATION-004 — Moderation Audit

**Priority:** MUST

Moderation actions shall be recorded for appropriate auditing.

---

# 24. Audit Requirements

## FR-AUDIT-001 — Security Event Recording

**Priority:** MUST

The system shall record appropriate security-sensitive events.

---

## FR-AUDIT-002 — Administrative Event Recording

**Priority:** MUST

The system shall record significant administrative actions.

---

## FR-AUDIT-003 — Content Moderation Recording

**Priority:** MUST

The system shall record moderation actions.

---

## FR-AUDIT-004 — Audit Access

**Priority:** MUST

Audit information shall only be accessible to authorized users.

---

# 25. Cross-Functional Authorization Requirements

## FR-AUTHZ-001 — Server-Side Authorization

**Priority:** MUST

The backend shall enforce authorization for protected operations.

---

## FR-AUTHZ-002 — Resource Ownership

**Priority:** MUST

The system shall verify resource ownership or permission before allowing modification.

---

## FR-AUTHZ-003 — Cross-User Data Protection

**Priority:** MUST

The system shall prevent a user from accessing another user's protected data without authorization.

---

## FR-AUTHZ-004 — Role Boundary

**Priority:** MUST

The system shall enforce role-specific functional boundaries.

---

# 26. Error and Exception Functional Requirements

## FR-ERROR-001 — Validation Error

**Priority:** MUST

The system shall provide an appropriate response when user input fails validation.

---

## FR-ERROR-002 — Unauthorized Error

**Priority:** MUST

The system shall return an appropriate unauthorized/forbidden response when access is not permitted.

---

## FR-ERROR-003 — Not Found Error

**Priority:** MUST

The system shall provide an appropriate response when a requested resource does not exist or is not accessible.

---

## FR-ERROR-004 — External Service Error

**Priority:** MUST

The system shall handle relevant external-service failures without exposing sensitive internal implementation details.

---

## FR-ERROR-005 — User-Friendly Errors

**Priority:** SHOULD

User-facing error messages should explain what happened and, where appropriate, what the user can do next.

---

# 27. Functional Workflow Requirements

## FR-WORKFLOW-001 — Student Learning Workflow

**Priority:** MUST

The system shall support the following core student workflow:

```text
Login
  ↓
Access Subject
  ↓
Open Material
  ↓
Study
  ↓
Attempt Assignment / Quiz
  ↓
Review Result / Feedback
  ↓
Use AI Assistance
  ↓
View Progress
```

---

## FR-WORKFLOW-002 — Teacher Teaching Workflow

**Priority:** MUST

The system shall support the following core teacher workflow:

```text
Login
  ↓
Create / Manage Subject
  ↓
Create Learning Material
  ↓
Publish Resource
  ↓
Create Assignment / Quiz
  ↓
Students Complete Work
  ↓
Teacher Reviews
  ↓
Teacher Provides Feedback
  ↓
Teacher Reviews Progress
```

---

## FR-WORKFLOW-003 — Administrator Workflow

**Priority:** MUST

The system shall support:

```text
Login
  ↓
Administrative Dashboard
  ↓
User / Role Management
  ↓
Content / Platform Management
  ↓
Audit / Operational Review
```

---

# 28. Functional Requirement Traceability

Each requirement should eventually map to implementation and verification artifacts.

Recommended structure:

| Requirement | User Story | Development Task | Code Area | Test Case | Defect |
|---|---|---|---|---|---|
| FR-AUTH-001 | TBD | TBD | TBD | TBD | TBD |
| FR-AUTH-005 | TBD | TBD | TBD | TBD | TBD |
| FR-STUDENT-004 | TBD | TBD | TBD | TBD | TBD |
| FR-TEACHER-003 | TBD | TBD | TBD | TBD | TBD |
| FR-SUBJECT-001 | TBD | TBD | TBD | TBD | TBD |
| FR-MATERIAL-001 | TBD | TBD | TBD | TBD | TBD |
| FR-ASSIGNMENT-001 | TBD | TBD | TBD | TBD | TBD |
| FR-QUIZ-001 | TBD | TBD | TBD | TBD | TBD |
| FR-AI-001 | TBD | TBD | TBD | TBD | TBD |
| FR-ADMIN-001 | TBD | TBD | TBD | TBD | TBD |

This matrix will be expanded during backlog, design, implementation, and testing.

---

# 29. Requirement-to-Test Mapping Example

A future QA test may reference the requirement directly.

### Requirement

```text
FR-SUBJECT-001
The system shall allow authorized teachers to create a subject space.
```

### Test Case

```text
TC-SUBJECT-001

Given:
A valid authenticated teacher.

When:
The teacher submits valid subject information.

Then:
The system creates the subject and associates it with the authorized teacher.
```

### Defect

```text
BUG-SUBJECT-001

Related Requirement:
FR-SUBJECT-001

Issue:
Subject creation returns a server error for valid input.

Status:
Open
```

This creates a complete traceability chain:

```text
FR-SUBJECT-001
      ↓
TC-SUBJECT-001
      ↓
BUG-SUBJECT-001
      ↓
Fix
      ↓
Regression Test
```

---

# 30. Functional Requirement Review Checklist

Before a requirement is approved:

- [ ] Unique ID assigned
- [ ] Requirement statement is clear
- [ ] Actor identified
- [ ] Priority assigned
- [ ] Scope alignment checked
- [ ] Dependencies identified
- [ ] Acceptance criteria defined
- [ ] Authorization implications reviewed
- [ ] Security implications reviewed
- [ ] Data implications reviewed
- [ ] Testability confirmed
- [ ] No duplicate requirement exists
- [ ] No conflict with SRS
- [ ] Requirement is feasible for current release

---

# 31. Functional Scope Summary

| Functional Area | MUST | SHOULD | COULD / FUTURE |
|---|---:|---:|---:|
| Authentication | ✓ | | |
| Authorization | ✓ | | |
| Student | ✓ | ✓ | |
| Teacher | ✓ | ✓ | |
| Institution | | ✓ | |
| Administration | ✓ | ✓ | |
| Profiles | ✓ | ✓ | |
| Subjects | ✓ | ✓ | |
| Materials | ✓ | ✓ | |
| PDF Resources | ✓ | ✓ | |
| Video Resources | | ✓ | |
| Assignments | ✓ | ✓ | |
| Submissions | ✓ | ✓ | |
| Quizzes | ✓ | ✓ | |
| AI Assistant | ✓ | ✓ | |
| Notifications | | ✓ | |
| Progress | ✓ | ✓ | |
| Search | | ✓ | |
| File Management | ✓ | ✓ | |
| Moderation | ✓ | | |
| Audit | ✓ | | |
| Advanced Analytics | | | Future |
| Payments | | | Out of Scope |
| Live Video | | | Out of Scope |
| Native Apps | | | Out of Scope |

---

# 32. Open Functional Questions

The following decisions must be finalized before the functional requirements are formally baselined:

1. Is mobile-number authentication mandatory for MVP?
2. Is email authentication mandatory?
3. Will Google/social login be included?
4. How are students assigned or enrolled into subjects?
5. Can teachers invite students?
6. Can students request subject access?
7. Can students upload materials?
8. Which file formats are supported?
9. What are the maximum file sizes?
10. What exact assignment submission formats are required?
11. Will assignments support grading in MVP?
12. Which quiz question types are required?
13. What are quiz attempt rules?
14. Should students see correct answers after submission?
15. What exact AI features must be delivered in MVP?
16. Will AI access only authorized subject materials?
17. Should AI conversations be stored?
18. Which notification channels are required?
19. What progress metrics should be displayed?
20. Which institution features belong in MVP?
21. Which administrative actions require approval?
22. What moderation workflow is required?
23. What exact search scope is required?
24. What exact audit events must be recorded?
25. What are the final acceptance thresholds for MVP?

---

# 33. Change Control

Any change to these functional requirements shall follow the approved change-management process.

A change request should include:

```text
Change Request ID
Requirement ID
Requested Change
Reason
Requester
Business/User Value
Scope Impact
Technical Impact
Security Impact
Testing Impact
Schedule Impact
Dependencies
Decision
Approver
Date
```

No major requirement should be added directly to implementation without updating the appropriate requirements and backlog artifacts.

---

# 34. Definition of Functional Requirement Completion

A functional requirement is considered implemented only when:

- Requirement is approved.
- Requirement is assigned to a development task.
- Design impact is reviewed.
- Code is implemented.
- Relevant unit/integration tests exist.
- Relevant QA test passes.
- Acceptance criteria pass.
- Security/authorization checks pass where applicable.
- Documentation is updated where necessary.
- No unresolved critical defect remains.
- Requirement status is updated in the traceability system.

---

# 35. Approval

| Role | Name | Decision | Signature | Date |
|---|---|---|---|---|
| Project Sponsor | TBD | Pending | TBD | TBD |
| Product Owner | TBD | Pending | TBD | TBD |
| Project Manager | TBD | Pending | TBD | TBD |
| Technical Lead | TBD | Pending | TBD | TBD |
| QA Lead | TBD | Pending | TBD | TBD |

---

# 36. Revision History

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | 2026-10-03 | SyllabAI Team | Initial functional requirements draft |
| 1.0 | 2026-10-03 | SyllabAI Team | Initial functional requirements baseline candidate |

---

# 37. Document Status

**Document:** `08-functional-requirements.md`

**Document ID:** `SAB-DOC-008`

**Current Status:** Draft — Functional Requirements Baseline Candidate

**Previous Document:** `07-srs.md`

**Next Document:** `09-non-functional-requirements.md`

**SDLC Stage:** Requirements Engineering

**Development Status:** No production coding yet

**Core Principle:**

> **Every functional capability must have a unique requirement ID so that it can be traced from requirement to development, code, testing, and defects.**
