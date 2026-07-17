---
phase: 07-support-order-helper-grounding
plan: "01"
subsystem: ai-support-api
tags: [ai-sdk, convex, cms, grounding, streaming, whatsapp]
requires:
  - phase: 05-ai-infrastructure-vehicle-matcher
    provides: server-only AI client, rate limiter, kill switch, centralized pricing
  - phase: 06-streaming-chat-configurator-assistant
    provides: streaming route and tool patterns
provides:
  - Convex-first public FAQ and content-page reads with static fallback
  - Answer-time support grounding over CMS and site settings
  - Isolated Turkish support tools, scoped prompt, and streaming API route
affects: [07-02, 07-03, phase-08]
tech-stack:
  added: []
  patterns: [answer-time grounding, user-sends draft, customer-tool isolation]
key-files:
  created:
    - src/lib/ai/support-grounding.ts
    - src/lib/ai/support-tools.ts
    - src/lib/ai/support-prompt.ts
    - src/app/api/ai/support/route.ts
  modified:
    - src/lib/cms.ts
    - src/lib/ai/config.ts
key-decisions:
  - "Grounding dependencies resolve at call time so every answer sees current CMS/settings values."
  - "Support has a separate route and tool surface from configurator and admin mutations."
requirements-completed: [SUPAI-01, SUPAI-02, SUPAI-03, SUPAI-05]
coverage:
  - id: D1
    description: Live CMS and site-settings grounding is rebuilt for every support answer.
    requirement: SUPAI-01
    verification:
      - kind: unit
        ref: src/lib/ai/support-grounding.test.ts
        status: pass
    human_judgment: false
  - id: D2
    description: Support route applies scoped Turkish policy and Phase 5/6 cost guardrails.
    requirement: SUPAI-02
    verification:
      - kind: unit
        ref: src/lib/ai/support-tools.test.ts
        status: pass
    human_judgment: false
duration: 4min
completed: 2026-07-17
status: complete
---

# Phase 7 Plan 01: Live Support Grounding Summary

**Convex-first CMS reads now feed a freshly rebuilt support fact pack, isolated pricing/draft tools, and a guarded streaming Turkish support endpoint.**

## Performance
- **Tasks:** 2
- **Tests:** 20 passed
- **Typecheck:** passed
- **Focused lint:** passed

## Task Commits
1. `7552c6d` — failing live-grounding contracts
2. `7c621cb` — live CMS/settings grounding
3. `ed3f6a3` — failing support-tool contracts
4. `763e383` — support tools, prompt, model config, and streaming route

## Deviations from Plan
- **Rule 3 — testability:** Kept the grounding builder pure with type-only imports and lazy default server dependencies so Vitest can inject deterministic live-setting fixtures without weakening production server boundaries.

## Known Stubs
None.

## Self-Check: PASSED
All source files and commits listed above exist.
