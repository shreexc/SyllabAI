# SyllabAI — Use Case Specification

## Document Control

| Field | Details |
|---|---|
| Document ID | SAB-DOC-011 |
| Document Name | Use Case Specification |
| File Name | `11-use-cases.md` |
| Product | SyllabAI |
| Document Type | Use Case / Behavioral Requirements |
| SDLC Stage | Requirements Engineering |
| Status | Draft — Use Case Baseline Candidate |
| Version | 1.0 |
| Previous Document | `10-user-stories.md` |
| Next Document | `12-system-architecture.md` |
| Development Status | No production coding yet |
| Product Owner | TBD |
| Project Manager | TBD |
| Technical Lead | TBD |
| QA Lead | TBD |
| Prepared By | SyllabAI Team |
| Last Updated | 2026-10-03 |

---

# 1. Purpose

This document defines the major behavioral use cases of SyllabAI.

Use cases describe how actors interact with the system to achieve a meaningful goal.

They convert requirements and user stories into structured system interactions:

```text
Problem
   ↓
Requirement
   ↓
User Story
   ↓
Use Case
   ↓
System Behavior
   ↓
Test Scenario
```

The use-case specification is intended to support:

- Requirements clarification
- UX design
- API design
- Architecture decisions
- Database design
- Development planning
- QA test design
- Acceptance testing
- Defect analysis

---

# 2. Use Case Standard

Each major use case should contain:

- Use Case ID
- Name
- Goal
- Primary Actor
- Supporting Actors
- Preconditions
- Trigger
- Main Flow
- Alternative Flows
- Exception Flows
- Postconditions
- Business Rules
- Related Requirements
- Related User Stories
- Notes

---

# 3. Use Case ID Convention

| Domain | Prefix |
|---|---|
| Authentication | `UC-AUTH-xxx` |
| Student | `UC-STUDENT-xxx` |
| Teacher | `UC-TEACHER-xxx` |
| Institution | `UC-INSTITUTION-xxx` |
| Administration | `UC-ADMIN-xxx` |
| Profile | `UC-PROFILE-xxx` |
| Subject | `UC-SUBJECT-xxx` |
| Materials | `UC-MATERIAL-xxx` |
| PDF | `UC-PDF-xxx` |
| Assignment | `UC-ASSIGNMENT-xxx` |
| Submission | `UC-SUBMISSION-xxx` |
| Quiz | `UC-QUIZ-xxx` |
| AI | `UC-AI-xxx` |
| Notification | `UC-NOTIFICATION-xxx` |
| Progress | `UC-PROGRESS-xxx` |
| Search | `UC-SEARCH-xxx` |
| Moderation | `UC-MODERATION-xxx` |
| Operations | `UC-OPS-xxx` |

---

# 4. Actor Catalogue

| Actor ID | Actor | Description |
|---|---|---|
| ACT-001 | Student | Primary learner using SyllabAI |
| ACT-002 | Teacher | Creates and manages educational content |
| ACT-003 | Institution Administrator | Manages institution-associated users/resources |
| ACT-004 | Platform Administrator | Manages the overall platform |
| ACT-005 | Authentication Service | Handles approved authentication/verification operations |
| ACT-006 | AI Service | Processes approved AI requests |
| ACT-007 | File Storage Service | Stores and retrieves educational files |
| ACT-008 | Notification Service | Delivers supported notifications |
| ACT-009 | Database | Persists application data |
| ACT-010 | External Video Provider | Provides approved external video content |

---

# 5. Use Case Overview

| ID | Use Case | Primary Actor | MVP |
|---|---|---|---|
| UC-AUTH-001 | Student Registration | Student | Yes |
| UC-AUTH-002 | User Login | User | Yes |
| UC-AUTH-003 | User Logout | User | Yes |
| UC-AUTH-004 | Verify Mobile Number | User | Conditional |
| UC-AUTH-005 | Password Reset | User | Conditional |
| UC-AUTH-006 | Authorization Check | System | Yes |
| UC-PROFILE-001 | Manage Profile | User | Yes |
| UC-SUBJECT-001 | Create Subject | Teacher | Yes |
| UC-SUBJECT-002 | Manage Subject | Teacher | Yes |
| UC-SUBJECT-003 | Access Subject | Student | Yes |
| UC-MATERIAL-001 | Create Learning Material | Teacher | Yes |
| UC-MATERIAL-002 | Publish Material | Teacher | Yes |
| UC-PDF-001 | Upload PDF | Teacher | Yes |
| UC-PDF-002 | Access PDF | Student | Yes |
| UC-ASSIGNMENT-001 | Create Assignment | Teacher | Yes |
| UC-ASSIGNMENT-002 | Publish Assignment | Teacher | Yes |
| UC-ASSIGNMENT-003 | View Assignment | Student | Yes |
| UC-SUBMISSION-001 | Submit Assignment | Student | Yes |
| UC-SUBMISSION-002 | Review Submission | Teacher | Yes |
| UC-SUBMISSION-003 | Provide Feedback | Teacher | Yes |
| UC-QUIZ-001 | Create Quiz | Teacher | Yes |
| UC-QUIZ-002 | Publish Quiz | Teacher | Yes |
| UC-QUIZ-003 | Attempt Quiz | Student | Yes |
| UC-QUIZ-004 | Submit Quiz | Student | Yes |
| UC-QUIZ-005 | Generate Quiz Result | System | Yes |
| UC-AI-001 | Ask AI Question | Student | Yes |
| UC-AI-002 | Use Learning Context | Student | Candidate |
| UC-AI-003 | Handle AI Failure | System | Yes |
| UC-PROGRESS-001 | Record Learning Activity | System | Yes |
| UC-PROGRESS-002 | View Student Progress | Student | Yes |
| UC-PROGRESS-003 | View Learner Progress | Teacher | Candidate |
| UC-NOTIFICATION-001 | Create Notification | System | Candidate |
| UC-NOTIFICATION-002 | View Notifications | User | Candidate |
| UC-ADMIN-001 | Manage Users | Platform Administrator | Yes |
| UC-ADMIN-002 | Manage Roles | Platform Administrator | Yes |
| UC-MODERATION-001 | Moderate Content | Platform Administrator | Yes |
| UC-OPS-001 | Record Audit Event | System | Yes |
| UC-SEARCH-001 | Search Resources | User | Candidate |

---

# 6. UC-AUTH-001 — Student Registration

## Goal

Allow a new student to create a SyllabAI account.

## Primary Actor

Student

## Supporting Actors

- Authentication Service
- Database
- Verification Service where applicable

## Preconditions

- Student does not already have an account using the registration identifier.
- Registration service is available.

## Trigger

Student selects the registration option.

## Main Flow

1. Student opens the registration page.
2. System displays required registration fields.
3. Student enters valid information.
4. Student submits the registration form.
5. System validates the submitted information.
6. System checks for duplicate account identifiers.
7. System creates the account.
8. System assigns the appropriate default role/state.
9. System initiates required verification if applicable.
10. System informs the student of the next step.
11. Student proceeds to verification or authenticated access according to the approved authentication design.

## Alternative Flows

### A1 — Mobile Verification Required

1. System creates a pending account.
2. System sends a verification code.
3. Student enters the code.
4. System validates the code.
5. System activates the verified account.

### A2 — Existing Account

1. System detects an existing account.
2. System does not create a duplicate account.
3. System informs the student that the identifier is already associated with an account.

## Exception Flows

### E1 — Invalid Input

