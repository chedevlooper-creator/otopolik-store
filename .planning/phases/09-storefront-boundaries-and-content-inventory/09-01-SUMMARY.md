---
phase: 09-storefront-boundaries-and-content-inventory
plan: 01
subsystem: ui
tags: [feature-flags, vitest, cms, storefront]

requires:
  - phase: v1.1
    provides: Existing AI capability configuration and CMS-backed storefront
provides:
  - Default-off server-only customer AI UI flag
  - Unit coverage separating customer visibility from admin and API capability
  - Reversible homepage CMS mount and seed inventory for Phase 10
affects: [09-02, phase-10-homepage-and-motion-diet]

tech-stack:
  added: []
  patterns:
    - Server-only opt-in storefront visibility flags compose with capability checks
    - Homepage sections are unmounted at the composition layer while CMS rows remain intact

key-files:
  created:
    - src/lib/storefront-flags.ts
    - src/lib/storefront-flags.test.ts
    - .planning/phases/09-storefront-boundaries-and-content-inventory/09-HOMEPAGE-INVENTORY.md
  modified:
    - .env.example

key-decisions:
  - "Customer AI UI visibility requires CUSTOMER_AI_UI_ENABLED=true/1 and an already configured AI capability."
  - "Homepage simplification remains reversible: Phase 10 may change mounts but must retain CMS and seed data."

patterns-established:
  - "Visibility versus capability: customer UI flags never authorize or disable admin/API AI."
  - "CMS inventory: classify mounted, chrome, seeded-only, hardcoded, and orphan component surfaces before unmounting."

requirements-completed: [BOUND-01]

coverage:
  - id: D1
    description: "Default-off customer AI UI gate remains independent from admin and API capability semantics."
    requirement: BOUND-01
    verification:
      - kind: unit
        ref: "npx vitest run src/lib/storefront-flags.test.ts src/lib/ai/config.test.ts"
        status: pass
      - kind: other
        ref: "npm run typecheck"
        status: pass
      - kind: other
        ref: "npx eslint src/lib/storefront-flags.ts src/lib/storefront-flags.test.ts"
        status: pass
    human_judgment: false
  - id: D2
    description: "Homepage CMS mount inventory captures reversible Phase 10 composition inputs."
    verification:
      - kind: other
        ref: "09-01 PLAN inventory node assertion"
        status: pass
    human_judgment: false

duration: 4min
completed: 2026-07-17
status: complete
---

# Phase 9 Plan 1: Customer AI UI Flag and Homepage Inventory Summary

**Server-only, default-off customer AI visibility now composes with existing AI readiness, while a complete homepage section matrix preserves every CMS row for reversible Phase 10 simplification.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-07-17T15:14:00Z
- **Completed:** 2026-07-17T15:18:09Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Added `isCustomerAiUiEnabled()` with explicit `true`/`1` opt-in and existing `isAiConfigured()` readiness.
- Proved default-off, opt-in, missing-key, kill-switch, and capability-independence behavior with 15 new parameterized assertions.
- Documented mounted, layout-chrome, seeded-only, hardcoded, and orphan homepage content without changing mounts or deleting CMS data.

## Task Commits

1. **Task 1 RED: Customer AI UI flag tests** - `0d89c76` (test)
2. **Task 1 GREEN: Customer AI UI helper and env documentation** - `3cfe3c6` (feat)
3. **Task 2: Homepage CMS section inventory artifact** - `cc1c4d6` (docs)

_Task 1 followed the required TDD test-to-implementation sequence._

## Files Created/Modified

- `src/lib/storefront-flags.ts` - Server-evaluated customer AI visibility helper.
- `src/lib/storefront-flags.test.ts` - Default-off and opt-in boundary coverage.
- `.env.example` - Documents the server-only storefront flag and its capability separation.
- `.planning/phases/09-storefront-boundaries-and-content-inventory/09-HOMEPAGE-INVENTORY.md` - Phase 10 mount and seed matrix.

## Decisions Made

- The customer UI gate remains in a dedicated storefront module so existing admin and API imports of `isAiConfigured()` are unchanged.
- `CUSTOMER_AI_UI_ENABLED` is intentionally not public and defaults to false for every value except normalized `true` or `1`.
- Homepage cleanup will operate on React composition only; Convex rows and seed entries remain available for remounting.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Initial typecheck found conflicting stale Next.js route declarations under `.next/dev/types` and `.next/types`. Running `npx next typegen` regenerated route types; the unchanged source then passed `npm run typecheck`.

## User Setup Required

None - no external service configuration is required. Operators may explicitly set `CUSTOMER_AI_UI_ENABLED=true` only when customer AI chrome should be enabled and AI is configured.

## Next Phase Readiness

- Plan 09-02 can consume `isCustomerAiUiEnabled()` at customer AI mount points without affecting admin or API capability.
- Phase 10 has a complete reversible homepage inventory and no CMS data was removed.
- No blockers remain.

## Self-Check: PASSED

- All four plan artifacts and this summary exist.
- Task commits `0d89c76`, `3cfe3c6`, and `cc1c4d6` are present.
- The protected `Hero.tsx` diff fingerprint remains `d8330d168d92b8e6d3d3d5782c5060d8b1e8fcc9`.

---
*Phase: 09-storefront-boundaries-and-content-inventory*
*Completed: 2026-07-17*
