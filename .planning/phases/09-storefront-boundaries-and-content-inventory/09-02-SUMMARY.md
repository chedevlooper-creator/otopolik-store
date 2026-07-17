---
phase: 09-storefront-boundaries-and-content-inventory
plan: 02
subsystem: ui
tags: [navigation, feature-flags, whatsapp, nextjs]

requires:
  - phase: 09-01
    provides: Default-off server-only customer AI UI flag
provides:
  - Four-link storefront navigation spine with the existing cart control preserved
  - Non-AI support fallback backed by store WhatsApp settings
  - Conditional customer chat imports and mounts for support and configurator routes
affects: [phase-10-homepage-and-motion-diet, phase-11-configurator-and-product-focus, FUT-05]

tech-stack:
  added: []
  patterns:
    - Server routes dynamically import customer chat islands only after the customer UI gate passes
    - Support contact links derive WhatsApp destinations from store settings

key-files:
  created: []
  modified:
    - src/components/Header.tsx
    - src/components/Footer.tsx
    - src/app/destek/page.tsx
    - src/app/olusturucu/page.tsx

key-decisions:
  - "The footer keeps a plain Destek link for contact discoverability while customer AI branding stays absent from static chrome."
  - "Customer chat modules are conditionally imported on server routes so the default-off path does not mount or load their client islands."

patterns-established:
  - "Static storefront chrome remains non-AI; customer AI visibility is evaluated only at server route mount points."
  - "WhatsApp support always uses getStoreSettings().whatsappNumber with buildWhatsAppLink()."

requirements-completed: [BOUND-02, BOUND-03, BOUND-04]

coverage:
  - id: D1
    description: "Primary navigation contains only Tasarla, Ürünler, Galeri, and İletişim while preserving the dedicated Sepet control."
    requirement: BOUND-04
    verification:
      - kind: other
        ref: "09-02 Task 1 source assertion"
        status: pass
      - kind: other
        ref: "npx eslint src/components/Header.tsx src/components/Footer.tsx"
        status: pass
    human_judgment: false
  - id: D2
    description: "Customer support defaults to settings-backed WhatsApp contact without statically importing SupportChat."
    requirement: BOUND-03
    verification:
      - kind: other
        ref: "09-02 Task 2 source assertion"
        status: pass
      - kind: other
        ref: "npm run typecheck"
        status: pass
    human_judgment: false
  - id: D3
    description: "Support and configurator customer AI mounts use isCustomerAiUiEnabled without changing admin or API capability gates."
    requirement: BOUND-02
    verification:
      - kind: unit
        ref: "npx vitest run src/lib/storefront-flags.test.ts src/lib/ai/config.test.ts"
        status: pass
      - kind: other
        ref: "protected capability and seed surface diff assertion"
        status: pass
    human_judgment: false

duration: 3min
completed: 2026-07-17
status: complete
---

# Phase 9 Plan 2: Storefront Chrome and Customer AI Route Boundaries Summary

**A four-link conversion spine, settings-backed WhatsApp support fallback, and server-gated dynamic chat imports now keep customer AI hidden by default without weakening admin or API capabilities.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-07-17T15:20:30Z
- **Completed:** 2026-07-17T15:22:33Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Reduced desktop and mobile primary navigation to Tasarla, Ürünler, Galeri, and İletişim while retaining the existing Sepet drawer control.
- Removed AI-branded support and dead homepage hash links from the footer while keeping legal, contact, and real-route destinations.
- Reframed `/destek` as a contact-first WhatsApp page by default, using the configured store number rather than a hardcoded destination.
- Gated and dynamically imported customer chat islands on `/destek` and `/olusturucu` through `isCustomerAiUiEnabled()`.

## Task Commits

1. **Task 1: Slim Header spine and Footer AI/dead-hash links** - `b023acc` (feat)
2. **Task 2: Gate /destek fallback and /olusturucu AI mounts** - `bcf98e4` (feat)

## Files Created/Modified

- `src/components/Header.tsx` - Locked the shared desktop/mobile navigation constant to the four conversion routes.
- `src/components/Footer.tsx` - Replaced AI support branding and removed dead homepage hash destinations.
- `src/app/destek/page.tsx` - Added the default contact-first WhatsApp fallback and conditional SupportChat import.
- `src/app/olusturucu/page.tsx` - Switched customer AI mounts to the dedicated storefront UI flag and conditional chat import.

## Decisions Made

- Kept a plain `/destek` footer link because the route now provides non-AI contact help and remains a useful support destination.
- Used server-side conditional `import()` calls for both customer chat islands to preserve reversible re-enablement without shipping the default-off mount path.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- The full `npm test -- --run` command collected two Playwright specs under Vitest. All 15 Vitest suites and 110 unit tests passed, but the two Playwright files failed during collection because Playwright's `test.describe()` cannot execute inside Vitest. This pre-existing runner-boundary issue is recorded in `deferred-items.md`; the Phase 9 targeted suites passed 23/23 tests.

## User Setup Required

None - customer AI UI remains default off. Operators may opt in with `CUSTOMER_AI_UI_ENABLED=true` only when the existing AI capability is configured.

## Next Phase Readiness

- Phase 10 can simplify homepage composition without customer AI links returning through shared chrome.
- Phase 11 receives a configurator whose AI affordances are absent by default while preserved for future opt-in.
- No Plan 09-02 blocker remains; the unrelated Vitest/Playwright collection boundary is deferred.

## Self-Check: PASSED

- All four modified source files and this summary exist.
- Task commits `b023acc` and `bcf98e4` are present.
- The protected `Hero.tsx` byte fingerprint remains `07632327b758e6c34342dbff07eeb601e1571fdc`.

---
*Phase: 09-storefront-boundaries-and-content-inventory*
*Completed: 2026-07-17*