1. System rejects invalid data.
2. System identifies the relevant validation errors.
3. Student corrects the information.

### E2 — Database Unavailable

1. System cannot persist the account.
2. System returns a safe error message.
3. No incomplete account should be represented as successfully registered.

### E3 — Verification Service Unavailable

1. Account remains in the appropriate pending state.
2. System informs the student that verification could not be completed.
3. Retry behavior follows the verification policy.

## Postconditions

### Success

- Student account exists.
- Required verification state is recorded.
- Student can continue according to authentication rules.

### Failure

- No unauthorized or inconsistent account is created.

## Related Requirements

- `FR-AUTH-001`
- `FR-AUTH-002`
- `FR-AUTH-004`

## Related User Stories

- `US-AUTH-001`
- `US-AUTH-002`

---

# 7. UC-AUTH-002 — User Login

## Goal

Authenticate a registered user and provide access to authorized SyllabAI functionality.

## Primary Actor

Student / Teacher / Administrator

## Supporting Actors

- Authentication Service
- Database

## Preconditions

- User has an account.
- Account is allowed to authenticate.

## Trigger

User submits login information.

## Main Flow

1. User opens the login page.
2. System requests authentication information.
3. User submits valid information.
4. System validates the request.
5. System locates the account.
6. System verifies the authentication credentials.
7. System verifies account status.
8. System creates the appropriate authentication state.
9. System redirects or returns the user to the appropriate authenticated experience.

## Alternative Flows

### A1 — User Has Multiple Authentication Methods

1. User selects an approved authentication method.
2. System processes the selected method.
3. Successful authentication continues the main flow.

### A2 — Account Requires Verification

1. System identifies the account as unverified.
2. System prevents access to features requiring verification.
3. System directs the user to the verification process.

## Exception Flows

### E1 — Invalid Credentials

1. Authentication fails.
2. System rejects access.
3. System provides a generic authentication error.

### E2 — Account Suspended

1. System detects the suspended state.
2. System denies normal authentication access.
3. System displays the appropriate account-status message.

### E3 — Authentication Service Failure

1. Authentication cannot be completed.
2. System returns a safe failure response.
3. User can retry later.

## Postconditions

- Authenticated user has the correct access state.
- Unauthorized functionality remains inaccessible.

## Related Requirements

- `FR-AUTH-005`
- `FR-AUTH-013`
- `FR-AUTH-014`

## Related User Stories

- `US-AUTH-003`
- `US-AUTH-006`

---

# 8. UC-AUTH-003 — User Logout

## Goal

Terminate the user's active authentication state.

## Primary Actor

Authenticated User

## Preconditions

- User is authenticated.

## Trigger

User selects logout.

## Main Flow

1. User selects logout.
2. System validates the logout request.
3. System invalidates or terminates the appropriate authentication state.
4. System clears applicable client-side authentication state.
5. System redirects the user to a public page.

## Exception Flow

### E1 — Logout Request Failure

The client shall still avoid presenting the user as authenticated locally where safe to do so, while server-side token/session state follows the approved security architecture.

## Postconditions

The user cannot access protected resources using the terminated authentication state.

## Related Requirements

- `FR-AUTH-006`

## Related User Stories

- `US-AUTH-004`

---

# 9. UC-AUTH-004 — Verify Mobile Number

## Goal

Verify ownership of a mobile number.

## Primary Actor

User

## Supporting Actors

- Authentication Service
- Verification/SMS Service
- Database

## Preconditions

- User has started a registration or verification process.
- A verification request exists.

## Trigger

User submits a verification code.

## Main Flow

1. System displays verification interface.
2. User enters the verification code.
3. System validates the code.
4. System checks expiration and attempt rules.
5. System marks the mobile number as verified.
6. System updates the account verification state.

## Alternative Flows

### A1 — Resend Code

1. User requests a new code.
2. System checks resend limits.
3. System generates/sends a new code.
4. Previous code becomes invalid where required.

## Exception Flows

### E1 — Invalid Code

System rejects the code and allows another attempt within configured limits.

### E2 — Expired Code

System rejects the code and instructs the user to request a new code.

### E3 — Rate Limit Exceeded

System temporarily prevents additional verification attempts.

## Related Requirements

- `FR-AUTH-004`

## Related User Stories

- `US-AUTH-002`

---

# 10. UC-AUTH-005 — Password Reset

## Goal

Allow an eligible user to securely regain access after forgetting a password.

## Primary Actor

User

## Supporting Actors

- Authentication Service
- Email/SMS/Verification Service
- Database

## Preconditions

- Password authentication is enabled.
- User has an eligible account.

## Trigger

User selects password reset.

## Main Flow

1. User requests password reset.
2. System validates the request.
3. System initiates the approved verification mechanism.
4. User completes verification.
5. System allows a new password to be created.
6. System validates the new password.
7. System securely stores the new password.
8. System confirms successful reset.

## Exception Flows

- Invalid verification.
- Expired reset token.
- Too many reset attempts.
- Account not eligible for reset.
- External verification service unavailable.

## Related Requirements

- `FR-AUTH-011`

## Related User Stories

- `US-AUTH-005`

---

# 11. UC-AUTH-006 — Authorization Check

## Goal

Ensure that a user can perform only actions permitted by their role and resource permissions.

## Primary Actor

System

## Supporting Actors

- Database
- Authorization subsystem

## Preconditions

- A request targets a protected operation.

## Trigger

User requests a protected resource or operation.

## Main Flow

1. System identifies the authenticated user.
2. System identifies the requested resource/action.
3. System evaluates role and resource permissions.
4. System determines whether access is allowed.
5. If allowed, processing continues.
6. If not allowed, the request is rejected.

## Exception Flow

### E1 — Missing Authentication

System returns an appropriate authentication-required response.

### E2 — Insufficient Permission

System returns an appropriate forbidden response.

## Related Requirements

- `FR-AUTH-013`
- `FR-AUTH-014`
- `FR-AUTHZ-001`
- `FR-AUTHZ-002`
- `FR-AUTHZ-003`

## Related User Stories

- `US-AUTH-006`
- `US-CROSS-001`

---

# 12. UC-PROFILE-001 — Manage Profile

## Goal

Allow an authenticated user to view and update permitted profile information.

## Primary Actor

Student / Teacher

## Preconditions

- User is authenticated.

## Trigger

User opens profile settings.

## Main Flow

1. User opens profile.
2. System retrieves permitted profile data.
3. System displays the profile.
4. User edits permitted information.
5. System validates changes.
6. System saves valid changes.
7. System confirms the update.

## Alternative Flows

### A1 — Profile Image Update

1. User selects a valid image.
2. System validates the file.
3. System stores the image.
4. System associates it with the profile.

## Exception Flows

- Invalid profile information.
- Unauthorized field modification.
- Invalid image.
- Storage failure.

## Related Requirements

- `FR-PROFILE-001`
- `FR-PROFILE-002`
- `FR-PROFILE-003`
- `FR-PROFILE-005`

## Related User Stories

- `US-PROFILE-001`
- `US-PROFILE-002`
- `US-PROFILE-003`

---

# 13. UC-SUBJECT-001 — Create Subject

## Goal

Allow an authorized teacher to create a subject space.

## Primary Actor

Teacher

## Supporting Actors

- Database

## Preconditions

- Teacher is authenticated.
- Teacher has subject-creation permission.

## Trigger

Teacher selects create subject.

## Main Flow

