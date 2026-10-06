# SyllabAI — User Story Backlog

## Document Control

| Field | Details |
|---|---|
| Document ID | SAB-DOC-010 |
| Document Name | User Story Backlog |
| File Name | `10-user-stories.md` |
| Product | SyllabAI |
| Document Type | Agile Requirements / Product Backlog |
| SDLC Stage | Requirements Engineering / Product Backlog |
| Status | Draft — Initial Backlog Baseline Candidate |
| Version | 1.0 |
| Previous Document | `09-non-functional-requirements.md` |
| Next Document | `11-use-cases.md` |
| Development Status | No production coding yet |
| Product Owner | TBD |
| Project Manager | TBD |
| Technical Lead | TBD |
| QA Lead | TBD |
| Prepared By | SyllabAI Team |
| Last Updated | 2026-10-03 |

---

# 1. Purpose

This document converts approved SyllabAI requirements into user-centered user stories.

User stories describe what a user wants to accomplish and why.

The purpose is to create a clear bridge between:

```text
Product Vision
      ↓
Problem
      ↓
Scope
      ↓
Requirement
      ↓
Epic
      ↓
User Story
      ↓
Acceptance Criteria
      ↓
Development Task
      ↓
Implementation
      ↓
Test
      ↓
Release
```

The user story backlog is intended to become the primary source for sprint planning and feature-level development work.

---

# 2. User Story Format

SyllabAI user stories should follow:

```text
As a <user>,
I want <capability>,
so that <benefit>.
```

Example:

```text
US-AUTH-001

As a student,
I want to register an account,
so that I can access SyllabAI.
```

---

# 3. Acceptance Criteria Format

Acceptance criteria should define observable behavior.

The preferred format is:

```text
Given <initial condition>

When <action>

Then <expected result>
```

Example:

```text
Given the student is on the registration page

When the student submits valid registration information

Then the system should create the account
and provide the appropriate next step.
```

---

# 4. User Story Quality Standard

A good SyllabAI user story should be:

- Independent where practical
- Valuable to a user or stakeholder
- Negotiable before implementation
- Specific enough to estimate
- Small enough to implement
- Testable
- Traceable to requirements

The backlog should avoid stories that describe only technical implementation.

Prefer:

> As a teacher, I want to create a subject so that I can organize learning materials for students.

Avoid:

> As a developer, I want to create a Subject model in Django.

The second is an implementation task rather than a user story.

---

# 5. Story ID Convention

| Epic | ID Prefix |
|---|---|
| Authentication | `US-AUTH-xxx` |
| Student | `US-STUDENT-xxx` |
| Teacher | `US-TEACHER-xxx` |
| Institution | `US-INSTITUTION-xxx` |
| Administration | `US-ADMIN-xxx` |
| Profile | `US-PROFILE-xxx` |
| Subject | `US-SUBJECT-xxx` |
| Materials | `US-MATERIAL-xxx` |
| PDF | `US-PDF-xxx` |
| Video | `US-VIDEO-xxx` |
| Assignment | `US-ASSIGNMENT-xxx` |
| Submission | `US-SUBMISSION-xxx` |
| Quiz | `US-QUIZ-xxx` |
| AI Assistant | `US-AI-xxx` |
| Notification | `US-NOTIFICATION-xxx` |
| Progress | `US-PROGRESS-xxx` |
| Search | `US-SEARCH-xxx` |
| Moderation | `US-MODERATION-xxx` |
| Platform Operations | `US-OPS-xxx` |

---

# 6. Priority Model

| Priority | Meaning |
|---|---|
| P0 | Critical for core MVP |
| P1 | High priority for MVP |
| P2 | Important but can be deferred |
| P3 | Enhancement / future |
| Future | Not planned for current release |

---

# 7. Epic Overview

| Epic | Description | MVP |
|---|---|---|
| EPIC-01 Authentication | Account access and security | Yes |
| EPIC-02 Student | Student learning experience | Yes |
| EPIC-03 Teacher | Teacher teaching experience | Yes |
| EPIC-04 Institution | Institution management | Partial |
| EPIC-05 Administration | Platform administration | Yes |
| EPIC-06 Profiles | User profile management | Yes |
| EPIC-07 Subjects | Subject spaces | Yes |
| EPIC-08 Materials | Learning resources | Yes |
| EPIC-09 PDF | PDF resources | Yes |
| EPIC-10 Video | Video resources | Candidate |
| EPIC-11 Assignments | Assignment lifecycle | Yes |
| EPIC-12 Submissions | Assignment submission/review | Yes |
| EPIC-13 Quizzes | Quiz lifecycle | Yes |
| EPIC-14 AI | AI learning assistant | Yes |
| EPIC-15 Notifications | Learning/system notifications | Candidate |
| EPIC-16 Progress | Basic learning progress | Yes |
| EPIC-17 Search | Resource discovery | Candidate |
| EPIC-18 Moderation | Content moderation | Yes |
| EPIC-19 Operations | Audit/operational controls | Yes |

---

# 8. Epic 01 — Authentication

## US-AUTH-001 — Student Registration

**Priority:** P0  
**Persona:** Student  
**Related Requirements:** `FR-AUTH-001`, `FR-AUTH-002`

### User Story

> As a student, I want to register an account using the approved registration method so that I can access SyllabAI.

### Acceptance Criteria

```text
Given the student is on the registration page

When the student submits valid required information

Then the system should create the student account
and provide the appropriate verification or next step.
```

```text
Given required registration information is invalid

When the student submits the form

Then the system should reject the registration
and identify the invalid information.
```

---

## US-AUTH-002 — Verify Mobile Number

**Priority:** P0 if mobile authentication is approved  
**Persona:** Student / Teacher  
**Related Requirements:** `FR-AUTH-004`

### User Story

> As a user, I want to verify my mobile number so that my account can use a trusted phone identifier.

### Acceptance Criteria

```text
Given a verification code has been issued

When the user submits the valid code

Then the mobile number should become verified.
```

```text
Given the verification code is invalid or expired

When the user submits it

Then verification should fail
and the user should receive an appropriate message.
```

