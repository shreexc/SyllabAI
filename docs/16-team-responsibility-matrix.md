# SyllabAI — Team Responsibility Matrix

## Document Control

| Field | Details |
|---|---|
| Document ID | SAB-DOC-016 |
| Document Name | Team Responsibility Matrix |
| File Name | `16-team-responsibility-matrix.md` |
| Product | SyllabAI |
| Document Type | Team Organization / Responsibility Definition |
| SDLC Stage | Project Planning / Team Organization |
| Team Size | 4 Members |
| Version | 1.0 |
| Status | Draft — Team Responsibility Baseline Candidate |
| Previous Document | `15-software-development-plan.md` |
| Next Document | TBD |
| Development Status | No production coding yet |
| Prepared By | SyllabAI Team |
| Last Updated | 2026-10-03 |

---

# 1. Purpose

This document defines the responsibilities, ownership areas, collaboration expectations, and decision boundaries for the four-member SyllabAI development team.

The goal is to prevent:

- Unclear ownership
- Duplicate work
- Knowledge silos
- "Someone else is doing it" situations
- Single-person dependency
- Unreviewed code
- Deployment dependency on one person
- Poor communication between frontend, backend, AI, QA, and DevOps

The team will use:

> **Primary Ownership + Shared Engineering Responsibility**

A member owns an area, but no member is the only person who understands that area.

---

# 2. Team Philosophy

The SyllabAI team will operate as a cross-functional engineering team.

The model is:

```text
Primary Responsibility
        +
Secondary Responsibility
        +
Shared Engineering Practices
        =
Team Ownership
```

The team must avoid:

```text
Member A → Backend only
Member B → Frontend only
Member C → AI only
Member D → QA only

        ❌ Knowledge Silos
```

Instead:

```text
                 SyllabAI Team
                      │
        ┌─────────────┼─────────────┐
        │             │             │
    Backend       Frontend          AI
        │             │             │
        └─────────────┼─────────────┘
                      │
                  QA / DevOps
                      │
               Shared Practices
                      │
   Requirements • Design • Git • Testing
   Code Review • Deployment • Documentation
```

---

# 3. Team Members

The names below are intentionally placeholders and can be replaced later.

| Member | Primary Area | Secondary Area |
|---|---|---|
| Member A | Backend / API | Architecture / Security |
| Member B | Frontend / UI | UX / API Integration |
| Member C | AI / ML | Backend / AI Evaluation |
| Member D | DevOps / QA / Integration | Backend / Testing |

The responsibilities are not permanent restrictions.

---

# 4. Responsibility Model

The team uses the following ownership levels:

| Level | Meaning |
|---|---|
| Primary Owner | Leads implementation and is accountable for the area |
| Secondary Owner | Can independently support or take over the area |
| Contributor | Participates when the work affects their area |
| Reviewer | Reviews the work for quality/security/architecture |
| Consulted | Provides domain or technical input |
| Informed | Must know about important changes |

---

# 5. Core Team Responsibility Matrix

Legend:

- **P** = Primary responsibility
- **S** = Secondary responsibility
- **C** = Contributor
- **R** = Reviewer
- **I** = Informed

| Area | Member A | Member B | Member C | Member D |
|---|---:|---:|---:|---:|
| Product Requirements | C | C | C | C |
| User Stories | C | C | C | C |
| Use Cases | C | C | C | C |
| Business Rules | C | C | C | C |
| System Architecture | P | C | C | R |
| Backend/API | P | C | S | C |
| Database | P | I | S | C |
| Authentication | P | C | C | R |
| Authorization | P | C | C | R |
| Frontend/UI | C | P | I | C |
| UX / Accessibility | C | P | C | R |
| AI/ML | C | I | P | C |
| AI Evaluation | C | C | P | P |
| DevOps | C | I | C | P |
| CI/CD | C | I | C | P |
| Testing Strategy | C | C | C | P |
| Automated Testing | C | C | S | P |
| Security | P | C | C | P |
| Code Review | P | P | P | P |
| Git / Branching | C | C | C | P |
| Deployment | C | I | C | P |
| Monitoring | C | I | C | P |
| Documentation | P | C | C | P |
| Technical Debt | P | C | C | P |
| Release Management | C | C | C | P |
| Incident Response | P | C | C | P |

---

# 6. Member A — Backend / API Lead

## Primary Responsibility

Backend engineering and core application architecture.

## Secondary Responsibility

Architecture, database, authentication, authorization, and security.

