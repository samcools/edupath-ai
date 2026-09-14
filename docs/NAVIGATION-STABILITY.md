# Navigation and browser-stability hardening

This change addresses reported freezes and non-responsive navigation in EduPath AI.

## Root causes addressed

The application has several dynamic modules mounted alongside the React workspace. React re-renders can remove externally injected sidebar buttons, after which module observers re-inject them. Some modules also created a new hidden page each time their navigation was re-injected. Over repeated navigation this could accumulate hidden pages, leave the primary workspace suppressed, or degrade browser performance.

The multilingual interface also changes visible role and navigation labels. Role-sensitive modules must not depend on translated text as their identity key.

## Commercial navigation controls

- The canonical signed-in role is preserved independently of translated UI text so role-scoped modules remain available after language changes.
- Canonical navigation keys are attached to sidebar destinations before labels are translated.
- Every sidebar navigation action first closes stale feature overlays and restores the primary workspace, then allows the requested destination to open.
- Duplicate Learning Hub, Exam Practice, Agent Centre and AI Settings pages are removed so dynamic re-renders cannot accumulate hidden singleton pages.
- Route buttons such as **Ask Student GPT**, **Open LMS material**, **Practice papers** and **Curriculum pathway** use canonical navigation keys instead of translated text matching.
- Student GPT, Parent GPT and Teacher Copilot have resilient role-scoped workspaces.
- Student GPT supports Grade R–12 and phase-appropriate subject sets.
- Parent GPT is restricted to the linked learner's parent-visible subjects, progress, challenges and support information.
- Teacher Copilot is scoped to the configured high-school institution (Grades 8–12), supports all configured high-school subjects and saves AI-assisted output as unpublished teacher material for human review.
- Contextual drill-down links now return relevant evidence, status and recommended next actions. Commercial UI copy no longer mentions "dead links".

## Existing stability hardening retained

- Multilingual updates are incremental and scheduled rather than performing synchronous full-document rescans for every DOM mutation.
- The UI integrity layer uses delegated click handling.
- Dead `#` anchors are prevented from silently doing nothing and route to an authorised destination or relevant detail view.
- Header layout keeps user identity and language controls aligned consistently.

## Validation expectations

Before release:

1. Sign in with each supported role.
2. Open every sidebar destination available to that role in sequence and then repeat the sequence.
3. Confirm Student GPT is visible and functional for the learner role.
4. Confirm Parent GPT is visible only for the linked parent/guardian role.
5. Confirm Teacher Copilot opens after navigating through other teacher pages.
6. Open Learning Hub, Exam Practice, Agent Centre, Curriculum R–12, Career Readiness and other commercial modules, then navigate back to ordinary workspace pages.
7. Confirm Back-to-workspace controls return without leaving hidden overlays.
8. Open every right-side/detail row and confirm the content is relevant to its subject, assignment, assessment, intervention, class, attendance, digital-inclusion or administration context.
9. Change language from the website and from Ayanda and verify role-scoped features remain available.
10. Confirm only one Learning Hub, Exam Practice and Agent Centre dynamic page exists after repeated navigation.
11. Verify no page causes sustained CPU usage or browser lock-up.
12. Verify header and feature-page layout on desktop, tablet and mobile.

The hackathon UI remains synthetic/demo where indicated; this hardening does not alter the underlying production-governance requirements.
