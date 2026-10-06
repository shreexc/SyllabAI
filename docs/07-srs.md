# SyllabAI — Software Requirements Specification (SRS)

## Document Control

| Field | Details |
|---|---|
| Document ID | SAB-DOC-007 |
| Document Name | Software Requirements Specification |
| File Name | `07-srs.md` |
| Product | SyllabAI |
| Document Type | Software Requirements Specification |
| Requirements Standard Reference | ISO/IEC/IEEE 29148 principles |
| SDLC Stage | Requirements Engineering |
| Status | Draft — Requirements Baseline Candidate |
| Version | 1.0 |
| Previous Document | `06-product-scope.md` |
| Next Document | `08-use-cases.md` |
| Development Status | No production coding yet |
| Product Owner | TBD |
| Project Manager | TBD |
| Technical Lead | TBD |
| Prepared By | SyllabAI Team |
| Last Updated | 2026-10-03 |

---

# 1. Introduction

## 1.1 Document Purpose

This Software Requirements Specification (SRS) defines the functional and non-functional requirements for SyllabAI.

The document converts the approved product scope into precise software requirements that can be:

- Understood by stakeholders
- Designed by engineers
- Implemented by developers
- Tested by QA
- Traced to user needs
- Validated against acceptance criteria
- Controlled through change management

This document becomes one of the primary references for software development.

---

## 1.2 Requirements Engineering Objective

The purpose of requirements engineering is to establish:

```text
User / Business Need
        ↓
Problem
        ↓
Product Scope
        ↓
Requirement
        ↓
Design
        ↓
Implementation
        ↓
Test
        ↓
Acceptance
```

A requirement should not exist only because someone requested a feature.

Each significant requirement should have a clear relationship to:

- A user need
- A product objective
- A stakeholder expectation
- A system capability
- A measurable outcome

---

## 1.3 Requirements Quality Principles

SyllabAI requirements should be:

- Correct
- Necessary
- Unambiguous
- Complete
- Consistent
- Feasible
- Verifiable
- Traceable
- Prioritized
- Modifiable
- Understandable

Whenever possible, requirements should describe **what the system must do**, rather than prematurely specifying **how developers must implement it**.

---

# 2. Purpose

## 2.1 Product Purpose

SyllabAI is intended to provide a centralized digital learning environment where students and teachers can manage educational resources, learning activities, assessments, progress information, and AI-assisted learning.

---

## 2.2 Software Purpose

The SyllabAI software system shall provide:

- Secure user access
- Role-based functionality
- Student profiles
- Teacher profiles
- Subject spaces
- Educational resources
- PDF resources
- Video resources
- Assignments
- Quizzes
- AI learning assistance
- Notifications
- Basic learning progress
- Administrative management

---

## 2.3 Core Product Workflow

```text
Register / Login
      ↓
Profile
      ↓
Subject
      ↓
Learning Materials
      ↓
Study
      ↓
Assignment / Quiz
      ↓
Result / Feedback
      ↓
Progress
      ↓
AI Assistance
      ↓
Continued Learning
```

---

# 3. Scope

## 3.1 In Scope

The following capabilities are within the software scope:

1. Authentication and authorization
2. Student profiles
3. Teacher profiles
4. Subject spaces
5. Study materials
6. PDF resources
7. Video resources
8. Assignments
9. Quizzes
10. AI assistant
11. Notifications
12. Basic progress tracking
13. Institution administration where enabled
14. Platform administration
15. Security controls
16. Basic auditability
17. Responsive web experience

---

## 3.2 Out of Scope

The following are outside the current MVP scope:

- Live video conferencing
- Payment gateway
- Advanced LMS analytics
- Native Android application
- Native iOS application
- Advanced examination proctoring
- Full school ERP
- Teacher/content marketplace
- General-purpose social network
- Hardware/IoT integration
- General-purpose autonomous AI agent
- Advanced enterprise integrations unless separately approved

---

## 3.3 MVP Boundary

The MVP should demonstrate the following complete learning loop:

```text
User Authentication
       ↓
Role/Profile
       ↓
Subject
       ↓
Learning Resource
       ↓
Assignment / Quiz
       ↓
Learning Feedback
       ↓
AI Assistance
```

The MVP should prioritize completeness and reliability of this workflow over the number of features.

---

# 4. Product Perspective

## 4.1 System Context

SyllabAI is a centralized web-based education platform.

At a high level:

```text
                    ┌──────────────────┐
                    │     Student      │
                    └────────┬─────────┘
                             │
                             ▼
┌──────────────┐      ┌───────────────┐      ┌─────────────────┐
│    Teacher   │─────▶│    SyllabAI   │◀─────│ Institution     │
└──────────────┘      │   Platform    │      │ Administrator   │
                      └───────┬───────┘      └─────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
             ┌─────────────┐     ┌──────────────┐
             │ AI Services │     │ Storage/Data │
             └─────────────┘     └──────────────┘

                              ▲
                              │
                    ┌─────────┴─────────┐
                    │ Platform Admin    │
                    └───────────────────┘
```

---

## 4.2 High-Level System Components