## Responsibilities

### Backend

- Django backend.
- Django REST Framework.
- API development.
- Service/domain logic.
- Validation.
- Error handling.
- Authentication.
- Authorization.
- Database integration.
- Background processing where applicable.

### Database

- Data modeling.
- Relationships.
- Constraints.
- Indexing.
- Migration strategy.
- Query optimization.

### Security

- Authentication architecture.
- Authorization architecture.
- Permission boundaries.
- API security.
- Sensitive-data handling.

### Architecture

- Backend architecture.
- API architecture.
- Service boundaries.
- Integration design.

## Expected Deliverables

```text
Backend APIs
Database models
Migrations
Authentication
Authorization
Business logic
API documentation
Backend tests
Architecture decisions
```

---

# 7. Member B — Frontend / UI Lead

## Primary Responsibility

Frontend application and user experience.

## Secondary Responsibility

UX, accessibility, and API integration.

## Responsibilities

### Frontend

- Next.js.
- React.
- TypeScript.
- Component architecture.
- Routing.
- State management.
- API integration.
- Forms.
- Loading states.
- Error states.
- Empty states.

### UI/UX

- Layout.
- Responsive design.
- Design-system consistency.
- Navigation.
- User flows.
- Accessibility.

### Integration

- API integration.
- Authentication UI.
- Protected routes.
- Error handling.
- Frontend testing.

## Expected Deliverables

```text
Pages
Components
Layouts
Forms
API integrations
Responsive UI
Accessibility implementation
Frontend tests
```

---

# 8. Member C — AI / ML Lead

## Primary Responsibility

AI functionality and AI evaluation.

## Secondary Responsibility

Backend AI integration and AI-related testing.

## Responsibilities

### AI

- AI assistant architecture.
- Model/provider integration.
- Prompt design.
- Context handling.
- Retrieval/RAG where approved.
- AI safety controls.
- AI failure handling.

### AI Evaluation

- Evaluation dataset.
- Evaluation methodology.
- Accuracy/relevance assessment.
- Hallucination analysis.
- Context-grounding tests.
- Latency measurement.
- Cost monitoring.

### Integration

- AI service APIs.
- Backend integration.
- Context authorization.
- AI request/response handling.

## Expected Deliverables

```text
AI service integration
AI prompts
AI context/retrieval logic
AI evaluation dataset
AI evaluation reports
AI tests
AI monitoring
AI documentation
```

---

# 9. Member D — DevOps / QA / Integration Lead

## Primary Responsibility

Quality engineering, CI/CD, infrastructure, and release integration.

## Secondary Responsibility

Backend support and system integration.

## Responsibilities

### DevOps

- Development environments.
- Docker.
- CI/CD.
- Deployment.
- Environment configuration.
- Secrets management.
- Infrastructure automation.
- Monitoring.

### QA

- Test strategy.
- Test planning.
- Integration testing.
- E2E testing.
- Regression testing.
- Release testing.
- Bug verification.

### Integration

- Frontend/backend integration.
- AI/backend integration.
- Deployment integration.
- Environment consistency.

## Expected Deliverables

```text
CI pipelines
CD pipelines
Docker configuration
Deployment configuration
Automated tests
E2E tests
QA reports
Release verification
Monitoring configuration
```

---

# 10. Shared Responsibilities

Every team member must understand:

```text
Requirements
Design
Git
Testing
Code Review
Deployment
Documentation
```

These are **not optional responsibilities** for any member.

---

# 11. Requirements Responsibility

All four members participate in requirements understanding.

## Member A

Focus:

- Backend feasibility
- API implications
- Security implications
- Data implications

## Member B

Focus:

- User experience
- UI feasibility
- Accessibility
- User workflows

## Member C

Focus:

- AI feasibility
- AI limitations
- Data/context requirements
- AI evaluation needs

## Member D

Focus:

- Testability
- Operational requirements
- Deployment implications
- Quality risks

---

# 12. Design Responsibility

Design is collaborative.

```text
Product Requirement
        ↓
Team Discussion
        ↓
Technical Design
        ↓
Security Review
        ↓
Implementation
```

No major architecture decision should be made by one person without appropriate team review.

---

# 13. Git Responsibility

Every member must understand:

- Git basics.
- Branches.
- Commits.
- Pull requests.
- Merge conflicts.
- Rebasing/merging according to team policy.
- Code review.
- Branch protection.
- Tags/releases.

Minimum expectation:

> Every member must be capable of creating a branch, making commits, opening a PR, reviewing a PR, resolving common conflicts, and safely updating their branch.

---

# 14. Testing Responsibility

Testing is a shared responsibility.

| Test Area | Primary | Support |
|---|---|---|
| Backend unit tests | Member A | Member D |
| Frontend unit/component tests | Member B | Member D |
| AI evaluation | Member C | Member D |
| API integration tests | Member A | Member D |
| E2E tests | Member D | Members A/B |
| Security tests | Member D | Member A |
| Performance tests | Member D | Member A/C |
| Accessibility tests | Member B | Member D |
| Regression tests | Member D | Everyone |

---

# 15. Code Review Responsibility

All four members participate in code review.

## Review Principle

A person should not routinely approve their own work without independent review.

Recommended minimum:

```text
Author
  ↓
Pull Request
  ↓
At least one appropriate reviewer
  ↓
CI
  ↓
Approval
  ↓
Merge
```

High-risk changes should receive additional review.

Examples:

- Authentication
- Authorization
- Database migrations
- Security controls
- AI data access
- Production infrastructure
- Destructive operations

---

# 16. Deployment Responsibility

Member D is the primary deployment owner.

However:

```text
Member A → understands backend deployment
Member B → understands frontend deployment
Member C → understands AI deployment/integration
Member D → coordinates deployment
```

No production system should depend on only one person's knowledge.

---

# 17. Documentation Responsibility

Documentation is shared.

| Documentation | Primary |
|---|---|
| Product requirements | Member A / Product Lead |
| Backend architecture | Member A |
| Frontend architecture | Member B |
| AI architecture | Member C |
| Deployment documentation | Member D |
| Testing documentation | Member D |
| Security documentation | Member A + D |
| API documentation | Member A |
| UX documentation | Member B |
| AI evaluation documentation | Member C |

All members must update documentation relevant to their changes.

---

# 18. Decision-Making Model

Decisions should be made at the lowest appropriate level while preserving project consistency.

## Technical Decision

Primary technical owner proposes.

Example:

```text
Backend architecture
→ Member A proposes
→ Team reviews
→ Decision recorded
```

## UI Decision

```text
Frontend/UI
→ Member B proposes
→ Team reviews
→ Decision recorded where significant
```

## AI Decision

```text
AI/ML
→ Member C proposes
→ Team reviews
→ Evaluation evidence
→ Decision recorded
```

## Infrastructure Decision

```text
DevOps
→ Member D proposes
→ Team reviews
→ Security/architecture implications checked
```

---

# 19. Decision Authority Matrix

| Decision | Primary Decision Owner | Required Review |
|---|---|---|
| Product scope | Product Owner / Team | Team |
| Requirements | Product Owner / Team | Team |
| Backend architecture | Member A | Technical team |
| Frontend architecture | Member B | Technical team |
| AI architecture | Member C | Technical team |
| Deployment architecture | Member D | Technical team |
| Security architecture | Member A + D | Team |
| Database design | Member A | Technical team |
| UI system | Member B | Product/team |
| AI evaluation criteria | Member C | QA/team |
| Test strategy | Member D | Team |
| Release readiness | Member D | Team |
| Production release | Release owner | Team approval |

---

# 20. Bus Factor Rule

The project should avoid single-person dependency.

For every critical area:

```text
Primary Owner
      +
Backup Owner
```

Recommended:

| Area | Primary | Backup |
|---|---|---|
| Backend | Member A | Member C |
| Frontend | Member B | Member D |
| AI | Member C | Member A |
| DevOps | Member D | Member A |
| QA | Member D | Member B |
| Database | Member A | Member C |
| Security | Member A | Member D |

---

# 21. Knowledge Sharing

Each member should periodically explain their primary area to the rest of the team.

Examples:

### Backend Session

Member A explains:

- API structure
- Authentication
- Database
- Permissions

### Frontend Session

Member B explains:

- Component structure
- Routing
- State
- API integration

### AI Session

Member C explains:

- AI architecture
- Context retrieval
- Evaluation
- Failure modes

### DevOps/QA Session

Member D explains:

- CI/CD
- Testing
- Deployment
- Monitoring

---

# 22. Pair Programming

Pair programming should be used for:

- Complex features.
- Security-sensitive code.
- New architecture.
- Difficult bugs.
- AI integration.
- Database migrations.
- Production incidents.

Recommended pairing examples:

```text
Backend + AI
Frontend + Backend
Backend + QA
Frontend + QA
AI + QA
DevOps + Backend
```