---

## US-AUTH-003 — User Login

**Priority:** P0  
**Persona:** All authenticated users  
**Related Requirements:** `FR-AUTH-005`

### User Story

> As a registered user, I want to log in securely so that I can access my SyllabAI account.

### Acceptance Criteria

```text
Given the user has valid authentication credentials

When the user submits them

Then the system should authenticate the user
and provide access according to their role.
```

```text
Given the credentials are invalid

When the user attempts to log in

Then the system should reject the attempt.
```

---

## US-AUTH-004 — Logout

**Priority:** P0  
**Persona:** All authenticated users  
**Related Requirements:** `FR-AUTH-006`

### User Story

> As an authenticated user, I want to log out so that my account is no longer accessible from the current session.

### Acceptance Criteria

```text
Given the user is authenticated

When the user selects logout

Then the active authentication state should be terminated
and protected resources should no longer be accessible.
```

---

## US-AUTH-005 — Password Reset

**Priority:** P1 if password authentication is enabled  
**Persona:** User  
**Related Requirements:** `FR-AUTH-011`

### User Story

> As a user who has forgotten my password, I want to reset it securely so that I can regain access to my account.

### Acceptance Criteria

```text
Given the user has a valid account

When the user requests a password reset

Then the system should provide the approved password-reset process.
```

---

## US-AUTH-006 — Role-Based Access

**Priority:** P0  
**Persona:** All users  
**Related Requirements:** `FR-AUTH-013`, `FR-AUTH-014`

### User Story

> As a user, I want SyllabAI to show me only the features I am authorized to use so that my account and data remain protected.

### Acceptance Criteria

```text
Given a user has a defined role

When the user accesses SyllabAI

Then the system should enforce permissions associated with that role.
```

```text
Given a user attempts an unauthorized operation

When the request reaches the system

Then the system should reject the operation.
```

---

# 9. Epic 02 — Student Experience

## US-STUDENT-001 — View Student Profile

**Priority:** P0  
**Persona:** Student  
**Related Requirements:** `FR-STUDENT-001`, `FR-PROFILE-001`

### User Story

> As a student, I want to view my profile so that I can confirm my account information.

### Acceptance Criteria

```text
Given the student is authenticated

When the student opens their profile

Then the system should display the student's permitted profile information.
```

---

## US-STUDENT-002 — Update Student Profile

**Priority:** P1  
**Persona:** Student  
**Related Requirements:** `FR-STUDENT-002`, `FR-PROFILE-002`

### User Story

> As a student, I want to update my permitted profile information so that my account remains accurate.

### Acceptance Criteria

```text
Given the student is authenticated

When the student submits valid profile changes

Then the system should save the permitted changes.
```

---

## US-STUDENT-003 — Access My Subjects

**Priority:** P0  
**Persona:** Student  
**Related Requirements:** `FR-STUDENT-004`, `FR-SUBJECT-007`

### User Story

> As a student, I want to see the subjects I can access so that I can choose what to study.

### Acceptance Criteria

```text
Given the student has access to one or more subjects

When the student opens the subject area

Then the system should display the subjects available to that student.
```

---

## US-STUDENT-004 — Access Learning Materials

**Priority:** P0  
**Persona:** Student  
**Related Requirements:** `FR-STUDENT-005`, `FR-MATERIAL-009`

### User Story

> As a student, I want to access my subject's learning materials so that I can study from centralized resources.

### Acceptance Criteria

```text
Given the student has access to a subject

When the student opens its materials

Then the system should display published resources
the student is authorized to access.
```

---

## US-STUDENT-005 — Complete Assignment

**Priority:** P0  
**Persona:** Student  
**Related Requirements:** `FR-STUDENT-006`, `FR-SUBMISSION-001`

### User Story

> As a student, I want to submit an assignment so that my teacher can review my work.

### Acceptance Criteria

```text
Given an assignment is available to the student

When the student submits valid assignment content

Then the system should record the submission
and its submission timestamp.
```

---

## US-STUDENT-006 — Attempt Quiz

**Priority:** P0  
**Persona:** Student  
**Related Requirements:** `FR-STUDENT-007`, `FR-QUIZ-010`

### User Story

> As a student, I want to attempt a published quiz so that I can test my understanding.

### Acceptance Criteria

```text
Given a quiz is available to the student

When the student answers and submits the quiz

Then the system should record the answers
and process the attempt according to the quiz rules.
```

---

## US-STUDENT-007 — Use AI Learning Assistant

**Priority:** P0  
**Persona:** Student  
**Related Requirements:** `FR-STUDENT-008`, `FR-AI-001`

### User Story

> As a student, I want to ask the AI learning assistant questions so that I can receive additional learning support.

### Acceptance Criteria

```text
Given the student is authorized to use the AI assistant

When the student submits an educational question

Then the system should process the request
and return an AI-generated response when available.
```

---

## US-STUDENT-008 — View Learning Progress

**Priority:** P1  
**Persona:** Student  
**Related Requirements:** `FR-STUDENT-009`, `FR-PROGRESS-005`

### User Story

> As a student, I want to view my learning progress so that I can understand my study activity and results.

### Acceptance Criteria

```text
Given the student has learning activity

When the student opens the progress area

Then the system should display the approved progress information.
```

---

# 10. Epic 03 — Teacher Experience

## US-TEACHER-001 — Create Teacher Profile

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-TEACHER-001`

### User Story

> As a teacher, I want to have a teacher profile so that I can manage my teaching activities on SyllabAI.

### Acceptance Criteria

```text
Given a teacher account exists

When the teacher opens the profile

Then a teacher profile should be available and associated with the account.
```

---

## US-TEACHER-002 — Create Subject

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-TEACHER-003`, `FR-SUBJECT-001`

### User Story

> As a teacher, I want to create a subject space so that I can organize learning for my students.

### Acceptance Criteria

```text
Given the teacher is authorized to create subjects

When the teacher submits valid subject information

Then the system should create the subject
and associate it with the authorized teacher.
```

---

