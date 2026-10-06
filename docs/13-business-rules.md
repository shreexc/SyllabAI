# SyllabAI — Business Rules Document

## Document Control

| Field | Details |
|---|---|
| Document ID | SAB-DOC-013 |
| Document Name | Business Rules Document |
| File Name | `13-business-rules.md` |
| Product | SyllabAI |
| Document Type | Business Rules / Decision Policy |
| SDLC Stage | Requirements Engineering |
| Status | Draft — Business Rules Baseline Candidate |
| Version | 1.0 |
| Previous Document | `12-use-case-diagram.drawio` |
| Next Document | TBD |
| Development Status | No production coding yet |
| Product Owner | TBD |
| Project Manager | TBD |
| Technical Lead | TBD |
| QA Lead | TBD |
| Prepared By | SyllabAI Team |
| Last Updated | 2026-10-03 |

---

# 1. Purpose

This document defines the business rules that govern how SyllabAI operates.

Business rules establish decisions, restrictions, permissions, validations, and policies that must be followed consistently by:

- Frontend developers
- Backend developers
- AI developers
- QA engineers
- UI/UX designers
- Product owners
- Administrators
- Future development teams

The purpose is to prevent developers from making independent assumptions about business behavior.

```text
Business Requirement
        ↓
Business Rule
        ↓
System Behavior
        ↓
Implementation
        ↓
Test Case
```

A business rule should remain independent of a specific programming language, framework, database, or UI implementation.

---

# 2. Business Rule Principles

SyllabAI business rules follow these principles:

1. Authorization must be explicit.
2. Users receive only the access appropriate to their role and relationship with a resource.
3. Ownership must be respected.
4. Private educational content must not become publicly accessible unintentionally.
5. Important administrative actions must be auditable.
6. Student data must be protected.
7. Published content must meet publication requirements.
8. Assessment rules must be deterministic and documented.
9. AI must operate only on authorized context.
10. System failures must not silently create inconsistent business state.
11. Developers must not invent business behavior that is not defined or approved.
12. Where a rule is unresolved, the implementation must remain configurable or the decision must be escalated to the product owner.

---

# 3. Rule ID Convention

| Domain | Prefix |
|---|---|
| Authentication | `BR-AUTH-xxx` |
| Authorization | `BR-AUTHZ-xxx` |
| User / Account | `BR-USER-xxx` |
| Profile | `BR-PROFILE-xxx` |
| Student | `BR-STUDENT-xxx` |
| Teacher | `BR-TEACHER-xxx` |
| Institution | `BR-INST-xxx` |
| Subject | `BR-SUBJECT-xxx` |
| Materials | `BR-MATERIAL-xxx` |
| Files | `BR-FILE-xxx` |
| Assignment | `BR-ASSIGNMENT-xxx` |
| Submission | `BR-SUBMISSION-xxx` |
| Quiz | `BR-QUIZ-xxx` |
| AI | `BR-AI-xxx` |
| Notification | `BR-NOTIFY-xxx` |
| Progress | `BR-PROGRESS-xxx` |
| Search | `BR-SEARCH-xxx` |
| Moderation | `BR-MOD-xxx` |
| Audit | `BR-AUDIT-xxx` |
| Data / Privacy | `BR-DATA-xxx` |
| Operations | `BR-OPS-xxx` |
| General | `BR-GEN-xxx` |

---

# 4. Rule Priority

| Priority | Meaning |
|---|---|
| Critical | Security, authorization, privacy, or data-integrity rule |
| High | Core product/business behavior |
| Medium | Important supporting behavior |
| Low | Optional or configurable behavior |
| Future | Intended but not part of the current baseline |

Critical and High rules must not be changed during implementation without formal requirement/change approval.

---

# 5. User and Role Rules

## BR-USER-001 — Unique Account Identity

Each user account must have a unique primary authentication identity according to the approved authentication design.

**Priority:** Critical

---

## BR-USER-002 — Valid Account State

Only accounts in an eligible state may access protected platform functionality.

Possible states may include:

```text
Pending Verification
Active
Suspended
Deactivated
Deleted / Anonymized
```

