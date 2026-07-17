# Phase 11: Configurator and Product Simplification - Context

**Gathered:** 2026-07-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Reduce the mat configurator to at most three decision surfaces (vehicle, colors, optional extras) with floor + edge colors merged into one surface with live preview, keep price and add-to-cart reachable on mobile, and simplify product listing/detail chrome while fit, material, and purchase path stay clear. Configured price continues to come only from `mat-pricing.ts` / vehicle price helpers. Do not touch cart/checkout flows (Phase 12), homepage (done in Phase 10), admin surfaces, or Convex backend contracts. Customer AI stays behind the Phase 9 flag (off by default) — the `aiEnabled` branches in the configurator remain gated, not removed.

</domain>

<decisions>
## Implementation Decisions

### Color surface merge (CONF-01, CONF-02)
- **D-01:** Floor + edge colors merge into ONE "Renkler" surface: a Taban swatch row and a Kenar swatch row stacked inside a single card — reuse `ColorPicker` twice within one section rather than inventing a new component.
- **D-02:** The step progress bar becomes 3 static steps (Araç / Renkler / Ekstralar). Keep the stepper as orientation, but remove the animated fill bar, shine sweep, and spring badge animations per the Phase 10 motion diet.
- **D-03:** Live preview reacts to color changes with a subtle crossfade (≤200ms opacity fade), replacing the AnimatePresence spring scale transition. Must respect `prefers-reduced-motion`.

### Mobile price/CTA reachability (CONF-03)
- **D-04:** Mobile-only sticky bottom bar with live total price + a single "Sepete Ekle" CTA. Hidden on desktop, where the inline `ConfigSummary` card continues to work.
- **D-05:** The sticky bar contains price + one CTA only. The "Hemen Al" checkout shortcut stays exclusively in the inline `ConfigSummary` card.
- **D-06:** The sticky bar is always visible with live price from page load; "Sepete Ekle" is disabled until a vehicle is selected (`canAdd`/`vehicleComplete`). Price transparency from the first second.

### Configurator chrome (CONF-01 + motion diet)
- **D-07:** Extras (Topuk pedi, Bagaj paspası) become a collapsed accordion: "Ekstralar" renders as a collapsed row with a + toggle, showing item prices when opened — progressive disclosure per CONF-01/CONF-02.
- **D-08:** The customer gallery strip (12 thumbnails + lightbox below the preview) stays as-is — social proof near the purchase decision is a trust surface.
- **D-09:** The cabin/flat preview toggle (Kabin Görünümü / Paspas Tasarımı) stays — both views carry real information.
- **D-10:** Motion inside the configurator drops to the Phase 10 allowlist: remove `StaggeredReveal` and spring transitions; keep only `btn-press` button micro-interactions, the ≤200ms preview crossfade, and focus states.

### Product page chrome (PROD-01)
- **D-11:** `/urunler` listing keeps all functional controls (category pills, sort select, VehicleMatches band). Simplification happens in styling density: quieter pills, simpler section headers, less decoration.
- **D-12:** Product detail goes purchase-first: gallery, name, fit note, price, AddToCart stay on top. Long spec/feature icon grids collapse into accordion sections. Keep ONE trust element (TrustStrip), drop Testimonials from the detail page, keep related products.
- **D-13:** ProductCards keep the `glass-vitrine` treatment (locked brand signature per CLAUDE.md); card content may get leaner but the glass display-window look stays.

### Claude's Discretion
- Exact accordion implementation for extras and detail-page specs (native `<details>` vs. controlled component), provided it is accessible and works without JS surprises.
- Exact sticky-bar markup/styling, provided it uses existing utilities (`btn-red-rich`, `surface-glass`/`mac-glass` patterns) and doesn't cover content when the keyboard is open.
- How ColorPicker's internal step-number badges are renumbered/removed after the merge.
- Which listing styling densities to reduce, within D-11's "controls stay" constraint.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design system & motion rules
- `CLAUDE.md` — design-system hard rules (OLED black, Racing Red accent reserve, glass-vitrine, motion must respect `prefers-reduced-motion`)
- `.planning/phases/10-homepage-and-motion-diet/10-CONTEXT.md` — the motion-diet allowlist precedent this phase extends to the configurator
- `.planning/phases/09-storefront-boundaries-and-content-inventory/09-UI-SPEC.md` — locked nav spine, accent reserve list, typography/spacing contract

### Pricing single source (PROD-02)
- `src/lib/mat-pricing.ts` — `MAT_PRICING`, `calculateMatPrice` — the ONLY price source; no new price math anywhere
- `src/lib/vehicle-data.ts` — `getVehiclePrice()` vehicle price helper

### Surfaces being changed
- `src/components/configurator/MatConfigurator.tsx` — orchestrator: stepper, preview column, options column, gallery strip
- `src/components/configurator/ColorPicker.tsx`, `ExtrasSelector.tsx`, `ConfigSummary.tsx`, `VehicleSelector.tsx` — the decision-surface components
- `src/context/` configurator assistant provider — `useConfiguratorAssistant()` supplies `currentStep`, selections, `totalPrice`, `buildCartItem`
- `src/app/urunler/page.tsx` — listing chrome (FilterControls, VehicleMatches, grid)
- `src/app/urunler/[slug]/page.tsx` — detail page blocks (spec grids, TrustStrip, Testimonials, related)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ColorPicker` already takes `label`/`colors`/`selected`/`onSelect` props — the merged Renkler surface is two instances in one card, not a new component.
- `ConfigSummary` already exposes `totalPrice`, `onAddToCart`, `canAdd` — the sticky bar can consume the same handlers/state from `useConfiguratorAssistant()`.
- `btn-red-rich` + `btn-press`, `surface-glass`, `spec-value` utilities cover sticky-bar and accordion styling needs; no new CSS inventions required.
- `GalleryLightbox` + `CONFIGURATOR_GALLERY_ITEMS` stay untouched (D-08).

### Established Patterns
- Motion allowlist precedent from Phase 10: Hero was converted to a server component with CSS-only micro-interactions; the configurator stays a client component (it's stateful) but follows the same allowlist.
- `useConfiguratorAssistant()` context already centralizes step/selection/price state — mobile sticky bar should read from it rather than duplicating state.
- All animations must be disabled under `prefers-reduced-motion: reduce` (globals.css pattern).

### Integration Points
- `currentStep` in the assistant provider is derived for a 4-step model — merging colors into one step changes step indexing; the provider and any `aiEnabled` assistant flows that reference steps must stay consistent.
- `ColorPicker` receives a `step` prop (2 and 3 today) used for its number badge — renumbering or removal needed after the merge.
- Sticky bar mounts inside the configurator page; must not conflict with the cart drawer or (in Phase 12 scope) checkout surfaces.

</code_context>

<specifics>
## Specific Ideas

- The three decision surfaces are exactly: 1) Araç, 2) Renkler (Taban row + Kenar row, live preview), 3) Ekstralar (collapsed accordion).
- Sticky bar behavior modeled on standard e-commerce product pages: always-present price, disabled CTA until configuration is valid.
- Detail-page simplification keeps the purchase decision above the fold; information density moves behind accordions rather than being deleted.

</specifics>

<deferred>
## Deferred Ideas

- Cart/checkout calm-down (including any sticky-bar ↔ checkout interactions) belongs to Phase 12.
- Lenis keep/remove decision and cross-surface a11y verification belong to Phase 13.
- Any change to the AI-gated configurator assistant/chat UX stays out of scope — flag remains off (Phase 9 contract).

</deferred>

---

*Phase: 11-Configurator and Product Simplification*
*Context gathered: 2026-07-17*