The software is expected to contain logical components such as:

- Frontend application
- Backend/API layer
- Authentication service
- User/profile management
- Subject management
- Content/resource management
- Assignment service
- Quiz/assessment service
- Notification service
- AI service
- Progress/learning activity service
- Administrative service
- Database
- File/object storage
- Optional cache/background task infrastructure

The final architecture will be defined in the architecture documentation.

---

## 4.3 External System Perspective

Depending on implementation decisions, SyllabAI may communicate with:

- AI/LLM providers
- Email providers
- SMS providers
- Object/file storage
- Authentication providers
- Monitoring/logging services
- Hosting/cloud infrastructure

External integrations must be separately evaluated for security, cost, reliability, privacy, and dependency risk.

---

# 5. User Classes

## 5.1 Student

### Description

The primary learning user.

### Responsibilities

- Maintain profile
- Access subjects
- Study resources
- Watch educational videos
- Read PDFs
- Complete assignments
- Attempt quizzes
- Review results
- Use AI learning assistance
- View relevant notifications
- Monitor basic learning progress

### Main Requirements

Students must only access resources and actions for which they have permission.

---

# 5.2 Teacher

### Description

The primary content and learning-activity creator.

### Responsibilities

- Maintain teacher profile
- Create/manage subjects
- Upload learning resources
- Publish PDFs/videos
- Create assignments
- Review submissions
- Create quizzes
- Review quiz results
- Provide feedback
- View permitted student activity
- Use AI assistance where enabled

---

# 5.3 Institution Administrator

### Description

An administrator responsible for institution-level management where institutional functionality is enabled.

### Responsibilities

- Manage institution users
- Manage relevant teacher/student associations
- Monitor institution-level information
- Manage institution structures where supported
- Maintain administrative oversight

Institution administrators must not automatically receive unrestricted platform-wide privileges.

---

# 5.4 Platform Administrator

### Description

A trusted operational administrator responsible for the overall SyllabAI platform.

### Responsibilities

- Manage users
- Manage roles
- Moderate content
- Manage platform configuration
- Handle operational issues
- Review administrative information
- Manage platform-level access

---

# 5.5 System / External Service

External services are not human users but are important system actors.

Examples:

- AI service
- Email service
- SMS service
- Storage service
- Authentication provider
- Monitoring service

---

# 6. Functional Requirements

## Requirement Identification Convention

Functional requirements use:

```text
FR-AUTH-xxx
FR-USER-xxx
FR-SUB-xxx
FR-MAT-xxx
FR-PDF-xxx
FR-VID-xxx
FR-ASG-xxx
FR-QUIZ-xxx
FR-AI-xxx
FR-NOT-xxx
FR-PROG-xxx
FR-ADM-xxx
```

Priority:

- **MUST** — Required for the approved MVP baseline
- **SHOULD** — Important but may be deferred without invalidating the core MVP
- **COULD** — Useful enhancement
- **FUTURE** — Not part of the current release

---

# 6.1 Authentication Requirements

### FR-AUTH-001 — User Registration

**Priority:** MUST

The system shall allow an eligible user to create an account using the approved registration information.

**Acceptance:**

- Required fields are validated.
- Invalid registration data is rejected.
- Duplicate account identifiers are handled.
- A successful registration creates an account in the appropriate state.

---

### FR-AUTH-002 — User Login

**Priority:** MUST

The system shall authenticate users using the approved authentication mechanism.

**Acceptance:**

- Valid credentials result in authenticated access.
- Invalid credentials are rejected.
- Unauthorized users cannot access protected resources.

---

### FR-AUTH-003 — Logout

**Priority:** MUST

The system shall allow authenticated users to terminate their active session.

---

### FR-AUTH-004 — Password Management

**Priority:** MUST

The system shall provide secure password management appropriate to the selected authentication architecture.

This may include:

- Password creation
- Password change
- Password reset

---

### FR-AUTH-005 — Authorization

**Priority:** MUST

The system shall enforce role-based authorization.

At minimum:

```text
Student
Teacher
Institution Admin
Platform Admin
```

---

### FR-AUTH-006 — Protected Resources

**Priority:** MUST

The system shall prevent unauthenticated or unauthorized users from accessing protected resources.

---

### FR-AUTH-007 — Account State

**Priority:** SHOULD

The system should support account states such as:

- Active
- Inactive
- Suspended
- Pending verification

---

# 6.2 User Profile Requirements

### FR-USER-001 — Student Profile

**Priority:** MUST

The system shall allow students to create and manage an approved set of profile information.

---

### FR-USER-002 — Teacher Profile

**Priority:** MUST

The system shall allow teachers to create and manage an approved set of professional/profile information.

---

### FR-USER-003 — Profile Update

**Priority:** MUST

Authorized users shall be able to update permitted profile fields.

---

### FR-USER-004 — Profile Privacy

**Priority:** MUST

The system shall prevent users from accessing profile information that they are not authorized to view.

---

### FR-USER-005 — Profile Image

**Priority:** SHOULD

The system should support a profile image where enabled by product requirements.

---

# 6.3 Subject Requirements

