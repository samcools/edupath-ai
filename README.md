# EduPath AI by Pyrneo

**One Learner. One Learning Journey. Equal Opportunity.**

EduPath AI is a hackathon-ready education platform that reuses the proven Project Guardian application patterns already carried into the AquaFlow implementation: governed role-based actions, audit logging, responsive executive dashboards, one global Ayanda assistant, multilingual/voice-ready interaction, deterministic navigation and approval-gated record changes.

> All bundled learner, school, assessment, attendance and intervention records are synthetic demonstration data. No live DBE, provincial department, district or school-system integration is claimed.

## Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

The demo server uses Node.js built-in modules only; there is no mandatory package install for the hackathon demo.

## Demo accounts

Select the matching **User Type** at sign-in. The dropdown is a requested login context only: the server verifies the account's assigned role and rejects mismatches.

| User type | Username | Password |
|---|---|---|
| Learner | `learner@demo.edupath.local` | `Demo123!` |
| Teacher | `teacher@demo.edupath.local` | `Demo123!` |
| Parent / Guardian | `parent@demo.edupath.local` | `Demo123!` |
| Principal / School Administrator | `principal@demo.edupath.local` | `Demo123!` |
| District Official | `district@demo.edupath.local` | `Demo123!` |
| Provincial Official | `provincial@demo.edupath.local` | `Demo123!` |
| Platform Administrator | `admin@demo.edupath.local` | `Demo123!` |

## Flagship demo story

Thando, a Grade 9 learner, asks Ayanda for help with corresponding angles. EduPath explains the concept step by step, detects a possible Grade 8 prerequisite gap, recommends remediation, records the learning activity, exposes the intervention to the teacher and rolls aggregated insight up to school and district views.

## Implemented foundation

- Pyrneo-branded responsive login and application shell.
- User Type dropdown with server-side role validation.
- Role-specific dashboards for learner, teacher, parent, principal, district, provincial and platform administrator users.
- Learner 360 summary, assignments, progress, attendance and interventions.
- Teacher intervention workflow with approval-gated write action.
- School/district/provincial aggregate views using synthetic demo data.
- One global Ayanda assistant with text chat, browser voice input/output and deterministic navigation commands.
- South African language selector with graceful browser/provider fallback.
- Audit/activity feed for authentication, tutoring and intervention actions.
- POPIA-aware demo posture and no live-government-integration claims.

## Project Guardian inheritance

EduPath does not rebuild the platform shell from zero. See [`docs/architecture/PROJECT-GUARDIAN-INHERITANCE.md`](docs/architecture/PROJECT-GUARDIAN-INHERITANCE.md) for the reuse map and [`SECURITY.md`](SECURITY.md) for the security posture.

## Repository status

This branch is the first executable EduPath vertical slice. Production integrations, a persistent production database, native multilingual speech-provider validation, formal legal review, browser-matrix testing and external penetration testing remain future work and are not claimed as completed.