The exact lifecycle states must be finalized before implementation.

**Priority:** Critical

---

## BR-USER-003 — Role Assignment

A user's platform role must be explicitly assigned by the approved account/administration workflow.

A user must not gain elevated privileges merely because they access a particular URL or UI screen.

**Priority:** Critical

---

## BR-USER-004 — Role-Based Behavior

The system must apply permissions based on the user's assigned role and applicable resource relationship.

**Priority:** Critical

---

## BR-USER-005 — No Client-Side Authorization Trust

The backend must independently enforce authorization.

Hiding a button or page in the frontend does not constitute authorization.

**Priority:** Critical

---

# 6. Authentication Rules

## BR-AUTH-001 — Authentication Required

Protected resources require successful authentication unless explicitly defined as public.

**Priority:** Critical

---

## BR-AUTH-002 — Credential Validation

Authentication credentials must be validated by the authentication subsystem.

The frontend must never be treated as the authority for credential validity.

**Priority:** Critical

---

## BR-AUTH-003 — Verification

If account verification is required, users must complete the required verification before accessing features restricted to verified users.

**Priority:** High

---

## BR-AUTH-004 — Secure Password Storage

Passwords must never be stored as plaintext.

They must be stored using an approved secure password-hashing mechanism.

**Priority:** Critical

---

## BR-AUTH-005 — Logout

After logout, the user's authentication state must no longer provide normal access to protected resources.

**Priority:** Critical

---

## BR-AUTH-006 — Rate Limiting

Authentication-sensitive operations must be protected against excessive attempts.

Examples:

- Login
- Registration
- OTP verification
- Password reset
- Verification-code resend

**Priority:** Critical

---

## BR-AUTH-007 — Generic Authentication Errors

Authentication failures must not reveal sensitive information such as whether a protected account exists when such disclosure would create a security risk.

**Priority:** High

---

# 7. Authorization Rules

## BR-AUTHZ-001 — Least Privilege

Users receive only the permissions required for their role and approved responsibilities.

**Priority:** Critical

---

## BR-AUTHZ-002 — Resource-Level Authorization

Authorization must be evaluated at the resource level where required.

Example:

A teacher who can manage Subject A must not automatically be able to modify Subject B.

**Priority:** Critical

---

## BR-AUTHZ-003 — Student Data Boundary

A student may access their own private learning records but must not access another student's private records unless an approved role explicitly permits such access.

**Priority:** Critical

---

## BR-AUTHZ-004 — Teacher Data Boundary

A teacher may access student information only within the teacher's authorized teaching scope.

**Priority:** Critical

---

## BR-AUTHZ-005 — Administrator Boundary

Platform-wide administrative capabilities must be restricted to authorized platform administrators.

**Priority:** Critical

---

## BR-AUTHZ-006 — Institution Administrator Boundary

Institution administrators must be restricted to the institution scope assigned to them.

Institution-level access does not automatically imply platform-wide access.

**Priority:** Critical

---

## BR-AUTHZ-007 — Permission Before Action

The system must evaluate authorization before performing a protected operation, not after the operation has already modified data.

**Priority:** Critical

---

# 8. Student Rules

## BR-STUDENT-001 — Student Account

A student must have an eligible account before accessing protected learning functionality.

**Priority:** High

---

## BR-STUDENT-002 — Subject Access

A student may access a private subject only when the student has an approved relationship with that subject.

The exact enrollment mechanism must be finalized.

**Priority:** High

---

## BR-STUDENT-003 — Published Content Access

Students may access learning materials only when the materials are published and the student is authorized to access the associated subject/resource.

**Priority:** High

---

## BR-STUDENT-004 — Student Ownership

Students own/control their own permitted submissions and personal learning information, subject to platform policies and institutional rules.

**Priority:** High

---

## BR-STUDENT-005 — Student Cannot Publish Teacher Content

A student must not be able to publish or modify teacher-owned learning materials unless a specific future role/permission explicitly allows it.

**Priority:** Critical

---

## BR-STUDENT-006 — Student Assessment Integrity

Students must only be able to submit or modify assessment attempts according to the configured assessment rules.

