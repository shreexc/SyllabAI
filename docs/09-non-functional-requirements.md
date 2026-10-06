# SyllabAI — Non-Functional Requirements Document

## Document Control

| Field | Details |
|---|---|
| Document ID | SAB-DOC-009 |
| Document Name | Non-Functional Requirements Document |
| File Name | `09-non-functional-requirements.md` |
| Product | SyllabAI |
| Document Type | Non-Functional Requirements |
| SDLC Stage | Requirements Engineering |
| Status | Draft — NFR Baseline Candidate |
| Version | 1.0 |
| Previous Document | `08-functional-requirements.md` |
| Next Document | `10-use-cases.md` |
| Development Status | No production coding yet |
| Product Owner | TBD |
| Project Manager | TBD |
| Technical Lead | TBD |
| QA Lead | TBD |
| Prepared By | SyllabAI Team |
| Last Updated | 2026-10-03 |

---

# 1. Purpose

This document defines the non-functional requirements (NFRs) for SyllabAI.

Functional requirements describe **what the system does**.

Non-functional requirements describe **how well the system must operate and what quality characteristics it must satisfy**.

For example:

```text
Functional Requirement
    ↓
Student can log in

Non-Functional Requirement
    ↓
Login must be secure, reliable, and respond within an agreed target
```

NFRs are critical because a system can be functionally correct while still being:

- Slow
- Insecure
- Difficult to maintain
- Unreliable
- Inaccessible
- Difficult to scale
- Difficult to test

Therefore, non-functional requirements are part of the product baseline rather than optional enhancements.

---

# 2. NFR Principles

SyllabAI NFRs should be:

- Measurable where practical
- Testable
- Realistic for the project
- Aligned with expected usage
- Traceable to business/user needs
- Reviewed before production
- Version controlled
- Updated when system scale changes

Where an exact threshold is not yet known, the requirement is marked as a **baseline candidate** and must be finalized before production release.

---

# 3. NFR Requirement ID Convention

Requirements use the following prefixes:

| Category | Prefix |
|---|---|
| Performance | `NFR-PERF-xxx` |
| Security | `NFR-SEC-xxx` |
| Reliability | `NFR-REL-xxx` |
| Availability | `NFR-AVAIL-xxx` |
| Scalability | `NFR-SCALE-xxx` |
| Maintainability | `NFR-MAINT-xxx` |
| Accessibility | `NFR-ACC-xxx` |
| Usability | `NFR-USAB-xxx` |
| Observability | `NFR-OBS-xxx` |
| Privacy | `NFR-PRIV-xxx` |
| Testing | `NFR-TEST-xxx` |
| Compatibility | `NFR-COMP-xxx` |
| Deployment | `NFR-DEPLOY-xxx` |
| Data Integrity | `NFR-DATA-xxx` |
| AI Quality | `NFR-AI-xxx` |

---

# 4. Requirement Priority

| Priority | Meaning |
|---|---|
| MUST | Required for MVP/production acceptance |
| SHOULD | Important and expected unless formally deferred |
| COULD | Useful improvement |
| FUTURE | Not required for current release |

---

# 5. Performance Requirements

Performance defines how quickly the system responds under expected operating conditions.

## 5.1 API Response Time

### NFR-PERF-001

**Priority:** MUST

For normal application API requests, the system should target:

| Metric | Target |
|---|---:|
| P50 response time | ≤ 300 ms |
| P95 response time | ≤ 800 ms |
| P99 response time | ≤ 1.5 s |

These targets apply to normal API operations excluding intentionally long-running operations such as AI generation and large file transfers.

---

## 5.2 Page Load Performance

### NFR-PERF-002

**Priority:** MUST

The application should provide a responsive initial user experience.

Target:

- Initial page/application shell: approximately ≤ 2.5 seconds under normal test conditions
- Main interactive content should become usable as early as practical.
- Performance should be measured using representative production-like builds.

---

## 5.3 Frontend Interaction

### NFR-PERF-003

**Priority:** SHOULD

Common client-side interactions should provide visible feedback within approximately 100–200 ms where no network operation is required.

Long-running operations shall display an appropriate loading/progress state.

---

## 5.4 Database Query Performance

### NFR-PERF-004

**Priority:** MUST

Frequently executed database operations shall be optimized through appropriate:

- Indexes
- Query design
- Pagination
- Filtering
- Selective loading
- Caching where justified

---

## 5.5 Pagination

### NFR-PERF-005

