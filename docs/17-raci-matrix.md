# SyllabAI — RACI Matrix

## Document Control

| Field | Details |
|---|---|
| Document ID | SAB-DOC-017 |
| Document Name | RACI Matrix |
| File Name | `17-raci-matrix.md` |
| Product | SyllabAI |
| Document Type | Governance / Responsibility Matrix |
| SDLC Stage | Project Planning / Governance |
| Team Size | 4 Members |
| Version | 1.0 |
| Status | Draft — RACI Baseline Candidate |
| Previous Document | `16-team-responsibility-matrix.md` |
| Next Document | TBD |
| Development Status | No production coding yet |
| Prepared By | SyllabAI Team |
| Last Updated | 2026-10-03 |

---

# 1. Purpose

This document defines who is:

- **R — Responsible:** Performs the work.
- **A — Accountable:** Owns the final outcome and decision.
- **C — Consulted:** Provides required input before the work is finalized.
- **I — Informed:** Must be kept informed of the outcome.

The RACI model prevents:

- Unclear ownership.
- Duplicate responsibility.
- Missing responsibility.
- Unnecessary approvals.
- Single-person dependency.
- Confusion about who makes decisions.
- Work being completed without appropriate review.

---

# 2. RACI Principles

SyllabAI follows these principles:

1. Every important activity must have at least one Responsible party.
2. Every important activity should have one clear Accountable party.
3. Accountable and Responsible may be the same person.
4. Consulted parties provide meaningful input before completion.
5. Informed parties receive relevant updates but do not need to approve the work.
6. RACI does not replace engineering collaboration.
7. Security, quality, and compliance concerns may require additional consultation.
8. RACI assignments can evolve as the project matures.
9. Accountability should remain clear even when implementation is shared.
10. RACI must not create unnecessary bureaucracy for a four-person team.

---

# 3. Team Roles

| Code | Team Role | Primary Area |
|---|---|---|
| A | Member A | Backend / API / Architecture / Security |
| B | Member B | Frontend / UI / UX / Accessibility |
| C | Member C | AI / ML / AI Evaluation |
| D | Member D | DevOps / QA / Integration |

The member names are placeholders and may be replaced when the team formally assigns names.

---

# 4. RACI Legend

| Code | Meaning | Description |
|---|---|---|
| R | Responsible | Performs the activity |
| A | Accountable | Owns the final outcome |
| C | Consulted | Provides input before completion |
| I | Informed | Receives relevant information |

### Example

```text
API Design

Member A → A/R
Member B → C
Member C → C
Member D → I
```

Meaning:

- Member A performs and owns API design.
- Member B provides frontend requirements.
- Member C provides AI integration requirements.
- Member D is informed of the resulting design.

---

# 5. RACI Assignment Rules

## 5.1 Responsible

The Responsible person:

- Performs the work.
- Coordinates implementation.
- Provides progress updates.
- Produces the expected deliverable.
- Ensures the work is ready for review.

## 5.2 Accountable

The Accountable person:

- Owns the final result.
- Makes or coordinates the final decision.
- Ensures the activity satisfies requirements.
- Resolves unresolved ownership issues.

There should normally be **one Accountable role per activity**.

## 5.3 Consulted

A Consulted person:

- Provides expertise.
- Reviews relevant implications.
- Identifies risks.
- Provides feedback before completion.

## 5.4 Informed

An Informed person:

- Receives status or outcome information.
- Does not normally participate in detailed execution.
- Does not need to approve the activity unless another governance rule requires it.

---

# 6. Product and Requirements RACI

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| Product vision | C | C | C | C |
| Product scope | C | C | C | C |
| Problem definition | C | C | C | C |
| Stakeholder identification | C | C | C | C |
| User personas | C | R | C | C |
| User journey mapping | C | A/R | C | C |
| Functional requirements | A/R | C | C | C |
| Non-functional requirements | A | C | C | R |
| User stories | C | C | C | C |
| Use cases | A/R | C | C | C |
| Business rules | A/R | C | C | C |
| Acceptance criteria | A | C | C | R |
| Requirements validation | A | C | C | R |
| Requirements traceability | A/R | C | C | R |
| Requirements change control | A | C | C | R |
| Backlog refinement | C | C | C | C |
| Sprint backlog preparation | C | C | C | A/R |

---

