---
phase: 06-streaming-chat-configurator-assistant
plan: "03"
subsystem: testing
tags: [vitest, golden-eval, price-integrity, human-verification]
requires:
  - phase: 06-02
    provides: shared configurator state, cart helper, and streaming chat UI
provides:
  - Deterministic configurator chat golden eval
  - Automated price, prompt, and admin-isolation regression gate
  - Human UX checkpoint checklist
affects: [phase-07]
tech-stack:
  added: []
  patterns: [keyless golden eval, source isolation scan, pure cart builder verification]
key-files:
  created:
    - src/lib/ai/evals/configurator-chat-golden.ts
    - src/lib/ai/evals/configurator-chat-eval.test.ts
  modified:
    - package.json
key-decisions:
  - "Price integrity is tested without ANTHROPIC_API_KEY across eight representative configurations."
requirements-completed: []
duration: 5min
completed: 2026-07-17
status: human_needed
---

# Phase 6 Plan 03: Configurator Assistant Eval Summary

**Twelve deterministic assertions lock centralized pricing, Turkish flow vocabulary, AI disclosure, and admin isolation while live streaming UX awaits human sign-off**

## Accomplishments
- Added eight golden configurations spanning all extras combinations and representative vehicles/colors.
- Asserted both customer price tool and real cart item price equal `calculateMatPrice`.
- Asserted prompt disclosure and Turkish taban/kenar/topuk/bagaj vocabulary.
- Re-scanned chat route and tools for admin-key or mutation coupling.

## Task Commits
1. **Task 1 RED:** `6095fe4`
2. **Task 1 GREEN:** `cae6359`
3. **Task 2:** no code change; automated smoke found no reconnect regression.
4. **Task 3:** human verification pending.

## Verification
- `npm run ai:eval:configurator-chat`: 12/12 passed with API key unset.
- `npm test -- src/lib/ai`: 64/64 passed.
- Typecheck, production build, and focused Phase 6 lint passed.
- Full repository lint remains blocked by pre-existing debt (571 errors, 155 warnings); no Phase 6 file appears in the failures.

## Human Verification Required
See `06-VERIFICATION.md` and test `http://localhost:3000/olusturucu`.

## Self-Check: PASSED
- Both eval files and commits exist; checkpoint intentionally remains open.