### FR-SUB-001 — Subject Creation

**Priority:** MUST

Authorized teachers shall be able to create a subject space.

---

### FR-SUB-002 — Subject Information

**Priority:** MUST

A subject shall contain relevant information such as:

- Name
- Description
- Owner/teacher
- Status
- Associated resources

---

### FR-SUB-003 — Subject Access

**Priority:** MUST

The system shall restrict subject access according to enrollment, membership, or approved access rules.

---

### FR-SUB-004 — Subject Management

**Priority:** MUST

Authorized teachers shall be able to update or manage their subjects.

---

### FR-SUB-005 — Subject Resources

**Priority:** MUST

The system shall allow authorized educational resources to be associated with subjects.

---

# 6.4 Study Material Requirements

### FR-MAT-001 — Material Creation

**Priority:** MUST

Authorized teachers shall be able to create educational materials.

---

### FR-MAT-002 — Material Organization

**Priority:** MUST

The system shall organize learning materials by subject and appropriate categories.

---

### FR-MAT-003 — Material Access

**Priority:** MUST

Authorized students shall be able to access published materials associated with subjects they can access.

---

### FR-MAT-004 — Material Update

**Priority:** MUST

Authorized content owners shall be able to update permitted material information.

---

### FR-MAT-005 — Material Status

**Priority:** SHOULD

Materials should support states such as:

- Draft
- Published
- Archived

---

# 6.5 PDF Resource Requirements

### FR-PDF-001 — PDF Upload

**Priority:** MUST

Authorized teachers shall be able to upload PDF educational resources.

---

### FR-PDF-002 — PDF Validation

**Priority:** MUST

The system shall validate uploaded PDF files according to configured file-type, size, and security rules.

---

### FR-PDF-003 — PDF Association

**Priority:** MUST

Each approved PDF resource shall be associated with the appropriate subject/material context.

---

### FR-PDF-004 — PDF Access

**Priority:** MUST

Authorized students shall be able to view or download PDF resources according to configured permissions.

---

### FR-PDF-005 — PDF Metadata

**Priority:** SHOULD

The system should maintain metadata such as:

- Title
- Description
- Owner
- Subject
- Upload date
- File size
- Status

---

# 6.6 Video Resource Requirements

### FR-VID-001 — Video Resource Creation

**Priority:** SHOULD

Authorized teachers shall be able to create video learning resources.

---

### FR-VID-002 — Video Metadata

**Priority:** SHOULD

The system should store relevant video information.

---

### FR-VID-003 — Video Access

**Priority:** SHOULD

Authorized students shall be able to access published video resources.

---

### FR-VID-004 — External Video Support

**Priority:** SHOULD

The system should support approved external video URLs where applicable.

---

# 6.7 Assignment Requirements

### FR-ASG-001 — Assignment Creation

**Priority:** MUST

Authorized teachers shall be able to create assignments.

---

### FR-ASG-002 — Assignment Details

**Priority:** MUST

An assignment shall support appropriate information including:

- Title
- Description
- Instructions
- Subject
- Due date
- Publication state

---

### FR-ASG-003 — Assignment Publication

**Priority:** MUST

Teachers shall be able to publish an assignment to authorized students.

---

### FR-ASG-004 — Assignment Access

**Priority:** MUST

Authorized students shall be able to view published assignments.

---

### FR-ASG-005 — Assignment Submission

**Priority:** MUST

Students shall be able to submit assignments according to configured submission rules.

---

### FR-ASG-006 — Submission Status

**Priority:** MUST

The system shall maintain assignment submission status.

Example:

```text
Not Started
In Progress
Submitted
Late
Reviewed
```

---

### FR-ASG-007 — Teacher Review

**Priority:** MUST

Authorized teachers shall be able to review student submissions.

---

### FR-ASG-008 — Feedback

**Priority:** MUST

Teachers shall be able to provide appropriate feedback on submissions.

---

### FR-ASG-009 — Due-Date Handling

**Priority:** MUST

The system shall apply configured due-date rules consistently.

---

# 6.8 Quiz Requirements

### FR-QUIZ-001 — Quiz Creation

**Priority:** MUST

Authorized teachers shall be able to create quizzes.

---

### FR-QUIZ-002 — Question Creation

**Priority:** MUST

Authorized teachers shall be able to create supported quiz questions.

---

### FR-QUIZ-003 — Multiple Choice

**Priority:** MUST

The MVP shall support multiple-choice questions.

---

### FR-QUIZ-004 — Quiz Publication

**Priority:** MUST

Teachers shall be able to publish quizzes to authorized students.

---

### FR-QUIZ-005 — Quiz Attempt

**Priority:** MUST

Students shall be able to attempt published quizzes.

---

### FR-QUIZ-006 — Answer Submission

**Priority:** MUST

The system shall record submitted answers.

---

### FR-QUIZ-007 — Automatic Scoring

**Priority:** MUST

The system shall automatically score supported objective questions.

---

### FR-QUIZ-008 — Result Display

**Priority:** MUST

The system shall display quiz results according to configured visibility rules.

---

