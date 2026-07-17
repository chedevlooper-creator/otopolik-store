# Phase 11: Configurator and Product Simplification - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-17
**Phase:** 11-configurator-and-product-simplification
**Areas discussed:** Color surface merge, Mobile price/CTA, Configurator chrome, Product page chrome

---

## Color surface merge

| Option | Description | Selected |
|--------|-------------|----------|
| Two rows, one card | One "Renkler" surface with Taban + Kenar swatch rows stacked; reuses ColorPicker twice | ✓ |
| Tabbed picker | One swatch grid with Taban/Kenar tabs; hides one dimension | |
| Side-by-side columns | Two columns on desktop, stacked on mobile | |

**User's choice:** Two rows, one card (Recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| 3 static steps | Araç / Renkler / Ekstralar; drop animated fill, shine sweep, spring badges | ✓ |
| Remove stepper entirely | Headings alone carry orientation | |
| Keep animations, 3 steps | Renumber but keep spring/shine treatment | |

**User's choice:** 3 static steps (Recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle crossfade | ≤200ms opacity fade on image swap; respects prefers-reduced-motion | ✓ |
| Instant swap | No transition at all | |
| Keep spring scale | Keep AnimatePresence spring scale transition | |

**User's choice:** Subtle crossfade (Recommended)

---

## Mobile price/CTA

| Option | Description | Selected |
|--------|-------------|----------|
| Sticky bottom bar | Mobile-only fixed bar: live total + "Sepete Ekle"; hidden on desktop | ✓ |
| Floating chip | Collapsed price chip expanding to summary on tap | |
| Summary moved higher | Move ConfigSummary above extras; no fixed elements | |

**User's choice:** Sticky bottom bar (Recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Price + one CTA | Live total + single "Sepete Ekle"; "Hemen Al" stays in inline summary only | ✓ |
| Price + two CTAs | Both buttons in the bar | |
| Price + CTA + config recap | Adds one-line seçim recap; taller bar | |

**User's choice:** Price + one CTA (Recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Always visible, disabled until valid | Bar shows from start with live price; CTA disabled until vehicle selected | ✓ |
| Appears after vehicle chosen | Bar slides in once vehicleComplete | |
| You decide | Planner/executor judgment | |

**User's choice:** Always visible, disabled until valid (Recommended)

---

## Configurator chrome

| Option | Description | Selected |
|--------|-------------|----------|
| Collapsed accordion | "Ekstralar" collapsed row with + toggle, prices shown when opened | ✓ |
| Inline but compact | Always visible, two compact checkbox rows | |
| Inside the summary card | Extras as add-on toggles next to the price | |

**User's choice:** Collapsed accordion (Recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Keep, as social proof | Customer photo strip + lightbox stay as is | ✓ |
| Trim to fewer items | Cut to ~6 thumbnails | |
| Remove from configurator | Gallery only at /galeri | |

**User's choice:** Keep, as social proof (Recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Keep both views | Cabin photo + color-accurate flat render both stay | ✓ |
| Cabin only | Single preview mode | |
| Flat only | Only the flat render | |

**User's choice:** Keep both views (Recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Phase 10 allowlist | Remove StaggeredReveal + springs; keep btn-press, ≤200ms crossfade, focus states | ✓ |
| Keep subtle reveals | Light single-pass fade-in stays | |
| You decide | Planner decides within reduced-motion rules | |

**User's choice:** Phase 10 allowlist (Recommended)

---

## Product page chrome

| Option | Description | Selected |
|--------|-------------|----------|
| Keep controls, calm styling | Pills + sort + VehicleMatches stay; simplify styling density | ✓ |
| Drop VehicleMatches band | Remove vehicle-matching from listing | |
| Minimal grid | Pills + grid only | |

**User's choice:** Keep controls, calm styling (Recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Purchase-first + collapse | Purchase panel on top; spec/feature grids into accordions; keep TrustStrip; drop Testimonials; keep related | ✓ |
| Trim styling only | Keep all blocks, reduce density | |
| You decide | Planner chooses blocks | |

**User's choice:** Purchase-first + collapse (Recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Keep glass-vitrine | Locked brand signature stays; content gets leaner | ✓ |
| Simplify cards | Plain surface cards | |

**User's choice:** Keep glass-vitrine (Recommended)

---

## Claude's Discretion

- Accordion implementation (native `<details>` vs. controlled component) for extras and detail specs
- Sticky-bar markup/styling using existing utilities; keyboard-safe
- ColorPicker step-badge renumbering after the merge
- Exact listing styling-density reductions within "controls stay"

## Deferred Ideas

- Cart/checkout calm-down → Phase 12
- Lenis decision + cross-surface verification → Phase 13
- AI-gated configurator assistant UX changes → out of scope (flag off, Phase 9 contract)