## US-TEACHER-003 — Manage Subject

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-TEACHER-004`, `FR-SUBJECT-005`

### User Story

> As a teacher, I want to manage my subject information so that the learning space remains accurate.

### Acceptance Criteria

```text
Given the teacher owns or manages a subject

When the teacher updates permitted information

Then the system should save the changes.
```

---

## US-TEACHER-004 — Create Learning Material

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-TEACHER-005`, `FR-MATERIAL-001`

### User Story

> As a teacher, I want to create learning materials so that students can study from organized resources.

### Acceptance Criteria

```text
Given the teacher has access to a subject

When the teacher creates valid material

Then the material should be associated with that subject.
```

---

## US-TEACHER-005 — Upload PDF

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-TEACHER-006`, `FR-PDF-001`

### User Story

> As a teacher, I want to upload PDF resources so that students can access study documents.

### Acceptance Criteria

```text
Given the teacher is authorized to add resources

When the teacher uploads a valid PDF

Then the system should validate and store the PDF
and associate it with the selected subject or material.
```

---

## US-TEACHER-006 — Create Assignment

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-TEACHER-008`, `FR-ASSIGNMENT-001`

### User Story

> As a teacher, I want to create an assignment so that students can complete structured learning work.

### Acceptance Criteria

```text
Given the teacher manages the selected subject

When the teacher submits valid assignment information

Then the system should create the assignment
in the appropriate subject.
```

---

## US-TEACHER-007 — Review Submission

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-TEACHER-009`, `FR-SUBMISSION-006`

### User Story

> As a teacher, I want to review student submissions so that I can evaluate their work.

### Acceptance Criteria

```text
Given students have submitted work to an assignment

When the teacher opens the assignment submissions

Then the teacher should be able to view authorized submissions.
```

---

## US-TEACHER-008 — Provide Feedback

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-TEACHER-010`, `FR-SUBMISSION-007`

### User Story

> As a teacher, I want to provide feedback on submissions so that students understand how they performed.

### Acceptance Criteria

```text
Given the teacher can access a submission

When the teacher submits valid feedback

Then the feedback should be stored
and made available according to the visibility rules.
```

---

## US-TEACHER-009 — Create Quiz

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-TEACHER-011`, `FR-QUIZ-001`

### User Story

> As a teacher, I want to create a quiz so that students can assess their understanding.

### Acceptance Criteria

```text
Given the teacher manages a subject

When the teacher creates a valid quiz

Then the system should create the quiz
and associate it with the subject.
```

---

## US-TEACHER-010 — View Student Progress

**Priority:** P1  
**Persona:** Teacher  
**Related Requirements:** `FR-TEACHER-014`, `FR-PROGRESS-006`

### User Story

> As a teacher, I want to view permitted student progress so that I can understand learning activity.

### Acceptance Criteria

```text
Given the teacher has authorized access to student activity

When the teacher opens the progress area

Then the system should display the approved progress information.
```

---

# 11. Epic 04 — Institution Administration

## US-INSTITUTION-001 — Manage Institution Users

**Priority:** P2  
**Persona:** Institution Administrator  
**Related Requirements:** `FR-INSTITUTION-002`

### User Story

> As an institution administrator, I want to manage institution-associated users so that I can maintain accurate institution records.

### Acceptance Criteria

```text
Given the administrator belongs to an authorized institution

When the administrator opens institution user management

Then the administrator should only see users
within the permitted institution boundary.
```

---

## US-INSTITUTION-002 — Manage Institution Teachers

**Priority:** P2  
**Persona:** Institution Administrator  
**Related Requirements:** `FR-INSTITUTION-003`

### User Story

> As an institution administrator, I want to manage institution-associated teachers so that teaching assignments can be maintained.

---

## US-INSTITUTION-003 — Manage Institution Students

**Priority:** P2  
**Persona:** Institution Administrator  
**Related Requirements:** `FR-INSTITUTION-004`

### User Story

> As an institution administrator, I want to manage institution-associated students so that student records remain organized.

---

## US-INSTITUTION-004 — View Institution Subjects

**Priority:** P2  
**Persona:** Institution Administrator  
**Related Requirements:** `FR-INSTITUTION-005`

### User Story

> As an institution administrator, I want to view institution-associated subjects so that I can maintain appropriate oversight.

---

# 12. Epic 05 — Platform Administration

## US-ADMIN-001 — Manage Users

**Priority:** P0  
**Persona:** Platform Administrator  
**Related Requirements:** `FR-ADMIN-001`

### User Story

> As a platform administrator, I want to manage user accounts so that I can operate the platform safely.

### Acceptance Criteria

```text
Given the administrator has the required permission

When the administrator opens user management

Then the administrator should be able to perform approved user-management actions.
```

---

## US-ADMIN-002 — Manage Roles

**Priority:** P0  
**Persona:** Platform Administrator  
**Related Requirements:** `FR-ADMIN-002`

### User Story

> As a platform administrator, I want to manage user roles so that users receive appropriate permissions.

---

## US-ADMIN-003 — Manage Account Status

**Priority:** P0  
**Persona:** Platform Administrator  
**Related Requirements:** `FR-ADMIN-003`

### User Story

> As a platform administrator, I want to manage account states so that problematic or inactive accounts can be controlled.

---

## US-ADMIN-004 — Moderate Content

**Priority:** P0  
**Persona:** Platform Administrator  
**Related Requirements:** `FR-ADMIN-004`, `FR-MODERATION-001`

### User Story

> As a platform administrator, I want to review and moderate content so that the platform remains safe and appropriately managed.

### Acceptance Criteria

```text
Given content requires moderation

When an authorized administrator reviews it

