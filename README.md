# EduPath AI by Pyrneo

**One Learner. One Learning Journey. Equal Opportunity.**

EduPath AI is the education-domain implementation of the Project Guardian operating patterns: role-aware access, governed actions, auditability, responsive dashboards, activity history and a single AI/voice assistant. The hackathon prototype is being built in this repository rather than from scratch.

## Current implementation

The current branch adds a working front-end foundation with:

- Pyrneo-branded login and application shell;
- user-type dropdown for Learner, Teacher, Parent/Guardian, Principal/School Administrator, District Official, Provincial Official, National Education Analyst, Platform Administrator and Support Administrator;
- role-specific navigation and role-specific dashboards;
- synthetic hackathon demo personas and data;
- Learner geometry-remediation storyline;
- school/district style analytics and digital-inclusion indicators;
- one Ayanda text/voice assistant across the platform;
- deterministic low-latency navigation commands before AI fallback;
- browser speech recognition/synthesis fallback where supported;
- responsive desktop, tablet and mobile layout;
- Guardian inheritance documentation.

> **Important:** Demo authentication and data in this phase are front-end/synthetic. Server-side identity, RBAC, database persistence, audit storage and external AI/voice providers are the next implementation layer and must not be represented as production-ready until completed and tested.

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

## Demo flow

1. Select **Learner** and sign in with the prefilled synthetic demo account.
2. Open Ayanda and ask: `I do not understand corresponding angles`.
3. Ask: `Explain in isiZulu`.
4. Sign out and select **Teacher** to see the teacher-specific workspace.
5. Repeat for Principal, District or Provincial roles to demonstrate the ecosystem view.

## Security model

The user-type dropdown is a requested login context only. In the production architecture, server-side identity and assigned roles are authoritative. Selecting a privileged user type must never grant privilege.

See `docs/architecture/PROJECT-GUARDIAN-INHERITANCE.md` and `docs/SECURITY.md`.

## Branding

The interface uses the official Pyrneo wordmark hosted by Pyrneo. No generated or fabricated Pyrneo logo is used.

## Data

All learner, teacher, school, performance and digital-inclusion values displayed in demo mode are synthetic and are not live government or school records.