1. Teacher opens subject creation.
2. System displays the subject form.
3. Teacher enters subject information.
4. Teacher submits the form.
5. System validates the information.
6. System checks authorization.
7. System creates the subject.
8. System associates the subject with the teacher.
9. System returns the created subject.

## Alternative Flows

### A1 — Save as Draft

Where supported, the teacher saves incomplete subject information for later completion.

## Exception Flows

- Invalid subject information.
- Teacher lacks permission.
- Duplicate subject condition where business rules prohibit it.
- Database failure.

## Postconditions

A valid subject exists and is associated with the authorized teacher.

## Related Requirements

- `FR-SUBJECT-001`
- `FR-SUBJECT-004`

## Related User Stories

- `US-TEACHER-002`
- `US-SUBJECT-001`

---

# 14. UC-SUBJECT-002 — Manage Subject

## Goal

Allow an authorized teacher to update or archive a subject.

## Primary Actor

Teacher

## Preconditions

- Teacher is authorized to manage the subject.
- Subject exists.

## Trigger

Teacher selects subject management.

## Main Flow

1. Teacher opens the subject.
2. System verifies authorization.
3. System displays editable subject information.
4. Teacher changes permitted information.
5. System validates the changes.
6. System saves the changes.
7. System confirms the update.

## Alternative Flow

### A1 — Archive Subject

1. Teacher chooses archive.
2. System checks lifecycle rules.
3. System changes subject state to archived.
4. System prevents new activity according to archive rules.

## Exception Flows

- Subject does not exist.
- Teacher lacks permission.
- Invalid data.
- Database failure.

## Related Requirements

- `FR-SUBJECT-005`
- `FR-SUBJECT-006`
- `FR-SUBJECT-007`

## Related User Stories

- `US-TEACHER-003`
- `US-SUBJECT-002`
- `US-SUBJECT-005`

---

# 15. UC-SUBJECT-003 — Access Subject

## Goal

Allow an authorized student to open a subject and access its permitted content.

## Primary Actor

Student

## Preconditions

- Student is authenticated.
- Subject exists.
- Student has access to the subject.

## Trigger

Student selects a subject.

## Main Flow

1. Student selects a subject.
2. System verifies authentication.
3. System verifies subject access.
4. System retrieves subject information.
5. System retrieves accessible published resources.
6. System displays the subject space.

## Exception Flows

- Subject not found.
- Student not authorized.
- Subject archived.
- Temporary database/service failure.

## Related Requirements

- `FR-STUDENT-004`
- `FR-SUBJECT-007`
- `FR-MATERIAL-009`

## Related User Stories

- `US-STUDENT-003`
- `US-STUDENT-004`
- `US-SUBJECT-004`

---

# 16. UC-MATERIAL-001 — Create Learning Material

## Goal

Allow a teacher to create a learning resource.

## Primary Actor

Teacher

## Preconditions

- Teacher is authenticated.
- Teacher can manage the target subject.

## Trigger

Teacher selects create material.

## Main Flow

1. Teacher selects a subject.
2. Teacher selects create material.
3. System displays the material form.
4. Teacher enters title, description, and resource information.
5. Teacher submits the material.
6. System validates the information.
7. System creates the material.
8. System associates it with the subject and owner.
9. System stores the appropriate state.

## Alternative Flow

### A1 — Draft Material

The teacher saves the material as a draft instead of publishing it.

## Exception Flows

- Invalid material data.
- Teacher lacks access to the subject.
- Unsupported resource.
- Storage failure.

## Related Requirements

- `FR-MATERIAL-001`
- `FR-MATERIAL-004`
- `FR-MATERIAL-006`

## Related User Stories

- `US-MATERIAL-001`
- `US-MATERIAL-003`

---

# 17. UC-MATERIAL-002 — Publish Material

## Goal

Make a completed learning material available to authorized students.

## Primary Actor

Teacher

## Preconditions

- Material exists.
- Teacher owns or manages the material.
- Required material fields are valid.

## Trigger

Teacher selects publish.

## Main Flow

1. Teacher opens the material.
2. System verifies ownership/permission.
3. System validates publication requirements.
4. System changes material state to published.
5. System makes the material discoverable to authorized students.
6. System confirms publication.

## Exception Flows

- Missing required information.
- Unauthorized teacher.
- Material already archived.
- Publication failure.

## Related Requirements

- `FR-MATERIAL-005`
- `FR-MATERIAL-009`

## Related User Stories

- `US-MATERIAL-002`

---

# 18. UC-PDF-001 — Upload PDF

## Goal

Allow a teacher to upload an educational PDF.

## Primary Actor

Teacher

## Supporting Actors

- File Storage Service
- Database

## Preconditions

- Teacher is authenticated.
- Teacher has access to the target subject.
- PDF upload is permitted.

## Trigger

Teacher selects a PDF upload operation.

## Main Flow

1. Teacher selects the target subject/material.
2. Teacher selects a PDF file.
3. System validates the file type.
4. System validates the file size.
5. System performs required security checks.
6. System uploads the file to approved storage.
7. System records file metadata.
8. System associates the PDF with the appropriate resource.
9. System confirms successful upload.

## Alternative Flow

### A1 — Replace Existing PDF

1. Teacher selects replacement.
2. System validates the new file.
3. System stores the replacement.
4. System updates the resource while preserving required audit/history information.

## Exception Flows

- Unsupported file.
- File too large.
- Security scan failure.
- Storage unavailable.
- Upload interrupted.

## Related Requirements

- `FR-PDF-001` through `FR-PDF-008`
- `FR-FILE-001` through `FR-FILE-004`

## Related User Stories

- `US-PDF-001`
- `US-PDF-004`

---

# 19. UC-PDF-002 — Access PDF

## Goal

Allow an authorized student to view or download a PDF resource.

## Primary Actor

Student

## Supporting Actors

- File Storage Service

## Preconditions

- Student is authenticated.
- PDF exists.
- Student has permission to access it.

## Trigger

Student selects the PDF.

## Main Flow

1. Student requests the PDF.
2. System verifies authentication.
3. System verifies authorization.
4. System retrieves the approved file.
5. System provides the PDF according to access rules.

## Alternative Flow

### A1 — Download Disabled

System provides viewing access but does not provide the download operation.

## Exception Flows

- PDF not found.
- Student unauthorized.
- Storage service unavailable.
- File corrupted/unavailable.

## Related Requirements

- `FR-PDF-006`
- `FR-PDF-007`

## Related User Stories

- `US-PDF-002`
- `US-PDF-003`
- `US-PDF-004`

---

# 20. UC-ASSIGNMENT-001 — Create Assignment

## Goal

Allow a teacher to create an assignment for a subject.

## Primary Actor

Teacher

## Preconditions

- Teacher manages the target subject.
- Teacher is authenticated.

## Trigger

Teacher selects create assignment.

## Main Flow

1. Teacher selects a subject.
2. Teacher opens assignment creation.
3. System displays assignment fields.
4. Teacher enters title, instructions, due date, and supported settings.
5. Teacher submits the assignment.
6. System validates the data.
7. System creates the assignment.
8. Assignment is stored in the appropriate state.

## Alternative Flow

### A1 — Save Draft

Teacher saves the assignment without publishing it.

## Exception Flows

- Invalid due date.
- Missing required fields.
- Unauthorized subject access.
- Database failure.

## Related Requirements

- `FR-ASSIGNMENT-001`
- `FR-ASSIGNMENT-002`
- `FR-ASSIGNMENT-003`
- `FR-ASSIGNMENT-004`
- `FR-ASSIGNMENT-005`