Then the administrator should be able to perform approved moderation actions.
```

---

## US-ADMIN-005 — View Administrative Activity

**Priority:** P1  
**Persona:** Platform Administrator  
**Related Requirements:** `FR-ADMIN-008`, `FR-AUDIT-002`

### User Story

> As a platform administrator, I want important administrative actions to be auditable so that operational activity can be reviewed.

---

# 13. Epic 06 — Profiles

## US-PROFILE-001 — View Profile

**Priority:** P0  
**Persona:** All Users  
**Related Requirements:** `FR-PROFILE-001`

### User Story

> As a user, I want to view my profile so that I can confirm my account information.

---

## US-PROFILE-002 — Update Profile

**Priority:** P0  
**Persona:** All Users  
**Related Requirements:** `FR-PROFILE-002`

### User Story

> As a user, I want to update my permitted profile information so that my account remains current.

---

## US-PROFILE-003 — Update Profile Image

**Priority:** P2  
**Persona:** Student / Teacher  
**Related Requirements:** `FR-PROFILE-003`

### User Story

> As a user, I want to update my profile image so that my profile can be recognizable to authorized users.

---

# 14. Epic 07 — Subject Spaces

## US-SUBJECT-001 — Create Subject

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-SUBJECT-001`

### User Story

> As a teacher, I want to create a subject space so that I can organize learning content.

---

## US-SUBJECT-002 — Edit Subject

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-SUBJECT-005`

### User Story

> As a teacher, I want to edit my subject information so that students see accurate subject details.

---

## US-SUBJECT-003 — Associate Resource With Subject

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-SUBJECT-008`

### User Story

> As a teacher, I want to associate learning resources with a subject so that students can find relevant material in the correct place.

---

## US-SUBJECT-004 — Access Subject

**Priority:** P0  
**Persona:** Student  
**Related Requirements:** `FR-SUBJECT-007`

### User Story

> As a student, I want to open a subject I am authorized to access so that I can study its content.

---

## US-SUBJECT-005 — Archive Subject

**Priority:** P2  
**Persona:** Teacher  
**Related Requirements:** `FR-SUBJECT-006`

### User Story

> As a teacher, I want to archive an old subject so that inactive learning spaces do not remain unnecessarily active.

---

# 15. Epic 08 — Learning Materials

## US-MATERIAL-001 — Create Material

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-MATERIAL-001`

### User Story

> As a teacher, I want to create learning material so that I can provide structured resources to students.

---

## US-MATERIAL-002 — Publish Material

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-MATERIAL-005`

### User Story

> As a teacher, I want to publish learning material so that authorized students can access it.

---

## US-MATERIAL-003 — Save Material as Draft

**Priority:** P1  
**Persona:** Teacher  
**Related Requirements:** `FR-MATERIAL-006`

### User Story

> As a teacher, I want to save material as a draft so that I can prepare it before publishing.

---

## US-MATERIAL-004 — Update Material

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-MATERIAL-007`

### User Story

> As a teacher, I want to update learning material so that students receive accurate information.

---

## US-MATERIAL-005 — Archive Material

**Priority:** P2  
**Persona:** Teacher  
**Related Requirements:** `FR-MATERIAL-008`

### User Story

> As a teacher, I want to archive outdated material so that the active learning space remains organized.

---

## US-MATERIAL-006 — Access Published Material

**Priority:** P0  
**Persona:** Student  
**Related Requirements:** `FR-MATERIAL-009`

### User Story

> As a student, I want to access published learning materials so that I can study from teacher-provided resources.

---

# 16. Epic 09 — PDF Resources

## US-PDF-001 — Upload PDF

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-PDF-001`, `FR-PDF-002`

### User Story

> As a teacher, I want to upload a PDF so that I can provide document-based study resources.

### Acceptance Criteria

```text
Given the teacher is authorized to upload resources

When the teacher selects a valid PDF within the configured size limit

Then the system should validate and store the PDF.
```

```text
Given the selected file is not an approved PDF

When the teacher attempts to upload it

Then the system should reject the file.
```

---

## US-PDF-002 — View PDF

**Priority:** P0  
**Persona:** Student  
**Related Requirements:** `FR-PDF-006`

### User Story

> As a student, I want to view an authorized PDF so that I can study the provided material.

---

## US-PDF-003 — Download PDF

**Priority:** P1  
**Persona:** Student  
**Related Requirements:** `FR-PDF-006`

### User Story

> As a student, I want to download an authorized PDF when downloads are permitted so that I can study it later.

---

## US-PDF-004 — Protect PDF Access

**Priority:** P0  
**Persona:** Student / Teacher  
**Related Requirements:** `FR-PDF-007`

### User Story

> As a content owner, I want protected PDFs to be accessible only to authorized users so that educational resources are not exposed improperly.

---

# 17. Epic 10 — Video Resources

## US-VIDEO-001 — Add Video Resource

**Priority:** P2  
**Persona:** Teacher  
**Related Requirements:** `FR-VIDEO-001`, `FR-VIDEO-004`

### User Story

> As a teacher, I want to add an approved video resource so that students can learn through video content.

---

## US-VIDEO-002 — Access Video

**Priority:** P2  
**Persona:** Student  
**Related Requirements:** `FR-VIDEO-006`

### User Story

> As a student, I want to access an authorized video resource so that I can learn through video.

---

# 18. Epic 11 — Assignments

## US-ASSIGNMENT-001 — Create Assignment

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-ASSIGNMENT-001`

### User Story

> As a teacher, I want to create an assignment so that students can complete structured work.

---

## US-ASSIGNMENT-002 — Set Due Date

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-ASSIGNMENT-005`

### User Story

> As a teacher, I want to set an assignment due date so that students know when their work is expected.

---

## US-ASSIGNMENT-003 — Save Assignment Draft

**Priority:** P1  
**Persona:** Teacher  
**Related Requirements:** `FR-ASSIGNMENT-006`

### User Story

> As a teacher, I want to save an assignment as a draft so that I can complete it before publishing.

---

