# EduPath AI — Commercial Architecture

## Product scope

EduPath AI is designed as a configurable education and digital-citizen platform spanning Grade R–12 learning, educator enablement, learner support, assessment/exam practice, proctoring, post-school employment readiness, administration, reporting and governed AI.

The hackathon build demonstrates the product architecture with synthetic data. It must not be represented as a certified production education, proctoring or regulatory system without customer-specific validation.

## Curriculum

The product model supports Grade R through Grade 12 and a broad South African subject taxonomy. Official curriculum content must be ingested from authorised sources, versioned, provenance-tagged and approved by the relevant curriculum owner. Student GPT must answer from the active grade/subject curriculum pack and teacher-approved material rather than unrestricted model knowledge.

## Multilingual architecture

A single language state controls website UI, Student GPT/Ayanda preferences, speech recognition and speech synthesis. Changing language from the website or assistant must dispatch the same language event. Production language packs require native-language QA; untranslated strings are a release-blocking localisation defect rather than silently mixing languages.

Supported language configuration includes English, Afrikaans, isiZulu, isiXhosa, Sesotho, Setswana, Sepedi, Xitsonga, Tshivenda, siSwati and isiNdebele.

## Proctoring

Proctoring requires explicit consent before the camera starts. The system records transparent integrity events such as session start/end, camera availability, tab visibility, window focus and fullscreen changes. Video-analysis extensions may add local face-presence signals where legally approved, but signals must never be treated as automatic proof of cheating. A human reviewer remains accountable for consequential decisions.

Retention, recording, biometric processing and cross-border transfer settings must be configurable by institution and jurisdiction.

## Data sovereignty and deployment modes

Supported commercial deployment patterns should include:

1. Customer-controlled private deployment in an approved jurisdiction.
2. Regional cloud tenancy with tenant data pinned to an approved region.
3. Hybrid architecture where identity and analytics are central but selected high-sensitivity content stays institution-hosted.
4. Local-only exam mode where question papers and answer books remain on the learner/institution device unless explicitly transferred.

The demo Local Data Vault uses browser IndexedDB to show the local-only pattern. Production implementations require endpoint encryption, managed backup/retention policies, device controls and institution-approved key management.

## Security baseline

- Server-side RBAC and ABAC; UI selections never grant privileges.
- MFA-ready staff and administrator access.
- Tenant, institution, district, province and jurisdiction scoping.
- Encryption in transit and at rest.
- Secrets stored outside source code.
- Restricted exports and role-aware reporting.
- Immutable/tamper-aware audit design for high-value events.
- Consent, purpose limitation and data minimisation for child data.
- Configurable retention, deletion, archival and legal hold.
- SIEM integration and incident response hooks.
- Vulnerability scanning, dependency scanning and penetration testing before production.
- Human approval for consequential AI actions.

## POPIA and jurisdictional compliance

The architecture is designed to support privacy-by-design and data-sovereignty controls, but legal compliance is deployment-specific. Each production tenant requires a documented data-flow map, lawful-processing basis, operator/sub-processor review, cross-border transfer assessment, retention policy, information-security controls and privacy impact assessment appropriate to the jurisdiction.

## Commercial multi-tenancy

Production architecture should isolate tenants at authentication, authorization, data, object storage, search/retrieval, analytics and audit layers. Institution administrators must only manage their authorised tenant. District/provincial/national views are explicit data-sharing scopes, not implicit global access.

## Reports and logs

Role-authorised reporting should cover learning progress, attendance, interventions, training, exam/proctoring sessions, AI-assisted actions, user activity, access changes, exports, support operations and system health. Logs must not contain passwords, authentication secrets or unnecessary sensitive content.

## Post-school and workplace services

The workplace service layer extends the learner journey into:

- corporate readiness and custom workplace pathways;
- public-sector digital literacy;
- SME and entrepreneurship micro-learning;
- strategic talent growth;
- digital tools, AI literacy, cyber hygiene and productivity;
- skill badges, mastery evidence, training analytics and completion audit.

## Production gates

Before a commercial production launch, complete: curriculum licensing/approval, native-language QA, accessibility validation, security testing, privacy/legal review, proctoring policy validation, model evaluation/red-teaming, incident response, disaster recovery testing, observability/SLA setup, backup restoration tests and tenant-isolation tests.