**Priority:** High

---

# 9. Teacher Rules

## BR-TEACHER-001 — Authorized Teacher

Only authorized teachers may create subject spaces.

**Priority:** Critical

---

## BR-TEACHER-002 — Subject Ownership

A teacher may modify a subject only when the teacher owns or is explicitly authorized to manage that subject.

**Priority:** Critical

---

## BR-TEACHER-003 — Material Creation

Only authorized subject teachers/managers may create learning materials within a subject.

**Priority:** Critical

---

## BR-TEACHER-004 — Material Publication

Only authorized subject teachers/managers may publish learning materials.

**Priority:** Critical

---

## BR-TEACHER-005 — Assignment Creation

Only authorized teachers may create assignments within their permitted subjects.

**Priority:** Critical

---

## BR-TEACHER-006 — Quiz Creation

Only authorized teachers may create quizzes within their permitted subjects.

**Priority:** Critical

---

## BR-TEACHER-007 — Student Submission Access

Teachers may review submissions only for assignments they are authorized to manage.

**Priority:** Critical

---

## BR-TEACHER-008 — Feedback Authority

Only authorized teachers may provide or modify feedback on submissions within their permitted teaching scope.

**Priority:** High

---

## BR-TEACHER-009 — Teacher Cannot Escalate Privileges

Being a teacher does not grant platform administration privileges.

**Priority:** Critical

---

## BR-TEACHER-010 — Teacher Progress Visibility

Teacher access to student progress must be limited to students and subjects within the teacher's authorized scope.

**Priority:** Critical

---

# 10. Institution Rules

## BR-INST-001 — Institution Scope

Institution administrators may manage only resources and users within their assigned institution scope.

**Priority:** Critical

---

## BR-INST-002 — Institution Does Not Override Platform Security

Institution-level permissions cannot bypass platform-wide security controls.

**Priority:** Critical

---

## BR-INST-003 — Institution User Management

Institution administrators may manage institution users only for actions explicitly permitted by their role.

**Priority:** High

---

## BR-INST-004 — Cross-Institution Isolation

Private institution resources must not become accessible to users outside the institution unless an approved sharing rule exists.

**Priority:** Critical

---

# 11. Subject Rules

## BR-SUBJECT-001 — Subject Creation Authorization

Only authorized teachers or future approved subject managers may create subjects.

**Priority:** Critical

---

## BR-SUBJECT-002 — Subject Ownership

Every subject must have a defined owner or responsible management relationship.

**Priority:** High

---

## BR-SUBJECT-003 — Subject State

A subject must have a defined lifecycle state.

Example:

```text
Draft
Active
Archived
```

The final state model must be approved before implementation.

**Priority:** High

---

## BR-SUBJECT-004 — Archived Subject

An archived subject must not behave like an active subject.

New activities should be restricted according to the approved lifecycle policy.

**Priority:** High

---

## BR-SUBJECT-005 — Subject Access

Private subject access must be controlled by enrollment, invitation, institution membership, or another approved access mechanism.

**Priority:** Critical

---

# 12. Learning Material Rules

## BR-MATERIAL-001 — Material Ownership

Every learning material must have a defined subject and responsible owner/manager.

**Priority:** High

---

## BR-MATERIAL-002 — Authorized Creation

Only authorized users may create materials within a subject.

**Priority:** Critical

---

## BR-MATERIAL-003 — Draft Before Publication

Learning material should support a draft state before publication where the workflow requires teacher review.

**Priority:** Medium

---

## BR-MATERIAL-004 — Publication Authority

Only the responsible teacher or another explicitly authorized role may publish a material.

**Priority:** Critical

---

## BR-MATERIAL-005 — Published Material Integrity

A published material must not be silently changed in a way that violates the platform's audit or content-management policy.

**Priority:** High

---

## BR-MATERIAL-006 — Private Material

Private materials must not be publicly accessible through predictable URLs or unauthorized API requests.

**Priority:** Critical

---

## BR-MATERIAL-007 — Material Deletion

Material deletion must follow the approved deletion/lifecycle policy.

Where required, deletion should be soft deletion or archival rather than irreversible physical deletion.

