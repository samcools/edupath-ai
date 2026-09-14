# Navigation and browser-stability hardening

This change addresses reported freezes and non-responsive navigation in EduPath AI.

## Root cause addressed

The application had several dynamic modules plus multiple broad `MutationObserver` callbacks. The multilingual layer and UI integrity layer both reacted to large portions of the DOM whenever pages were re-rendered. On complex pages this could trigger repeated full-document scans and create visible browser stalls.

## Changes

- Multilingual updates are now incremental and animation-frame scheduled instead of rescanning the complete document for every DOM mutation.
- The UI integrity layer now uses delegated click handling and removes its document-wide button observer.
- Dynamic module-list rows continue to route to matching sidebar destinations.
- Dead `#` anchors are prevented from silently doing nothing and are routed to a matching sidebar destination when one exists.
- Existing buttons are hardened once during idle time instead of after every DOM mutation.
- Header layout explicitly places the signed-in user identity slightly left of the language selector, with the language selector aligned to the far right.

## Validation expectations

Before release:

1. Sign in with each supported role.
2. Open every sidebar destination available to that role.
3. Open Student GPT, Learning Hub, Training Academy, Exam Practice, Agent Centre and the commercial modules.
4. Confirm Back-to-workspace controls return without leaving hidden overlays.
5. Change language from the website and from Ayanda and verify the preference remains synchronized.
6. Verify no page causes sustained CPU usage or browser lock-up.
7. Verify header alignment on desktop, tablet and mobile.

The hackathon UI remains synthetic/demo where indicated; this hardening does not alter the underlying production-governance requirements.