## US-ASSIGNMENT-004 — Publish Assignment

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-ASSIGNMENT-007`

### User Story

> As a teacher, I want to publish an assignment so that authorized students can access it.

---

## US-ASSIGNMENT-005 — View Assignment

**Priority:** P0  
**Persona:** Student  
**Related Requirements:** `FR-ASSIGNMENT-008`

### User Story

> As a student, I want to view published assignments so that I know what work I need to complete.

---

## US-ASSIGNMENT-006 — Update Assignment

**Priority:** P1  
**Persona:** Teacher  
**Related Requirements:** `FR-ASSIGNMENT-009`

### User Story

> As a teacher, I want to update an assignment according to its lifecycle rules so that students receive accurate instructions.

---

# 19. Epic 12 — Assignment Submissions

## US-SUBMISSION-001 — Submit Assignment

**Priority:** P0  
**Persona:** Student  
**Related Requirements:** `FR-SUBMISSION-001`

### User Story

> As a student, I want to submit my assignment so that my teacher can review my work.

---

## US-SUBMISSION-002 — View Submission Status

**Priority:** P0  
**Persona:** Student  
**Related Requirements:** `FR-SUBMISSION-004`

### User Story

> As a student, I want to see my assignment submission status so that I know whether my work has been submitted.

---

## US-SUBMISSION-003 — Resubmit Assignment

**Priority:** P2  
**Persona:** Student  
**Related Requirements:** `FR-SUBMISSION-005`

### User Story

> As a student, I want to resubmit an assignment when permitted so that I can correct or improve my work.

---

## US-SUBMISSION-004 — Review Student Submission

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-SUBMISSION-006`

### User Story

> As a teacher, I want to review student submissions so that I can evaluate completed assignments.

---

## US-SUBMISSION-005 — Give Submission Feedback

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-SUBMISSION-007`

### User Story

> As a teacher, I want to provide feedback on student submissions so that students understand their strengths and areas for improvement.

---

## US-SUBMISSION-006 — Record Assignment Result

**Priority:** P1  
**Persona:** Teacher  
**Related Requirements:** `FR-SUBMISSION-008`

### User Story

> As a teacher, I want to record an assignment result when grading is enabled so that student performance can be tracked.

---

# 20. Epic 13 — Quizzes

## US-QUIZ-001 — Create Quiz

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-QUIZ-001`

### User Story

> As a teacher, I want to create a quiz so that students can assess their understanding.

---

## US-QUIZ-002 — Add Multiple Choice Question

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-QUIZ-005`, `FR-QUIZ-006`

### User Story

> As a teacher, I want to add multiple-choice questions so that I can create objective assessments.

---

## US-QUIZ-003 — Configure Correct Answer

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-QUIZ-007`

### User Story

> As a teacher, I want to define the correct answer so that the system can score objective questions automatically.

---

## US-QUIZ-004 — Publish Quiz

**Priority:** P0  
**Persona:** Teacher  
**Related Requirements:** `FR-QUIZ-008`

### User Story

> As a teacher, I want to publish a quiz so that authorized students can attempt it.

---

## US-QUIZ-005 — Attempt Quiz

**Priority:** P0  
**Persona:** Student  
**Related Requirements:** `FR-QUIZ-010`

### User Story

> As a student, I want to attempt a published quiz so that I can test my knowledge.

---

## US-QUIZ-006 — Submit Quiz

**Priority:** P0  
**Persona:** Student  
**Related Requirements:** `FR-QUIZ-012`

### User Story

> As a student, I want to submit my quiz attempt so that my answers can be evaluated.

---

## US-QUIZ-007 — Receive Automatic Result

**Priority:** P0  
**Persona:** Student  
**Related Requirements:** `FR-QUIZ-013`, `FR-QUIZ-014`

### User Story

> As a student, I want my objective quiz answers to be scored automatically so that I can see my result efficiently.

---

## US-QUIZ-008 — Configure Attempt Limit

**Priority:** P2  
**Persona:** Teacher  
**Related Requirements:** `FR-QUIZ-015`

### User Story

> As a teacher, I want to configure the number of allowed quiz attempts so that assessment rules are controlled.

---

## US-QUIZ-009 — Configure Quiz Availability

**Priority:** P2  
**Persona:** Teacher  
**Related Requirements:** `FR-QUIZ-016`

### User Story

> As a teacher, I want to define when a quiz is available so that students can attempt it during the intended period.

---

# 21. Epic 14 — AI Learning Assistant

## US-AI-001 — Ask AI Learning Question

**Priority:** P0  
**Persona:** Student  
**Related Requirements:** `FR-AI-001`

### User Story

> As a student, I want to ask the AI learning assistant a question so that I can receive additional study support.

### Acceptance Criteria

```text
Given the student is authorized to use the AI assistant

When the student submits a valid educational question

Then the system should send the request for AI processing
and return the response when available.
```

---

## US-AI-002 — Receive AI Response

**Priority:** P0  
**Persona:** Student  
**Related Requirements:** `FR-AI-003`

### User Story

> As a student, I want to receive an AI-generated response so that I can continue learning without manually searching multiple sources.

---

## US-AI-003 — Use Subject Context

**Priority:** P1  
**Persona:** Student  
**Related Requirements:** `FR-AI-006`

### User Story

> As a student, I want the AI assistant to understand the subject context so that its explanations are more relevant to what I am studying.

---

## US-AI-004 — Ask About Learning Material

**Priority:** P1  
**Persona:** Student  
**Related Requirements:** `FR-AI-007`

### User Story

> As a student, I want to ask questions about authorized learning materials so that I can better understand the resources provided in my subject.

---

## US-AI-005 — Maintain AI Conversation Context

**Priority:** P2  
**Persona:** Student  
**Related Requirements:** `FR-AI-008`

### User Story

> As a student, I want the AI assistant to understand the context of my recent questions so that I can have a coherent learning conversation.

---

## US-AI-006 — Handle AI Failure

**Priority:** P0  
**Persona:** Student  
**Related Requirements:** `FR-AI-005`

### User Story

> As a student, I want to know when the AI assistant is temporarily unavailable so that I understand why I did not receive a response.

### Acceptance Criteria

```text
Given the AI service is unavailable

When the student submits a question

Then the system should display an understandable failure state
without exposing internal technical details.
```

---

## US-AI-007 — Protect AI Context

**Priority:** P0  
**Persona:** Student / Teacher  
**Related Requirements:** `FR-AI-013`

### User Story

> As a user, I want AI responses to use only resources I am authorized to access so that private educational content remains protected.

---

# 22. Epic 15 — Notifications

## US-NOTIFICATION-001 — Receive Assignment Notification