## Related User Stories

- `US-ASSIGNMENT-001`
- `US-ASSIGNMENT-002`
- `US-ASSIGNMENT-003`

---

# 21. UC-ASSIGNMENT-002 — Publish Assignment

## Goal

Make an assignment available to authorized students.

## Primary Actor

Teacher

## Preconditions

- Assignment exists.
- Required fields are complete.
- Teacher is authorized.

## Trigger

Teacher selects publish.

## Main Flow

1. Teacher opens the assignment.
2. System verifies permission.
3. System validates publication requirements.
4. System changes assignment state to published.
5. System makes it available to eligible students.
6. System triggers configured notifications if enabled.

## Exception Flows

- Assignment incomplete.
- Teacher unauthorized.
- Assignment lifecycle does not permit publication.
- Notification service failure.

## Related Requirements

- `FR-ASSIGNMENT-007`
- `FR-NOTIFICATION-002`

## Related User Stories

- `US-ASSIGNMENT-004`
- `US-NOTIFICATION-001`

---

# 22. UC-ASSIGNMENT-003 — View Assignment

## Goal

Allow a student to view a published assignment.

## Primary Actor

Student

## Preconditions

- Student is authenticated.
- Assignment is published.
- Student is eligible to access it.

## Trigger

Student opens the assignment.

## Main Flow

1. Student selects the assignment.
2. System verifies access.
3. System retrieves assignment information.
4. System displays instructions and due-date information.
5. Student can proceed to submission.

## Exception Flows

- Assignment unavailable.
- Student unauthorized.
- Assignment archived/closed.

## Related Requirements

- `FR-ASSIGNMENT-008`

## Related User Stories

- `US-ASSIGNMENT-005`

---

# 23. UC-SUBMISSION-001 — Submit Assignment

## Goal

Allow a student to submit assignment work.

## Primary Actor

Student

## Supporting Actors

- File Storage Service where file submissions are supported
- Database

## Preconditions

- Student is authorized for the assignment.
- Assignment is accepting submissions.

## Trigger

Student selects submit.

## Main Flow

1. Student opens the assignment.
2. Student provides the required submission content.
3. System validates the submission.
4. System checks submission rules.
5. System stores the submission.
6. System records the submission timestamp.
7. System determines whether the submission is on time or late.
8. System records the submission status.
9. System confirms successful submission.

## Alternative Flows

### A1 — Resubmission

1. Student submits a replacement.
2. System checks whether resubmission is allowed.
3. System stores the new submission according to version/lifecycle rules.

### A2 — Late Submission

1. System determines the current time is after the due date.
2. System marks the submission as late.
3. System applies configured late-submission rules.

## Exception Flows

- Submission format invalid.
- File too large.
- Assignment closed.
- Submission limit exceeded.
- Storage failure.

## Related Requirements

- `FR-SUBMISSION-001` through `FR-SUBMISSION-005`

## Related User Stories

- `US-SUBMISSION-001`
- `US-SUBMISSION-002`
- `US-SUBMISSION-003`

---

# 24. UC-SUBMISSION-002 — Review Submission

## Goal

Allow a teacher to review student assignment submissions.

## Primary Actor

Teacher

## Preconditions

- Teacher manages the assignment.
- Submission exists.

## Trigger

Teacher opens assignment submissions.

## Main Flow

1. Teacher opens the assignment.
2. System verifies teacher authorization.
3. System lists authorized submissions.
4. Teacher selects a submission.
5. System displays submission information.
6. Teacher reviews the work.
7. Teacher proceeds to feedback or grading where enabled.

## Exception Flows

- Submission does not exist.
- Teacher unauthorized.
- File unavailable.
- Assignment no longer accessible.

## Related Requirements

- `FR-SUBMISSION-006`

## Related User Stories

- `US-SUBMISSION-004`

---

# 25. UC-SUBMISSION-003 — Provide Feedback

## Goal

Allow a teacher to provide feedback on student work.

## Primary Actor

Teacher

## Preconditions

- Teacher is authorized to review the submission.
- Submission exists.

## Trigger

Teacher selects the feedback action.

## Main Flow

1. Teacher opens a submission.
2. Teacher enters feedback.
3. System validates the feedback.
4. System stores the feedback.
5. System makes feedback available according to visibility rules.
6. System triggers a notification if enabled.

## Exception Flows

- Teacher unauthorized.
- Invalid feedback.
- Storage failure.
- Notification service unavailable.

## Related Requirements

- `FR-SUBMISSION-007`
- `FR-NOTIFICATION-004`

## Related User Stories

- `US-SUBMISSION-005`

---

# 26. UC-QUIZ-001 — Create Quiz

## Goal

Allow a teacher to create a quiz for a subject.

## Primary Actor

Teacher

## Preconditions

- Teacher manages the target subject.
- Teacher is authenticated.

## Trigger

Teacher selects create quiz.

## Main Flow

1. Teacher selects a subject.
2. Teacher opens quiz creation.
3. System displays quiz fields.
4. Teacher enters quiz information.
5. Teacher adds supported questions.
6. Teacher defines correct answers where required.
7. Teacher saves the quiz.
8. System validates the quiz.
9. System stores the quiz.

## Exception Flows

- Missing quiz information.
- Invalid question.
- Missing correct answer.
- Unauthorized subject access.
- Database failure.

## Related Requirements

- `FR-QUIZ-001`
- `FR-QUIZ-005`
- `FR-QUIZ-007`

## Related User Stories

- `US-QUIZ-001`
- `US-QUIZ-002`
- `US-QUIZ-003`

---

# 27. UC-QUIZ-002 — Publish Quiz

## Goal

Make a completed quiz available to eligible students.

## Primary Actor

Teacher

## Preconditions

- Quiz exists.
- Quiz passes publication validation.
- Teacher is authorized.

## Trigger

Teacher selects publish.

## Main Flow

1. Teacher opens the quiz.
2. System verifies authorization.
3. System validates quiz completeness.
4. System changes quiz state to published.
5. System makes the quiz available to eligible students.
6. System creates configured notifications where enabled.

## Exception Flows

- Quiz incomplete.
- Unauthorized teacher.
- Quiz already closed.
- Publication failure.

## Related Requirements

- `FR-QUIZ-008`
- `FR-NOTIFICATION-003`

## Related User Stories

- `US-QUIZ-004`

---

# 28. UC-QUIZ-003 — Attempt Quiz

## Goal

Allow a student to complete an available quiz.

## Primary Actor

Student

## Preconditions

- Student is authenticated.
- Quiz is published and available.
- Student has remaining attempts where limits apply.

## Trigger

Student selects start quiz.

## Main Flow

1. Student opens the quiz.
2. System checks availability.
3. System checks attempt rules.
4. System creates or resumes an attempt according to quiz rules.
5. System displays questions.
6. Student selects answers.
7. System records answers according to the configured workflow.
8. Student reviews answers if permitted.
9. Student selects submit.

## Alternative Flows

### A1 — Attempt Limit Reached

System prevents a new attempt and informs the student.

### A2 — Quiz Not Yet Available

System informs the student when the quiz becomes available if scheduling information is configured.

### A3 — Quiz Closed

System prevents a new attempt.

## Exception Flows

- Quiz unavailable.
- Network interruption.
- Attempt persistence failure.
- Server error.

## Related Requirements

- `FR-QUIZ-009`
- `FR-QUIZ-010`
- `FR-QUIZ-011`
- `FR-QUIZ-015`
- `FR-QUIZ-016`