**Priority:** MUST

Large result sets shall use pagination or another bounded retrieval mechanism.

The system shall not unnecessarily return unbounded collections to clients.

---

## 5.6 File Upload Performance

### NFR-PERF-006

**Priority:** MUST

File upload operations shall avoid blocking unrelated application requests.

Large files should be handled using appropriate streaming, asynchronous processing, or object-storage mechanisms where necessary.

---

## 5.7 AI Response Performance

### NFR-PERF-007

**Priority:** MUST

AI requests shall provide a visible processing state.

The system shall not appear unresponsive while waiting for an AI provider.

Target:

- Request acknowledgement/status: ≤ 1 second where infrastructure permits
- AI response latency shall be monitored separately from normal API latency.

Because AI generation time depends on external/model infrastructure, AI response time is a monitored service-level metric rather than a fixed standard API threshold.

---

## 5.8 Performance Under Load

### NFR-PERF-008

**Priority:** MUST

The system shall be performance-tested using representative workloads before production release.

The baseline MVP load target is:

```text
100 concurrent active users
```

The team should verify that critical workflows remain usable under this load.

---

## 5.9 Performance Monitoring

### NFR-PERF-009

**Priority:** SHOULD

Production monitoring should track:

- API latency
- Database latency
- Error rate
- AI latency
- File-processing latency
- Page performance
- Resource utilization

---

# 6. Security Requirements

Security is a core system requirement.

## 6.1 Authentication Security

### NFR-SEC-001

**Priority:** MUST

Authentication mechanisms shall follow secure industry practices appropriate to the selected authentication architecture.

---

## 6.2 Authorization

### NFR-SEC-002

**Priority:** MUST

Authorization shall be enforced on the server/backend.

Client-side restrictions alone shall never be treated as sufficient access control.

---

## 6.3 Role-Based Access Control

### NFR-SEC-003

**Priority:** MUST

The system shall enforce role-based access control for:

- Student
- Teacher
- Institution Administrator
- Platform Administrator

Permissions shall follow the principle of least privilege.

---

## 6.4 Password Security

### NFR-SEC-004

**Priority:** MUST

Passwords shall:

- Never be stored in plaintext.
- Be stored using a modern adaptive password hashing algorithm.
- Follow an approved password policy.
- Never appear in application logs.

---

## 6.5 Session / JWT Security

### NFR-SEC-005

**Priority:** MUST

If JWT-based authentication is used:

- Access tokens shall have limited lifetimes.
- Refresh tokens shall be protected.
- Token validation shall occur server-side.
- Token rotation/revocation policies shall be defined.
- Tokens shall not be exposed unnecessarily to client-side scripts.

If session-based authentication is used, equivalent secure session controls shall apply.

---

## 6.6 Transport Security

### NFR-SEC-006

**Priority:** MUST

Production traffic containing sensitive information shall use encrypted transport.

HTTPS shall be required for production application traffic.

---

## 6.7 Rate Limiting

### NFR-SEC-007

**Priority:** MUST

The system shall implement appropriate rate limiting or abuse protection for sensitive endpoints.

At minimum, rate limiting should be considered for:

- Login
- Registration
- OTP/verification
- Password reset
- AI requests
- File uploads
- Public APIs

---

## 6.8 Input Validation

### NFR-SEC-008

**Priority:** MUST

All untrusted input shall be validated on the server.

This includes:

- Form input
- API requests
- Query parameters
- File metadata
- Uploaded files
- User-generated content

---

## 6.9 Injection Protection

### NFR-SEC-009

**Priority:** MUST

The system shall use appropriate protections against common injection vulnerabilities.

Examples include:

- SQL injection
- Command injection
- Cross-site scripting
- Template injection
- Unsafe deserialization

---

## 6.10 Cross-Site Request Protection

### NFR-SEC-010

**Priority:** MUST

The system shall implement appropriate CSRF protections where cookie-based authentication or state-changing browser requests require them.

---

## 6.11 Security Headers

### NFR-SEC-011

**Priority:** SHOULD

Production web responses should use appropriate security headers.

Examples include:

- Content Security Policy
- Strict-Transport-Security
- X-Content-Type-Options
- Referrer-Policy
- Appropriate frame protection

The exact policy will be finalized during security hardening.

---

## 6.12 File Security

### NFR-SEC-012

**Priority:** MUST

Uploaded files shall be protected against malicious content and unauthorized access.

Controls should include:

- File type validation
- File size validation
- Secure storage
- Access control
- Safe filenames/identifiers
- Malware scanning where justified
- Avoiding direct execution of uploaded content

---

## 6.13 Secrets Management

### NFR-SEC-013

**Priority:** MUST

Secrets shall not be committed to source control.

Examples:

- Database passwords
- API keys
- JWT secrets
- AI provider keys
- Storage credentials
- Email credentials

Secrets shall be supplied through secure configuration mechanisms.

---

## 6.14 Dependency Security

### NFR-SEC-014

**Priority:** SHOULD

Project dependencies should be regularly checked for known security vulnerabilities.

---

## 6.15 Administrative Security

### NFR-SEC-015

**Priority:** MUST

Administrative operations shall require appropriate authorization and shall follow stronger security controls than ordinary user actions.

---

## 6.16 Security Logging

### NFR-SEC-016

**Priority:** MUST

Security-sensitive events shall be logged appropriately without exposing secrets or sensitive credentials.

---

## 6.17 Security Testing

### NFR-SEC-017

**Priority:** MUST

Before production release, the application shall undergo security testing appropriate to its risk.

Testing should include:

- Authentication testing
- Authorization testing
- Input validation testing
- File security testing
- API security testing
- Dependency vulnerability scanning
- Common web vulnerability checks

---

# 7. Reliability Requirements

## 7.1 Failure Handling

### NFR-REL-001

**Priority:** MUST

The system shall handle expected failures without exposing internal implementation details to users.

---

## 7.2 Graceful Degradation

### NFR-REL-002

**Priority:** MUST

Failure of a non-critical external service shall not unnecessarily disable unrelated core functionality.

Example:

```text
AI Service Down
      ↓
AI Feature Unavailable
      ↓
Subjects / PDFs / Assignments
Remain Available
```

---

## 7.3 Transaction Integrity

### NFR-REL-003

**Priority:** MUST

Critical multi-step data operations shall maintain data consistency if an operation fails.

---

## 7.4 Data Integrity

### NFR-REL-004

**Priority:** MUST

The system shall prevent invalid relationships and inconsistent application state through appropriate validation and database constraints.

---

## 7.5 Backup

### NFR-REL-005

**Priority:** MUST

Production data shall have a documented backup strategy.

The baseline target is:

- Automated database backups
- At least daily backup for production database data
- Appropriate retention policy
- Backup verification

---

## 7.6 Recovery

### NFR-REL-006

**Priority:** MUST

A documented recovery procedure shall exist before production release.

Target baseline:

| Metric | Initial Target |
|---|---:|
| RPO | ≤ 24 hours |
| RTO | ≤ 8 hours |

These targets must be validated against actual infrastructure capabilities before production.

---

## 7.7 Backup Restoration Testing

### NFR-REL-007

**Priority:** MUST

Backups shall be periodically tested through restoration or equivalent verification.

A backup that has never been restored/tested shall not be assumed to be reliable.

---

## 7.8 Error Recovery

### NFR-REL-008

**Priority:** SHOULD

Recoverable failures should provide mechanisms for retrying or safely repeating operations where appropriate.

---

# 8. Availability Requirements

## NFR-AVAIL-001 — Production Availability

**Priority:** MUST

The initial production availability target should be:

```text
≥ 99.0% monthly availability
```

The target may be increased in future releases as infrastructure maturity increases.

---

## NFR-AVAIL-002 — Planned Maintenance

**Priority:** SHOULD

Planned maintenance that affects users should be communicated before the maintenance window where practical.

---

## NFR-AVAIL-003 — Health Checks

**Priority:** MUST

Critical production services shall expose appropriate health information for operational monitoring.

---

## NFR-AVAIL-004 — Service Restart

**Priority:** SHOULD

Critical services should be capable of restarting without manual intervention where infrastructure permits.

---

# 9. Scalability Requirements

Scalability defines the expected growth envelope.

These values are planning baselines, not permanent product limits.

## 9.1 Initial User Capacity

### NFR-SCALE-001

**Priority:** MUST

The initial architecture should support at least:

```text
1,000 registered users
100 concurrent active users
```

without fundamental architectural redesign.

---

## 9.2 Teacher Capacity

### NFR-SCALE-002

**Priority:** SHOULD

The initial system should support approximately:

```text
100 active teachers
```

within the planned deployment architecture.

---

## 9.3 Subject Capacity

### NFR-SCALE-003

**Priority:** SHOULD