# 7. Product Planning RACI

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| Product roadmap | A | C | C | C |
| MVP definition | A | C | C | C |
| Release planning | C | C | C | A/R |
| Sprint goal | C | C | C | A/R |
| Sprint planning | C | C | C | R |
| Sprint review | C | C | C | A/R |
| Sprint retrospective | C | C | C | A/R |
| Product priorities | A | C | C | C |
| Feature prioritization | A | C | C | C |
| Dependency identification | A | C | C | R |
| Delivery risk review | C | C | C | A/R |

---

# 8. Architecture RACI

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| Overall system architecture | A/R | C | C | C |
| Backend architecture | A/R | C | C | C |
| Frontend architecture | C | A/R | I | C |
| API architecture | A/R | C | C | C |
| Database architecture | A/R | I | C | C |
| AI architecture | C | C | A/R | C |
| Infrastructure architecture | C | I | C | A/R |
| Authentication architecture | A/R | C | C | C |
| Authorization architecture | A/R | C | C | C |
| Security architecture | A | C | C | R |
| Integration architecture | A | C | C | R |
| Architecture review | A | C | C | R |
| Architecture decision records | A/R | C | C | C |
| Major architecture change | A | C | C | R |

---

# 9. UX / Frontend RACI

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| UX requirements | C | A/R | C | C |
| Information architecture | C | A/R | I | C |
| User flow design | C | A/R | C | C |
| UI design | C | A/R | I | C |
| Design system | C | A/R | I | C |
| Responsive design | I | A/R | I | C |
| Accessibility design | C | A/R | C | R |
| Frontend architecture | C | A/R | I | C |
| Frontend implementation | C | A/R | I | C |
| API integration | R | A | C | C |
| Frontend state management | C | A/R | I | C |
| Frontend error handling | C | A/R | I | R |
| Frontend testing | C | R | I | A |
| UX acceptance | C | A/R | C | C |

---

# 10. Backend / API RACI

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| Backend architecture | A/R | C | C | C |
| API design | A/R | C | C | I |
| API implementation | A/R | C | S/C | C |
| Business logic | A/R | C | C | C |
| Data validation | A/R | C | C | C |
| Authentication | A/R | C | C | R |
| Authorization | A/R | C | C | R |
| API documentation | A/R | C | C | C |
| API testing | R | C | C | A/R |
| Error handling | A/R | C | C | R |
| Performance optimization | A/R | C | C | R |
| Backend security | A/R | C | C | R |
| Backend monitoring | R | I | C | A |
| Backend deployment | C | I | C | A/R |

---

# 11. Database RACI

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| Data model | A/R | I | C | C |
| Entity relationships | A/R | I | C | C |
| Database constraints | A/R | I | C | C |
| Index design | A/R | I | C | R |
| Migration design | A/R | I | C | R |
| Migration testing | R | I | C | A |
| Query optimization | A/R | I | C | C |
| Backup strategy | C | I | C | A/R |
| Data recovery testing | C | I | C | A/R |
| Data integrity | A/R | I | C | R |

---

# 12. AI / ML RACI

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| AI product requirements | C | C | A/R | C |
| AI architecture | C | C | A/R | C |
| Model/provider selection | C | I | A/R | C |
| Prompt design | C | C | A/R | C |
| RAG design | C | I | A/R | C |
| Context retrieval | C | I | A/R | C |
| Context authorization | A/R | C | R | C |
| AI service integration | R | I | A | C |
| AI response handling | C | C | A/R | C |
| AI failure handling | C | C | A/R | R |
| AI evaluation dataset | C | C | A/R | R |
| AI quality evaluation | C | C | A/R | R |
| AI safety controls | A | C | R | C |
| AI cost monitoring | C | I | A/R | R |
| AI latency monitoring | C | I | R | A |
| AI documentation | C | I | A/R | C |

---

# 13. Security RACI

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| Security requirements | A | C | C | R |
| Authentication security | A/R | C | C | R |
| Authorization security | A/R | C | C | R |
| API security | A/R | C | C | R |
| Frontend security | C | A/R | C | R |
| AI security | C | C | A/R | R |
| File upload security | A/R | C | C | R |
| Secrets management | C | I | C | A/R |
| Dependency security | C | C | C | A/R |
| Security testing | A | C | C | R |
| Vulnerability remediation | A/R | C | C | R |
| Security incident response | A | C | C | R |

---

# 14. Git and Source Control RACI

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| Repository structure | C | C | C | A/R |
| Branching strategy | C | C | C | A/R |
| Branch protection | C | I | I | A/R |
| Commit conventions | C | C | C | A/R |
| Pull request standards | C | C | C | A/R |
| Code review | R | R | R | R |
| Merge approval | A/R | R | R | A/R |
| Release tagging | C | C | C | A/R |
| Repository access | C | I | I | A/R |
| Secret scanning | C | C | C | A/R |