**Priority:** Medium

---

# 13. File and PDF Rules

## BR-FILE-001 — Allowed File Types

Only approved file types may be uploaded.

**Priority:** High

---

## BR-FILE-002 — File Size Limit

Uploaded files must not exceed the configured maximum file size.

The initial baseline is defined by the NFR document and may be changed through approved requirements change control.

**Priority:** High

---

## BR-FILE-003 — File Validation

File extension alone must not be treated as sufficient validation where stronger file validation is required.

**Priority:** High

---

## BR-FILE-004 — File Access Control

Protected educational files must be served only to authorized users.

**Priority:** Critical

---

## BR-FILE-005 — Safe File Storage

Files must be stored using safe identifiers and approved storage mechanisms.

**Priority:** Critical

---

## BR-FILE-006 — Failed Upload

A failed file upload must not leave an invalid or misleading resource record representing the upload as successful.

**Priority:** High

---

# 14. Assignment Rules

## BR-ASSIGNMENT-001 — Assignment Ownership

An assignment belongs to a subject and must have an authorized teacher responsible for it.

**Priority:** High

---

## BR-ASSIGNMENT-002 — Required Fields

An assignment cannot be published until all required publication fields are valid.

**Priority:** High

---

## BR-ASSIGNMENT-003 — Due Date

An assignment may have a due date according to the product configuration.

The final timezone and due-date policy must be explicitly defined before production.

**Priority:** High

---

## BR-ASSIGNMENT-004 — Submission Eligibility

Only students eligible for the assignment may submit it.

**Priority:** Critical

---

## BR-ASSIGNMENT-005 — Closed Assignment

A closed assignment must not accept normal submissions unless the configured policy explicitly allows them.

**Priority:** High

---

## BR-ASSIGNMENT-006 — Late Submission

If late submissions are permitted, the system must record the submission as late according to the configured due-date policy.

**Priority:** High

---

## BR-ASSIGNMENT-007 — Assignment Publication

Only authorized teachers may publish assignments.

**Priority:** Critical

---

# 15. Submission Rules

## BR-SUBMISSION-001 — Submission Ownership

A student may create or modify only their own submission.

**Priority:** Critical

---

## BR-SUBMISSION-002 — Submission Eligibility

A submission is accepted only when the student is authorized for the assignment.

**Priority:** Critical

---

## BR-SUBMISSION-003 — Submission Limits

Submission count and resubmission behavior must follow the assignment's configured rules.

**Priority:** High

---

## BR-SUBMISSION-004 — Submission Timestamp

The system must record the authoritative submission timestamp.

**Priority:** High

---

## BR-SUBMISSION-005 — Late Status

The system must determine late status using the authoritative server-side time and approved due-date policy.

**Priority:** Critical

---

## BR-SUBMISSION-006 — Teacher Review Scope

Teachers may review only submissions they are authorized to access.

**Priority:** Critical

---

## BR-SUBMISSION-007 — Feedback Visibility

Feedback must be visible only to authorized recipients.

**Priority:** High

---

# 16. Quiz Rules

## BR-QUIZ-001 — Quiz Ownership

Every quiz must belong to a subject and have an authorized managing teacher.

**Priority:** High

---

## BR-QUIZ-002 — Quiz Publication Validation

A quiz must satisfy all required configuration rules before publication.

**Priority:** High

---

## BR-QUIZ-003 — Quiz Access

Only eligible students may attempt a published quiz.

**Priority:** Critical

---

## BR-QUIZ-004 — Attempt Limit

A quiz may restrict the number of attempts according to its configured rules.

**Priority:** High

---

## BR-QUIZ-005 — Attempt State

A quiz attempt must have a controlled lifecycle.

Example:

```text
Not Started
In Progress
Submitted
Expired
Cancelled
```

The final state model must be approved.

**Priority:** High

---

## BR-QUIZ-006 — Submission Finality

Once a quiz attempt is submitted, further modification must be prevented unless the configured workflow explicitly permits it.

**Priority:** Critical

---

## BR-QUIZ-007 — Server-Side Scoring

