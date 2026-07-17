# Phase 11: Configurator and Product Simplification - Research

**Researched:** 2026-07-17
**Domain:** Internal React/Next.js refactor — decision-surface reduction, motion removal, mobile sticky CTA (no new dependencies)
**Confidence:** HIGH

## Summary

This phase is a pure internal refactor of three already-implemented surfaces
(`MatConfigurator.tsx` + its child components, `/urunler` listing, `/urunler/[slug]` detail) —
it introduces zero new npm packages and zero new architectural concepts. Every requirement
(CONF-01, CONF-02, CONF-03, PROD-01, PROD-02) is already fully specified at the decision level in
`11-CONTEXT.md` (D-01…D-13) and translated to exact spacing/copy/color/motion values in
`11-UI-SPEC.md`. The planner's job is almost entirely task sequencing and dependency ordering
within a fixed design, not open technical investigation.

The highest-value finding from this research is **not** a library recommendation — it's that the
current codebase has two structural facts the plan must account for that aren't spelled out
verbatim in CONTEXT.md: (1) `useConfiguratorAssistant()`'s `currentStep` is derived from 4 boolean
gates (`vehicleComplete`, `floorTouched`, `edgeTouched`) that must collapse to 3 gates, and every
consumer of `currentStep` (just `MatConfigurator.tsx`'s stepper today) must be updated in lockstep;
and (2) `tests/configurator.spec.ts` (Playwright E2E) asserts the *current* 4-step labels
("Aracınız" → "Taban" → "Kenar" → "Ekstralar") and separate `aria-current="step"` transitions per
color pick — this test **will fail** after the D-01/D-02 merge and must be updated in the same
phase, or CI/verification will show a false regression.

`getVehiclePrice()` in `vehicle-data.ts` already ignores its brand/model arguments and returns
`MAT_PRICING.basePrice` unconditionally — PROD-02 ("price continues to come only from
`mat-pricing.ts`/vehicle price helpers") is structurally already satisfied; this phase must not
introduce any new price computation, only reuse `totalPrice`/`calculateMatPrice()` from the
existing context, which the sticky bar can consume directly.

**Primary recommendation:** Treat this as a component-editing phase, not a build-new-things phase.
Plan tasks around: (1) collapsing the assistant provider's step model 4→3, (2) merging
`ColorPicker` into one "Renkler" card, (3) building the extras accordion and mobile sticky bar as
new small components that read from `useConfiguratorAssistant()` rather than duplicating state,
(4) stripping framer-motion from the stepper/`ColorPicker`/options wrapper per the Motion Contract
table, (5) trimming `/urunler` and `/urunler/[slug]` chrome per D-11/D-12, and (6) updating
`tests/configurator.spec.ts` to match the new 3-step model as part of the same phase.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Configurator step/selection state | Frontend Server (client component state) | — | `ConfiguratorAssistantProvider` is a client-side React context (`useState`/`useMemo`); no server round-trip involved |
| Color selection UI (merged Renkler) | Browser / Client | — | Pure client interaction (`ColorPicker` swatch buttons), no data fetching |
| Live preview crossfade | Browser / Client | — | Local static images (`MAT_PREVIEW_IMAGES`), CSS/framer-motion opacity transition only |
| Price calculation | API / Backend (logic layer, not network) | — | `calculateMatPrice()` / `getVehiclePrice()` in `src/lib/` — pure synchronous functions, single source of truth per PROD-02; no DB or network call |
| Mobile sticky bar | Browser / Client | — | Reads existing context state (`totalPrice`, `canAdd`, `buildCartItem`); no new state source |
| Product listing/detail chrome | Frontend Server (Next.js async Server Components) | Database / Storage (via `catalog.ts` → Convex or static fallback) | `/urunler` and `/urunler/[slug]` are `async` Server Components resolving `getProducts()`/`getProductBySlug()` server-side before HTML ships |
| Cart mutation on Add-to-Cart | Browser / Client | — | `useCart().addItem()` writes to `localStorage`-backed external store (`cart-store.ts`); no Convex write until checkout (unchanged, out of scope) |

## Package Legitimacy Audit

**Not applicable.** This phase installs zero new packages. All work reuses already-installed
dependencies: `framer-motion` (existing, usage reduced not added), `lucide-react` (existing icons
only), `next/image`, and the project's own `src/lib/`/`src/components/` modules. No `npm install`
step belongs in this phase's plan — flag any task that proposes adding a dependency as
out-of-contract with `11-UI-SPEC.md`'s "No shadcn, no new dependencies" line and CONTEXT.md's
Deferred Ideas ("New animation libraries... Adds spectacle opposite to deletion-first goal" is a
project-wide Out of Scope item in REQUIREMENTS.md).

## Standard Stack

No new stack. Confirmed existing dependencies in use for this phase's surfaces
`[VERIFIED: package.json]`:

| Library | Version (installed) | Purpose in this phase | Why standard here |
|---------|---------|---------|--------------|
| `framer-motion` | as pinned in `package.json` (unchanged) | Reduced, not removed — only the ≤200ms opacity crossfade (D-03) and possibly `btn-press`-adjacent micro-interactions remain motion-driven; most current usages get deleted per the Motion Contract table | Already the project's only animation library; introducing a second one would violate the "no new animation libraries" out-of-scope rule |
| `lucide-react` | as pinned (unchanged) | `PlusIcon` (accordion chevron rotate-45, existing pattern already used in `/urunler/[slug]` `<details>` blocks), `ChevronDownIcon` if needed for consistency | Already used for every icon in the touched surfaces |
| React `<details>`/`<summary>` (native, not a library) | N/A | Extras accordion (D-07) and detail-page "Özellikler" accordion (D-12) — CSS-only disclosure, matches existing `/urunler/[slug]` accordion pattern exactly | Zero-JS-cost, accessible by default, already the established pattern on this exact page for "Araç uyumluluğu"/"Kargo ve teslimat"/"Bu sette neler var?" |

**Installation:** none — no `npm install` required for this phase.

## Architecture Patterns

### System Architecture Diagram

```
                    ┌─────────────────────────────┐
                    │  /olusturucu (Server Comp.)  │
                    │  reads CMS copy, passes      │
                    │  aiEnabled flag              │
                    └──────────────┬────────────────┘
                                   │ renders
                                   ▼
              ┌────────────────────────────────────────────┐
              │  ConfiguratorAssistantProvider (client ctx) │
              │  vehicle / floor / edge / heelPad / trunkMat │
              │  currentStep (3-gate after this phase)      │
              │  totalPrice = calculateMatPrice(...)        │──┐  single price source
              │  buildCartItem()                            │  │  (PROD-02)
              └──────────────────┬───────────────────────────┘  │
                                 │ useConfiguratorAssistant()    │
        ┌────────────────────────┼─────────────────────────┐    │
        ▼                        ▼                         ▼    │
┌───────────────┐     ┌───────────────────┐      ┌──────────────┴──┐
│ VehicleSelector│     │  Renkler card      │      │ ExtrasSelector   │
│ (step 1)       │     │  (step 2 — NEW)    │      │  accordion       │
│                │     │  ColorPicker×2     │      │  (step 3)        │
│ sets vehicle   │     │  Taban + Kenar row │      │  heelPad/trunkMat│
└───────┬────────┘     │  → live preview    │      └────────┬─────────┘
        │              │  crossfade (≤200ms)│               │
        │              └─────────┬──────────┘               │
        │                        │                           │
        ▼                        ▼                           ▼
┌──────────────────────────────────────────────────────────────────┐
│           Preview column (Image/FlatMatPreview) — unchanged      │
└──────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
        ┌────────────────────────────────────────────┐
        │  Desktop: inline ConfigSummary (unchanged)  │
        │  Mobile:  NEW sticky bottom bar              │
        │    - reads totalPrice, canAdd, buildCartItem │
        │    - single "Sepete Ekle" CTA (D-05)         │
        └──────────────────┬───────────────────────────┘
                            │ onClick → addItem()
                            ▼
                  ┌───────────────────────┐
                  │ cart-context/cart-store│  (out of scope — Phase 12
                  │ (localStorage, client) │   owns cart/checkout calm-down)
                  └───────────────────────┘

──────────────────────────────────────────────────────────────────

┌───────────────────────┐        ┌──────────────────────────────┐
│ /urunler (Server Comp) │        │ /urunler/[slug] (Server Comp) │
│ FilterControls (kept)  │        │ purchase-first layout (D-12): │
│ VehicleMatches (kept)  │        │  gallery→name→fit→price→CTA   │
│ ProductCard grid       │        │  spec grid → accordion         │
│ (glass-vitrine, D-13)  │        │  Testimonials REMOVED          │
│ styling density ↓ (D-11)│        │  TrustStrip KEPT (only trust) │
└────────────────────────┘        └────────────────────────────────┘
```

### Recommended Project Structure

No new files/folders required beyond possibly one new small component for the sticky bar (naming
at planner's discretion, e.g. `src/components/configurator/MobileStickyBar.tsx`). All other work
edits existing files in place:

```
src/components/configurator/
├── MatConfigurator.tsx        # EDIT: stepper 4→3, remove StaggeredReveal, merge color section, mount sticky bar
├── ColorPicker.tsx            # EDIT: strip framer-motion hover/tap/glow, keep focus-visible + simple hover
├── ConfigSummary.tsx          # NO CHANGE per D-05 (stays the desktop inline summary; "Hemen Sipariş Ver" stays exclusive to it)
├── ExtrasSelector.tsx         # EDIT: wrap existing content in <details>/<summary> per D-07
├── ConfiguratorAssistantProvider.tsx  # EDIT: currentStep 4-gate → 3-gate (vehicle / colors / extras)
├── VehicleSelector.tsx        # EDIT: step badge "01" stays; internal h2 copy unaffected by merge
└── MobileStickyBar.tsx        # NEW (small): mobile-only, reads useConfiguratorAssistant(), single CTA

src/app/urunler/
├── page.tsx                   # EDIT: styling density only (D-11) — no control removal
└── [slug]/page.tsx            # EDIT: wrap feature grid in accordion, remove <Testimonials/>, keep <TrustStrip/>

tests/
└── configurator.spec.ts       # EDIT: update step-label assertions to 3-step model ("Araç"/"Renkler"/"Ekstralar")
```

### Pattern 1: Step count derived from boolean gates, not an array length

**What:** `currentStep` in `ConfiguratorAssistantProvider.tsx` is computed as a ternary chain over
`vehicleComplete`, `floorTouched`, `edgeTouched` — NOT read from `steps.length` in
`MatConfigurator.tsx` (that array is presentation-only, currently 4 items, hardcoded separately).
**When to use:** Any task touching the stepper must update BOTH the provider's derivation logic
AND the `steps` array literal in `MatConfigurator.tsx` — they are two separate sources of truth
today and must be kept in sync when collapsing to 3.
**Example:**
```typescript
// Source: src/components/configurator/ConfiguratorAssistantProvider.tsx (current, 4-gate)
const currentStep = !vehicleComplete
  ? 0
  : !floorTouched
    ? 1
    : !edgeTouched
      ? 2
      : 3;

// Target shape after D-01/D-02 merge (3-gate — floor+edge collapse to one "colors" gate)
// Planner should decide: gate on (floorTouched && edgeTouched), or drop touched-tracking
// entirely and gate purely on vehicleComplete (since colors always have defaults selected,
// per UI-SPEC's E2 "populated" coverage — "Default selections guarantee a selected swatch...
// no unselected state exists"). The second option is simpler and matches D-06's "price
// transparency from the first second" framing.
```

### Pattern 2: `ColorPicker`'s `step` prop drives its own number badge

**What:** `ColorPicker.tsx` receives a `step: number` prop rendered as `0{step}` inline in its own
`<h2>`. `MatConfigurator.tsx` currently passes `step={2}` and `step={3}` to the two instances.
**When to use:** Per CONTEXT.md's "Claude's Discretion" — after the merge, both `ColorPicker`
instances render inside ONE "Renkler" section. The UI-SPEC's Typography section says the merged
heading is one `h2` "Renkler" with two sub-labels using the Label role (not a second h2/step
badge). This implies `ColorPicker`'s own `<h2>`+step-badge rendering must be suppressed or
refactored when used in merged mode — either add an optional prop to hide the heading (e.g.
`showHeading?: boolean`) and render the "Renkler" h2 + step number once in `MatConfigurator.tsx`,
or extract the heading out of `ColorPicker` entirely and have the parent section own it. This is
open to implementation choice but MUST be resolved — leaving both instances rendering their own
"02 Taban Rengi" / "03 Kenar Rengi" headings would violate the UI-SPEC Typography contract (one
h2 "Renkler" + two sub-labels, not two h2s with step badges).
**Example:**
```typescript
// Source: src/components/configurator/ColorPicker.tsx (current)
<h2 className="flex items-baseline gap-3 font-heading text-2xl font-bold text-white">
  <span className="spec-value text-base font-medium text-white">0{step}</span>
  {label}
  ...
</h2>
```

### Pattern 3: Sticky bar reads context, does not duplicate state (established precedent)

**What:** `ConfigSummary.tsx` already demonstrates the exact pattern the new mobile sticky bar
should follow: it receives `totalPrice`, `canAdd`, `onAddToCart` as props from
`MatConfigurator.tsx`, which itself pulls them from `useConfiguratorAssistant()`. The sticky bar
should either (a) receive the same props from `MatConfigurator.tsx`, or (b) call
`useConfiguratorAssistant()` directly if mounted as a sibling — CONTEXT.md's Integration Points
section explicitly states "mobile sticky bar should read from it rather than duplicating state."
**When to use:** Building `MobileStickyBar.tsx`.
**Example:**
```typescript
// Source: src/components/configurator/ConfigSummary.tsx (existing precedent to mirror)
const priceFormatter = (n: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
// ...
<p className="spec-value text-2xl font-semibold text-white sm:text-3xl">
  {canAdd ? animatedPrice : "—"}
</p>
```
Per D-06 and the UI-SPEC's E4 "empty" coverage, the sticky bar shows "—" or "Araç seçin" helper
text (not a hidden/collapsed state) when `!canAdd` — it is ALWAYS visible from page load, never
conditionally mounted.

### Pattern 4: Existing `<details>` accordion pattern to replicate for D-07/D-12

**What:** `/urunler/[slug]/page.tsx` already has three working `<details className="group ...">`
blocks with a `PlusIcon` that rotates 45° via `group-open:rotate-45` — this is the exact,
already-approved, CSS-only accessible accordion pattern the UI-SPEC's Motion Contract calls out
("Native `<details>`/`<summary>` disclosure triangle rotation... CSS-only, no framer-motion").
**When to use:** Both the Ekstralar accordion (D-07) and the new "Özellikler" feature-grid
accordion (D-12) on the detail page.
**Example:**
```typescript
// Source: src/app/urunler/[slug]/page.tsx (existing pattern, lines 258-271)
<details className="group border-b border-dashed border-border" open>
  <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-heading text-base font-bold uppercase text-white [&::-webkit-details-marker]:hidden">
    Bu sette neler var?
    <PlusIcon className="h-4 w-4 text-white transition-transform group-open:rotate-45" aria-hidden="true" />
  </summary>
  <div className="pb-5">{/* content */}</div>
</details>
```
Note: the collapsed-by-default requirement differs per element — Ekstralar (D-07) is collapsed by
default ("Ekstralar renders as a collapsed row"), while the existing "Bu sette neler var?" stays
`open` by default (per UI-SPEC Copywriting Contract row). The new "Özellikler" accordion's
default-open state isn't explicitly locked in CONTEXT.md/UI-SPEC — planner should default it to
collapsed (consistent with "moves it behind progressive disclosure" framing in the UI-SPEC) unless
a later checkpoint specifies otherwise.

### Anti-Patterns to Avoid

- **Duplicating step/price state in the sticky bar:** Would create two sources of truth for
  `currentStep`/`totalPrice` — always consume `useConfiguratorAssistant()`.
- **Adding a second `AnimatePresence`/spring transition "for consistency":** The Motion Contract
  table is exhaustive and prescriptive — anything not explicitly listed as "Keep" must be removed,
  not reimplemented in a lighter form. Do not invent a new fade/slide for the sticky bar's
  mount — D-06 explicitly says "always visible... no slide-in animation" (per Motion Contract row).
- **Introducing a new price-formatting function in the sticky bar:** Reuse `formatPrice()` (from
  `src/lib/format.ts`, already used by `ConfigSummary`/`ProductCard`) or the same
  `useAnimatedNumber` + `priceFormatter` pattern from `ConfigSummary.tsx` — never hand-roll
  `Intl.NumberFormat` a second time in a new file (PROD-02, "no duplicate price sources" extends
  to formatting logic per the UI-SPEC's explicit constraint note).
- **Changing `getVehiclePrice()`'s brand/model-blind behavior:** Out of scope. It already ignores
  its arguments by design (`void brand; void modelName;`) — this phase must not "fix" that; it's
  intentional per the code comment ("Aynı EVA paspas seti... aynı taban fiyatı kullanır").

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accessible collapsible sections | A custom `useState`-driven accordion component with ARIA wiring | Native `<details>`/`<summary>` (already the established pattern on this exact page) | Zero JS needed, built-in keyboard/AT support, already proven in this codebase for 3 other sections |
| Price formatting | A new `Intl.NumberFormat` call or string template in the sticky bar | `formatPrice()` (`src/lib/format.ts`) or the `useAnimatedNumber`+`priceFormatter` pair from `ConfigSummary.tsx` | PROD-02 requires one price source; formatting drift (e.g. missing `maximumFractionDigits: 0`) would visually diverge from `ConfigSummary` |
| Reduced-motion handling | Per-component `matchMedia("(prefers-reduced-motion)")` checks in new components | The existing `globals.css` `@media (prefers-reduced-motion: reduce)` blocks (see lines ~219, ~565, ~748) — add new selectors there, or rely on framer-motion's automatic reduced-motion respect when only `opacity` is animated | Centralizes the policy; framer-motion opacity-only transitions are cheap to gate via a shared CSS rule rather than JS media-query listeners in every component |
| Mobile CTA reachability | A custom viewport-height calculation or JS scroll-listener to show/hide a floating button | CSS `fixed bottom-0` bar with `pb-[env(safe-area-inset-bottom)]` (already specified in UI-SPEC spacing exceptions) | Simpler, no scroll-jank, matches the `WhatsappFloat.tsx` precedent of a CSS-fixed-position element gated by pathname, not scroll math |

**Key insight:** Every "new" surface this phase needs (accordion, sticky bar, merged color card)
has a directly analogous, already-shipped pattern elsewhere in this exact codebase. The research
found zero cases where an external library or novel technique is warranted — the risk in this
phase is scope/consistency drift, not technical difficulty.

## Common Pitfalls

### Pitfall 1: Sticky bar overlapping the `WhatsappFloat` FAB

**What goes wrong:** `WhatsappFloat.tsx` is a `fixed bottom-4 right-4 z-40` circular button. If a
new mobile sticky bar were added to a route where `WhatsappFloat` is still visible, they would
visually collide.
**Why it happens:** Both are `position: fixed` bottom-anchored elements.
**How to avoid:** `WhatsappFloat.tsx` already hides itself on `/olusturucu`, `/urunler`, and every
`/urunler/*` route (`HIDDEN_ROUTES` array, verified `[VERIFIED: src/components/WhatsappFloat.tsx]`)
— exactly the three surfaces this phase touches. No code change to `WhatsappFloat.tsx` is needed;
this is a pre-existing safety net, not something to newly implement. Still worth a smoke-test in
verification since the two systems aren't otherwise coordinated.
**Warning signs:** If a future task adds the sticky bar to a route not in `HIDDEN_ROUTES`, the FAB
and the bar will overlap — flag any such route addition for a `HIDDEN_ROUTES` update too.

### Pitfall 2: `tests/configurator.spec.ts` breaking silently

**What goes wrong:** The existing Playwright E2E spec hardcodes 4-step assertions
(`toContainText("Aracınız")`, `toContainText("Taban")`, `toContainText("Kenar")`) and looks up
`[role="radiogroup"][aria-label="Taban Rengi"]` as a distinct step transition target. After D-01
(merge) and D-02 (3 static steps: "Araç"/"Renkler"/"Ekstralar"), the step-label assertions will
fail outright, and the mid-flow `aria-current="step"` transition checks (from "Taban" to "Kenar")
become meaningless since both colors now live in the same "Renkler" step.
**Why it happens:** The test encodes the *current* step model as an implicit contract; nothing in
D-01–D-13 explicitly says "update the E2E test," but CONTEXT.md's canonical refs point at
`MatConfigurator.tsx` as a changed surface, and VERIFY-04 (Phase 13, but a project-wide bar)
requires "existing automated checks pass after simplification."
**How to avoid:** Include an explicit task in the plan to update
`tests/configurator.spec.ts` — new step labels ("Araç"/"Renkler"/"Ekstralar"), and since floor and
edge pickers still exist as two `role="radiogroup"` elements inside one visual card, the
`aria-label`s ("Taban Rengi"/"Kenar (Overlok) Rengi") stay valid selectors — only the *step
transition* assertions between them need removing/merging (there's no longer a stepper transition
between floor and edge picks, since both live under the "Renkler" step).
**Warning signs:** `npm run test:e2e` (Playwright) failing after the configurator changes land, if
this test wasn't updated in the same phase.

### Pitfall 3: Two sources of truth for step count (array vs. derivation logic)

**What goes wrong:** `MatConfigurator.tsx`'s `steps` array (`[{label: "Aracınız", index: 0}, ...]`,
4 entries) is a separate literal from `ConfiguratorAssistantProvider.tsx`'s `currentStep`
derivation (3-way ternary based on `vehicleComplete`/`floorTouched`/`edgeTouched`). Updating one
without the other produces a stepper UI that's out of sync with actual state (e.g. a 3-item
stepper array but `currentStep` still capable of returning `3`).
**Why it happens:** No shared constant links them today — they're two independently maintained
literals in two files.
**How to avoid:** When collapsing to 3 steps, update BOTH: (1) the `steps` array literal in
`MatConfigurator.tsx` to 3 entries ("Araç"/"Renkler"/"Ekstralar"), and (2) the `currentStep`
ternary in the provider to return a matching 0–2 range. Consider whether `floorTouched`/
`edgeTouched` should collapse into a single `colorsTouched` concept, or whether `currentStep`
should stop depending on touched-state entirely (color swatches always have a default selection —
see UI-SPEC's E2 "populated" coverage — so gating on "touched" may no longer carry real meaning
once colors and vehicle are the only two real gates before "Ekstralar").
**Warning signs:** Stepper visually shows "Ekstralar" as active while colors haven't been
interacted with, or vice versa; `aria-current="step"` landing on the wrong `<li>`.

### Pitfall 4: `ColorPicker`'s internal heading duplicating the new "Renkler" H2

**What goes wrong:** If `MatConfigurator.tsx` simply renders two `<ColorPicker>` instances
unchanged inside a wrapping "Renkler" card, the page ends up with three h2-level headings
("Renkler" wrapper + "Taban Rengi" + "Kenar Rengi" from each `ColorPicker`'s own `<h2>`), each with
its own step-number badge — contradicting the UI-SPEC Typography contract's "one `h2` 'Renkler'
plus two sub-labels" requirement.
**Why it happens:** `ColorPicker.tsx` owns its own heading markup with an embedded `step` prop;
this wasn't designed for a merged context.
**How to avoid:** See Architecture Pattern 2 above — add a way to suppress/change `ColorPicker`'s
internal heading rendering, or move heading ownership to the parent.
**Warning signs:** Visual review shows 3 stacked headings with step badges "02"/"02" or "02"/"03"
inside one card instead of one "Renkler" h2 + two plain sub-labels.

### Pitfall 5: Detail page ends up with TWO trust sections if Testimonials removal is skipped

**What goes wrong:** D-12 says "Keep ONE trust element (TrustStrip), drop Testimonials from the
detail page." The current code renders both `<Testimonials />` and `<TrustStrip />` back-to-back
at the bottom of `/urunler/[slug]/page.tsx` (lines 299-302, verified). If the `<Testimonials />`
import/usage isn't removed, both trust surfaces remain, contradicting D-12 and inflating the page
below the fold — the opposite of "purchase-first" simplification.
**Why it happens:** Easy to miss since both components render successfully together with no error
— nothing forces the removal, it's a design decision, not a technical constraint.
**How to avoid:** Explicit task: remove the `<Testimonials />` import and JSX block from
`/urunler/[slug]/page.tsx`; verify `<TrustStrip />` remains as the page's sole trust element.
**Warning signs:** Detail page still shows a testimonials carousel/grid above or below TrustStrip
after this phase.

## Code Examples

### Reusing `formatPrice` (single price-formatting source)
```typescript
// Source: src/lib/format.ts (existing, verified in use by ProductCard.tsx and ConfigSummary.tsx paths)
import { formatPrice } from "@/lib/format";
// used as: formatPrice(product.price) → "₺3.500" style Turkish currency string
```

### `ExtrasSelector` content to preserve verbatim inside the new accordion (D-07)
```typescript
// Source: src/components/configurator/ExtrasSelector.tsx (existing — copy stays, wrapper changes)
<label className={/* existing conditional border classes */}>
  <span>
    <span className="block text-sm font-bold text-white">Topuk Pedi</span>
    <span className="text-xs text-muted">Sürücü tarafına metal görünümlü koruma</span>
  </span>
  <span className="flex items-center gap-2">
    <span className="spec-value text-sm font-medium text-white">+{formatPrice(heelPadPrice)}</span>
    <input type="checkbox" checked={heelPad} onChange={(e) => onHeelPadChange(e.target.checked)} className="h-5 w-5 accent-sand" />
  </span>
</label>
```
Per the UI-SPEC Copywriting Contract, this content is unchanged — only the collapsed/expanded
`<details>` wrapper and the collapsed teaser copy ("Topuk pedi, bagaj paspası") are new.

### Reduced-motion CSS pattern to extend (not reinvent)
```css
/* Source: src/app/globals.css (existing pattern at ~line 748, to replicate for new crossfade class) */
@media (prefers-reduced-motion: reduce) {
  .btn-red-rich:hover::after {
    animation: none;
  }
}
```
Any new CSS-only transition class introduced for the preview crossfade or accordion chevron must
get a matching `prefers-reduced-motion: reduce` override added to this same file, following this
exact pattern.

## State of the Art

| Old Approach (this codebase, pre-phase-11) | Current/Target Approach (this phase) | When Changed | Impact |
|--------------------------------------------|----------------------------------|---------------|--------|
| 4-step configurator (Vehicle/Taban/Kenar/Extras) with animated fill bar, spring badges, shine sweep | 3-step static indicator (Araç/Renkler/Ekstralar), CSS `transition-colors` only | This phase (D-02) | Fewer decision surfaces per CONF-01; less motion overhead |
| `AnimatePresence` spring scale transition on preview image (`scale: 0.97→1→1.02`) | Single ≤200ms opacity crossfade | This phase (D-03) | Matches Phase 10's motion-diet precedent; respects `prefers-reduced-motion` more cheaply |
| `whileHover`/`whileTap`/`layoutId` glow + spring checkmark on every color swatch | Simple `focus-visible` outline + CSS hover/active border transition | This phase (D-10) | Removes ~5 framer-motion primitives per swatch × up to 21 swatches (EDGE_COLORS count) rendered simultaneously — real performance win, not just aesthetic |
| `StaggeredReveal` wrapping the entire options column (scroll-triggered blur+stagger) | Plain `<div className="space-y-7">` | This phase (D-10) | Removes scroll-linked animation entirely from the options column, consistent with Phase 10's Hero conversion precedent |
| Product detail page: always-visible feature icon grid + Testimonials + TrustStrip | Feature grid behind "Özellikler" accordion; Testimonials removed; TrustStrip is sole trust element | This phase (D-12) | Shortens page, keeps purchase actions (gallery/name/price/CTA) above the fold |

**Deprecated/outdated (within this codebase, as of this phase):**
- `StaggeredReveal`/`StaggerItem` usage inside the configurator specifically is being removed
  (D-10) — but the components themselves are NOT deleted from `src/components/ui/`, since other
  surfaces may still use them (out of scope to audit/remove elsewhere in this phase).
- The 4-step `steps` array literal and its associated `currentStep` 4-gate derivation are
  superseded by the 3-step model — do not leave dead code referencing step index `3` as "Ekstralar
  active."

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The best `currentStep` collapse strategy is to gate step 2 ("Renkler" active) on `vehicleComplete` alone (dropping `floorTouched`/`edgeTouched` tracking, since colors always have valid defaults) rather than requiring both colors to be explicitly touched | Architecture Pattern 1 / Pitfall 3 | If the team wants the stepper to only advance to "Ekstralar" after the user has actively picked colors (not just accepted defaults), this recommendation is wrong and `floorTouched`/`edgeTouched` (collapsed into one `colorsTouched`) should be retained. Low risk — either approach satisfies CONF-01/CONF-02 functionally; this only affects stepper *visual* progression timing, not the decision-surface count. |
| A2 | `ColorPicker`'s heading/step-badge should be suppressed via an optional prop rather than removing heading ownership from the component entirely | Architecture Pattern 2 / Pitfall 4 | If the planner instead chooses to strip the heading from `ColorPicker.tsx` unconditionally (since it's only ever used twice, both times inside the merged card after this phase), that is equally valid and arguably simpler — CONTEXT.md explicitly leaves this to "Claude's Discretion," so this is a recommendation, not a locked decision. |
| A3 | The new "Özellikler" (feature grid) accordion on the detail page should default to collapsed | Architecture Pattern 4 | Not explicitly stated in CONTEXT.md/UI-SPEC. If stakeholders expect it open by default (matching "Bu sette neler var?"'s current open-by-default state), the purchase-first fold benefit of D-12 is reduced. Low risk either way — verify with a UAT check during `/gsd-verify-work`. |

## Open Questions

1. **Should `tests/configurator.spec.ts` be updated in this phase's plan, or flagged for Phase 13 (verification phase)?**
   - What we know: The test WILL fail against the new 3-step model; VERIFY-04 (Phase 13) requires
     "Lint, typecheck, and existing automated checks pass after simplification" as a project-wide
     bar, but Phase 13 is scoped to cross-cutting verification of Phases 9-12 collectively.
   - What's unclear: Whether Phase 11's own plan should include the test-file update (so the
     change stays green throughout), or whether it's acceptable to leave it red until Phase 13
     "fixes" it as part of its verification sweep.
   - Recommendation: Update the test within Phase 11's own plan — the phase that introduces the
     breaking behavior change should also update the test that encodes the old behavior, rather
     than leaving a known-red test in the tree for two more phases. This is the safer default and
     costs one small task.

2. **Exact naming/location for the new sticky-bar component.**
   - What we know: CONTEXT.md gives full behavioral spec (D-04/D-05/D-06) and styling constraints
     (UI-SPEC spacing/color sections) but no file name.
   - What's unclear: Whether it should live in `src/components/configurator/` (sibling to
     `ConfigSummary.tsx`) or be inlined directly into `MatConfigurator.tsx` as a local JSX block.
   - Recommendation: A separate small component (`src/components/configurator/MobileStickyBar.tsx`
     or similar) is cleaner for testability and matches the existing one-component-per-surface
     pattern in this directory, but inlining is equally valid given its small scope — planner's
     discretion, not a blocker.

## Environment Availability

Not applicable — this phase has no external tool/service dependencies. All work is local
TypeScript/React/CSS editing against already-installed dependencies. `npm run dev`, `npm run
lint`, `npm run typecheck`, `npm run test` (vitest), and `npm run test:e2e` (Playwright) are all
already configured and runnable in this environment `[VERIFIED: package.json scripts]`.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest (unit) `[VERIFIED: vitest.config.ts present]` + Playwright (E2E) `[VERIFIED: playwright.config.ts present]` |
| Config file | `vitest.config.ts` (unit), `playwright.config.ts` (E2E, `testDir: "./tests"`) |
| Quick run command | `npm run test` (vitest run — fast, no browser) |
| Full suite command | `npm run test` && `npm run test:e2e` (Playwright spins up `npm run dev` via `webServer`, ~2min+) |

No existing unit tests target the configurator/product components directly — all current
`*.test.ts`/`*.test.tsx` files are AI-domain (`src/lib/ai/*`) or the `useAnimatedNumber` hook.
`tests/configurator.spec.ts` is the only test exercising this phase's primary surface.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONF-01 | Configurator completes in ≤3 decision surfaces | e2e (visual/DOM step count) | `npx playwright test tests/configurator.spec.ts` | ⚠️ EXISTS but asserts OLD 4-step model — must be updated, see Pitfall 2 |
| CONF-02 | Floor+edge share one surface with live preview | e2e (both `role="radiogroup"` present under one heading) | `npx playwright test tests/configurator.spec.ts` | ⚠️ Same file — update assertions, don't create new file |
| CONF-03 | Mobile price/CTA reachable | manual-only (viewport-specific, no existing mobile-viewport Playwright project configured) | N/A — `playwright.config.ts` only defines a `chromium` desktop project, no mobile device emulation project exists | ❌ Wave 0 gap — see below |
| PROD-01 | Listing/detail chrome simplified, purchase path clear | manual/visual — no automated layout-density assertions exist or are proposed | N/A | n/a — visual/UAT verification, not unit-testable |
| PROD-02 | Price only from `mat-pricing.ts`/vehicle helpers | Already covered structurally — `calculateMatPrice`/`getVehiclePrice` are the only price functions in the codebase (`[VERIFIED: grep for price computation]`); no dedicated regression test exists but risk is low since no new price logic is introduced | `npm run typecheck` (would catch call-signature drift) | n/a |

### Sampling Rate
- **Per task commit:** `npm run typecheck && npm run lint` (fast, catches most regressions in a
  refactor-heavy phase like this)
- **Per wave merge:** `npm run test` (vitest unit suite — fast) then `npx playwright test
  tests/configurator.spec.ts` (targeted, not the full e2e suite, to keep iteration fast)
- **Phase gate:** Full `npm run test:e2e` before `/gsd-verify-work`, plus manual mobile-viewport
  check (see Wave 0 gap below) since no automated mobile project exists

### Wave 0 Gaps
- [ ] `tests/configurator.spec.ts` — MUST be updated (not newly created) to assert the 3-step
      model; this is a required task in this phase's plan, not optional test debt.
- [ ] No mobile-viewport Playwright project exists in `playwright.config.ts` (only
      `devices["Desktop Chrome"]`) — CONF-03's "reachable without hunting" claim cannot be
      automatically verified at a real mobile viewport width without adding a `devices["iPhone
      13"]`-style project. Recommend either (a) adding a lightweight mobile project to
      `playwright.config.ts` as part of this phase if time allows, or (b) treating CONF-03 as a
      manual/UAT check during `/gsd-verify-work` with an explicit 320-375px viewport pass — the
      UI-SPEC's E4 "overflow" row already flags this exact gap as a "backstop" requiring executor
      visual verification, not an automated assertion.
- [ ] No unit tests exist for `calculateMatPrice`/`getVehiclePrice` — low priority given these
      functions are untouched by this phase, but if the plan touches
      `ConfiguratorAssistantProvider.tsx`'s `currentStep` logic, consider a small unit test for the
      new step-derivation function since it's pure logic and easy to regress silently (see Pitfall
      3).

## Security Domain

Not applicable in the traditional sense — this phase touches no auth, session, input-validation,
or cryptography surfaces. `security_enforcement` is not explicitly disabled in
`.planning/config.json`, so noting explicitly: no ASVS category applies. This phase's only
"security-adjacent" surface is the WhatsApp deep-link construction in `ConfigSummary.tsx`
(`buildWhatsAppLink`), which is unchanged/out of scope — the sticky bar does not construct a new
WhatsApp link (per D-05, "Hemen Al" checkout shortcut stays exclusively in `ConfigSummary`).

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No auth surfaces touched |
| V3 Session Management | no | No session surfaces touched |
| V4 Access Control | no | No admin/access-gated surfaces touched (admin explicitly out of scope per CONTEXT.md domain boundary) |
| V5 Input Validation | no | No new form/user-input fields introduced — sticky bar is read-only display + a single button click |
| V6 Cryptography | no | No crypto surfaces touched |

### Known Threat Patterns for this stack

Not applicable — no new attack surface (no new forms, no new external data fetches, no new
user-supplied strings rendered).

## Sources

### Primary (HIGH confidence)
- Direct codebase reads (this session) — `[VERIFIED: file read]` tag applies to every code claim
  above: `MatConfigurator.tsx`, `ColorPicker.tsx`, `ConfigSummary.tsx`, `ExtrasSelector.tsx`,
  `ConfiguratorAssistantProvider.tsx`, `VehicleSelector.tsx`, `mat-pricing.ts`, `vehicle-data.ts`
  (`getVehiclePrice`), `ProductCard.tsx`, `TrustStrip.tsx`, `Testimonials.tsx`, `WhatsappFloat.tsx`,
  `CartDrawer.tsx`, `useAnimatedNumber.tsx`, `StaggeredReveal.tsx`, `/urunler/page.tsx`,
  `/urunler/[slug]/page.tsx`, `/olusturucu/page.tsx`, `globals.css` (motion/utility patterns),
  `tests/configurator.spec.ts`, `playwright.config.ts`, `package.json` scripts,
  `.planning/config.json`.
- `.planning/phases/11-configurator-and-product-simplification/11-CONTEXT.md` — locked decisions
  D-01 through D-13, canonical refs, code insights (user-approved via `/gsd-discuss-phase`)
- `.planning/phases/11-configurator-and-product-simplification/11-UI-SPEC.md` — exact
  spacing/typography/color/copy/motion contract (design-approved)
- `.planning/REQUIREMENTS.md` — CONF-01/02/03, PROD-01/02 requirement text and traceability
- `CLAUDE.md` — project-wide architecture/design-system hard rules

### Secondary (MEDIUM confidence)
None used — no external documentation lookup was needed since this phase introduces no new
libraries, APIs, or frameworks beyond what's already installed and documented in-repo.

### Tertiary (LOW confidence)
None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — zero new dependencies, all patterns directly observed in the codebase
- Architecture: HIGH — every component/data-flow claim verified by direct file reads this session
- Pitfalls: HIGH — each pitfall traced to a specific, quoted line/behavior in the actual source
  files (not speculative), including the test-breakage finding which required cross-referencing
  `tests/configurator.spec.ts` against the new step model

**Research date:** 2026-07-17
**Valid until:** No external expiry driver (no library versions to go stale) — valid until the
touched source files change again outside this phase's plan execution.