### FR-QUIZ-009 — Attempt Management

**Priority:** SHOULD

The system should support configured attempt rules such as:

- Maximum attempts
- Open/close period
- Retake permissions

---

# 6.9 AI Assistant Requirements

### FR-AI-001 — AI Question Submission

**Priority:** MUST

Authorized students shall be able to submit educational questions to the AI assistant.

---

### FR-AI-002 — AI Response

**Priority:** MUST

The system shall return an AI-generated response when the AI service is available.

---

### FR-AI-003 — Educational Context

**Priority:** SHOULD

Where supported, the AI assistant should use relevant subject or learning-material context when responding.

---

### FR-AI-004 — Conversation Context

**Priority:** SHOULD

The system should maintain appropriate conversational context during an AI interaction.

---

### FR-AI-005 — AI Failure Handling

**Priority:** MUST

The system shall handle AI service failures gracefully.

The user should receive a clear status message rather than an unexplained system error.

---

### FR-AI-006 — AI Safety

**Priority:** MUST

The AI feature shall include appropriate safeguards for educational use, including protection against unsafe or inappropriate system behavior.

---

### FR-AI-007 — AI Transparency

**Priority:** SHOULD

The system should clearly identify AI-generated responses.

---

### FR-AI-008 — AI Content Boundaries

**Priority:** MUST

The AI assistant shall operate within approved product and safety boundaries.

It shall not be treated as a guaranteed source of academic truth.

---

### FR-AI-009 — AI Usage Monitoring

**Priority:** SHOULD

The system should record appropriate operational information needed to monitor AI usage, failures, and performance while respecting privacy requirements.

---

# 6.10 Notification Requirements

### FR-NOT-001 — Notification Creation

**Priority:** SHOULD

The system should generate notifications for configured learning events.

---

### FR-NOT-002 — Assignment Notification

**Priority:** SHOULD

The system should notify relevant students about published or updated assignments where enabled.

---

### FR-NOT-003 — Quiz Notification

**Priority:** SHOULD

The system should notify relevant users about configured quiz events.

---

### FR-NOT-004 — System Notification

**Priority:** SHOULD

The system should support important system-level notifications.

---

### FR-NOT-005 — Read State

**Priority:** SHOULD

Users should be able to identify read and unread notifications.

---

# 6.11 Progress Requirements

### FR-PROG-001 — Activity Recording

**Priority:** MUST

The system shall record relevant learning activities required to support basic progress information.

---

### FR-PROG-002 — Assignment Progress

**Priority:** MUST

The system shall provide appropriate assignment completion information.

---

### FR-PROG-003 — Quiz Results

**Priority:** MUST

The system shall associate quiz results with the appropriate student and quiz.

---

### FR-PROG-004 — Subject Progress

**Priority:** SHOULD

The system should provide basic subject-level progress information.

---

### FR-PROG-005 — Teacher Visibility

**Priority:** SHOULD

Authorized teachers should be able to view permitted student learning activity.

---

# 6.12 Administration Requirements

### FR-ADM-001 — User Management

**Priority:** MUST

Platform administrators shall be able to manage user accounts according to their permissions.

---

### FR-ADM-002 — Role Management

**Priority:** MUST

Authorized administrators shall be able to assign or manage supported user roles.

---

### FR-ADM-003 — Account Status

**Priority:** MUST

Authorized administrators shall be able to manage supported account states.

---

### FR-ADM-004 — Content Moderation

**Priority:** MUST

Authorized administrators shall be able to take appropriate moderation actions on content.

---

### FR-ADM-005 — Subject Administration

**Priority:** SHOULD

Authorized administrators should be able to manage subject records where operationally required.

---

### FR-ADM-006 — Administrative Auditability

**Priority:** MUST

Security-sensitive administrative actions shall be recorded sufficiently for operational auditing.

---

# 6.13 Search and Discovery Requirements

### FR-SEARCH-001 — Basic Search

**Priority:** SHOULD

The system should provide basic search across approved educational resources.

---

### FR-SEARCH-002 — Authorized Results

**Priority:** MUST

Search results shall only expose resources that the requesting user is authorized to access.

---

### FR-SEARCH-003 — Subject Filtering

**Priority:** SHOULD

Users should be able to filter resources by subject or relevant category where supported.

---

# 6.14 General Data Requirements

### FR-DATA-001 — Data Integrity

**Priority:** MUST

The system shall maintain data consistency across related entities.

---

### FR-DATA-002 — Ownership

**Priority:** MUST

The system shall maintain appropriate ownership relationships for user-created content.

---

### FR-DATA-003 — Deletion Rules

**Priority:** MUST

Deletion of records shall follow defined authorization, dependency, and data-retention rules.

---

### FR-DATA-004 — Audit Information

**Priority:** SHOULD

The system should maintain appropriate created/updated metadata for important records.

---

# 7. Non-Functional Requirements

Non-functional requirements define quality attributes and operational constraints.

Requirement IDs use:

```text
NFR-SEC-xxx
NFR-PERF-xxx
NFR-REL-xxx
NFR-USAB-xxx
NFR-SCALE-xxx
NFR-MAINT-xxx
NFR-TEST-xxx
NFR-OBS-xxx
NFR-COMP-xxx
```

