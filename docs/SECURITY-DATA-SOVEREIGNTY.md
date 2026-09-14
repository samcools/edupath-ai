# EduPath AI — Security, Privacy and Data Sovereignty Architecture

## Status
This document defines the **production target architecture**. The hackathon deployment is a front-end demonstration and must not be represented as certified or production-compliant until the controls below are implemented, independently tested and legally reviewed.

## Regulatory design basis
EduPath is designed for South African education environments and should be implemented with the Protection of Personal Information Act 4 of 2013 (POPIA), PAIA obligations where applicable, contractual education-sector requirements and institution policies in mind.

Important principles:
- POPIA requires lawful, minimal, purpose-bound processing and appropriate security safeguards.
- Personal information of children requires enhanced safeguards and a lawful basis. The Information Regulator publishes specific guidance for processing children's personal information.
- Cross-border transfers are **not assumed to be prohibited**. POPIA section 72 governs transfers to foreign countries and requires an applicable legal basis / adequate protection framework.
- Certain transfers involving special personal information or children's information may trigger prior-authorisation considerations and must be assessed by qualified privacy/legal personnel.

Official references:
- Information Regulator: https://inforegulator.org.za/
- Guidance on processing personal information of children: https://inforegulator.org.za/guidance-notes/
- DBE National Curriculum Statements Grades R–12: https://www.education.gov.za/Curriculum/CAPS/tabid/419/Default.aspx

## Sovereign deployment profiles
### 1. Local device / exam centre
Use for highly sensitive exam artefacts that should not leave the device during a session.
- Browser local vault / managed desktop vault
- No cloud upload required
- Export controlled by authorised user
- Automatic expiry can be enforced in production

### 2. Institution on-premises
Use where a school, district or assessment body requires locally controlled storage.
- Institution-controlled server/storage
- Local identity federation
- Local backup and disaster recovery
- Central policy with site-level data segregation

### 3. South Africa cloud region
Use approved cloud infrastructure located in South Africa where required by institutional policy.
- Region pinning
- Customer-managed encryption keys where supported
- Private networking and audit export
- Data-class-specific retention

### 4. Hybrid sovereign mode
Separate highly sensitive artefacts from operational metadata.
Example:
- Question papers / answer books remain local or on-prem
- Pseudonymised operational events may be synchronised centrally
- Aggregate analytics can be produced without exporting the raw artefact

## Data classification
Suggested classes:
1. Public curriculum content
2. Institution-internal content
3. Learner personal information
4. Child personal information
5. Assessment records
6. High-sensitivity exam artefacts
7. Proctoring events and recordings (if recording is explicitly enabled)
8. Authentication/security logs
9. Aggregated/de-identified analytics

Each class should have a defined owner, purpose, lawful basis, residency rule, retention period, access policy and export policy.

## Security architecture
Production controls should include:
- MFA for staff, administrators and privileged roles
- Strong learner authentication appropriate to age/context
- Server-side RBAC plus attribute/tenant/school scoping
- Least privilege and just-in-time privileged access
- Encryption in transit and at rest
- Secrets management; no credentials in source control
- Customer-controlled keys where required
- Per-tenant data isolation
- Tamper-evident audit logging
- Secure file scanning and content-type validation
- Rate limiting and abuse controls
- CSP, secure headers, CSRF/XSS protection as applicable
- Dependency, SAST and secret scanning in CI
- Secure backup and tested restore
- Session expiry and device/session revocation
- Security monitoring and incident response integration

## Children's data
- Data minimisation is mandatory by design.
- Do not expose confidential educator notes to parents or learners unless policy allows.
- Avoid behavioural inference that is not necessary for an education purpose.
- Proctoring must be transparent and proportionate.
- No automated disciplinary decision should be based solely on AI or proctoring events.
- Obtain lawful authority/consent where required and preserve evidence of that authority.

## Proctoring privacy
The current demo logs observable session events only:
- Camera availability/interruption
- Page visibility
- Window focus
- Fullscreen state
- Network state
- Copy/paste events in the exam page

It does **not** infer:
- emotion
- intent
- dishonesty
- disability
- health condition
- identity from face biometrics

A human examiner must review the context before any adverse action.

## AI governance
- Curriculum-grounded retrieval only for Student GPT
- Source/provenance shown where practical
- Refuse when authorised knowledge is unavailable
- High-impact actions require human approval
- Model/prompt/version tracking in production
- Bias/fairness review and red-team testing
- No hidden chain-of-thought exposure

## Production assurance before launch
Required before commercial production:
1. Threat model and architecture review
2. POPIA/privacy impact assessment
3. Information Officer / governance review
4. Penetration test
5. Secure-code review
6. Data-processing and cross-border transfer review
7. Disaster recovery test
8. Accessibility audit
9. Child-safeguarding review
10. Linguistic QA for every supported language pack
11. Proctoring proportionality and legal review
12. Independent verification of security and compliance claims