---

# 15. Testing RACI

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| Test strategy | C | C | C | A/R |
| Unit testing | R | R | R | A |
| Backend integration testing | R | C | C | A |
| Frontend component testing | C | R | I | A |
| API testing | R | C | C | A |
| AI testing | C | C | A/R | R |
| E2E testing | C | C | C | A/R |
| Regression testing | C | C | C | A/R |
| Security testing | C | C | C | A/R |
| Performance testing | C | C | C | A/R |
| Accessibility testing | C | A/R | C | R |
| Test automation | C | C | C | A/R |
| Test data management | C | C | C | A/R |
| Defect verification | C | C | C | A/R |

---

# 16. CI/CD RACI

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| CI pipeline design | C | I | C | A/R |
| Linting pipeline | C | C | C | A/R |
| Type checking | C | C | C | A/R |
| Automated tests in CI | C | C | C | A/R |
| Security scanning | C | C | C | A/R |
| Build pipeline | C | C | C | A/R |
| Deployment pipeline | C | I | C | A/R |
| Staging environment | C | I | C | A/R |
| Production environment | C | I | C | A/R |
| Rollback mechanism | C | I | C | A/R |
| Deployment documentation | C | I | C | A/R |

---

# 17. Infrastructure and Operations RACI

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| Development environment | C | C | C | A/R |
| Docker configuration | C | C | C | A/R |
| Environment configuration | C | I | C | A/R |
| Secrets management | C | I | C | A/R |
| Logging | C | C | C | A/R |
| Monitoring | C | I | C | A/R |
| Alerting | C | I | C | A/R |
| Health checks | C | I | C | A/R |
| Backups | C | I | C | A/R |
| Disaster recovery | C | I | C | A/R |
| Infrastructure documentation | C | I | C | A/R |

---

# 18. Release Management RACI

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| Release planning | C | C | C | A/R |
| Release scope | A | C | C | R |
| Release checklist | C | C | C | A/R |
| Backend release readiness | A/R | I | C | C |
| Frontend release readiness | C | A/R | I | C |
| AI release readiness | C | I | A/R | C |
| QA release readiness | C | C | C | A/R |
| Security release readiness | A | C | C | R |
| Production deployment | C | I | C | A/R |
| Smoke testing | C | R | R | A |
| Release notes | C | C | C | A/R |
| Post-release verification | C | C | C | A/R |
| Rollback decision | A | C | C | R |

---

# 19. Documentation RACI

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| Project documentation | A/R | C | C | C |
| Requirements documentation | A/R | C | C | C |
| Architecture documentation | A/R | C | C | C |
| UX documentation | C | A/R | C | C |
| API documentation | A/R | C | C | C |
| AI documentation | C | I | A/R | C |
| Deployment documentation | C | I | C | A/R |
| Testing documentation | C | C | C | A/R |
| Security documentation | A/R | C | C | R |
| Operational runbooks | C | I | C | A/R |
| Changelog | C | C | C | A/R |

---

# 20. Defect and Issue Management RACI

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| Bug reporting | C | C | C | A/R |
| Bug triage | C | C | C | A/R |
| Backend bug fixing | A/R | C | C | C |
| Frontend bug fixing | C | A/R | I | C |
| AI bug fixing | C | C | A/R | C |
| Infrastructure bug fixing | C | I | C | A/R |
| Regression verification | C | C | C | A/R |
| Root-cause analysis | R | R | R | A |
| Critical defect escalation | C | C | C | A/R |

---

# 21. Change Management RACI

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| Change request creation | C | C | C | R |
| Scope impact analysis | A/R | C | C | R |
| Architecture impact analysis | A/R | C | C | R |
| UX impact analysis | C | A/R | C | C |
| AI impact analysis | C | C | A/R | C |
| Security impact analysis | A/R | C | C | R |
| Test impact analysis | C | C | C | A/R |
| Change approval | A | C | C | R |
| Traceability update | A/R | C | C | R |
| Change implementation | R | R | R | R |

---

# 22. Sprint RACI

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| Sprint planning | C | C | C | A/R |
| Sprint goal definition | A | C | C | R |
| Story estimation | R | R | R | R |
| Task breakdown | R | R | R | R |
| Task assignment | C | C | C | A/R |
| Daily progress | R | R | R | R |
| Blocker escalation | R | R | R | A |
| Sprint review | C | C | C | A/R |
| Retrospective | C | C | C | A/R |
| Sprint metrics | C | C | C | A/R |

---