---

# 7.1 Security

### NFR-SEC-001 — Authentication Security

The system shall use secure authentication mechanisms appropriate to the selected architecture.

---

### NFR-SEC-002 — Password Protection

Passwords shall never be stored as plaintext.

---

### NFR-SEC-003 — Authorization Enforcement

Authorization shall be enforced server-side.

Frontend restrictions alone shall not be considered sufficient security.

---

### NFR-SEC-004 — Data Protection

Sensitive user data shall be protected against unauthorized access.

---

### NFR-SEC-005 — Transport Security

Production communication containing sensitive information shall use secure transport mechanisms.

---

### NFR-SEC-006 — Input Validation

User-controlled input shall be validated and sanitized according to its context.

---

### NFR-SEC-007 — File Security

Uploaded files shall be validated and handled using appropriate security controls.

---

### NFR-SEC-008 — API Security

APIs shall enforce authentication, authorization, validation, and appropriate rate/abuse protections.

---

### NFR-SEC-009 — Secrets Management

Credentials, API keys, tokens, and secrets shall not be committed to source control.

---

### NFR-SEC-010 — Administrative Security

Administrative operations shall receive stronger authorization controls appropriate to their risk.

---

# 7.2 Performance

### NFR-PERF-001 — Response Time

Common user interactions should provide acceptable response times under expected normal load.

Exact measurable thresholds shall be finalized during performance planning.

---

### NFR-PERF-002 — Database Efficiency

The system shall use appropriate database queries and indexing for frequently accessed operations.

---

### NFR-PERF-003 — File Operations

File uploads/downloads shall be handled efficiently without unnecessarily blocking unrelated application operations.

---

### NFR-PERF-004 — AI Response Handling

AI requests should provide clear loading/status states and handle long-running requests appropriately.

---

# 7.3 Reliability

### NFR-REL-001 — Error Handling

The system shall handle expected errors gracefully.

---

### NFR-REL-002 — Data Integrity

Critical operations shall maintain data integrity even when an operation fails.

---

### NFR-REL-003 — Service Failure

Failure of a non-critical external service shall not unnecessarily bring down unrelated platform functionality.

---

### NFR-REL-004 — Recovery

The system shall have an appropriate backup and recovery strategy before production release.

---

# 7.4 Availability

### NFR-AVAIL-001 — Availability Target

The production availability target shall be defined before production launch.

---

### NFR-AVAIL-002 — Planned Maintenance

Planned maintenance should be communicated appropriately where it affects users.

---

# 7.5 Usability

### NFR-USAB-001 — Navigation

The interface shall provide consistent navigation across major learning workflows.

---

### NFR-USAB-002 — Error Messages

User-facing errors should be understandable and actionable.

---

### NFR-USAB-003 — Responsive Experience

The web interface shall support common desktop and mobile browser screen sizes.

---

### NFR-USAB-004 — Learning Workflow

The primary student and teacher workflows should be understandable without requiring technical knowledge.

---

# 7.6 Accessibility

### NFR-ACC-001 — Accessible Interface

The system should follow recognized accessibility practices appropriate to the product's supported platforms.

---

### NFR-ACC-002 — Keyboard Access

Core workflows should support keyboard interaction where applicable.

---

### NFR-ACC-003 — Semantic Structure

The interface should use appropriate semantic structures and labels.

---

# 7.7 Scalability

### NFR-SCALE-001 — Modular Growth

The system architecture shall allow major product components to evolve independently where practical.

---

### NFR-SCALE-002 — User Growth

The system should support growth in users, subjects, resources, and activity without fundamental architectural redesign.

---

### NFR-SCALE-003 — AI Scaling

AI workloads should be isolated sufficiently to prevent unnecessary impact on core platform operations.

---

# 7.8 Maintainability

### NFR-MAINT-001 — Code Quality

Production code shall follow agreed coding standards.

---

### NFR-MAINT-002 — Modularity

Software components should have clear responsibilities and limited unnecessary coupling.

---

### NFR-MAINT-003 — Documentation

Important APIs, architectural decisions, configurations, and operational procedures shall be documented.

---

### NFR-MAINT-004 — Version Control

Source code and configuration changes shall be managed through version control.

---

# 7.9 Testability

### NFR-TEST-001 — Automated Testing

Critical business logic shall have automated test coverage appropriate to its risk.

---

### NFR-TEST-002 — API Testing

Critical API behavior shall be testable independently of the user interface.

---

### NFR-TEST-003 — Acceptance Testing

MVP requirements shall have verifiable acceptance criteria.

---

# 7.10 Observability

### NFR-OBS-001 — Logging

Important system events and errors shall be logged appropriately.

---

### NFR-OBS-002 — Monitoring

Production systems shall have appropriate monitoring for critical services.

---

### NFR-OBS-003 — Error Tracking

Production errors should be identifiable and traceable to their source.

---

# 7.11 Privacy

### NFR-PRIV-001 — Data Minimization