---

# 23. Cross-Training Plan

Each member should have at least one secondary technical competency.

| Member | Primary | Secondary |
|---|---|---|
| A | Backend | Security / Architecture |
| B | Frontend | Testing / UX |
| C | AI | Backend |
| D | DevOps / QA | Backend |

This allows the team to continue functioning when one person is unavailable.

---

# 24. Sprint Responsibility

During every sprint:

## Before Sprint

All members:

- Review backlog.
- Understand requirements.
- Identify dependencies.
- Identify risks.

## During Sprint

All members:

- Update task status.
- Communicate blockers.
- Review PRs.
- Write tests.
- Update documentation.

## End of Sprint

All members:

- Validate completed work.
- Participate in review.
- Participate in retrospective.
- Identify improvement actions.

---

# 25. Daily Working Model

Each member should be able to answer:

```text
What did I complete?
What am I doing next?
What is blocking me?
Do I need another team member?
```

Blockers should be communicated early.

---

# 26. Communication Rules

The team should prefer:

### Immediate Communication

For:

- Blocking issue
- Security problem
- Production incident
- Data loss
- Broken deployment

### Issue Tracker

For:

- Feature work
- Bugs
- Technical debt
- Research tasks

### Pull Request

For:

- Code discussion
- Implementation review
- Test discussion

### Documentation

For:

- Permanent decisions
- Architecture
- Business rules
- Processes
- Setup instructions

Important information should not remain only in private chat messages.

---

# 27. Ownership During a Feature

Example:

## Feature

> Student Registration

### Member A

- API
- Database
- Authentication
- Validation

### Member B

- Registration UI
- Form validation
- UX

### Member C

- Verification/AI implications if applicable
- Integration support

### Member D

- Integration tests
- E2E test
- CI
- Release verification

Everyone reviews the completed feature.

---

# 28. Ownership During a Quiz Feature

```text
Member A
Backend + database + scoring API

Member B
Quiz UI + attempt flow

Member C
AI quiz-generation capability if approved

Member D
Testing + CI + E2E + deployment
```

---

# 29. Ownership During AI Feature

```text
Member C
AI architecture + evaluation

Member A
Backend API + authorization

Member B
AI interface + UX

Member D
Integration + tests + deployment + monitoring
```

This demonstrates the desired cross-functional model.

---

# 30. Ownership During Production Release

```text
Member A
Backend readiness

Member B
Frontend readiness

Member C
AI readiness

Member D
Deployment + QA + release coordination

        ↓

Team Release Decision
```

Production release is a team responsibility even when one member performs the deployment.

---

# 31. Security Responsibility

Security is everyone's responsibility.

## Member A

Primary:

- Authentication
- Authorization
- API security
- Data access

## Member B

Responsible for:

- Secure client behavior
- Avoiding sensitive data exposure
- Safe frontend authentication handling
- XSS-aware development

## Member C

Responsible for:

- AI data protection
- Context authorization
- Prompt/input safety
- Provider security

## Member D

Responsible for:

- Infrastructure security
- Secrets
- CI security
- Deployment security
- Security testing

---

# 32. Quality Responsibility

Quality cannot be delegated entirely to QA.

```text
Developer writes code
        ↓
Developer tests
        ↓
Reviewer reviews
        ↓
CI validates
        ↓
QA verifies
        ↓
Team releases
```

Every developer is responsible for preventing defects.

---

# 33. Code Ownership Rules

Primary ownership does not mean exclusive ownership.

A primary owner:

- Understands the area deeply.
- Maintains the area.
- Reviews important changes.
- Helps others understand it.
- Documents it.

A primary owner must not:

- Block all changes.
- Reject legitimate collaboration.
- Keep undocumented knowledge.
- Become the only person capable of deploying/fixing the area.

---

# 34. Responsibility During Absence

If a primary owner is unavailable:

```text
Primary Owner unavailable
        ↓
Backup Owner takes responsibility
        ↓
Team supports
        ↓
Primary Owner reviews later when available
```

The repository and documentation should contain enough information for the backup owner to operate safely.

---

# 35. Conflict Resolution

Technical disagreements should follow:

```text
Identify disagreement
        ↓
Define decision criteria
        ↓
Compare alternatives
        ↓
Review evidence
        ↓
Choose documented approach
        ↓
Record decision if significant
```

The goal is not to "win" an argument.

The goal is to select a maintainable solution for SyllabAI.

---

# 36. Escalation