Automatically scored quiz results must be calculated by trusted server-side logic rather than relying on client-provided scores.

**Priority:** Critical

---

## BR-QUIZ-008 — Result Ownership

Students may view their own quiz results according to publication rules.

**Priority:** High

---

## BR-QUIZ-009 — Teacher Result Access

Teachers may view quiz results only for students within their authorized teaching scope.

**Priority:** Critical

---

# 17. AI Rules

## BR-AI-001 — AI Requires Authorization

Only users authorized to use the AI assistant may submit AI requests.

**Priority:** High

---

## BR-AI-002 — Authorized Context Only

The AI system must never retrieve or provide context from resources the requesting user is not authorized to access.

**Priority:** Critical

---

## BR-AI-003 — No Permission Bypass Through AI

A user must not be able to use an AI query to retrieve information that the user could not directly access.

**Priority:** Critical

---

## BR-AI-004 — AI Does Not Become an Authority

AI-generated responses must be treated as generated assistance, not as a replacement for platform authorization or official system records.

**Priority:** High

---

## BR-AI-005 — AI Provider Failure

Failure of the AI service must not prevent unrelated core SyllabAI functions from operating.

**Priority:** High

---

## BR-AI-006 — AI Usage Limits

AI requests may be subject to rate, quota, or usage limits.

**Priority:** High

---

## BR-AI-007 — AI Data Protection

Private student or institutional information must not be sent to an AI provider unless the data flow is explicitly approved and protected.

**Priority:** Critical

---

## BR-AI-008 — AI Logging

AI logs must not unnecessarily store sensitive user information.

**Priority:** Critical

---

## BR-AI-009 — AI Context Traceability

Where contextual AI answers depend on platform learning resources, the system should retain sufficient metadata to identify the context used, subject to privacy requirements.

**Priority:** Medium

---

# 18. Notification Rules

## BR-NOTIFY-001 — Notification Eligibility

Notifications must be delivered only to eligible recipients.

**Priority:** High

---

## BR-NOTIFY-002 — Event-Based Notifications

Notifications should be generated only for configured business events.

Examples:

- Assignment published
- Quiz published
- Feedback available
- Important account event

**Priority:** Medium

---

## BR-NOTIFY-003 — Notification Ownership

A user must only be able to access their own private notifications.

**Priority:** Critical

---

## BR-NOTIFY-004 — Duplicate Prevention

The system should avoid generating duplicate notifications for the same event where duplicate delivery is not intended.

**Priority:** Medium

---

## BR-NOTIFY-005 — Notification Failure

A notification delivery failure must not automatically roll back the primary business transaction unless the product owner explicitly defines notification delivery as transaction-critical.

**Priority:** High

---

# 19. Progress Rules

## BR-PROGRESS-001 — Activity Source

Progress must be derived from approved learning activities.

**Priority:** High

---

## BR-PROGRESS-002 — Trusted Events

Progress calculations must use trusted server-side learning events.

**Priority:** Critical

---

## BR-PROGRESS-003 — Student Progress Privacy

Students may view their own progress.

**Priority:** Critical

---

## BR-PROGRESS-004 — Teacher Progress Access

Teachers may view student progress only within their authorized teaching scope.

**Priority:** Critical

---

## BR-PROGRESS-005 — No Manual Client Manipulation

Students must not be able to directly modify progress values through client-side requests.

**Priority:** Critical

---

## BR-PROGRESS-006 — Calculation Consistency

The same progress rules must produce consistent results for the same underlying learning events.

**Priority:** High

---

# 20. Search Rules

## BR-SEARCH-001 — Search Authorization

Search results must be filtered according to the requesting user's permissions.

**Priority:** Critical

---

## BR-SEARCH-002 — Private Content Protection

Private resources must not appear in search results for unauthorized users.

**Priority:** Critical

---

## BR-SEARCH-003 — Search Does Not Grant Access

Finding a resource through search does not automatically grant access to it.

**Priority:** Critical

---

## BR-SEARCH-004 — Search Result Integrity

Search results should link only to resources that remain valid and accessible.

**Priority:** Medium

---

# 21. Moderation Rules