The system should collect only information necessary for approved product functionality.

---

### NFR-PRIV-002 — Access Control

Personal information shall only be accessible to authorized users.

---

### NFR-PRIV-003 — Data Retention

Data retention rules shall be defined before production release for applicable data.

---

### NFR-PRIV-004 — AI Data Handling

User data sent to external AI services shall follow approved privacy and data-processing requirements.

---

# 8. External Interfaces

## 8.1 User Interface

The primary user interface is expected to be a responsive web application.

Major UI areas include:

```text
Authentication
Dashboard
Profile
Subjects
Materials
Assignments
Quizzes
AI Assistant
Notifications
Progress
Administration
```

---

## 8.2 API Interface

The backend should expose documented APIs for supported frontend and service operations.

Expected API concerns include:

- Authentication
- Users
- Profiles
- Subjects
- Materials
- Assignments
- Submissions
- Quizzes
- Attempts
- AI
- Notifications
- Progress
- Administration

The detailed API contract will be documented separately.

---

## 8.3 Database Interface

The application shall interact with a persistent database for structured application data.

The current technology direction is PostgreSQL, subject to architecture approval.

---

## 8.4 File Storage Interface

The platform shall use appropriate storage for educational files such as PDFs.

Storage may be:

- Object storage
- Cloud storage
- Managed file storage

The final choice will be documented in the architecture and infrastructure documents.

---

## 8.5 AI Interface

The AI subsystem may communicate with:

- External LLM provider
- Self-hosted model
- AI gateway/service
- Retrieval system
- Embedding/vector infrastructure

The AI interface shall isolate the rest of the application from provider-specific implementation where practical.

---

## 8.6 Notification Interface

The notification system may integrate with:

- In-app notification service
- Email provider
- SMS provider
- Push notification infrastructure

Only approved channels will be included in a specific release.

---

# 9. Constraints

## 9.1 Team Constraint

The initial development team consists of four members.

Therefore:

- Scope must remain controlled.
- Responsibilities must be clearly assigned.
- Parallel work should be planned carefully.
- Complex infrastructure should be introduced only when justified.

---

## 9.2 Time Constraint

The project is expected to follow a controlled development timeline.

New features must be evaluated against schedule impact.

---

## 9.3 Budget Constraint

The project should prioritize cost-effective infrastructure and third-party services.

External AI, storage, email, SMS, and hosting costs must be considered before adoption.

---

## 9.4 Technical Constraints

The selected architecture must remain maintainable by the team.

Technology should not be introduced solely because it is popular.

---

## 9.5 Security Constraint

Security requirements apply from the beginning of development.

Security must not be treated only as a pre-release activity.

---

## 9.6 AI Constraint

AI behavior depends on:

- Model quality
- Context quality
- Provider availability
- Token/cost limits
- Latency
- Evaluation quality
- Safety controls

Therefore, AI functionality must include appropriate fallback and evaluation strategies.

---

# 10. Assumptions

The current SRS assumes:

1. Users have internet access.
2. The primary experience is web-based.
3. Students and teachers are the main users.
4. Administrative users have controlled elevated privileges.
5. Teachers are authorized to publish educational resources.
6. Educational content may be stored using external/object storage.
7. AI services may depend on third-party or self-hosted infrastructure.
8. Product requirements will be refined before implementation.
9. Security and privacy requirements will apply throughout the system.
10. The team will maintain source control and documentation.
11. Scope changes will follow formal change control.
12. The exact technology stack will be finalized through architecture documentation.
13. The initial release does not require native mobile applications.
14. The initial release does not require integrated payments.
15. The initial release does not require live video conferencing.

---

# 11. Dependencies

## 11.1 Internal Dependencies

| Dependency | Impact |
|---|---|
| Authentication | Required by protected features |
| Authorization | Required for role-based access |
| User profiles | Required for personalized workflows |
| Subject model | Required for resource organization |
| Storage | Required for PDF/file resources |
| Assignment model | Required for submissions/progress |
| Quiz model | Required for assessment/progress |
| Activity tracking | Required for progress |
| Notification events | Required for notifications |
| AI service | Required for AI assistant |
| Administration | Required for operational management |

---

## 11.2 External Dependencies

Potential external dependencies include:

- Cloud hosting
- Database hosting
- Object storage
- AI/LLM provider
- Email provider
- SMS provider
- Authentication provider
- Monitoring services
- Domain/DNS services

Each external dependency should have an identified owner and fallback strategy where its failure could affect critical functionality.

---

# 12. Acceptance Criteria

## 12.1 General Acceptance Principle

A requirement is not considered complete merely because code exists.

The implementation must:

1. Satisfy the requirement.
2. Pass relevant tests.
3. Meet security expectations.
4. Meet acceptance criteria.
5. Avoid breaking existing functionality.
6. Be documented where required.

---

# 12.2 Authentication Acceptance

The authentication module is accepted when:

- A valid user can register.
- A valid user can authenticate.
- Invalid credentials are rejected.
- Protected resources reject unauthorized access.
- Logout invalidates the appropriate session/token state.
- Role-based authorization is enforced.

---