## Related User Stories

- `US-QUIZ-005`

---

# 29. UC-QUIZ-004 — Submit Quiz

## Goal

Complete a student's quiz attempt.

## Primary Actor

Student

## Preconditions

- Student has an active attempt.

## Trigger

Student submits the quiz.

## Main Flow

1. Student selects submit.
2. System validates the active attempt.
3. System records final answers.
4. System marks the attempt as submitted.
5. System prevents unauthorized further changes.
6. System sends the attempt for scoring.
7. System provides the result when scoring is complete.

## Alternative Flow

### A1 — Unanswered Questions

If unanswered questions are allowed, the system submits them according to quiz rules. Otherwise, the system asks the student to resolve required questions.

## Exception Flows

- Attempt expired.
- Submission failure.
- Database failure.
- Scoring service failure.

## Related Requirements

- `FR-QUIZ-012`
- `FR-QUIZ-013`

## Related User Stories

- `US-QUIZ-006`

---

# 30. UC-QUIZ-005 — Generate Quiz Result

## Goal

Automatically score supported objective quiz questions and produce a result.

## Primary Actor

System

## Supporting Actors

- Database

## Preconditions

- Quiz attempt is submitted.
- Quiz contains supported automatically scorable questions.

## Trigger

A submitted attempt enters the scoring workflow.

## Main Flow

1. System retrieves the submitted answers.
2. System retrieves the configured correct answers.
3. System compares submitted answers with correct answers.
4. System calculates the score.
5. System stores the result.
6. System associates the result with the student and quiz attempt.
7. System makes the result available according to quiz rules.

## Exception Flows

- Missing answer data.
- Invalid question configuration.
- Scoring calculation failure.
- Database failure.

## Related Requirements

- `FR-QUIZ-013`
- `FR-QUIZ-014`

## Related User Stories

- `US-QUIZ-007`

---

# 31. UC-AI-001 — Ask AI Question

## Goal

Allow an authorized student to ask the AI learning assistant an educational question.

## Primary Actor

Student

## Supporting Actors

- AI Service
- Database where conversation/history is stored
- Authorization subsystem

## Preconditions

- Student is authenticated.
- Student is authorized to use AI.
- AI service is configured.

## Trigger

Student submits a question.

## Main Flow

1. Student opens the AI assistant.
2. Student enters an educational question.
3. System validates the request.
4. System checks authorization and usage limits.
5. System builds the approved AI request.
6. System sends the request to the AI service.
7. AI service processes the request.
8. System receives the response.
9. System applies required safety/processing rules.
10. System displays the response to the student.
11. System records appropriate usage information.

## Alternative Flows

### A1 — Subject Context Available

1. System identifies the selected subject.
2. System includes authorized subject context.
3. AI service generates a context-aware response.

### A2 — Learning Material Context Available

1. System retrieves authorized relevant material context.
2. System includes the approved context.
3. AI service processes the enriched request.

## Exception Flows

### E1 — AI Service Unavailable

1. Request cannot be completed.
2. System informs the student.
3. System does not expose provider secrets or internal infrastructure details.

### E2 — Rate Limit Exceeded

1. System rejects or delays the request.
2. System informs the student according to the usage policy.

### E3 — Unauthorized Context

1. System detects that requested context is not accessible.
2. System excludes that context.
3. The request continues only with authorized context.

## Postconditions

- AI response is displayed when successful.
- Appropriate AI usage information is recorded.

## Related Requirements

- `FR-AI-001`
- `FR-AI-002`
- `FR-AI-003`
- `FR-AI-004`
- `FR-AI-010`
- `FR-AI-011`
- `FR-AI-013`

## Related User Stories

- `US-AI-001`
- `US-AI-002`
- `US-AI-007`

---

# 32. UC-AI-002 — Use Learning Context

## Goal

Allow the AI assistant to use relevant authorized subject or learning-material context.

## Primary Actor

Student

## Supporting Actors

- AI Service
- Retrieval/context subsystem
- Database
- File/content storage

## Preconditions

- Student has access to the relevant subject/material.
- AI contextual functionality is enabled.

## Trigger

Student asks a question requiring contextual learning support.

## Main Flow

1. Student submits a question.
2. System identifies the active subject or context.
3. System verifies access permissions.
4. System retrieves relevant authorized content.
5. System prepares the AI context.
6. System sends the request to the AI service.
7. System receives the response.
8. System presents the response.

## Exception Flows

- No relevant content found.
- Content unavailable.
- Unauthorized content detected.
- AI service unavailable.

## Related Requirements

- `FR-AI-006`
- `FR-AI-007`
- `FR-AI-013`

## Related User Stories

- `US-AI-003`
- `US-AI-004`

---

# 33. UC-AI-003 — Handle AI Failure

## Goal

Handle AI provider failures without making the core platform unusable.

## Primary Actor

System

## Supporting Actor

AI Service

## Preconditions

- Student has submitted an AI request.

## Trigger

AI processing fails, times out, or becomes unavailable.

## Main Flow

1. System detects the failure.
2. System records appropriate operational information.
3. System applies configured timeout/retry behavior.
4. System returns a safe user-facing failure state.
5. Student remains able to use unrelated SyllabAI functionality.

## Exception Flows

### E1 — Temporary Provider Failure

System may retry according to configured retry policy.

### E2 — Persistent Provider Failure

System stops retries and informs the user that AI is temporarily unavailable.

## Related Requirements

- `FR-AI-005`
- `NFR-REL-001`
- `NFR-REL-002`

## Related User Stories

- `US-AI-006`

---

# 34. UC-PROGRESS-001 — Record Learning Activity

## Goal

Record approved learning events needed for progress tracking.

## Primary Actor

System

## Preconditions

- A supported learning event occurs.

## Trigger

Student performs a trackable activity.

## Main Flow

1. System detects the learning event.
2. System validates the event.
3. System associates it with the correct student/resource/subject.
4. System records the activity.
5. System makes the activity available for approved progress calculations.

## Examples

- Assignment submission
- Quiz completion
- Quiz result
- Approved material activity

## Exception Flows

- Invalid event.
- Missing student association.
- Database failure.

## Related Requirements

- `FR-PROGRESS-001`
- `FR-PROGRESS-007`

## Related User Stories

- `US-PROGRESS-001`

---

# 35. UC-PROGRESS-002 — View Student Progress

## Goal

Allow a student to view their own approved learning progress.

## Primary Actor

Student

## Preconditions

- Student is authenticated.

## Trigger

Student opens progress.

## Main Flow

1. Student opens progress.
2. System verifies authentication.
3. System retrieves permitted learning activity.
4. System calculates or retrieves approved progress measures.
5. System displays the progress.

## Exception Flows

- No learning activity exists.
- Progress data unavailable.
- Calculation failure.

## Related Requirements

- `FR-PROGRESS-002`
- `FR-PROGRESS-003`
- `FR-PROGRESS-004`
- `FR-PROGRESS-005`

## Related User Stories

- `US-STUDENT-008`
- `US-PROGRESS-002`
- `US-PROGRESS-003`
- `US-PROGRESS-004`

---

# 36. UC-PROGRESS-003 — View Learner Progress

## Goal

Allow an authorized teacher to view permitted student progress.

## Primary Actor

Teacher

## Preconditions

- Teacher is authorized to view the relevant students.
- Learning activity exists or can be queried.

## Trigger

Teacher opens learner progress.

## Main Flow