# 23. Production Incident RACI

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| Incident detection | C | C | C | A/R |
| Incident coordination | C | C | C | A/R |
| Backend investigation | A/R | C | C | R |
| Frontend investigation | C | A/R | I | R |
| AI investigation | C | C | A/R | R |
| Infrastructure investigation | C | I | C | A/R |
| Immediate mitigation | R | R | R | A |
| Rollback | C | I | C | A/R |
| Data integrity assessment | A/R | I | C | R |
| Root-cause analysis | R | R | R | A |
| Post-incident report | C | C | C | A/R |
| Preventive action tracking | A | C | C | R |

---

# 24. Security Incident RACI

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| Security incident identification | C | C | C | A/R |
| Initial containment | A | C | C | R |
| Authentication investigation | A/R | C | C | R |
| Authorization investigation | A/R | C | C | R |
| Infrastructure investigation | C | I | C | A/R |
| AI security investigation | C | C | A/R | R |
| Evidence preservation | C | I | C | A/R |
| Remediation | A/R | C | C | R |
| Security testing after fix | C | C | C | A/R |
| Incident documentation | C | C | C | A/R |

---

# 25. Feature Development RACI

For a normal feature, the following workflow applies:

```text
Requirement
    ↓
Design
    ↓
Implementation
    ↓
Testing
    ↓
Review
    ↓
Release
```

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| Requirement understanding | C | C | C | C |
| Feature design | A/R | R | C | C |
| Backend implementation | A/R | C | C | C |
| Frontend implementation | C | A/R | I | C |
| AI implementation | C | I | A/R | C |
| Automated testing | R | R | R | A |
| Code review | R | R | R | R |
| Integration | C | C | C | A/R |
| QA verification | C | C | C | A/R |
| Release | C | C | C | A/R |

---

# 26. Example — Authentication Feature

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| Authentication requirements | A/R | C | C | C |
| Auth architecture | A/R | C | C | R |
| Backend auth API | A/R | C | I | C |
| Login UI | C | A/R | I | C |
| Security review | A | C | C | R |
| Testing | R | R | C | A |
| CI validation | C | C | C | A/R |
| Release | C | I | I | A/R |

---

# 27. Example — AI Assistant Feature

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| AI requirements | C | C | A/R | C |
| AI architecture | C | C | A/R | C |
| Backend AI endpoint | R | I | A | C |
| AI UI | C | A/R | C | C |
| Context retrieval | C | I | A/R | C |
| Authorization | A/R | C | R | C |
| AI evaluation | C | C | A/R | R |
| Integration testing | C | C | R | A |
| Deployment | C | I | C | A/R |

---

# 28. Example — Deployment

| Activity | Member A | Member B | Member C | Member D |
|---|---|---|---|---|
| Backend readiness | A/R | I | C | C |
| Frontend readiness | C | A/R | I | C |
| AI readiness | C | I | A/R | C |
| QA readiness | C | C | C | A/R |
| Security readiness | A | C | C | R |
| Deployment | C | I | C | A/R |
| Smoke testing | R | R | R | A |
| Monitoring | C | I | C | A/R |
| Rollback | C | I | C | A/R |

---

# 29. RACI Quality Rules

Before approving a RACI table, check:

- [ ] Every activity has at least one R.
- [ ] Every important activity has one clear A.
- [ ] C roles are genuinely needed.
- [ ] I roles are not overloaded.
- [ ] No important activity is ownerless.
- [ ] Accountability is not assigned to everyone.
- [ ] The matrix reflects actual team capability.
- [ ] The matrix does not create unnecessary bureaucracy.
- [ ] Backup knowledge exists for critical areas.
- [ ] Security-sensitive activities have appropriate review.
- [ ] Production activities have explicit ownership.
- [ ] Changes to responsibilities are documented.

---

# 30. RACI vs Team Responsibility Matrix

The two documents serve different purposes.

## Team Responsibility Matrix

Answers:

> **Who generally owns this area?**

Example:

```text
Member A → Backend
Member B → Frontend
Member C → AI
Member D → DevOps/QA
```

## RACI Matrix

Answers:

> **Who is responsible, accountable, consulted, and informed for this specific activity?**

Example:

```text
AI Architecture

Member A → C
Member B → C
Member C → A/R
Member D → C
```

Therefore:

```text
Team Responsibility Matrix
          ↓
Defines ownership domains
          ↓
RACI Matrix
          ↓
Defines activity-level coordination
```

---

# 31. How the RACI Is Used in Practice

The RACI matrix should be consulted when:

- Starting a major feature.
- Planning a sprint.
- Designing architecture.
- Reviewing security.
- Planning a release.
- Handling production incidents.
- Changing requirements.
- Assigning cross-functional work.

It should not be used to avoid normal team communication.

---

# 32. RACI Maintenance

The RACI matrix should be reviewed:

- At project initiation.
- When team membership changes.
- When responsibilities change.
- When major architecture changes occur.
- Before major releases.
- After significant organizational lessons.
- During periodic project governance reviews.

Any significant change should update:

1. Team Responsibility Matrix.
2. RACI Matrix.
3. Relevant project documentation.
4. Ownership in the issue tracker where applicable.

---

# 33. RACI and Traceability

RACI assignments should connect to the project traceability chain:

```text
Requirement
    ↓
User Story
    ↓
Use Case
    ↓
Business Rule
    ↓
Design
    ↓
Development Task
    ↓
RACI Owner
    ↓
Implementation
    ↓
Test Case
    ↓
Release
```

This ensures responsibility does not exist separately from the engineering lifecycle.

---

# 34. RACI and Pull Requests

For every significant PR:

```text
Author
  ↓
Responsible for implementation
  ↓
Reviewer
  ↓
Consulted / review responsibility
  ↓
CI
  ↓
QA
  ↓
Accountable release owner
```

No RACI assignment should bypass:

- Code review.
- Automated testing.
- Security controls.
- Required QA.
- Release controls.

---

# 35. RACI and Four-Person Team Reality

Because SyllabAI has only four members, strict organizational separation would create unnecessary overhead.

Therefore:

```text
Small Team Model

One person may be:
R + A

Another person:
C

Another:
C/I
```

Example:

```text
API Design

Member A → A/R
Member B → C
Member C → C
Member D → I
```

This is appropriate for a small team while still teaching enterprise-style responsibility management.

---

# 36. Critical Activities Requiring Strong Accountability

The following activities must never be ownerless:

```text
Authentication
Authorization
Database migrations
Security
AI data access
Production deployment
Backups
Rollback
Release readiness
Testing
Incident response
```

For these activities, the team must always know:

```text
Who performs it?
Who owns the outcome?
Who must be consulted?
Who must be informed?
```

---

# 37. Final RACI Operating Model

SyllabAI will operate using:

```text
                     PROJECT
                        │
                Product Requirements
                        │
                  RACI Assignment
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    Backend         Frontend           AI
    Member A        Member B         Member C
        │               │               │
        └───────────────┼───────────────┘
                        │
                  QA / DevOps
                    Member D
                        │
              ┌─────────┴─────────┐
              │                   │
             QA                  DevOps
              │                   │
              └─────────┬─────────┘
                        │
                     Release
                        │
                    Production
```

---

# 38. Core Governance Principle

> **RACI does not mean people work alone. It means the team knows who owns each outcome and how others participate.**

For SyllabAI:

```text
Responsible
    ↓
Does the work

Accountable
    ↓
Owns the result

Consulted
    ↓
Provides expertise

Informed
    ↓
Receives relevant information
```

The final objective is:

> **Clear ownership without creating knowledge silos.**

---

# 39. Approval

| Role | Name | Decision | Signature | Date |
|---|---|---|---|---|
| Project Sponsor | TBD | Pending | TBD | TBD |
| Product Owner | TBD | Pending | TBD | TBD |
| Project Manager / Scrum Lead | TBD | Pending | TBD | TBD |
| Technical Lead | TBD | Pending | TBD | TBD |
| QA / DevOps Lead | TBD | Pending | TBD | TBD |

---

# 40. Revision History

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | 2026-10-03 | SyllabAI Team | Initial RACI draft |
| 1.0 | 2026-10-03 | SyllabAI Team | Initial RACI baseline candidate |

---

# 41. Document Status

**Document:** `17-raci-matrix.md`

**Document ID:** `SAB-DOC-017`

**Current Status:** Draft — RACI Baseline Candidate

**Previous Document:** `16-team-responsibility-matrix.md`

**Team Size:** 4 Members

**Primary Role Model:**

> Member A — Backend / API / Architecture / Security

> Member B — Frontend / UI / UX / Accessibility

> Member C — AI / ML / AI Evaluation

> Member D — DevOps / QA / Integration

**RACI Standard:**

> **R = Responsible**

> **A = Accountable**

> **C = Consulted**

> **I = Informed**

**Development Status:** No production coding yet

**Core Principle:**

> **Every significant activity must have clear responsibility and accountability while preserving cross-functional collaboration and shared product ownership.**