Escalate when:

- Security is uncertain.
- Requirements conflict.
- Architecture is unclear.
- Production is at risk.
- Data integrity is at risk.
- A decision affects project scope.
- A major dependency is blocked.
- A business rule is undefined.

Use the appropriate project owner/technical decision process.

---

# 37. Responsibility Matrix — SDLC Activities

| SDLC Activity | A | B | C | D |
|---|---:|---:|---:|---:|
| Project Planning | C | C | C | C |
| Requirements | C | C | C | C |
| User Stories | C | C | C | C |
| Use Cases | C | C | C | C |
| Business Rules | C | C | C | C |
| Architecture | P | C | C | R |
| UX Design | C | P | C | R |
| Database Design | P | I | S | C |
| API Design | P | C | S | C |
| Frontend Design | C | P | I | C |
| AI Design | C | I | P | C |
| Security Design | P | C | C | P |
| Implementation | P | P | P | P |
| Unit Testing | C | C | C | P |
| Integration Testing | C | C | S | P |
| E2E Testing | C | C | C | P |
| Security Testing | P | C | C | P |
| Performance Testing | C | C | C | P |
| Code Review | P | P | P | P |
| CI/CD | C | I | C | P |
| Deployment | C | I | C | P |
| Monitoring | C | I | C | P |
| Documentation | P | C | C | P |
| Release Management | C | C | C | P |
| Incident Response | P | C | C | P |

---

# 38. RACI Interpretation

For future project management, the team may use:

- **R — Responsible:** Performs the work.
- **A — Accountable:** Ultimately accountable for the result.
- **C — Consulted:** Provides input.
- **I — Informed:** Kept informed.

The responsibility matrix may evolve into a formal RACI matrix once project roles are finalized.

---

# 39. Team Skills Matrix

The following should be maintained and updated as the team learns.

| Skill | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| Git | Working | Working | Working | Working |
| GitHub | Working | Working | Working | Working |
| Python | Advanced | Working | Advanced | Working |
| Django | Advanced | Working | Working | Working |
| DRF | Advanced | Working | Working | Working |
| Next.js | Working | Advanced | Basic | Working |
| TypeScript | Working | Advanced | Basic | Working |
| PostgreSQL | Advanced | Basic | Working | Working |
| Docker | Working | Basic | Working | Advanced |
| CI/CD | Working | Basic | Working | Advanced |
| Testing | Working | Working | Working | Advanced |
| AI/ML | Working | Basic | Advanced | Working |
| Security | Advanced | Working | Working | Advanced |
| Cloud/Deployment | Working | Basic | Working | Advanced |

Skill levels should be updated based on actual demonstrated capability rather than assumptions.

---

# 40. Learning Requirement

Every team member should continuously improve their understanding of the entire system.

The team should periodically conduct internal knowledge sessions covering:

```text
Requirements
Architecture
Backend
Frontend
Database
AI
Testing
DevOps
Security
Deployment
```

---

# 41. Minimum Knowledge Requirement

Before the first production release, every member should understand at least:

### Requirements

- Product scope
- Functional requirements
- NFRs
- User stories
- Use cases
- Business rules

### Engineering

- Git
- Branching
- PRs
- Code review
- Testing

### System

- Architecture
- Authentication
- Authorization
- Database
- API
- Frontend
- AI integration

### Operations

- CI/CD
- Deployment
- Monitoring
- Backup
- Rollback

---

# 42. Team Onboarding Checklist

A new team member should be able to complete:

- [ ] Clone repository.
- [ ] Configure development environment.
- [ ] Run backend.
- [ ] Run frontend.
- [ ] Connect development database.
- [ ] Run tests.
- [ ] Run linting.
- [ ] Create a feature branch.
- [ ] Make a small change.
- [ ] Create a PR.
- [ ] Review another PR.
- [ ] Understand CI.
- [ ] Understand deployment process.
- [ ] Find requirements documentation.
- [ ] Find architecture documentation.
- [ ] Find business rules.
- [ ] Find API documentation.

---

# 43. Team Health Indicators

The team should periodically check:

- Is anyone becoming a single point of failure?
- Does everyone understand current sprint goals?
- Are PRs being reviewed?
- Are tests being written?
- Are requirements clear?
- Are decisions documented?
- Are blockers being raised early?
- Is technical debt increasing?
- Is one person doing most of the critical work?
- Can another member take over an important component?

---

# 44. Anti-Patterns to Avoid

## Anti-Pattern 1 — "Backend Person Does Everything"

