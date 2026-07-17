# Phase 9: Storefront Boundaries and Content Inventory - Context

**Gathered:** 2026-07-17
**Status:** Ready for planning
**Source:** Approved v1.2 milestone requirements and research

<domain>
## Phase Boundary

Establish reversible storefront composition boundaries before visual simplification: add a customer-only AI UI flag that defaults off, remove customer AI entry points, replace `/destek` chat with a non-AI WhatsApp/contact fallback, reduce primary navigation to essential destinations, and inventory homepage CMS section mounts. Do not redesign the homepage, configurator, products, cart, or checkout in this phase.

</domain>

<decisions>
## Implementation Decisions

### Locked Decisions
- Customer AI implementations, API routes, evals, and admin AI remain in code.
- Customer AI visibility uses a dedicated storefront UI flag; it is not controlled solely by the global AI capability kill switch.
- The customer UI flag defaults off.
- With the flag off, header, footer, configurator, and support chrome expose no AI or AI Destek entry points.
- `/destek` remains a valid route and becomes a static non-AI WhatsApp/contact fallback rather than a 404.
- Primary navigation is limited to Tasarla, Ürünler, Galeri, İletişim, and Sepet, with no dead hash anchors.
- Homepage CMS data and seed rows remain intact; inventory/mount decisions must be reversible.
- Admin remains outside `.premium-site`; Convex fallback architecture, pricing, cart, and checkout contracts are untouched.

### Agent's Discretion
- Exact environment variable name and helper location for the customer UI flag, provided it is server-evaluated, typed, and defaults off.
- Exact contact copy and layout on `/destek`, using existing design utilities and Turkish copy.
- Whether secondary destinations live in the footer or are omitted, provided primary navigation matches the locked spine.
- Format/location of the homepage section-key inventory artifact.

</decisions>

<specifics>
## Specific Ideas

- Prefer a small helper such as `isCustomerAiUiEnabled()` over scattering direct environment reads.
- Avoid importing/mounting customer AI client islands when the flag is off.
- Preserve WhatsApp contact behavior from site settings/config rather than hardcoding a new number.
- Treat CMS inventory as documentation for Phase 10; do not delete Convex rows or fallback seeds.

</specifics>

<deferred>
## Deferred Ideas

- Homepage section removal and hero/motion changes belong to Phase 10.
- Configurator/product simplification belongs to Phase 11.
- Cart/checkout changes belong to Phase 12.
- Lenis decision and cross-surface verification belong to Phase 13.

</deferred>
