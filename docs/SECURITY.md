# EduPath AI security baseline

This repository is a hackathon implementation and does not claim production certification.

## Required production controls

- Server-side authentication and session management
- Authoritative RBAC with optional ABAC extension
- Role selection validated against assigned roles
- Least privilege and school/district/province data scoping
- Audit logging for authentication, role switching and sensitive record changes
- Protected API routes and schema validation
- Rate limiting and login throttling
- Secure secret management and environment variables
- CSP and secure HTTP headers
- Input/output sanitisation and XSS/CSRF protections where applicable
- Dependency and secret scanning in CI
- Data minimisation, retention controls and POPIA review for children's information

## User-type dropdown rule

The dropdown is never an authorisation source. It represents the requested active role. The server must authenticate the user, retrieve assigned roles and reject mismatches. Multi-role users may switch only among server-authorised roles, and role switching must be audited.

## Responsible AI

AI suggestions are advisory. High-impact education decisions require human review. The platform must not automatically fail, discipline, exclude or otherwise make irreversible decisions about learners.