1. Teacher selects the relevant subject/student.
2. System verifies authorization.
3. System retrieves permitted learning activity.
4. System calculates/retrieves approved progress information.
5. System displays the result.

## Exception Flows

- Student not associated with teacher.
- Unauthorized access.
- Data unavailable.

## Related Requirements

- `FR-TEACHER-014`
- `FR-PROGRESS-006`

## Related User Stories

- `US-TEACHER-010`
- `US-PROGRESS-005`

---

# 37. UC-NOTIFICATION-001 — Create Notification

## Goal

Generate a notification for a configured system event.

## Primary Actor

System

## Supporting Actor

Notification Service

## Preconditions

- A notification-triggering event occurs.
- Notification is enabled for the event.

## Trigger

Supported event occurs.

## Main Flow

1. System detects the event.
2. System identifies eligible recipients.
3. System creates notification content.
4. System stores the notification.
5. System sends it through the configured channel where applicable.

## Examples

- Assignment published
- Quiz published
- Feedback available
- Important system event

## Exception Flows

- Recipient cannot be identified.
- Notification service unavailable.
- Duplicate notification prevention is triggered.

## Related Requirements

- `FR-NOTIFICATION-001`
- `FR-NOTIFICATION-002`
- `FR-NOTIFICATION-003`
- `FR-NOTIFICATION-004`

## Related User Stories

- `US-NOTIFICATION-001`
- `US-NOTIFICATION-002`
- `US-NOTIFICATION-003`

---

# 38. UC-NOTIFICATION-002 — View Notifications

## Goal

Allow a user to view their notifications.

## Primary Actor

User

## Preconditions

- User is authenticated.

## Trigger

User opens notifications.

## Main Flow

1. User opens notifications.
2. System verifies authentication.
3. System retrieves notifications belonging to the user.
4. System displays notifications.
5. User can open relevant notification details.
6. System updates read state when appropriate.

## Exception Flows

- Notification service/database unavailable.
- User attempts to access another user's notification.

## Related Requirements

- `FR-NOTIFICATION-006`
- `FR-NOTIFICATION-007`
- `FR-NOTIFICATION-008`

## Related User Stories

- `US-NOTIFICATION-004`
- `US-NOTIFICATION-005`

---

# 39. UC-ADMIN-001 — Manage Users

## Goal

Allow a platform administrator to manage user accounts.

## Primary Actor

Platform Administrator

## Preconditions

- Administrator is authenticated.
- Administrator has user-management permission.

## Trigger

Administrator opens user management.

## Main Flow

1. Administrator opens user management.
2. System verifies administrative permission.
3. System displays permitted user records.
4. Administrator searches or selects a user.
5. Administrator performs an approved action.
6. System validates the action.
7. System updates the account.
8. System records the administrative action.

## Possible Actions

- View
- Update permitted information
- Change account state
- Assign permitted role
- Suspend/deactivate where authorized

## Exception Flows

- Unauthorized administrator.
- Invalid action.
- User does not exist.
- Protected account cannot be modified.
- Database failure.

## Related Requirements

- `FR-ADMIN-001`
- `FR-ADMIN-003`
- `FR-ADMIN-007`
- `FR-ADMIN-008`

## Related User Stories

- `US-ADMIN-001`
- `US-ADMIN-003`

---

# 40. UC-ADMIN-002 — Manage Roles

## Goal

Allow authorized platform administrators to manage supported user roles.

## Primary Actor

Platform Administrator

## Preconditions

- Administrator has role-management permission.

## Trigger

Administrator changes a user's role.

## Main Flow

1. Administrator selects a user.
2. System verifies permission.
3. System displays permitted role options.
4. Administrator selects a role.
5. System validates the role assignment.
6. System updates the role.
7. System records the change.

## Exception Flows

- Unauthorized role assignment.
- Invalid role.
- Protected administrative role cannot be assigned without required authorization.

## Related Requirements

- `FR-ADMIN-002`
- `FR-AUTH-013`

## Related User Stories

- `US-ADMIN-002`

---

# 41. UC-MODERATION-001 — Moderate Content

## Goal

Allow a platform administrator to review and act on content requiring moderation.

## Primary Actor

Platform Administrator

## Preconditions

- Administrator has moderation permission.
- Content exists.

## Trigger

Administrator opens moderation queue/content.

## Main Flow

1. Administrator opens moderation.
2. System verifies permission.
3. System displays content requiring review.
4. Administrator reviews the content.
5. Administrator selects an approved action.
6. System validates the action.
7. System applies the action.
8. System records the moderation event.

## Supported Actions

```text
Approve
Hide
Remove
Restrict
Escalate
```

## Exception Flows

- Content no longer exists.
- Administrator unauthorized.
- Moderation action invalid.
- Database failure.

## Related Requirements

- `FR-MODERATION-001`
- `FR-MODERATION-002`
- `FR-MODERATION-003`
- `FR-MODERATION-004`

## Related User Stories

- `US-MODERATION-001`
- `US-MODERATION-002`
- `US-MODERATION-003`

---

# 42. UC-OPS-001 — Record Audit Event

## Goal

Record important security, administrative, and moderation events.

## Primary Actor

System

## Preconditions

- A configured auditable event occurs.

## Trigger

A sensitive event is completed or attempted.

## Main Flow

1. System identifies the event.
2. System identifies the actor where available.
3. System records the relevant event metadata.
4. System stores the audit event securely.
5. Authorized operational users can later review it.

## Exception Flows

- Audit storage unavailable.
- Event contains sensitive data that must be excluded or redacted.

## Related Requirements

- `FR-AUDIT-001`
- `FR-AUDIT-002`
- `FR-AUDIT-003`
- `FR-AUDIT-004`

## Related User Stories

- `US-OPS-001`
- `US-OPS-002`

---

# 43. UC-SEARCH-001 — Search Resources

## Goal

Allow users to find accessible educational resources and subjects.

## Primary Actor

Student / Teacher

## Preconditions

- User is authenticated where search requires authentication.
- Search service is available.

## Trigger

User enters a search query.

## Main Flow

1. User opens search.
2. User enters a query.
3. System validates the query.
4. System searches the permitted dataset.
5. System applies authorization filtering.
6. System applies configured filters.
7. System returns relevant results.
8. User selects a result.

## Alternative Flows

### A1 — Filter Results

User filters results by supported attributes such as subject or resource type.

### A2 — No Results

System informs the user that no matching accessible results were found.

## Exception Flows

- Search service unavailable.
- Invalid query.
- Database failure.

## Related Requirements

- `FR-SEARCH-001`
- `FR-SEARCH-002`
- `FR-SEARCH-003`
- `FR-SEARCH-004`

## Related User Stories

- `US-SEARCH-001`
- `US-SEARCH-002`
- `US-SEARCH-003`

---

# 44. Core End-to-End Student Use Case

The primary SyllabAI learning journey can be represented as:

```text
UC-AUTH-001
Student Registration
       ↓
UC-AUTH-004
Verification
       ↓
UC-AUTH-002
Login
       ↓
UC-SUBJECT-003
Access Subject
       ↓
UC-MATERIAL-001 / UC-PDF-002
Study Materials
       ↓
UC-ASSIGNMENT-003
View Assignment
       ↓
UC-SUBMISSION-001
Submit Assignment
       ↓
UC-SUBMISSION-003
Receive Feedback
       ↓
UC-QUIZ-003
Attempt Quiz
       ↓
UC-QUIZ-004
Submit Quiz
       ↓
UC-QUIZ-005
Receive Result
       ↓
UC-AI-001
Ask AI
       ↓
UC-PROGRESS-002
View Progress
```