The initial system should support at least:

```text
1,000 subjects
```

with appropriate indexing and pagination.

---

## 9.4 Educational Resource Capacity

### NFR-SCALE-004

**Priority:** SHOULD

The system should support at least:

```text
50,000 learning resources
```

including documents, links, and other supported resources, subject to infrastructure capacity.

---

## 9.5 File Storage Capacity

### NFR-SCALE-005

**Priority:** SHOULD

The initial architecture should support growth toward:

```text
100 GB+ educational file storage
```

without requiring a complete application redesign.

Actual capacity depends on the selected storage provider and budget.

---

## 9.6 AI Request Capacity

### NFR-SCALE-006

**Priority:** MUST

The AI subsystem shall be designed so AI workload growth does not unnecessarily block core application functionality.

Initial planning baseline:

```text
Up to 20 concurrent AI requests
```

The system should use appropriate:

- Queueing
- Rate limiting
- Timeouts
- Retries
- Provider limits
- Usage monitoring

---

## 9.7 Database Growth

### NFR-SCALE-007

**Priority:** MUST

The database architecture shall support growth in:

- Users
- Subjects
- Materials
- Assignments
- Quiz attempts
- Notifications
- Activity records

without requiring immediate replacement of the database technology.

---

## 9.8 Horizontal Growth

### NFR-SCALE-008

**Priority:** SHOULD

The application architecture should allow future horizontal scaling of stateless application services where practical.

---

# 10. Maintainability Requirements

## 10.1 Code Standards

### NFR-MAINT-001

**Priority:** MUST

Production code shall follow agreed language and framework coding standards.

Standards shall cover:

- Naming
- Formatting
- Structure
- Error handling
- Logging
- Documentation
- Testing

---

## 10.2 Architecture

### NFR-MAINT-002

**Priority:** MUST

The system shall use a documented architecture with clear component responsibilities.

---

## 10.3 Separation of Concerns

### NFR-MAINT-003

**Priority:** MUST

The implementation shall maintain appropriate separation between:

- Presentation
- Business logic
- Data access
- External services
- AI services
- Infrastructure concerns

---

## 10.4 Documentation

### NFR-MAINT-004

**Priority:** MUST

The team shall maintain documentation for:

- Architecture
- APIs
- Database
- Deployment
- Environment configuration
- Major workflows
- Important decisions
- Operational procedures

---

## 10.5 API Documentation

### NFR-MAINT-005

**Priority:** MUST

Production APIs shall have machine-readable or human-readable documentation sufficient for frontend and integration development.

---

## 10.6 Version Control

### NFR-MAINT-006

**Priority:** MUST

All production source code shall be maintained in version control.

---

## 10.7 Code Review

### NFR-MAINT-007

**Priority:** MUST

Significant production code changes shall undergo peer review before being merged into the protected production branch.

---

## 10.8 Dependency Management

### NFR-MAINT-008

**Priority:** MUST

Application dependencies shall be explicitly versioned and reproducible.

---

## 10.9 Technical Debt

### NFR-MAINT-009

**Priority:** SHOULD

Known technical debt should be documented rather than hidden.

Each significant technical-debt item should have:

- Description
- Impact
- Risk
- Owner
- Proposed resolution
- Priority

---

# 11. Accessibility Requirements

SyllabAI should be usable by people with different abilities.

The accessibility target should align with recognized web accessibility practices, with WCAG 2.2 AA used as the target reference where practical.

## 11.1 Keyboard Navigation

### NFR-ACC-001

**Priority:** MUST

Core workflows shall be usable through keyboard navigation.

This includes:

- Login
- Navigation
- Subject access
- Material access
- Assignment interaction
- Quiz interaction
- AI interaction
- Administrative workflows where applicable

---

## 11.2 Focus Visibility

### NFR-ACC-002

**Priority:** MUST

Interactive elements shall provide a visible focus indication when navigated by keyboard.

---

## 11.3 Semantic Structure

### NFR-ACC-003

**Priority:** SHOULD

The interface should use semantic HTML and appropriate structural elements.

---

## 11.4 Form Labels

### NFR-ACC-004

**Priority:** MUST

Form controls shall have accessible labels or equivalent accessible names.

---

## 11.5 Screen Reader Support

### NFR-ACC-005

**Priority:** MUST

Core interface content should be understandable using common screen-reader technologies.

---

## 11.6 Color Contrast

### NFR-ACC-006

**Priority:** MUST