## BR-MOD-001 — Moderation Authority

Only authorized moderation personnel may perform moderation actions.

**Priority:** Critical

---

## BR-MOD-002 — Moderation Scope

Moderators may act only on content within their authorized scope.

**Priority:** Critical

---

## BR-MOD-003 — Moderation Actions Must Be Auditable

Important moderation actions must produce an audit record.

**Priority:** Critical

---

## BR-MOD-004 — Moderation Does Not Grant Administration

Moderation privileges do not automatically grant unrestricted platform administration privileges.

**Priority:** Critical

---

# 22. Administration Rules

## BR-ADMIN-001 — Platform Administration

Only authorized platform administrators may perform platform-wide administrative operations.

**Priority:** Critical

---

## BR-ADMIN-002 — User Suspension

Authorized platform administrators may suspend users according to the approved account policy.

**Priority:** Critical

---

## BR-ADMIN-003 — Role Management

Only authorized administrators may assign or modify privileged roles.

**Priority:** Critical

---

## BR-ADMIN-004 — Protected Administrative Actions

Sensitive administrative actions must require appropriate authorization and must be auditable.

**Priority:** Critical

---

## BR-ADMIN-005 — Administrator Self-Elevation

An administrator must not be able to bypass role-management controls to grant unauthorized privileges to themselves.

**Priority:** Critical

---

# 23. Data and Privacy Rules

## BR-DATA-001 — Data Minimization

SyllabAI should collect only information necessary for approved product functionality.

**Priority:** Critical

---

## BR-DATA-002 — Personal Data Access

Personal data must be accessible only to authorized users and system components.

**Priority:** Critical

---

## BR-DATA-003 — Sensitive Data in Logs

Sensitive personal information, credentials, tokens, and secrets must not be unnecessarily written to logs.

**Priority:** Critical

---

## BR-DATA-004 — Data Deletion

Deletion of user data must follow the approved retention and deletion policy.

**Priority:** High

---

## BR-DATA-005 — Data Ownership and Responsibility

Every major data domain must have an identified system owner/responsible role.

**Priority:** High

---

## BR-DATA-006 — Data Integrity

Business transactions must not leave the system in an invalid state.

**Priority:** Critical

---

## BR-DATA-007 — Unauthorized Data Access

A valid identifier, predictable URL, API parameter, or database ID must never by itself grant access to protected data.

**Priority:** Critical

---

# 24. Audit Rules

## BR-AUDIT-001 — Auditable Events

The system must audit configured security, administrative, moderation, and other sensitive events.

**Priority:** Critical

---

## BR-AUDIT-002 — Audit Integrity

Audit records must not be casually editable by ordinary users.

**Priority:** Critical

---

## BR-AUDIT-003 — Audit Actor

Where possible, an audit event should identify the actor responsible for the action.

**Priority:** High

---

## BR-AUDIT-004 — Audit Timestamp

Auditable events must contain an authoritative timestamp.

**Priority:** High

---

## BR-AUDIT-005 — Failed Sensitive Actions

Important failed security or administrative actions should be auditable where required by the security policy.

**Priority:** High

---

# 25. General System Rules

## BR-GEN-001 — Server Is the Business Authority

Business-critical rules must be enforced by trusted backend services.

**Priority:** Critical

---

## BR-GEN-002 — UI Is Not the Source of Truth

Frontend behavior must not be considered sufficient enforcement of a business rule.

**Priority:** Critical

---

## BR-GEN-003 — Consistent Validation

Business-critical validation must be applied consistently across all entry points that can modify the relevant data.

**Priority:** Critical

---

## BR-GEN-004 — No Silent Assumptions

If a business behavior is not defined, developers must not silently invent a permanent rule.

The issue must be:

1. Identified.
2. Documented.
3. Clarified with the appropriate product/technical owner.
4. Added to the relevant documentation.
5. Implemented after approval.

**Priority:** High

---

## BR-GEN-005 — Configuration Over Hardcoding

Rules likely to change through product decisions should be configurable where technically and economically reasonable.

Examples:

- Maximum file size
- Quiz attempt limits
- AI usage limits
- Assignment late-submission behavior
- Notification settings