This represents the core learning loop.

---

# 45. Core End-to-End Teacher Use Case

```text
UC-AUTH-002
Teacher Login
       ↓
UC-SUBJECT-001
Create Subject
       ↓
UC-MATERIAL-001
Create Material
       ↓
UC-PDF-001
Upload PDF
       ↓
UC-MATERIAL-002
Publish Material
       ↓
UC-ASSIGNMENT-001
Create Assignment
       ↓
UC-ASSIGNMENT-002
Publish Assignment
       ↓
UC-SUBMISSION-002
Review Submission
       ↓
UC-SUBMISSION-003
Provide Feedback
       ↓
UC-QUIZ-001
Create Quiz
       ↓
UC-QUIZ-002
Publish Quiz
       ↓
UC-PROGRESS-003
Review Learner Progress
```

---

# 46. Core Administration Use Case

```text
UC-AUTH-002
Administrator Login
       ↓
UC-ADMIN-001
Manage Users
       ↓
UC-ADMIN-002
Manage Roles
       ↓
UC-MODERATION-001
Moderate Content
       ↓
UC-OPS-001
Audit Events
```

---

# 47. Use Case Relationships

Major relationships include:

```text
Authentication
     ↓
Authorization
     ↓
Protected Use Cases
```

```text
Subject
  ├── Materials
  ├── PDFs
  ├── Assignments
  └── Quizzes
```

```text
Assignment
     ↓
Submission
     ↓
Teacher Review
     ↓
Feedback
     ↓
Notification
```

```text
Quiz
  ↓
Attempt
  ↓
Submission
  ↓
Automatic Scoring
  ↓
Result
  ↓
Progress
```

```text
Student
   ↓
AI Question
   ↓
Authorization
   ↓
Optional Context Retrieval
   ↓
AI Service
   ↓
Response
   ↓
Progress / Usage Monitoring
```

---

# 48. Business Rules

The following rules apply across use cases unless a more specific rule overrides them.

## BR-001 — Authentication

Protected operations require successful authentication.

## BR-002 — Authorization

Authentication alone does not grant permission to every resource.

## BR-003 — Ownership

Users may modify only resources they own or are explicitly authorized to manage.

## BR-004 — Student Privacy

Students may access only their own protected personal information and authorized learning records.

## BR-005 — Teacher Boundary

Teachers may manage only subjects, materials, assignments, quizzes, and student information within their permitted scope.

## BR-006 — Institution Boundary

Institution administrators do not automatically receive platform-wide administrative privileges.

## BR-007 — Administrative Boundary

Platform administration is restricted to authorized platform administrators.

## BR-008 — Published Content

Students should only receive content that is published and accessible to them.

## BR-009 — File Security

Uploaded files must satisfy configured file validation and security rules.

## BR-010 — Assignment Due Date

Assignment submission status must be determined according to the configured due-date policy.

## BR-011 — Quiz Availability

Students may attempt quizzes only when they are within their configured availability and attempt rules.

## BR-012 — AI Authorization

AI context must never include resources the requesting user is not authorized to access.

## BR-013 — Auditability

Important administrative, security, and moderation actions must be auditable.

---

# 49. Exception Handling Principles

All use cases should follow these principles:

1. Never expose secrets or internal implementation details to end users.
2. Return meaningful user-facing errors.
3. Preserve data integrity after failures.
4. Avoid duplicate operations where retries are possible.
5. Log appropriate operational information.
6. Respect authorization even during error/retry flows.
7. Provide retry behavior only where safe.
8. Prevent partial state where transactions are required.

---

# 50. Use Case to User Story Traceability

| Use Case | Related User Stories |
|---|---|
| UC-AUTH-001 | `US-AUTH-001`, `US-AUTH-002` |
| UC-AUTH-002 | `US-AUTH-003`, `US-AUTH-006` |
| UC-AUTH-003 | `US-AUTH-004` |
| UC-AUTH-004 | `US-AUTH-002` |
| UC-AUTH-005 | `US-AUTH-005` |
| UC-AUTH-006 | `US-AUTH-006`, `US-CROSS-001` |
| UC-PROFILE-001 | `US-PROFILE-001`, `US-PROFILE-002`, `US-PROFILE-003` |
| UC-SUBJECT-001 | `US-TEACHER-002`, `US-SUBJECT-001` |
| UC-SUBJECT-002 | `US-TEACHER-003`, `US-SUBJECT-002`, `US-SUBJECT-005` |
| UC-SUBJECT-003 | `US-STUDENT-003`, `US-SUBJECT-004` |
| UC-MATERIAL-001 | `US-MATERIAL-001`, `US-MATERIAL-003` |
| UC-MATERIAL-002 | `US-MATERIAL-002` |
| UC-PDF-001 | `US-PDF-001`, `US-PDF-004` |
| UC-PDF-002 | `US-PDF-002`, `US-PDF-003` |
| UC-ASSIGNMENT-001 | `US-ASSIGNMENT-001`, `US-ASSIGNMENT-002`, `US-ASSIGNMENT-003` |
| UC-ASSIGNMENT-002 | `US-ASSIGNMENT-004` |
| UC-ASSIGNMENT-003 | `US-ASSIGNMENT-005` |
| UC-SUBMISSION-001 | `US-SUBMISSION-001`, `US-SUBMISSION-002`, `US-SUBMISSION-003` |
| UC-SUBMISSION-002 | `US-SUBMISSION-004` |
| UC-SUBMISSION-003 | `US-SUBMISSION-005` |
| UC-QUIZ-001 | `US-QUIZ-001`, `US-QUIZ-002`, `US-QUIZ-003` |
| UC-QUIZ-002 | `US-QUIZ-004` |
| UC-QUIZ-003 | `US-QUIZ-005` |
| UC-QUIZ-004 | `US-QUIZ-006` |
| UC-QUIZ-005 | `US-QUIZ-007` |
| UC-AI-001 | `US-AI-001`, `US-AI-002`, `US-AI-007` |
| UC-AI-002 | `US-AI-003`, `US-AI-004` |
| UC-AI-003 | `US-AI-006` |
| UC-PROGRESS-001 | `US-PROGRESS-001` |
| UC-PROGRESS-002 | `US-STUDENT-008`, `US-PROGRESS-002`, `US-PROGRESS-003`, `US-PROGRESS-004` |
| UC-PROGRESS-003 | `US-TEACHER-010`, `US-PROGRESS-005` |
| UC-NOTIFICATION-001 | `US-NOTIFICATION-001`, `US-NOTIFICATION-002`, `US-NOTIFICATION-003` |
| UC-NOTIFICATION-002 | `US-NOTIFICATION-004`, `US-NOTIFICATION-005` |
| UC-ADMIN-001 | `US-ADMIN-001`, `US-ADMIN-003` |
| UC-ADMIN-002 | `US-ADMIN-002` |
| UC-MODERATION-001 | `US-MODERATION-001`, `US-MODERATION-002`, `US-MODERATION-003` |
| UC-OPS-001 | `US-OPS-001`, `US-OPS-002` |
| UC-SEARCH-001 | `US-SEARCH-001`, `US-SEARCH-002`, `US-SEARCH-003` |

---

# 51. Use Case to Functional Requirement Traceability