Text and important interface elements shall meet the selected accessibility contrast target.

The project should use WCAG 2.2 AA contrast requirements as the baseline where applicable.

---

## 11.7 Do Not Depend Only on Color

### NFR-ACC-007

**Priority:** MUST

Information shall not be communicated using color alone.

Example:

```text
Incorrect
Red = failed
Green = passed
```

should be supplemented with text, icons, or another accessible indicator.

---

## 11.8 Typography

### NFR-ACC-008

**Priority:** SHOULD

Typography should remain readable across supported screen sizes and zoom levels.

---

## 11.9 Error Identification

### NFR-ACC-009

**Priority:** MUST

Form and workflow errors should be identifiable through accessible text or equivalent mechanisms.

---

# 12. Usability Requirements

## NFR-USAB-001 — Consistent Navigation

**Priority:** MUST

Major application sections shall use consistent navigation patterns.

---

## NFR-USAB-002 — Understandable Actions

**Priority:** MUST

Primary actions should use clear labels.

---

## NFR-USAB-003 — Feedback

**Priority:** MUST

The system shall provide feedback after important user actions.

Examples:

- Save
- Upload
- Submit
- Delete
- Publish
- Quiz submission

---

## NFR-USAB-004 — Loading States

**Priority:** MUST

Long-running operations shall provide appropriate loading/progress states.

---

## NFR-USAB-005 — Confirmation

**Priority:** SHOULD

Destructive or irreversible operations should require appropriate confirmation.

---

## NFR-USAB-006 — Responsive Design

**Priority:** MUST

The application shall support common desktop and mobile browser dimensions.

---

# 13. Observability Requirements

## 13.1 Application Logging

### NFR-OBS-001

**Priority:** MUST

The system shall maintain structured application logs appropriate for debugging and operations.

---

## 13.2 Error Logging

### NFR-OBS-002

**Priority:** MUST

Unexpected application errors shall be captured with sufficient context to support diagnosis without exposing secrets.

---

## 13.3 Metrics

### NFR-OBS-003

**Priority:** SHOULD

The production system should collect metrics such as:

- Request count
- Request latency
- Error rate
- CPU usage
- Memory usage
- Database performance
- Storage usage
- AI request count
- AI latency
- AI failure rate

---

## 13.4 Alerting

### NFR-OBS-004

**Priority:** SHOULD

Critical operational failures should generate alerts for responsible team members.

---

## 13.5 Auditability

### NFR-OBS-005

**Priority:** MUST

Important security and administrative events shall be auditable.

---

# 14. Privacy Requirements

## NFR-PRIV-001 — Data Minimization

**Priority:** MUST

The system shall collect only information required for approved functionality or legitimate operational requirements.

---

## NFR-PRIV-002 — Access Control

**Priority:** MUST

Personal information shall only be accessible to authorized users.

---

## NFR-PRIV-003 — Data Retention

**Priority:** MUST

Data retention periods shall be defined for applicable categories of data before production release.

---

## NFR-PRIV-004 — Data Deletion

**Priority:** SHOULD

Where applicable, the system should support approved deletion or deactivation processes consistent with product and legal requirements.

---

## NFR-PRIV-005 — AI Data Protection

**Priority:** MUST

Data sent to external AI services shall comply with the approved privacy and data-processing policy.

---

## NFR-PRIV-006 — Sensitive Data Logging

**Priority:** MUST

Sensitive personal information, passwords, authentication secrets, and private content shall not be unnecessarily written to logs.

---

# 15. Data Integrity Requirements

## NFR-DATA-001 — Referential Integrity

**Priority:** MUST

Relationships between core entities shall maintain valid references.

---

## NFR-DATA-002 — Validation

**Priority:** MUST

The system shall validate critical data before persistence.

---

## NFR-DATA-003 — Transactional Operations

**Priority:** MUST

Operations requiring atomicity shall use appropriate transaction mechanisms.

---

## NFR-DATA-004 — Duplicate Prevention

**Priority:** MUST

The system shall prevent duplicate records where business rules require uniqueness.

---

## NFR-DATA-005 — Consistent State

**Priority:** MUST

The system shall prevent invalid state transitions for critical entities.

---

# 16. Testing Requirements

## NFR-TEST-001 — Unit Testing

**Priority:** MUST

Critical business logic shall have automated unit tests.

---

## NFR-TEST-002 — Integration Testing

**Priority:** MUST

Critical integrations between system components shall be tested.

---