# 12.3 Subject Acceptance

Subject functionality is accepted when:

- Authorized teachers can create subjects.
- Subject information can be managed.
- Authorized students can access relevant subjects.
- Unauthorized users cannot access protected subject content.
- Resources can be associated with subjects.

---

# 12.4 Material Acceptance

Material functionality is accepted when:

- Authorized teachers can create resources.
- Resources are associated with the correct subject.
- Students can access published resources.
- Unauthorized users cannot access restricted resources.

---

# 12.5 Assignment Acceptance

Assignment functionality is accepted when:

- Teachers can create assignments.
- Students can access published assignments.
- Students can submit according to configured rules.
- Submission status is recorded.
- Teachers can review submissions.
- Teachers can provide feedback.

---

# 12.6 Quiz Acceptance

Quiz functionality is accepted when:

- Teachers can create quizzes.
- Supported questions can be created.
- Students can attempt published quizzes.
- Answers are recorded.
- Supported objective questions are scored correctly.
- Results are displayed according to configured rules.

---

# 12.7 AI Acceptance

AI functionality is accepted when:

- An authorized user can submit an educational question.
- The system sends the request to the configured AI service.
- A response is returned when the service is available.
- AI failure is handled gracefully.
- AI-generated output is clearly identified where required.
- Relevant safety and privacy controls are applied.

---

# 12.8 Notification Acceptance

Notification functionality is accepted when:

- Configured events generate notifications.
- Notifications are delivered through supported channels.
- Users can identify unread notifications where applicable.
- Unauthorized users cannot access another user's notifications.

---

# 12.9 Administration Acceptance

Administrative functionality is accepted when:

- Authorized administrators can manage users within their permissions.
- Role permissions are enforced.
- Administrative actions are auditable where required.
- Unauthorized users cannot access administrative functionality.

---

# 12.10 Non-Functional Acceptance

Before MVP release:

- Critical security tests pass.
- Critical workflows pass functional testing.
- Core APIs are tested.
- Important error paths are tested.
- Production logging is operational.
- Monitoring is configured for critical services.
- Backup/recovery procedures are documented.
- Deployment procedures are documented.
- Known critical defects are resolved or formally accepted.

---

# 13. Requirement Traceability

Requirements shall eventually be traceable through the complete SDLC.

```text
Problem
  ↓
Persona
  ↓
Journey
  ↓
User Story
  ↓
SRS Requirement
  ↓
Use Case
  ↓
Design
  ↓
Code
  ↓
Test Case
  ↓
Acceptance
```

---

## 13.1 Initial Traceability Matrix

| Requirement Area | Problem/Need | Persona | Future Artifact |
|---|---|---|---|
| Authentication | Secure access | All | Use Cases / API |
| Student Profile | Personalized learning | Student | User Stories |
| Teacher Profile | Teaching identity | Teacher | User Stories |
| Subject Spaces | Organized learning | Student / Teacher | Use Cases |
| Materials | Scattered resources | Student / Teacher | User Stories |
| PDFs | Centralized documents | Student / Teacher | Functional Design |
| Videos | Learning resources | Student / Teacher | Functional Design |
| Assignments | Structured practice | Student / Teacher | Use Cases |
| Quizzes | Assessment | Student / Teacher | Use Cases |
| AI Assistant | Learning assistance | Student / Teacher | AI Requirements |
| Notifications | Important updates | All | Notification Design |
| Progress | Learning visibility | Student / Teacher | Analytics Requirements |
| Administration | Platform operation | Admins | Admin Use Cases |

---

# 14. Requirement Priority Model

Requirements should be prioritized using:

## MUST

Without the requirement, the MVP cannot adequately validate the core product.

## SHOULD

The requirement provides meaningful value but the MVP can remain valid if it is deferred.

## COULD

The requirement provides additional value but is not necessary for the current release.

## FUTURE

The requirement is intentionally outside the current release scope.

---

# 15. Requirement Change Management

Requirements are expected to evolve.

However, changes must be controlled.

## Change Process

```text
Change Request
      ↓
Identify Requirement
      ↓
Identify Reason
      ↓
Analyze Impact
      ↓
Estimate Effort
      ↓
Assess Risk
      ↓
Assess Scope
      ↓
Product Decision
      ↓
Approve / Reject / Defer
      ↓
Update SRS
      ↓
Update Backlog
      ↓
Update Design/Test Artifacts
```

---

# 16. Requirement Change Impact Areas

Every significant change should evaluate:

- Product scope
- User experience
- Architecture
- Database
- API
- Security
- Privacy
- Performance
- Testing
- Deployment
- AI infrastructure
- Documentation
- Schedule
- Team capacity

---

# 17. Definition of a Well-Formed Requirement

A well-formed SyllabAI requirement should be:

### Necessary

There is a valid product or stakeholder reason.

### Unambiguous

Different team members should interpret it consistently.

### Verifiable

QA should be able to determine whether it has been satisfied.

### Feasible

The team can realistically implement it within constraints.

### Traceable

It can be linked to a user need, scope item, or product objective.

### Atomic