| Use Case | Primary Functional Requirements |
|---|---|
| UC-AUTH-001 | `FR-AUTH-001`, `FR-AUTH-002`, `FR-AUTH-004` |
| UC-AUTH-002 | `FR-AUTH-005`, `FR-AUTH-013`, `FR-AUTH-014` |
| UC-AUTH-003 | `FR-AUTH-006` |
| UC-AUTH-004 | `FR-AUTH-004` |
| UC-AUTH-005 | `FR-AUTH-011` |
| UC-AUTH-006 | `FR-AUTH-013`, `FR-AUTH-014`, `FR-AUTHZ-*` |
| UC-PROFILE-001 | `FR-PROFILE-*` |
| UC-SUBJECT-001 | `FR-SUBJECT-001`, `FR-SUBJECT-004` |
| UC-SUBJECT-002 | `FR-SUBJECT-005`, `FR-SUBJECT-006`, `FR-SUBJECT-007` |
| UC-SUBJECT-003 | `FR-STUDENT-004`, `FR-SUBJECT-007` |
| UC-MATERIAL-001 | `FR-MATERIAL-001`, `FR-MATERIAL-004`, `FR-MATERIAL-006` |
| UC-MATERIAL-002 | `FR-MATERIAL-005`, `FR-MATERIAL-009` |
| UC-PDF-001 | `FR-PDF-*`, `FR-FILE-*` |
| UC-PDF-002 | `FR-PDF-006`, `FR-PDF-007` |
| UC-ASSIGNMENT-001 | `FR-ASSIGNMENT-001` through `FR-ASSIGNMENT-006` |
| UC-ASSIGNMENT-002 | `FR-ASSIGNMENT-007`, `FR-NOTIFICATION-002` |
| UC-ASSIGNMENT-003 | `FR-ASSIGNMENT-008` |
| UC-SUBMISSION-001 | `FR-SUBMISSION-001` through `FR-SUBMISSION-005` |
| UC-SUBMISSION-002 | `FR-SUBMISSION-006` |
| UC-SUBMISSION-003 | `FR-SUBMISSION-007`, `FR-NOTIFICATION-004` |
| UC-QUIZ-001 | `FR-QUIZ-001`, `FR-QUIZ-005`, `FR-QUIZ-007` |
| UC-QUIZ-002 | `FR-QUIZ-008`, `FR-NOTIFICATION-003` |
| UC-QUIZ-003 | `FR-QUIZ-009` through `FR-QUIZ-011` |
| UC-QUIZ-004 | `FR-QUIZ-012`, `FR-QUIZ-013` |
| UC-QUIZ-005 | `FR-QUIZ-013`, `FR-QUIZ-014` |
| UC-AI-001 | `FR-AI-001` through `FR-AI-005`, `FR-AI-010`, `FR-AI-011`, `FR-AI-013` |
| UC-AI-002 | `FR-AI-006`, `FR-AI-007`, `FR-AI-013` |
| UC-AI-003 | `FR-AI-005` |
| UC-PROGRESS-001 | `FR-PROGRESS-001`, `FR-PROGRESS-007` |
| UC-PROGRESS-002 | `FR-PROGRESS-002` through `FR-PROGRESS-005` |
| UC-PROGRESS-003 | `FR-PROGRESS-006` |
| UC-NOTIFICATION-001 | `FR-NOTIFICATION-001` through `FR-NOTIFICATION-005` |
| UC-NOTIFICATION-002 | `FR-NOTIFICATION-006` through `FR-NOTIFICATION-008` |
| UC-ADMIN-001 | `FR-ADMIN-001`, `FR-ADMIN-003`, `FR-ADMIN-007`, `FR-ADMIN-008` |
| UC-ADMIN-002 | `FR-ADMIN-002`, `FR-AUTH-013` |
| UC-MODERATION-001 | `FR-MODERATION-001` through `FR-MODERATION-004` |
| UC-OPS-001 | `FR-AUDIT-001` through `FR-AUDIT-004` |
| UC-SEARCH-001 | `FR-SEARCH-001` through `FR-SEARCH-004` |

---

# 52. Use Case Test Design

Each use case should eventually produce:

```text
Use Case
   ↓
Main Flow Test
Alternative Flow Test(s)
Exception Test(s)
Security Test(s)
Authorization Test(s)
Performance Test(s) where applicable
   ↓
Test Case(s)
```

Example:

```text
UC-SUBMISSION-001

TC-SUBMISSION-001
Valid on-time submission

TC-SUBMISSION-002
Late submission

TC-SUBMISSION-003
Invalid submission format

TC-SUBMISSION-004
Unauthorized student

TC-SUBMISSION-005
Assignment closed

TC-SUBMISSION-006
Storage failure
```

---

# 53. Use Case Review Checklist

Before a use case is approved:

- [ ] Unique ID assigned
- [ ] Goal clearly defined
- [ ] Primary actor identified
- [ ] Supporting actors identified
- [ ] Preconditions defined
- [ ] Trigger defined
- [ ] Main flow complete
- [ ] Alternative flows identified
- [ ] Exception flows identified
- [ ] Postconditions defined
- [ ] Business rules identified
- [ ] Related requirements mapped
- [ ] Related user stories mapped
- [ ] Test scenarios can be derived
- [ ] Authorization implications reviewed
- [ ] Security implications reviewed
- [ ] Data implications reviewed

---

# 54. Use Case Change Control

A change to a use case should be reviewed for impact on:

- Functional requirements
- User stories
- Scope
- Architecture
- API behavior
- Database behavior
- UI/UX
- Test cases
- Security
- Schedule

A significant change should follow:

```text
Change Request
      ↓
Use Case Review
      ↓
Requirement Impact
      ↓
Story Impact
      ↓
Architecture Impact
      ↓
Approval
      ↓
Documentation Update
```

---

# 55. Open Use Case Decisions

The following items require final product decisions:

1. Exact student enrollment workflow.
2. Teacher-to-student relationship model.
3. Institution enrollment and organization model.
4. Exact registration and verification flow.
5. Password versus passwordless authentication.
6. Google/social login inclusion.
7. Assignment submission formats.
8. Assignment grading workflow.
9. Quiz question types beyond multiple choice.
10. Quiz timing behavior.
11. Quiz attempt rules.
12. AI conversation persistence.
13. AI material-retrieval behavior.
14. AI response safety rules.
15. Notification channels.
16. Progress calculation rules.
17. Search visibility rules.
18. Moderation policy.
19. Administrative approval requirements.
20. Data retention and deletion workflows.

---

# 56. Approval

| Role | Name | Decision | Signature | Date |
|---|---|---|---|---|
| Project Sponsor | TBD | Pending | TBD | TBD |
| Product Owner | TBD | Pending | TBD | TBD |
| Project Manager | TBD | Pending | TBD | TBD |
| Technical Lead | TBD | Pending | TBD | TBD |
| QA Lead | TBD | Pending | TBD | TBD |

---

# 57. Revision History

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | 2026-10-03 | SyllabAI Team | Initial use-case specification draft |
| 1.0 | 2026-10-03 | SyllabAI Team | Initial use-case baseline candidate |

---

# 58. Document Status

**Document:** `11-use-cases.md`

**Document ID:** `SAB-DOC-011`

**Current Status:** Draft — Use Case Baseline Candidate

**Previous Document:** `10-user-stories.md`

**Next Document:** `12-system-architecture.md`

**SDLC Stage:** Requirements Engineering

**Development Status:** No production coding yet

**Core Principle:**

> **A use case must describe observable system behavior clearly enough that product, engineering, and QA teams can understand the same expected workflow and derive implementation and test scenarios from it.**