**Priority:** Medium

---

## BR-GEN-006 — Transaction Integrity

A business operation that consists of multiple dependent changes must either complete consistently or fail without leaving invalid partial state.

**Priority:** Critical

---

## BR-GEN-007 — Time Authority

Business decisions involving deadlines, expiration, cooldowns, or timestamps must use an authoritative server-side time source.

**Priority:** Critical

---

# 26. Rule Conflict Resolution

When two business rules appear to conflict, the following priority applies:

```text
Security / Privacy
       ↓
Legal / Regulatory Requirements
       ↓
Approved Product Requirements
       ↓
Approved Business Rules
       ↓
Technical Constraints
       ↓
Implementation Convenience
```

Implementation convenience must never override a higher-priority business rule.

If a conflict remains unresolved, development should pause for the affected behavior until the product/technical owner makes a documented decision.

---

# 27. Business Rule Enforcement Layers

Rules should be enforced at the appropriate layers.

| Layer | Responsibility |
|---|---|
| UI | Guidance and user experience |
| API | Request validation and authorization |
| Service / Domain | Core business rules |
| Database | Integrity constraints where appropriate |
| Storage | File access and storage controls |
| AI Layer | Context authorization and AI-specific controls |
| Audit Layer | Recording sensitive actions |
| QA | Verification of rule behavior |

Important rule:

> A business rule must not exist only in the UI.

---

# 28. Business Rule to Use Case Traceability

| Business Rule | Primary Use Cases |
|---|---|
| BR-AUTH-001 | `UC-AUTH-002`, all protected use cases |
| BR-AUTHZ-002 | `UC-AUTH-006`, all resource operations |
| BR-STUDENT-002 | `UC-SUBJECT-003` |
| BR-TEACHER-001 | `UC-SUBJECT-001` |
| BR-TEACHER-003 | `UC-MATERIAL-001` |
| BR-TEACHER-004 | `UC-MATERIAL-002` |
| BR-FILE-004 | `UC-PDF-001`, `UC-PDF-002` |
| BR-ASSIGNMENT-004 | `UC-SUBMISSION-001` |
| BR-SUBMISSION-005 | `UC-SUBMISSION-001` |
| BR-QUIZ-003 | `UC-QUIZ-003` |
| BR-QUIZ-007 | `UC-QUIZ-005` |
| BR-AI-002 | `UC-AI-002` |
| BR-AI-003 | `UC-AI-001`, `UC-AI-002` |
| BR-PROGRESS-005 | `UC-PROGRESS-001`, `UC-PROGRESS-002` |
| BR-SEARCH-001 | `UC-SEARCH-001` |
| BR-MOD-003 | `UC-MODERATION-001` |
| BR-ADMIN-002 | `UC-ADMIN-001` |
| BR-ADMIN-003 | `UC-ADMIN-002` |
| BR-AUDIT-001 | `UC-OPS-001` |
| BR-DATA-007 | All protected data use cases |

---

# 29. Business Rule to Functional Requirement Relationship

Business rules should be traceable to functional requirements.

Example:

```text
BR-TEACHER-001
Only authorized teachers can create subject spaces.
        ↓
FR-SUBJECT-001
System shall allow authorized teachers to create subjects.
        ↓
UC-SUBJECT-001
Create Subject
        ↓
US-SUBJECT-001
Teacher creates a subject.
        ↓
Implementation
        ↓
Test Cases
```

This traceability should be maintained throughout development.

---

# 30. Business Rule Implementation Checklist

Before implementation of a feature:

- [ ] Relevant business rules identified
- [ ] Rule IDs referenced in requirements
- [ ] Authorization behavior defined
- [ ] Ownership behavior defined
- [ ] Validation behavior defined
- [ ] Error behavior defined
- [ ] Data integrity implications reviewed
- [ ] Audit implications reviewed
- [ ] Privacy implications reviewed
- [ ] Test cases derived
- [ ] Unresolved assumptions documented

---

# 31. Business Rule Testing

Each critical/high rule should produce one or more test scenarios.

Example:

