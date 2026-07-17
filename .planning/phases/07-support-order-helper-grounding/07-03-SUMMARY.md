---
phase: 07-support-order-helper-grounding
plan: "03"
subsystem: ai-evaluation
tags: [vitest, golden-eval, grounding, refusal, kvkk, source-scan]
requires:
  - phase: 07-support-order-helper-grounding
    plans: ["01", "02"]
    provides: support backend and customer UI
provides:
  - API-key-free grounding freshness and policy regression gate
  - Price-integrity, user-sends, admin-isolation, and transcript-minimization scans
  - Human verification checklist for live provider behavior
affects: [phase-08, release-verification]
tech-stack:
  added: []
  patterns: [deterministic golden fixtures, source-boundary regression scans]
key-files:
  created:
    - src/lib/ai/evals/support-chat-golden.ts
    - src/lib/ai/evals/support-chat-eval.test.ts
  modified:
    - package.json
key-decisions:
  - "Provider-independent evals are the release gate because no Anthropic key is available in this environment."
requirements-completed: []
requirements-pending-human: [SUPAI-01, SUPAI-02, SUPAI-03, SUPAI-04, SUPAI-05]
coverage:
  - id: D1
    description: Deterministic eval proves live-setting freshness, centralized pricing, scoped refusal, user-send, and KVKK isolation.
    verification:
      - kind: integration
        ref: npm run ai:eval:support-chat
        status: pass
    human_judgment: false
  - id: D2
    description: Live /destek provider-on behavior and mobile visual quality.
    verification: []
    human_judgment: true
    rationale: No Anthropic key is available; live streaming and model adherence require manual verification.
duration: 3min
completed: 2026-07-17
status: human_needed
---

# Phase 7 Plan 03: Support Safety Evaluation Summary

**Nine deterministic golden checks now prevent stale grounding, open-domain policy drift, model-composed prices, automatic WhatsApp sends, admin access, and transcript persistence.**

## Automated Evidence
- `npm run ai:eval:support-chat`: 9/9 passed
- `npm test -- src/lib/ai`: 84/84 passed
- `npm run ai:eval:configurator-chat`: 12/12 passed
- `npm run ai:eval:vehicle-match`: 27/27 passed
- `npm run typecheck`: passed
- Focused Phase 7 lint: passed
- `npm run build`: passed; 659 static pages, `/destek` and `/api/ai/support` present

## Task Commits
1. `4c52e94` — failing support golden eval
2. `33b76bb` — deterministic support eval command
3. UX polish task required no code change after browser smoke and focused checks.

## Checkpoint
Automated work is complete. Live provider-on behavior remains at the required human checkpoint; see `07-VERIFICATION.md`.

## Known Stubs
None.

## Self-Check: PASSED
All eval files, scripts, and commits listed above exist.
