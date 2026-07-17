# Phase 10: Homepage and Motion Diet - Context

**Gathered:** 2026-07-17
**Status:** Ready for planning
**Source:** Approved v1.2 milestone requirements and research

<domain>
## Phase Boundary

Simplify the homepage into one calm luxury composition: unmount redundant sections, discipline the hero around one primary CTA, remove decorative motion spectacle (parallax, dense stagger, glow), and keep a small motion allowlist that respects `prefers-reduced-motion`. Preserve OLED black / Racing Red brand identity, premium typography, and at least one concise trust/FAQ or shipping proof surface near the purchase path. Do not touch configurator/product logic, cart/checkout flows, or admin surfaces. The user has an uncommitted `Hero.tsx` WIP change that must be preserved byte-for-byte — homepage work must not overwrite or stage that file.

</domain>

<decisions>
## Implementation Decisions

### Locked Decisions
- The homepage mounts only sections with a distinct job; duplicate or redundant marketing sections are unmounted at the composition layer (CMS rows retained for reversibility).
- First viewport communicates brand, one headline, one short supporting line, and one primary CTA to configure.
- Decorative parallax, dense stagger, and glow spectacle are removed or heavily reduced.
- Retained motion is a small allowlist of purposeful micro-interactions that respects `prefers-reduced-motion`.
- Customer surfaces still show OLED black, Racing Red, and existing premium typography.
- At least one concise trust/FAQ or shipping/proof surface remains near the purchase path, consistent with structured data/SEO where applicable.
- The homepage remains fully functional without customer AI (customer AI UI flag is off by default).
- The user's uncommitted `Hero.tsx` WIP change is preserved byte-for-byte; do not overwrite or stage it.

### Agent's Discretion
- Exact hero copy and layout details, using existing design utilities and Turkish copy.
- Which specific homepage sections to unmount vs. keep, guided by the Phase 9 inventory artifact.
- Whether to keep or remove specific micro-interactions, provided the overall motion budget is reduced and reduced-motion is respected.
- How to structure the concise trust/FAQ surface (existing component vs. new lightweight one).

</decisions>

<specifics>
## Specific Ideas

- Use the Phase 9 homepage inventory as the authoritative map of mounted vs. seeded-only sections.
- Prefer composition-layer changes (`page.tsx`) over component-level deletions where possible.
- Keep the hero's primary CTA to `/olusturucu` as the single conversion spine.
- Use existing CSS utilities (`btn-red-rich`, `btn-press`, `surface-glass`, etc.) rather than inventing new styles.

</specifics>

<deferred>
## Deferred Ideas

- Configurator/product simplification belongs to Phase 11.
- Cart/checkout changes belong to Phase 12.
- Lenis removal decision and cross-surface verification belong to Phase 13.
- Admin UI changes are out of scope for this milestone.

</deferred>
