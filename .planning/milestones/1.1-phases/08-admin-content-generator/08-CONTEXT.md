# Phase 8: Admin Content Generator - Context

**Gathered:** 2026-07-17
**Status:** Ready for planning
**Mode:** Auto-generated (yolo autonomous — research-grounded, discuss auto-optimized)

<domain>
## Phase Boundary

Ship an **admin-only** AI content generator: authenticated admins generate premium Turkish product descriptions, SEO titles/meta, and FAQ copy — grounded in structured product/vehicle facts — as **drafts** that only go live after an explicit admin publish action. It lives inside the existing admin content UI (`/admin/icerik` → `ContentManager.tsx`) and is admin-key-gated. Generated copy follows the project's premium ("Apple/Porsche") Turkish brand voice via a written system-prompt style guide.

Requirements in scope: CNTGEN-01…04.

Depends on Phase 5 (AI client, guardrails, rate limiter, kill switch — reused). Independent of the customer chat (Phases 6-7); could slip without blocking launch.

Out of scope: customer-facing chat/support (Phases 6-7), auto-publishing, non-Turkish content.
</domain>

<decisions>
## Implementation Decisions

### From research (authoritative — SUMMARY.md, ARCHITECTURE.md, FEATURES.md, PITFALLS.md)
- **Generation surface (CNTGEN-01):** generate Turkish product descriptions, SEO title/meta, and FAQ copy grounded in structured facts from products (`products.ts` / Convex `api.products.*`) and vehicle data (`vehicle-data.ts`) — pass facts as structured context, do not let the model invent specs/prices.
- **Draft-then-publish (CNTGEN-02):** generated content is written to a draft state and NEVER auto-published. A distinct, explicit admin publish action promotes a draft to live CMS content. Reuse the existing CMS write path (`convex/cms.ts` mutations) for publish; drafts must be clearly separated from live content in the UI.
- **In-place admin integration (CNTGEN-03):** the generator is embedded in the existing `ContentManager.tsx` at `/admin/icerik`, admin-key-gated. Reuse the two admin-key paths: server-side `getAdminConvexKey()` (`src/lib/admin-convex-key.ts`) and browser-side `useAdminConvexKey()` (`src/hooks/useAdminConvexKey.ts`, backed by `GET /api/admin/convex-key` + `admin_session` cookie). Any new Convex mutation/action re-verifies the admin key via `requireAdminKey()` (`convex/lib/adminAuth.ts`) — do NOT trust the proxy edge redirect alone.
- **Brand voice (CNTGEN-04):** a written premium Turkish "Apple/Porsche" style-guide system prompt drives tone; keep it as a reusable prompt constant. Add a golden eval asserting style-guide constraints (Turkish, premium register, no banned phrasings) are present/enforced.
- **Reuse Phase 5 infra:** server-only AI client, rate limiter, kill switch, graceful fallback (key unset/kill-switch off → generator UI hidden/disabled, rest of admin CMS untouched — AIINF-02 carryover). Generation likely a "use node" internalAction or a route handler; if Convex actions are used, only schedule internal functions.
- **Admin styling:** `/admin` is intentionally OUTSIDE `.premium-site` — plainer, sharp corners, simpler styling. Do NOT apply customer polish classes (`*-rich`, `mac-glass*`, `.premium-site`). Match existing admin UI conventions.

### Claude's Discretion
Generation transport (route handler vs Convex action), whether drafts persist in Convex (new `contentDrafts` table) vs client-only until publish, exact draft/publish UI affordances in ContentManager, per-content-type prompt templates — planner/executor discretion, guided by success criteria + research + CLAUDE.md. If a drafts table is added, follow schema-design + argument-validation + index rules.
</decisions>

<code_context>
## Existing Code Insights

- Phase 5 deliverables: server-only AI client, rate limiter, kill switch, eval harness — reused.
- `src/components/admin/ContentManager.tsx` + `/admin/icerik` — the integration point (uses `useQuery`/`useMutation` against Convex directly with the admin key).
- Admin key plumbing: `src/lib/admin-convex-key.ts` (`getAdminConvexKey`), `src/hooks/useAdminConvexKey.ts` (`useAdminConvexKey`), `GET /api/admin/convex-key`, `convex/lib/adminAuth.ts` (`requireAdminKey`).
- `convex/cms.ts` — CMS content mutations (publish path); `convex/schema.ts` — contentPages/contentSections/faqItems/seo tables.
- `src/lib/products.ts` / `api.products.*` and `src/lib/vehicle-data.ts` — structured fact sources for grounding.
- `convex/files.ts` — existing admin-key-gated action pattern to mirror for a new admin-gated AI action.
- Admin auth: `src/proxy.ts` edge redirect + per-action `isAuthenticated()`/`requireAdminKey()` re-verification.

Further codebase context gathered during plan-phase research.
</code_context>

<specifics>
## Specific Ideas

- The core safety property is CNTGEN-02: generation must never mutate live CMS content. Make "generate" and "publish" two distinct steps/actions, and add an eval/assertion that generation writes no live content.
- Reuse Phase 5 AI client + guardrails; this phase is prompt templates + grounding + a draft/publish admin UI + admin-key-gated generation endpoint, not new infra.
- Keep the style guide as a single reusable prompt constant so tone is consistent across product/SEO/FAQ generation.
</specifics>

<deferred>
## Deferred Ideas

- Bulk/batch generation across the whole catalog — v1.x.
- Non-Turkish / multi-locale content — out of scope (site is Turkish-only).
- Image/media generation — out of scope.
- AI-assisted editing of existing live content in place (vs draft) — v1.x.
</deferred>
</output>