```text
Backend Member
 ├── API
 ├── Database
 ├── Deployment
 ├── Security
 └── Production
```

Avoid this.

---

## Anti-Pattern 2 — "QA Only Tests at the End"

Testing must begin with requirements and continue throughout development.

---

## Anti-Pattern 3 — "AI Person Works Alone"

AI features affect:

- Backend
- Frontend
- Security
- Data
- Cost
- Testing
- Deployment

Therefore AI work must be cross-functional.

---

## Anti-Pattern 4 — "Only One Person Knows Deployment"

At least one backup person must understand deployment.

---

## Anti-Pattern 5 — "Only One Person Understands Requirements"

Requirements must be understood by the whole team.

---

# 45. Team Workflow

The standard team workflow is:

```text
Requirement
    ↓
Team Discussion
    ↓
Design
    ↓
Task Breakdown
    ↓
Owner Assigned
    ↓
Implementation
    ↓
Self-Test
    ↓
Pull Request
    ↓
Code Review
    ↓
CI
    ↓
QA
    ↓
Merge
    ↓
Staging
    ↓
Release
```

---

# 46. Responsibility During a Pull Request

### Author

Responsible for:

- Correct implementation.
- Tests.
- Documentation.
- PR description.
- Responding to review comments.

### Reviewer

Responsible for:

- Correctness.
- Security.
- Maintainability.
- Test quality.
- Requirement alignment.

### QA / Integration

Responsible for:

- Integration impact.
- Regression.
- E2E where applicable.

---

# 47. Responsibility During a Bug

```text
Bug Report
     ↓
Triage
     ↓
Assign Owner
     ↓
Reproduce
     ↓
Root Cause
     ↓
Fix
     ↓
Test
     ↓
Code Review
     ↓
CI
     ↓
QA
     ↓
Close
```

The bug should be linked to the affected requirement or user story where possible.

---

# 48. Responsibility During an Incident

For a production incident:

### Member D

Coordinates:

- Incident process
- Deployment
- Monitoring
- Recovery

### Member A

Investigates:

- Backend
- Database
- Authentication
- Authorization

### Member B

Investigates:

- Frontend
- Client-side behavior

### Member C

Investigates:

- AI service
- AI provider
- AI-related failures

The team communicates continuously until the system is stabilized.

---

# 49. Team Responsibility Principle

The following rule is mandatory:

> **Primary ownership means accountability, not isolation.**

Every important part of SyllabAI should have:

```text
Primary Owner
+
Backup Owner
+
Documentation
+
Tests
+
Code Review
```

---

# 50. Final Team Model

The SyllabAI team should operate as:

```text
                       PRODUCT
                          │
                  Shared Requirements
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   BACKEND/API       FRONTEND/UI          AI/ML
   Member A          Member B             Member C
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                   QA / DEVOPS
                     Member D
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
      Testing          CI/CD           Deployment
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                    WHOLE TEAM
                          │
     Requirements • Design • Git • Review
     Testing • Documentation • Security
```

---

# 51. Approval

| Role | Name | Decision | Signature | Date |
|---|---|---|---|---|
| Project Sponsor | TBD | Pending | TBD | TBD |
| Product Owner | TBD | Pending | TBD | TBD |
| Project Manager / Scrum Lead | TBD | Pending | TBD | TBD |
| Technical Lead | TBD | Pending | TBD | TBD |
| QA Lead | TBD | Pending | TBD | TBD |

---

# 52. Revision History

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | 2026-10-03 | SyllabAI Team | Initial team responsibility draft |
| 1.0 | 2026-10-03 | SyllabAI Team | Initial team responsibility baseline candidate |

---

# 53. Document Status

**Document:** `16-team-responsibility-matrix.md`

**Document ID:** `SAB-DOC-016`

**Current Status:** Draft — Team Responsibility Baseline Candidate

**Previous Document:** `15-software-development-plan.md`

**Team Size:** 4 Members

**Primary Responsibility Model:**

> **Member A — Backend/API + Architecture/Security**

> **Member B — Frontend/UI + UX/Accessibility**

> **Member C — AI/ML + AI Evaluation**

> **Member D — DevOps/QA/Integration**

**Shared Responsibility:**

> **Requirements + Design + Git + Testing + Code Review + Deployment + Documentation + Security**

**Development Status:** No production coding yet

**Core Principle:**

> **Every member owns an area, but the entire team owns the product. No critical system component should depend on only one person's knowledge.**
