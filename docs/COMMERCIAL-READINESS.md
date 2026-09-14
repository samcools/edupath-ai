# EduPath AI — Commercial Readiness Blueprint

## Product positioning
EduPath AI by Pyrneo is a learner-to-workforce digital citizen platform that combines:
- Grade R–12 curriculum delivery
- Curriculum-grounded Student GPT
- Teacher/learner LMS
- Past-paper practice and answer review
- Consent-based proctored exams
- Student management
- Agentic learner/support workflows
- Parent, teacher, principal, district, province, national and platform training
- Post-school employment readiness
- Reports, audit and data-sovereignty controls

## Platform architecture
### Educator platform
Users:
- Learners
- Teachers
- Parents / Guardians
- School / Administration
- District / Province / National analysts

Core services:
- Curriculum registry
- LMS and teacher content
- Student GPT
- Assessments and exam practice
- Student management
- Attendance and interventions
- Digital inclusion
- Training Academy
- Agent Centre

### Workplace platform
Target users / channels:
- Graduates / job seekers
- Private / corporate
- Public / government
- SMEs

Core services:
- Role-based employment pathways
- Digital and AI literacy
- Cloud/productivity tools
- Cybersecurity and data literacy
- CV / job-search readiness
- Interview practice
- Public-service digital capability
- Corporate readiness
- SME entrepreneurship tracks
- Skills badges and mastery

## Commercial packaging model
Suggested editions:
1. **EduPath School** — learner, teacher, parent and school administration
2. **EduPath District** — school portfolio, support interventions and district analytics
3. **EduPath Province** — provincial command centre and programme analytics
4. **EduPath National** — aggregated national intelligence and policy reporting
5. **EduPath Assessment** — proctoring, past papers, exam practice and local exam vault
6. **EduPath Workforce** — post-school employment readiness and workplace training
7. **EduPath Sovereign** — on-prem / private-cloud / hybrid deployment with customer-controlled policies

## Commercial capabilities required before GA
- Production backend and database
- Tenant / organisation hierarchy
- Subscription / licence service
- SSO / federation (OIDC/SAML)
- MFA and privileged access controls
- Billing/invoicing integration where commercially required
- Content lifecycle and versioning
- Production RAG / vector retrieval with authorised curriculum content
- Object storage adapters
- On-prem connector / local vault agent
- Reporting warehouse and scheduled reports
- Notification service
- Backup / DR
- Monitoring / observability
- Customer support tooling
- Admin and configuration APIs
- Data retention and deletion workflow
- Data portability and audit export
- Secure update mechanism

## Service levels
Do not advertise untested availability or response-time targets. Before contracting, define and measure:
- Availability SLA
- Recovery time objective (RTO)
- Recovery point objective (RPO)
- Support severity levels
- Response / resolution targets
- Data-residency commitment
- Incident-notification commitments

## Product governance
Every commercial tenant should have:
- Responsible data owner
- Information Officer / privacy owner as applicable
- AI governance owner
- Security owner
- Curriculum/content owner
- Assessment owner where exams are enabled
- Configured retention and export policies

## AI design
Student-facing AI must be retrieval-grounded in authorised curriculum and teacher content. The default policy should be:
1. Identify learner grade, subject and topic
2. Retrieve authorised sources
3. Answer with age-appropriate scaffolding
4. Show source/provenance
5. Refuse or escalate when the source set is insufficient
6. Never create a hidden high-stakes learner score
7. Keep consequential actions human-governed

## Proctoring design
Commercial proctoring should be modular and institution-configurable. The minimum principle is transparency: show what is monitored, request permission/lawful authority where required, avoid unnecessary biometric processing, record observable events rather than accusations, and require human review.

## Go-to-market demo story
1. Learner signs in and selects preferred language
2. Language changes across website and assistant
3. Learner opens Grade 9 Mathematics and asks Student GPT a curriculum question
4. Teacher publishes study material in the LMS
5. Learner uploads a past paper and receives guided support
6. Learner starts a proctored practice exam after permission
7. Examiner receives an observable-event report
8. Principal sees learner/student-management and support indicators
9. District / province sees aggregate needs and digital inclusion
10. Grade 12 learner opens Career & Workplace and begins an employment-readiness pathway
11. Platform administrator demonstrates local/on-prem/SA-cloud/hybrid data-sovereignty options
12. Agent Centre demonstrates governed autonomous support

## Definition of commercially ready
EduPath should only be labelled commercially ready when production infrastructure, security controls, legal/privacy review, performance testing, operational support, backup/DR, accessibility, language QA and customer acceptance have been completed. The hackathon build demonstrates the target product and interaction model; it is not yet a certified production deployment.