## NFR-TEST-003 — API Testing

**Priority:** MUST

Critical API endpoints shall have automated or repeatable tests.

---

## NFR-TEST-004 — End-to-End Testing

**Priority:** SHOULD

Critical user workflows should have end-to-end test coverage.

---

## NFR-TEST-005 — Regression Testing

**Priority:** MUST

Changes shall be tested against relevant existing functionality.

---

## NFR-TEST-006 — Security Testing

**Priority:** MUST

Security-sensitive functionality shall be tested before production release.

---

## NFR-TEST-007 — Performance Testing

**Priority:** MUST

The application shall be tested against the approved performance/load targets before production release.

---

## NFR-TEST-008 — Accessibility Testing

**Priority:** SHOULD

Core user workflows should be tested using automated and manual accessibility checks.

---

# 17. Compatibility Requirements

## NFR-COMP-001 — Browser Compatibility

**Priority:** MUST

The web application shall support current stable versions of major modern browsers used by the target audience.

At minimum, testing should cover:

- Chrome/Chromium
- Firefox
- Safari where supported
- Edge

---

## NFR-COMP-002 — Responsive Compatibility

**Priority:** MUST

The interface shall remain usable across supported desktop, tablet, and mobile viewport sizes.

---

## NFR-COMP-003 — API Compatibility

**Priority:** SHOULD

Backward-incompatible API changes should be managed through documented versioning or migration procedures.

---

# 18. Deployment Requirements

## NFR-DEPLOY-001 — Reproducible Deployment

**Priority:** MUST

Production deployment shall be reproducible through documented configuration and deployment procedures.

---

## NFR-DEPLOY-002 — Environment Separation

**Priority:** MUST

At minimum, development and production environments shall be logically separated.

A staging environment is strongly recommended.

---

## NFR-DEPLOY-003 — Configuration Management

**Priority:** MUST

Environment-specific configuration shall be separated from application source code.

---

## NFR-DEPLOY-004 — Database Migration

**Priority:** MUST

Database schema changes shall use version-controlled migration mechanisms.

---

## NFR-DEPLOY-005 — Rollback

**Priority:** SHOULD

Production deployments should have a documented rollback or recovery procedure.

---

## NFR-DEPLOY-006 — CI/CD

**Priority:** SHOULD

The project should use automated CI/CD checks for:

- Tests
- Linting
- Build validation
- Security checks
- Deployment validation

---

# 19. AI Quality Requirements

AI is a special subsystem because traditional deterministic software quality measures are insufficient.

## NFR-AI-001 — AI Availability Handling

**Priority:** MUST

The system shall handle AI service unavailability gracefully.

---

## NFR-AI-002 — AI Latency Monitoring

**Priority:** MUST

AI response latency shall be measured separately from normal API latency.

---

## NFR-AI-003 — AI Error Monitoring

**Priority:** MUST

AI failures, timeouts, provider errors, and rejected requests shall be observable.

---

## NFR-AI-004 — Context Authorization

**Priority:** MUST

AI retrieval/context systems shall respect user permissions.

---

## NFR-AI-005 — AI Evaluation

**Priority:** SHOULD

The project should establish an evaluation dataset or evaluation procedure for important AI workflows.

Evaluation should consider:

- Relevance
- Factuality
- Context adherence
- Safety
- Hallucination rate
- Response usefulness

---

## NFR-AI-006 — AI Cost Monitoring

**Priority:** SHOULD

AI usage and associated costs should be monitored.

---

## NFR-AI-007 — AI Rate Limiting

**Priority:** MUST

AI requests shall be subject to appropriate rate or usage controls.

---

# 20. File and Storage Requirements

## NFR-FILE-001 — File Size Limit

**Priority:** MUST

The system shall enforce configured upload limits.

Initial baseline:

```text
Maximum single educational file:
50 MB
```

The limit may differ by resource type and infrastructure decision.

---

## NFR-FILE-002 — Storage Durability

**Priority:** MUST

Production educational files shall use a storage mechanism appropriate for durability and recovery requirements.

---

## NFR-FILE-003 — File Access Control

**Priority:** MUST

Stored educational files shall not be publicly accessible unless the resource is intentionally configured as public.

---

## NFR-FILE-004 — File Naming

**Priority:** MUST

User-supplied filenames shall not be trusted as executable paths or direct storage identifiers.

---

# 21. API Quality Requirements

## NFR-API-001 — Consistent Responses

**Priority:** MUST

