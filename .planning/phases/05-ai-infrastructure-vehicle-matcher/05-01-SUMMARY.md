---
phase: 05-ai-infrastructure-vehicle-matcher
plan: "01"
subsystem: ai-infrastructure
tags: [ai-sdk, anthropic, rate-limit, pricing, vitest]
requires:
  - phase: 04
    provides: vehicle catalog and centralized mat pricing
provides:
  - Server-only lazy Anthropic provider with graceful disabled state
  - AI kill switch, model selection, and token caps
  - Public-surface rate limiting and read-only customer pricing helpers
affects: [05-02, 05-03, phase-06, phase-07]
tech-stack:
  added: [ai@7.0.30, "@ai-sdk/anthropic@4.0.15", zod@4.4.3]
  patterns: [lazy server-only provider, deterministic price tools, soft per-instance rate limit]
key-files:
  created:
    - src/lib/ai/config.ts
    - src/lib/ai/anthropic-client.ts
    - src/lib/ai/rate-limit.ts
    - src/lib/ai/customer-tools.ts
  modified:
    - package.json
    - package-lock.json
    - .env.example
key-decisions:
  - "Pinned the matcher to the official Claude Haiku 4.5 snapshot claude-haiku-4-5-20251001."
  - "Kept customer pricing helpers pure and isolated from every admin/Convex mutation surface."
patterns-established:
  - "AI providers return null when unconfigured, matching the project's graceful fallback architecture."
  - "Customer-facing AI can read prices only through getVehiclePrice/calculateMatPrice."
requirements-completed: [AIINF-01, AIINF-02, AIINF-03, AIINF-04, AIINF-05]
coverage:
  - id: D1
    description: Server-only AI configuration degrades cleanly when disabled or unconfigured
    requirement: AIINF-02
    verification:
      - kind: unit
        ref: src/lib/ai/config.test.ts
        status: pass
    human_judgment: false
  - id: D2
    description: Customer tools preserve centralized price equality and exclude admin mutations
    requirement: AIINF-03
    verification:
      - kind: unit
        ref: src/lib/ai/customer-tools.test.ts
        status: pass
    human_judgment: false
  - id: D3
    description: Public AI requests receive process-local rate limiting
    requirement: AIINF-04
    verification:
      - kind: unit
        ref: src/lib/ai/rate-limit.test.ts
        status: pass
    human_judgment: false
duration: 3min
completed: 2026-07-17
status: complete
---

# Phase 5 Plan 01: AI Infrastructure Foundation Summary

**Lazy Anthropic AI SDK infrastructure with a server-only key, kill switch, token caps, rate limiting, and catalog-grounded pricing tools**

## Performance
- **Duration:** 3 min
- **Started:** 2026-07-17T05:26:00Z
- **Completed:** 2026-07-17T05:29:00Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments
- Added a nullable Anthropic provider that never throws when the key is missing or placeholder-like.
- Added per-feature model/token configuration and a global environment kill switch.
- Added a ten-request sliding-window limiter and customer-only price helpers with structural isolation tests.

## Task Commits
1. **Task 1 RED: AI config tests** - `42c53f1`
2. **Task 1 GREEN: SDK and lazy configuration** - `81812c5`
3. **Task 2 RED: guardrail tests** - `8451a1d`
4. **Task 2 GREEN: limiter and price tools** - `e41c9b4`

## Files Created/Modified
- `src/lib/ai/config.ts` - Configuration, kill switch, token cap, and model ID.
- `src/lib/ai/anthropic-client.ts` - Server-only lazy Anthropic provider.
- `src/lib/ai/rate-limit.ts` - Process-local sliding-window limiter.
- `src/lib/ai/customer-tools.ts` - Read-only centralized pricing adapters.
- `src/lib/ai/*.test.ts` - Configuration, limiter, price-equality, and isolation coverage.
- `.env.example` - Server-only Anthropic environment documentation.
- `package.json`, `package-lock.json` - Current compatible AI SDK packages.

## Decisions Made
- Used AI SDK 7 structured-output-compatible packages resolved from npm and the official pinned Haiku 4.5 model ID.
- Accepted process-local serverless rate limiting for v1, as specified by the research.

## Deviations from Plan
- Vitest and the `test` script were already present before Phase 5, so no test-runner installation was required in Plan 03.
- Full `npm run lint` is blocked by pre-existing lint errors under `.agents/gsd-core` and existing application debt. Focused lint on `src/lib/ai/**/*.{ts,tsx}` passes.

## Issues Encountered
- The initial source-isolation test used `import.meta.url`, which jsdom rewrote to a non-file URL. It was corrected to resolve from `process.cwd()`.

## User Setup Required
- Set `ANTHROPIC_API_KEY` and optionally `AI_FEATURES_ENABLED=true` in the server environment to enable LLM fallback.

## Next Phase Readiness
- Plan 02 can now wire deterministic-first vehicle matching and public rate-limited API routes.

## Self-Check: PASSED
- All created files exist.
- Commits `42c53f1`, `81812c5`, `8451a1d`, and `e41c9b4` exist.