Where practical, it expresses one primary requirement rather than combining unrelated behaviors.

### Consistent

It must not contradict another approved requirement.

---

# 18. Requirement Writing Standard

Avoid:

> The system should have a really fast and user-friendly dashboard.

Prefer:

> The system shall provide the authenticated user with access to the dashboard appropriate to their role.

Avoid:

> The AI should be intelligent.

Prefer:

> The system shall send an authorized user's educational question to the configured AI service and return the generated response when the service is available.

Avoid:

> PDFs should work properly.

Prefer:

> The system shall validate supported PDF uploads against configured file-type and size constraints before storing them.

---

# 19. Requirement Completeness Checklist

Before a requirement is approved:

- [ ] Requirement ID exists
- [ ] Requirement has a clear statement
- [ ] Requirement has a priority
- [ ] Requirement has a reason or traceability source
- [ ] Requirement is unambiguous
- [ ] Requirement is feasible
- [ ] Requirement is testable
- [ ] Requirement does not conflict with another requirement
- [ ] Dependencies are identified
- [ ] Acceptance criteria are defined
- [ ] Security implications are considered
- [ ] Privacy implications are considered
- [ ] Scope alignment is confirmed

---

# 20. MVP Requirements Summary

| Category | MUST | SHOULD | Current Decision |
|---|---:|---:|---|
| Authentication | Yes | — | MVP |
| Authorization | Yes | — | MVP |
| Student Profile | Yes | — | MVP |
| Teacher Profile | Yes | — | MVP |
| Subject Spaces | Yes | — | MVP |
| Study Materials | Yes | — | MVP |
| PDF Resources | Yes | — | MVP |
| Video Resources | — | Yes | MVP Candidate |
| Assignments | Yes | — | MVP |
| Quizzes | Yes | — | MVP |
| AI Assistant | Yes | — | MVP |
| Notifications | — | Yes | MVP Candidate |
| Basic Progress | Yes | — | MVP |
| Administration | Yes | — | MVP |
| Advanced Analytics | — | — | Future |
| Payments | — | — | Out of Scope |
| Live Video | — | — | Out of Scope |
| Native Apps | — | — | Out of Scope |
| Proctoring | — | — | Out of Scope |

---

# 21. Open Requirements Questions

The following questions must be resolved before the SRS is formally baselined:

1. What exact registration fields are required?
2. Will phone, email, or both be supported for authentication?
3. Will Google/social authentication be part of MVP?
4. How will students gain access to subjects?
5. Will subjects be public, private, invitation-based, or institution-based?
6. Can students upload study materials?
7. Which file formats beyond PDF are required?
8. What maximum PDF file size is acceptable?
9. Which video hosting providers are allowed?
10. What exact assignment submission types are required?
11. Which quiz question types are required?
12. How many quiz attempts should be allowed?
13. Should students see correct answers immediately?
14. What exact AI capabilities are required for MVP?
15. Will AI use uploaded/approved course materials as context?
16. How should AI conversations be stored?
17. Which notification channels are required?
18. What exact progress metrics are required?
19. What institution-management capabilities belong in MVP?
20. What administrator actions require audit logs?
21. What accessibility level should be targeted?
22. What production performance targets should be adopted?
23. What availability target is required?
24. What data-retention rules apply?
25. Which privacy/regulatory requirements apply to the deployment?
26. Which external services will be used?
27. What are the final MVP acceptance thresholds?

These questions should be resolved through requirements workshops, stakeholder validation, architecture decisions, and subsequent documents.

---

# 22. SRS Approval Criteria

The SRS should not be considered fully baselined until:

- Product scope is approved.
- User classes are confirmed.
- Functional requirements are reviewed.
- Non-functional requirements are reviewed.
- External interfaces are identified.
- Constraints are understood.
- Assumptions are documented.
- Dependencies are documented.
- Acceptance criteria are agreed.
- Open critical questions are resolved.
- Requirements are traceable to product needs.
- Product Owner and Technical Lead approve the baseline.

---

# 23. Approval

| Role | Name | Decision | Signature | Date |
|---|---|---|---|---|
| Project Sponsor | TBD | Pending | TBD | TBD |
| Product Owner | TBD | Pending | TBD | TBD |
| Project Manager | TBD | Pending | TBD | TBD |
| Technical Lead | TBD | Pending | TBD | TBD |
| QA Lead | TBD | Pending | TBD | TBD |

---

# 24. Revision History

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | 2026-10-03 | SyllabAI Team | Initial SRS draft |
| 1.0 | 2026-10-03 | SyllabAI Team | Initial requirements baseline candidate |

---

# 25. Document Status

**Document:** `07-srs.md`

**Document ID:** `SAB-DOC-007`

**Current Status:** Draft — Requirements Baseline Candidate

**Previous Document:** `06-product-scope.md`

**Next Document:** `08-use-cases.md`

**SDLC Stage:** Requirements Engineering

**Requirements Standard Reference:** ISO/IEC/IEEE 29148 principles

**Development Status:** No production coding yet

**Core Principle:**

> **Every significant software capability must have a clear, testable, traceable requirement before implementation.**