**Priority:** P2  
**Persona:** Student  
**Related Requirements:** `FR-NOTIFICATION-002`

### User Story

> As a student, I want to receive a notification when a relevant assignment is published so that I do not miss required work.

---

## US-NOTIFICATION-002 — Receive Quiz Notification

**Priority:** P2  
**Persona:** Student  
**Related Requirements:** `FR-NOTIFICATION-003`

### User Story

> As a student, I want to receive relevant quiz notifications so that I know when an assessment is available.

---

## US-NOTIFICATION-003 — Receive Feedback Notification

**Priority:** P2  
**Persona:** Student  
**Related Requirements:** `FR-NOTIFICATION-004`

### User Story

> As a student, I want to know when assignment feedback is available so that I can review my teacher's comments.

---

## US-NOTIFICATION-004 — View Notifications

**Priority:** P2  
**Persona:** All Users  
**Related Requirements:** `FR-NOTIFICATION-006`

### User Story

> As a user, I want to view my notifications so that I can keep track of important updates.

---

## US-NOTIFICATION-005 — Mark Notification Read

**Priority:** P2  
**Persona:** All Users  
**Related Requirements:** `FR-NOTIFICATION-007`

### User Story

> As a user, I want to mark a notification as read so that I can distinguish new updates from information I have already seen.

---

# 23. Epic 16 — Learning Progress

## US-PROGRESS-001 — Record Learning Activity

**Priority:** P0  
**Persona:** System / Student  
**Related Requirements:** `FR-PROGRESS-001`

### User Story

> As a student, I want my relevant learning activities to be recorded so that SyllabAI can show my progress.

---

## US-PROGRESS-002 — View Assignment Progress

**Priority:** P0  
**Persona:** Student  
**Related Requirements:** `FR-PROGRESS-002`

### User Story

> As a student, I want to see my assignment completion status so that I know what work remains.

---

## US-PROGRESS-003 — View Quiz Performance

**Priority:** P0  
**Persona:** Student  
**Related Requirements:** `FR-PROGRESS-003`

### User Story

> As a student, I want to see my quiz results so that I can understand my assessment performance.

---

## US-PROGRESS-004 — View Subject Progress

**Priority:** P1  
**Persona:** Student  
**Related Requirements:** `FR-PROGRESS-004`

### User Story

> As a student, I want to see basic progress for each subject so that I can understand where I am in my learning.

---

## US-PROGRESS-005 — Teacher Views Student Progress

**Priority:** P1  
**Persona:** Teacher  
**Related Requirements:** `FR-PROGRESS-006`

### User Story

> As a teacher, I want to view permitted student progress so that I can understand learning activity and provide appropriate support.

---

# 24. Epic 17 — Search and Discovery

## US-SEARCH-001 — Search Learning Resources

**Priority:** P2  
**Persona:** Student / Teacher  
**Related Requirements:** `FR-SEARCH-001`

### User Story

> As a user, I want to search learning resources so that I can find relevant study content quickly.

---

## US-SEARCH-002 — Search Subjects

**Priority:** P2  
**Persona:** Student / Teacher  
**Related Requirements:** `FR-SEARCH-002`

### User Story

> As a user, I want to find accessible subjects so that I can quickly reach the learning spaces I need.

---

## US-SEARCH-003 — Filter Search Results

**Priority:** P2  
**Persona:** Student / Teacher  
**Related Requirements:** `FR-SEARCH-004`

### User Story

> As a user, I want to filter search results so that I can narrow down relevant resources.

---

# 25. Epic 18 — Content Moderation

## US-MODERATION-001 — Review Content

**Priority:** P0  
**Persona:** Platform Administrator  
**Related Requirements:** `FR-MODERATION-001`

### User Story

> As a platform administrator, I want to review content that requires moderation so that I can manage platform safety and quality.

---

## US-MODERATION-002 — Take Moderation Action

**Priority:** P0  
**Persona:** Platform Administrator  
**Related Requirements:** `FR-MODERATION-002`

### User Story

> As a platform administrator, I want to approve, hide, remove, restrict, or escalate content according to policy so that inappropriate content can be handled.

---

## US-MODERATION-003 — Audit Moderation Action

**Priority:** P0  
**Persona:** Platform Administrator  
**Related Requirements:** `FR-MODERATION-004`

### User Story

> As a platform administrator, I want moderation actions to be recorded so that content decisions can be audited.

---

# 26. Epic 19 — Platform Operations

## US-OPS-001 — Record Security Events

**Priority:** P0  
**Persona:** Platform Administrator / System  
**Related Requirements:** `FR-AUDIT-001`

### User Story

> As a platform administrator, I want important security events to be recorded so that suspicious or important activity can be investigated.

---

## US-OPS-002 — Record Administrative Events

**Priority:** P0  
**Persona:** Platform Administrator / System  
**Related Requirements:** `FR-AUDIT-002`

### User Story

> As a platform administrator, I want important administrative actions to be recorded so that platform operations are auditable.

---

## US-OPS-003 — Handle System Errors

**Priority:** P0  
**Persona:** All Users  
**Related Requirements:** `FR-ERROR-001`, `FR-ERROR-004`

### User Story

> As a user, I want the system to handle errors clearly so that I understand when an operation fails and what I can do next.

---

# 27. Cross-Epic User Stories

## US-CROSS-001 — Secure Resource Access

**Priority:** P0  
**Persona:** All Users  
**Related Requirements:** `FR-AUTHZ-001`, `FR-AUTHZ-002`, `FR-AUTHZ-003`

### User Story

> As a SyllabAI user, I want the platform to enforce access permissions on every protected resource so that my data and educational content remain secure.

### Acceptance Criteria

```text
Given a user requests a protected resource

When the system evaluates the request

Then the system should verify the user's permission
before returning or modifying the resource.
```

---

## US-CROSS-002 — Responsive Learning Experience

**Priority:** P1  
**Persona:** Student / Teacher  
**Related NFRs:** `NFR-PERF-001`, `NFR-USAB-006`

### User Story

> As a user, I want SyllabAI to respond quickly and work across common screen sizes so that I can use it comfortably during study or teaching.