API responses shall follow consistent conventions.

---

## NFR-API-002 — Error Format

**Priority:** MUST

API errors shall use a documented and consistent response format.

---

## NFR-API-003 — Validation

**Priority:** MUST

API endpoints shall validate request data before performing protected operations.

---

## NFR-API-004 — Pagination

**Priority:** MUST

Large API collections shall use pagination.

---

## NFR-API-005 — Rate Limiting

**Priority:** MUST

Sensitive and abuse-prone APIs shall have appropriate rate limiting.

---

# 22. Operational Requirements

## NFR-OPS-001 — Environment Documentation

**Priority:** MUST

Required environment variables, services, and operational configuration shall be documented.

---

## NFR-OPS-002 — Incident Procedure

**Priority:** SHOULD

The project should maintain a basic incident-response procedure.

---

## NFR-OPS-003 — Service Ownership

**Priority:** MUST

Critical production services shall have an identified responsible team member or role.

---

## NFR-OPS-004 — Dependency Monitoring

**Priority:** SHOULD

Critical external dependencies should be monitored for outages or service degradation.

---

# 23. Quality Attribute Summary

| Quality Attribute | Baseline Target |
|---|---|
| API P50 | ≤ 300 ms |
| API P95 | ≤ 800 ms |
| API P99 | ≤ 1.5 s |
| Initial page/application shell | ~≤ 2.5 s target |
| Initial concurrent active users | 100 |
| Initial registered users | 1,000 |
| Initial teachers | 100 |
| Initial subjects | 1,000 |
| Initial learning resources | 50,000 |
| Initial file storage planning | 100 GB+ |
| Concurrent AI requests | 20 |
| Production availability | ≥ 99.0% |
| Database backup | At least daily |
| RPO | ≤ 24 hours |
| RTO | ≤ 8 hours |
| Maximum single file | 50 MB baseline |
| Accessibility target | WCAG 2.2 AA where practical |

These values are initial engineering baselines and should be validated against actual product requirements, infrastructure, budget, and load-testing results.

---

# 24. NFR Measurement Strategy

A non-functional requirement should have a way to be verified.

| Requirement Area | Verification Method |
|---|---|
| Performance | Load testing / APM |
| Security | Security testing / code review / scanning |
| Reliability | Failure testing / recovery testing |
| Availability | Monitoring |
| Scalability | Load testing |
| Maintainability | Code review / architecture review |
| Accessibility | Automated + manual testing |
| Usability | User testing |
| Observability | Operational verification |
| Privacy | Privacy/security review |
| Data integrity | Automated tests / database validation |
| AI quality | Evaluation dataset + monitoring |
| Deployment | Deployment rehearsal |

---

# 25. NFR Traceability

NFRs should eventually trace to:

```text
Product Objective
      ↓
NFR
      ↓
Architecture Decision
      ↓
Implementation
      ↓
Test
      ↓
Measurement
      ↓
Release Acceptance
```

Example:

```text
Need:
Reliable platform

      ↓

NFR-REL-005:
Daily production backups

      ↓

Architecture:
Managed PostgreSQL backup strategy

      ↓

Implementation:
Automated backup configuration

      ↓

Test:
Backup restoration test

      ↓

Evidence:
Successful restore

      ↓

Acceptance:
Requirement satisfied
```

---

# 26. NFR Acceptance Criteria

The NFR baseline should not be considered complete until:

- Performance targets are agreed.
- Security requirements are reviewed.
- Authentication and authorization controls are defined.
- Backup strategy is defined.
- Recovery targets are agreed.
- Availability target is agreed.
- Scalability assumptions are documented.
- Maintainability standards are documented.
- Accessibility target is approved.
- Monitoring requirements are defined.
- Privacy requirements are reviewed.
- AI quality requirements are defined.
- Testing strategy can verify critical NFRs.

---

# 27. NFR Risk Areas

The following NFR areas require special attention:

## Security Risk

Authentication, authorization, file uploads, AI access, and administrative functions can expose high-impact vulnerabilities.

## Performance Risk

AI operations, file processing, and poorly optimized database queries may become bottlenecks.

## Reliability Risk

External services can fail independently of the application.

## Scalability Risk

AI requests and file storage can grow faster than normal database traffic.

## Maintainability Risk

A four-person team cannot safely maintain an unnecessarily complex architecture.

## Accessibility Risk

Accessibility is difficult to retrofit after UI architecture and components are already established.

---

# 28. NFR Change Management

