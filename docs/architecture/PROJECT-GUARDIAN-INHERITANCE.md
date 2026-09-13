# Project Guardian inheritance

EduPath AI deliberately inherits the strongest operating patterns already established across Project Guardian-derived hackathon products rather than rebuilding the application shell from zero.

## Reused patterns

- Role-aware authenticated workspace model
- Guardian-style executive dashboard hierarchy
- Single global AI/voice assistant pattern
- Fast deterministic routing for obvious navigation commands
- Approval-gated write-action model
- Recent activity and audit-event concepts
- Responsive desktop/tablet/mobile shell
- Explainable recommendations rather than opaque autonomous decisions

## Education adaptation

Guardian concepts are adapted into education-domain entities rather than mechanically renamed:

| Guardian pattern | EduPath adaptation |
|---|---|
| Work item | Learning activity / assignment / intervention action |
| Milestone | Learning goal / term outcome / intervention target |
| Project workspace | Learner / class / school workspace |
| Activity history | Education activity history |
| Compliance evidence | Curriculum/governance/audit evidence |
| Voice commands | Learner, teacher and administrator commands |

## Action governance

Target production flow:

`User request → intent detection → preview → server validation → RBAC/ABAC check → confirmation when required → execution → audit event → UI refresh`

The AI layer must never bypass server-side permissions.

## Current implementation boundary

The current hackathon foundation implements the shared UI, role-specific navigation, demo personas, synthetic dashboards, Ayanda interaction shell and education storyline in the browser. Server-side authentication, persistent RBAC, database-backed audit events and provider-backed AI/voice remain explicit next-stage work and must be tested before any production claim.

## Branding

EduPath AI is the product identity. Pyrneo is the company/platform identity. Only the authentic Pyrneo wordmark is used; generated substitutes are prohibited.
