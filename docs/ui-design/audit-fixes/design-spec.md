# Design Specification: UI/UX Audit Fixes

**Designer:** Aura UI workflow  
**Date:** 2026-07-12  
**Status:** Implemented; final visual regression pass blocked by local Browser URL policy  
**Approval:** User requested implementation after reviewing the browser audit  
**Source audit:** `deliverables/browser-ui-ux-audit-2026-07-12.md`

## Intent

Keep OTO POLİK's premium technical-workshop identity while removing mobile overlap, broken preview, inaccessible controls, false loading states, and admin/store chrome conflicts.

## Canon to preserve

- Anthracite EVA-sheet surfaces, red primary actions, sand technical accents.
- Barlow Condensed display typography, Barlow body copy, IBM Plex Mono specifications.
- Square corners, technical borders, restrained motion, real product photography.

## Acceptance criteria

- Mobile controls remain visible and tappable at 390 px; no sticky or floating element obscures content.
- Configurator preview reflects selected floor/edge colors or exposes a clear fallback state.
- Product card pricing does not clip at 390 px.
- Product detail purchase action is reachable without displacing page content and all icon buttons have accessible names.
- Cart/checkout do not show a false empty state before client hydration.
- Admin routes do not render storefront header, footer, cart, or WhatsApp UI.
- Admin mobile layout is usable; loading, empty, and error states are distinct.
- WCAG 2.2 AA contrast and visible focus treatment are retained.

## Responsive behavior

- **Mobile:** compact purchase summary; 44 px controls; floating WhatsApp hidden on transactional/configurator/admin routes.
- **Tablet:** vehicle/search controls may wrap instead of compressing below legible widths.
- **Desktop:** existing wide composition and sticky product/configurator aids remain.

## Verification

- TypeScript, ESLint, production build.
- Browser QA at 390×844, 768×1024, and desktop default viewport.
- Interactions: catalog search, configurator colors, cart hydration, product add, checkout validation, admin navigation/error states.

## Verification results

- Targeted ESLint passed for the storefront, configurator, and admin fixes.
- `git diff --check` passed.
- HTTP smoke tests passed for `/`, `/urunler`, `/urunler/eva-oto-paspas-seti`, `/olusturucu`, and `/sepet`.
- Unauthenticated `/admin` correctly returns a `307` redirect to `/admin/login?next=%2Fadmin`.
- The final full lint/type/build pass is currently blocked by a separate, incomplete Convex integration: missing `convex/_generated/*` modules, untyped Convex handlers/consumers, stale `fetchOrders` references, and reintroduced `Product.inStock` references. That integration appeared while this fix set was being verified and was intentionally not overwritten.
- The in-app Browser rejected the existing `127.0.0.1` tab under its local URL security policy. Per Browser safety rules, no alternate browser-control workaround was attempted; responsive visual QA remains to be repeated once the local URL is allowed.