Any significant change to an NFR should follow change control.

A change request should document:

```text
NFR ID
Current Requirement
Requested Change
Reason
Expected Benefit
Performance Impact
Security Impact
Architecture Impact
Cost Impact
Testing Impact
Schedule Impact
Decision
Approver
Date
```

Changing an NFR threshold can have significant downstream effects and must therefore be treated as an engineering decision.

---

# 29. Pre-Production NFR Checklist

Before production release:

### Performance

- [ ] API performance tested
- [ ] Page performance tested
- [ ] Database performance reviewed
- [ ] Load testing completed
- [ ] AI latency measured
- [ ] File operations tested

### Security

- [ ] Authentication tested
- [ ] Authorization tested
- [ ] Password security verified
- [ ] Token/session security verified
- [ ] Rate limiting configured
- [ ] Input validation tested
- [ ] File security tested
- [ ] Secrets removed from source control
- [ ] Dependency vulnerabilities reviewed

### Reliability

- [ ] Backups configured
- [ ] Backup restoration tested
- [ ] Recovery procedure documented
- [ ] Error handling tested
- [ ] External-service failure handling tested

### Scalability

- [ ] Initial load target tested
- [ ] Database indexes reviewed
- [ ] Storage capacity reviewed
- [ ] AI capacity reviewed

### Maintainability

- [ ] Code standards applied
- [ ] Architecture documented
- [ ] API documentation available
- [ ] Deployment documentation available
- [ ] Code review completed

### Accessibility

- [ ] Keyboard navigation checked
- [ ] Focus states checked
- [ ] Contrast checked
- [ ] Forms checked
- [ ] Screen-reader behavior reviewed
- [ ] Responsive layouts checked

### Observability

- [ ] Logging configured
- [ ] Error tracking configured
- [ ] Monitoring configured
- [ ] Critical alerts configured
- [ ] Audit logging verified

---

# 30. Open NFR Decisions

The following values must be finalized before the NFR document becomes a fully baselined production requirement:

1. Exact production API latency targets.
2. Exact page performance targets and test conditions.
3. Maximum expected concurrent users for MVP.
4. Maximum expected registered users for the first release.
5. Expected annual user growth.
6. Exact file-size limits by resource type.
7. Exact monthly storage growth.
8. Exact AI requests per minute/hour.
9. Production availability target.
10. Backup retention period.
11. Final RPO.
12. Final RTO.
13. Disaster-recovery architecture.
14. Exact browser support matrix.
15. Accessibility compliance target.
16. Exact password policy.
17. Exact session/token lifetime.
18. Exact rate limits by endpoint category.
19. Final AI evaluation metrics.
20. Data retention requirements.
21. Applicable privacy/legal requirements.
22. Monitoring and alerting thresholds.
23. Production infrastructure budget.

---

# 31. Relationship With Other Documents

This document is derived from the SRS and functional requirements.

```text
06 Product Scope
        ↓
07 Software Requirements Specification
        ↓
08 Functional Requirements
        ↓
09 Non-Functional Requirements
        ↓
10 Use Cases
        ↓
11 System Architecture
        ↓
12 Database Design
        ↓
13 API Specification
        ↓
14 UI/UX Specification
        ↓
15 Test Strategy
```

The exact document sequence may evolve as the SyllabAI SDLC documentation set is refined.

---

# 32. Approval

| Role | Name | Decision | Signature | Date |
|---|---|---|---|---|
| Project Sponsor | TBD | Pending | TBD | TBD |
| Product Owner | TBD | Pending | TBD | TBD |
| Project Manager | TBD | Pending | TBD | TBD |
| Technical Lead | TBD | Pending | TBD | TBD |
| QA Lead | TBD | Pending | TBD | TBD |

---

# 33. Revision History

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | 2026-10-03 | SyllabAI Team | Initial NFR draft |
| 1.0 | 2026-10-03 | SyllabAI Team | Initial NFR baseline candidate |

---

# 34. Document Status

**Document:** `09-non-functional-requirements.md`

**Document ID:** `SAB-DOC-009`

**Current Status:** Draft — NFR Baseline Candidate

**Previous Document:** `08-functional-requirements.md`

**Next Document:** `10-use-cases.md`

**SDLC Stage:** Requirements Engineering

**Development Status:** No production coding yet

**Core Principle:**

> **A system is not production-ready merely because its features work; it must also be secure, reliable, performant, scalable, maintainable, testable, and accessible.**