---

## US-CROSS-003 — Accessible Learning

**Priority:** P1  
**Persona:** All Users  
**Related NFRs:** `NFR-ACC-001` through `NFR-ACC-009`

### User Story

> As a user with accessibility needs, I want core SyllabAI workflows to be accessible so that I can use the platform independently.

---

# 28. Epic-to-Requirement Traceability

| Epic | Primary Requirements |
|---|---|
| Authentication | `FR-AUTH-*` |
| Student | `FR-STUDENT-*` |
| Teacher | `FR-TEACHER-*` |
| Institution | `FR-INSTITUTION-*` |
| Administration | `FR-ADMIN-*` |
| Profiles | `FR-PROFILE-*` |
| Subjects | `FR-SUBJECT-*` |
| Materials | `FR-MATERIAL-*` |
| PDF | `FR-PDF-*` |
| Video | `FR-VIDEO-*` |
| Assignments | `FR-ASSIGNMENT-*` |
| Submissions | `FR-SUBMISSION-*` |
| Quizzes | `FR-QUIZ-*` |
| AI | `FR-AI-*` |
| Notifications | `FR-NOTIFICATION-*` |
| Progress | `FR-PROGRESS-*` |
| Search | `FR-SEARCH-*` |
| Moderation | `FR-MODERATION-*` |
| Operations | `FR-AUDIT-*`, `FR-ERROR-*` |

---

# 29. MVP User Story Set

The MVP should prioritize stories required to demonstrate the core learning workflow.

## P0 Core Stories

```text
US-AUTH-001
US-AUTH-003
US-AUTH-004
US-AUTH-006

US-STUDENT-003
US-STUDENT-004
US-STUDENT-005
US-STUDENT-006
US-STUDENT-007

US-TEACHER-002
US-TEACHER-004
US-TEACHER-005
US-TEACHER-006
US-TEACHER-007
US-TEACHER-008
US-TEACHER-009

US-SUBJECT-001
US-SUBJECT-003
US-SUBJECT-004

US-MATERIAL-001
US-MATERIAL-002
US-MATERIAL-006

US-PDF-001
US-PDF-002
US-PDF-004

US-ASSIGNMENT-001
US-ASSIGNMENT-002
US-ASSIGNMENT-004
US-ASSIGNMENT-005

US-SUBMISSION-001
US-SUBMISSION-002
US-SUBMISSION-004
US-SUBMISSION-005

US-QUIZ-001
US-QUIZ-002
US-QUIZ-003
US-QUIZ-004
US-QUIZ-005
US-QUIZ-006
US-QUIZ-007

US-AI-001
US-AI-002
US-AI-006
US-AI-007

US-PROGRESS-001
US-PROGRESS-002
US-PROGRESS-003

US-ADMIN-001
US-ADMIN-002
US-ADMIN-003
US-ADMIN-004

US-MODERATION-001
US-MODERATION-002
US-MODERATION-003

US-OPS-001
US-OPS-002
US-OPS-003

US-CROSS-001
```

This is the initial MVP candidate set and must be validated against the final product scope and team capacity before sprint planning.

---

# 30. User Story Dependency Map

The major dependency flow is:

```text
US-AUTH-001 / US-AUTH-003
          ↓
US-AUTH-006
          ↓
US-PROFILE-001
          ↓
US-SUBJECT-001
          ↓
US-MATERIAL-001
          ↓
US-PDF-001
          ↓
US-ASSIGNMENT-001
          ↓
US-SUBMISSION-001
          ↓
US-SUBMISSION-004
          ↓
US-SUBMISSION-005
          ↓
US-QUIZ-001
          ↓
US-QUIZ-005
          ↓
US-QUIZ-007
          ↓
US-AI-001
          ↓
US-PROGRESS-001
```

This is a logical dependency map rather than a mandatory implementation sequence.

---

# 31. User Story to Development Task

Each story should be broken into implementation tasks.

Example:

```text
US-SUBJECT-001
Create Subject

        ↓

Tasks

1. Design subject data model
2. Create database migration
3. Implement subject API
4. Implement authorization
5. Implement teacher subject form
6. Implement subject creation UI
7. Add validation
8. Add unit tests
9. Add API tests
10. Add UI/integration tests
11. Update documentation
```

---

# 32. User Story to Test Case

Each accepted story should produce one or more test cases.

Example:

```text
User Story:
US-SUBJECT-001

        ↓

Test Case:
TC-SUBJECT-001

Given:
An authenticated teacher with subject-creation permission

When:
The teacher submits valid subject information

Then:
A subject is created and associated with the teacher.
```

---

# 33. User Story to Bug Traceability

Defects should reference the affected user story.

Example:

```text
BUG-SUBJECT-001

Affected Story:
US-SUBJECT-001

Problem:
Teacher receives an error when creating a valid subject.

Severity:
High

Status:
Open
```

The traceability chain becomes:

```text
User Story
    ↓
Task
    ↓
Code
    ↓
Test
    ↓
Bug
    ↓
Fix
    ↓
Regression Test
```

---

# 34. Definition of Ready

A user story should be considered **Ready for Development** when:

- [ ] Story has a unique ID.
- [ ] User/actor is identified.
- [ ] User value is clear.
- [ ] Acceptance criteria are defined.
- [ ] Related requirement is identified.
- [ ] Dependencies are understood.
- [ ] Scope is confirmed.
- [ ] Priority is assigned.
- [ ] Required UI/UX behavior is sufficiently understood.
- [ ] Technical blockers are known.
- [ ] QA can understand how the story will be tested.
- [ ] Product Owner has approved the story for development.

---

# 35. Definition of Done

A user story should be considered **Done** only when:

- [ ] Acceptance criteria pass.
- [ ] Code is implemented.
- [ ] Code review is completed.
- [ ] Automated tests are added where appropriate.
- [ ] Relevant QA tests pass.
- [ ] Security/authorization behavior is verified.
- [ ] No unresolved critical defect remains.
- [ ] Documentation is updated where required.
- [ ] The feature is integrated into the intended release branch.
- [ ] Product Owner accepts the completed story.