```text
BR-TEACHER-001
Only authorized teachers can create subject spaces.

Positive Test:
Authorized teacher creates subject → SUCCESS

Negative Test:
Student attempts to create subject → DENIED

Negative Test:
Teacher attempts to create subject outside scope → DENIED

Security Test:
Unauthenticated request attempts subject creation → DENIED
```

Another example:

```text
BR-SEARCH-002
Private resources must not appear in search results
for unauthorized users.

Test:
Authorized student searches → Resource may appear

Test:
Unauthorized student searches → Resource must not appear

Test:
Unauthenticated request searches protected index → Protected resource excluded
```

---

# 32. Change Management

A business rule change can affect:

- Product behavior
- Functional requirements
- User stories
- Use cases
- API contracts
- Database constraints
- Authorization logic
- UI behavior
- AI behavior
- Notifications
- Tests
- Documentation

Therefore, a change should follow:

```text
Business Rule Change Request
            ↓
Impact Analysis
            ↓
Requirement Review
            ↓
Use Case Review
            ↓
Architecture Review
            ↓
Approval
            ↓
Implementation
            ↓
Testing
            ↓
Documentation Update
```

---

# 33. Rule Lifecycle

Each business rule should have a lifecycle:

```text
Proposed
   ↓
Reviewed
   ↓
Approved
   ↓
Implemented
   ↓
Tested
   ↓
Active
   ↓
Changed / Retired
```

Rules must not be considered authoritative until they have been approved.

---

# 34. Open Business Decisions

The following decisions must be finalized before the affected features reach production:

1. Exact student enrollment mechanism.
2. Whether subjects are public, private, or both.
3. Institution membership rules.
4. Teacher approval/verification workflow.
5. Exact user role model.
6. Account lifecycle states.
7. Exact authentication methods.
8. Mobile OTP requirements.
9. Assignment late-submission policy.
10. Assignment resubmission policy.
11. Assignment grading policy.
12. Quiz attempt limits.
13. Quiz time-limit behavior.
14. Supported quiz question types.
15. Quiz result visibility timing.
16. AI usage limits.
17. AI conversation retention.
18. AI provider data-processing policy.
19. AI citation/source behavior.
20. Notification channels.
21. Progress calculation formula.
22. Resource sharing policy.
23. Content moderation policy.
24. User suspension/appeal workflow.
25. Data retention policy.
26. Account deletion/anonymization policy.
27. Audit retention policy.

These are product decisions, not assumptions for individual developers.

---

# 35. Developer Rule

The following statement is mandatory for the project:

> **Developers must implement documented business rules rather than inventing business behavior.**

When a developer encounters an undefined behavior:

```text
Undefined Behavior
       ↓
Do NOT silently decide
       ↓
Create clarification/question
       ↓
Product/Technical decision
       ↓
Update documentation
       ↓
Implement
       ↓
Test
```

This rule is especially important for:

- Authorization
- Student privacy
- Teacher permissions
- Institution boundaries
- Assessment behavior
- AI data access
- Data deletion
- Moderation
- Administrative privileges

---

# 36. Approval

| Role | Name | Decision | Signature | Date |
|---|---|---|---|---|
| Project Sponsor | TBD | Pending | TBD | TBD |
| Product Owner | TBD | Pending | TBD | TBD |
| Project Manager | TBD | Pending | TBD | TBD |
| Technical Lead | TBD | Pending | TBD | TBD |
| QA Lead | TBD | Pending | TBD | TBD |

---

# 37. Revision History

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | 2026-10-03 | SyllabAI Team | Initial business rules draft |
| 1.0 | 2026-10-03 | SyllabAI Team | Initial business rules baseline candidate |

---

# 38. Document Status

**Document:** `13-business-rules.md`

**Document ID:** `SAB-DOC-013`

**Current Status:** Draft — Business Rules Baseline Candidate

**Previous Document:** `12-use-case-diagram.drawio`

**SDLC Stage:** Requirements Engineering

**Development Status:** No production coding yet

**Core Principle:**

> **Business rules define how SyllabAI is allowed to behave. They are the decision authority that prevents implementation teams from making undocumented product assumptions.**
