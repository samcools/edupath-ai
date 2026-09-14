# EduPath AI by Pyrneo

**One Learner. One Learning Journey. Equal Opportunity.**

EduPath AI is the education-domain implementation of the Project Guardian operating patterns: role-aware access, governed actions, auditability, responsive dashboards, activity history and a single AI/voice assistant. The hackathon prototype is being built in this repository rather than from scratch.

## Current implementation

The current implementation includes:

- Pyrneo-branded login and application shell;
- user-type dropdown for Learner, Teacher, Parent/Guardian, Principal/School Administrator, District Official, Provincial Official, National Education Analyst, Platform Administrator and Support Administrator;
- role-specific navigation and role-specific dashboards;
- synthetic hackathon demo personas and data;
- one Ayanda text/voice assistant across the platform;
- permission-aware Agent Centre with 15 specialist agents;
- Student GPT grounded in configured curriculum and approved teacher material;
- learner/teacher LMS with published study material;
- past-paper upload, guided practice and answer-sheet review;
- Grade R–12 curriculum registry covering the phase subject sets and FET subject catalogue;
- EduPath Nexus command centre with educator and workplace platform views;
- student management workspace;
- consent-based camera proctoring with observable-event reports and human review;
- post-school career and workplace readiness pathways;
- role-based Training Academy;
- reports, audit logs and export;
- local exam vault for browser-local exam papers, answer books and reports;
- local / on-prem / South Africa cloud / hybrid sovereign deployment patterns;
- multilingual website/assistant language synchronisation;
- responsive desktop, tablet and mobile layout;
- Guardian inheritance, commercial-readiness and security/data-sovereignty documentation.

> **Important:** The Render deployment is still a hackathon front-end demonstration. Demo authentication and several persistence layers are browser/local rather than production server implementations. Production identity, server-side RBAC, database/object-storage persistence, encryption key management, verified curriculum RAG, legal/privacy review, penetration testing, disaster recovery and operational SLAs are required before the platform should be represented as commercially production-ready.

## Run locally

```bash
npm install
npm run dev
```

Build and type-check:

```bash
npm run check
npm run build
```

## Recommended demo flow

1. Sign in as **Learner**.
2. EduPath Nexus opens the Digital Citizen command centre.
3. Change the language on the website and confirm Ayanda/Student GPT follows the same preference.
4. Open **Curriculum R–12** and browse grades/subjects.
5. Open **Student GPT** and ask a grounded curriculum question.
6. Open **Learning Hub** to show teacher-published study material.
7. Open **Exam Practice** to upload a past paper and answer sheet.
8. Open **Proctored Exams**, consent to the camera, create observable events and generate the report.
9. Open **Career & Workplace** and progress an employment-readiness pathway.
10. Sign in as **Teacher / Principal / Administrator** to demonstrate Student Management, Training Academy, Reports, Data Sovereignty and Agent Centre.

## Security model

The user-type dropdown is a requested login context only. In the production architecture, server-side identity and assigned roles are authoritative. Selecting a privileged user type must never grant privilege.

Proctoring is deliberately transparent: it logs observable browser/camera-state events and does not make an automatic cheating decision or infer emotion, disability, health or identity.

See:
- `docs/architecture/PROJECT-GUARDIAN-INHERITANCE.md`
- `docs/SECURITY.md`
- `docs/SECURITY-DATA-SOVEREIGNTY.md`
- `docs/COMMERCIAL-READINESS.md`

## Branding

The interface uses the official Pyrneo wordmark hosted by Pyrneo. No generated or fabricated Pyrneo logo is used.

## Data

All learner, teacher, school, performance, proctoring and digital-inclusion records displayed in demo mode are synthetic or locally generated and are not live government or school records.