---

# 36. Backlog Refinement Process

The backlog should be refined continuously before sprint planning.

Recommended process:

```text
Review Story
    ↓
Clarify Requirement
    ↓
Check Acceptance Criteria
    ↓
Identify Dependencies
    ↓
Estimate Complexity
    ↓
Identify Risks
    ↓
Split if Too Large
    ↓
Assign Priority
    ↓
Ready for Sprint
```

---

# 37. Story Splitting Rules

A story should be split when it:

- Is too large for one sprint
- Contains multiple independent outcomes
- Has too many acceptance criteria
- Requires unrelated technical work
- Cannot be reasonably estimated
- Contains multiple user goals

Example:

Instead of:

> As a teacher, I want to create and manage a complete course with PDFs, videos, quizzes, assignments, grading, analytics, and AI.

Split into:

```text
Create Subject
Create Material
Upload PDF
Add Video
Create Assignment
Review Submission
Create Quiz
View Results
Use AI
View Progress
```

---

# 38. Backlog Prioritization

Priority should consider:

1. User value
2. MVP necessity
3. Dependency
4. Risk reduction
5. Technical feasibility
6. Security importance
7. Learning/validation value
8. Development effort

A technically easy feature should not automatically receive a higher priority than a critical user workflow.

---

# 39. Initial Backlog Summary

| Epic | P0 | P1 | P2 | P3/Future |
|---|---:|---:|---:|---:|
| Authentication | 4 | 1 | 0 | 0 |
| Student | 5 | 3 | 0 | 0 |
| Teacher | 6 | 4 | 0 | 0 |
| Institution | 0 | 0 | 4 | 0 |
| Administration | 4 | 1 | 0 | 0 |
| Profiles | 2 | 0 | 1 | 0 |
| Subjects | 4 | 0 | 1 | 0 |
| Materials | 3 | 2 | 1 | 0 |
| PDF | 3 | 1 | 0 | 0 |
| Video | 0 | 0 | 2 | 0 |
| Assignments | 4 | 2 | 0 | 0 |
| Submissions | 4 | 1 | 1 | 0 |
| Quizzes | 7 | 0 | 2 | 0 |
| AI | 3 | 2 | 2 | 0 |
| Notifications | 0 | 0 | 5 | 0 |
| Progress | 3 | 2 | 0 | 0 |
| Search | 0 | 0 | 3 | 0 |
| Moderation | 3 | 0 | 0 | 0 |
| Operations | 3 | 0 | 0 | 0 |
| Cross-functional | 1 | 2 | 0 | 0 |

Counts are initial planning values and may change during backlog refinement.

---

# 40. Open User Story Questions

The following questions must be resolved during backlog refinement:

1. What exact registration method is mandatory?
2. Is mobile-number verification mandatory for MVP?
3. How are students enrolled into subjects?
4. Can teachers directly invite students?
5. Can students request access to subjects?
6. Can students create personal/private study spaces?
7. Which resource types are required for MVP?
8. What assignment submission formats are required?
9. Will assignment grading be numerical, qualitative, or both?
10. Which quiz question types are required?
11. How many attempts are allowed for quizzes?
12. Should students see explanations after quiz submission?
13. What AI features are mandatory for MVP?
14. Should AI answer only from authorized materials?
15. Should AI conversation history be persistent?
16. Which notification channels are required?
17. What progress information is most important to students?
18. What progress information is most important to teachers?
19. Which institution features are actually required in MVP?
20. Which admin actions need additional approval?
21. What exact moderation policy will be used?
22. Which search capabilities are required?
23. Which stories must be completed before MVP validation?
24. What is the maximum acceptable story size for a sprint?

---

# 41. Backlog Governance

The Product Owner is responsible for maintaining the product backlog.

Responsibilities include:

- Prioritization
- Story clarification
- Acceptance criteria
- Stakeholder alignment
- Scope control
- Backlog refinement
- Release planning

The Technical Lead supports:

- Feasibility analysis
- Dependencies
- Technical risks
- Estimates
- Architecture implications

QA supports:

- Testability
- Acceptance criteria
- Quality risks
- Test coverage

Developers support:

- Technical decomposition
- Estimates
- Implementation risks
- Task breakdown

---

# 42. User Story Change Control

A major change to a story should not silently change the underlying requirement.

If a story changes significantly:

```text
User Story Change
      ↓
Requirement Impact Check
      ↓
Scope Impact Check
      ↓
Acceptance Criteria Update
      ↓
Technical Impact Review
      ↓
Backlog Update
      ↓
Approval
```

If the change expands product scope, the relevant scope and requirements documents must also be updated.

---

# 43. Release Traceability

Each release should be able to answer:

```text
Why was this feature built?
        ↓
Which user story?
        ↓
Which requirement?
        ↓
Which product problem?
        ↓
Which user/persona?
        ↓
Which test verifies it?
        ↓
Was it accepted?
```

This provides professional requirements traceability.

---

# 44. Approval

| Role | Name | Decision | Signature | Date |
|---|---|---|---|---|
| Project Sponsor | TBD | Pending | TBD | TBD |
| Product Owner | TBD | Pending | TBD | TBD |
| Project Manager | TBD | Pending | TBD | TBD |
| Technical Lead | TBD | Pending | TBD | TBD |
| QA Lead | TBD | Pending | TBD | TBD |

---

# 45. Revision History

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | 2026-10-03 | SyllabAI Team | Initial user story backlog draft |
| 1.0 | 2026-10-03 | SyllabAI Team | Initial backlog baseline candidate |

---

# 46. Document Status

**Document:** `10-user-stories.md`

**Document ID:** `SAB-DOC-010`

**Current Status:** Draft — Initial Backlog Baseline Candidate

**Previous Document:** `09-non-functional-requirements.md`

**Next Document:** `11-use-cases.md`

**SDLC Stage:** Requirements Engineering / Product Backlog

**Development Status:** No production coding yet

**Core Principle:**

> **Every significant feature should be expressed as a user-centered story with clear acceptance criteria before it becomes implementation work.**
