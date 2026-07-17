# Phase 7: Support / Order Helper & Grounding - Context

**Gathered:** 2026-07-17
**Status:** Ready for planning
**Mode:** Auto-generated (yolo autonomous — research-grounded, discuss auto-optimized)

<domain>
## Phase Boundary

Ship a customer support / order-helper capability: a Turkish assistant that answers shipping, sizing, and care questions **grounded in live CMS + site-settings content** (re-fetched at answer time), refuses off-topic questions with a scoped redirect, escalates uncertain cases to a pre-filled `wa.me` WhatsApp handoff, and drafts an order-summary message that the **user** sends — never the AI. Transcript handling must follow KVKK data-minimization.

Requirements in scope: SUPAI-01…05.

Depends on Phase 6 (streaming chat route pattern, AI client, guardrails, rate limiter, kill switch, WhatsApp handoff — all reused). The Phase 6 `src/app/api/ai/chat` route + streaming UI is the reuse template; this phase differs by system prompt, grounding tools, and refusal scope.

Out of scope: configurator-driving tools (Phase 6), admin content generator (Phase 8).
</domain>

<decisions>
## Implementation Decisions

### From research (authoritative — SUMMARY.md, ARCHITECTURE.md, FEATURES.md, PITFALLS.md)
- **Live grounding, not baked prompts (SUPAI-01):** answers must be grounded in content re-fetched at answer time from the Convex-first CMS layer (`src/lib/cms.ts`) and site settings (`src/lib/site-settings.ts` — phone, shipping threshold, prices), with static fallback preserved. Expose grounding as server tools/context the model reads per request; do NOT hardcode shipping/price facts into the system prompt (they change from `/admin/ayarlar`).
- **Scoped refusal (SUPAI-02):** system prompt + guardrail constrains the assistant to mats / orders / shipping / care / sizing domain; off-topic or open-domain questions get a short Turkish redirect back to mat selection/orders — no open-domain answers.
- **WhatsApp escalation on uncertainty (SUPAI-03):** when the assistant cannot ground an answer or the user needs a human, generate a pre-filled `wa.me` link via the existing `src/lib/whatsapp.ts` builder (draft-then-user-sends).
- **User-sent order draft (SUPAI-04):** the assistant can compose an order/summary message (vehicle + colors + price via `calculateMatPrice` + notes) for the user to review; the user presses send. AI never places the order or sends the message.
- **KVKK data-minimization (SUPAI-05):** stateless/short-TTL transcript handling, no training pipeline, no long-term PII retention. Prefer not persisting transcripts server-side; if any logging exists, keep it minimal and short-lived. Align with existing consent/analytics posture (`ConsentAnalytics.tsx`, cookie consent).
- **Reuse Phase 6 plumbing:** streaming route handler, server-only AI client, rate limiter, kill switch, graceful fallback (AIINF-02 carryover — key unset/kill-switch off → support entry hidden/disabled), tool-surface isolation from admin-key-gated mutations (AIINF-05 carryover), price integrity via `calculateMatPrice` (AIINF-03 carryover).
- **UI (UI hint: yes):** Turkish premium OLED-black/glass support chat surface inside `.premium-site`, reusing `surface-glass`/`mac-glass`, Racing Red accents, Syne/Instrument Sans typography, `prefers-reduced-motion` respected, "AI Asistan" disclosure, never impersonating a human rep.

### Claude's Discretion
Support entry placement (dedicated route vs floating widget vs shared with Phase 6 chat), exact grounding tool schema (single `getSiteFacts` tool vs multiple), refusal wording, whether support + configurator chats share one route with different modes — planner/executor discretion, guided by success criteria + research + CLAUDE.md.
</decisions>

<code_context>
## Existing Code Insights

- Phase 5/6 deliverables: `src/app/api/ai/chat` streaming route, lazy server-only AI client, rate limiter, kill switch, customer price tools, streaming chat UI + provider — all reused.
- `src/lib/cms.ts` (Convex-first CMS: FAQs, sections, promos, testimonials, SEO; static fallback `cms-defaults.ts`) — grounding source for shipping/sizing/care copy and FAQs.
- `src/lib/site-settings.ts` (Convex-first: phone, shipping threshold, prices; editable at `/admin/ayarlar`; fallback `site-config.ts`) — live shipping/price facts.
- `src/lib/mat-pricing.ts` — `calculateMatPrice` (only price source for order drafts).
- `src/lib/whatsapp.ts` — `wa.me` link builder for escalation + order-draft handoff.
- `src/lib/vehicle-data.ts` / `vehicle-compatibility.ts` — sizing/compatibility grounding.
- Design system: `globals.css` `.premium-site`, `surface-glass`, `mac-glass`, `premium-card`, `btn-red-rich`, `btn-press`; consent posture in `ConsentAnalytics.tsx` / cookie consent (KVKK alignment).

Further codebase context gathered during plan-phase research.
</code_context>

<specifics>
## Specific Ideas

- The single biggest correctness risk is stale grounding: re-fetch CMS/site-settings at answer time so `/admin`-edited shipping/prices are always reflected (SUPAI-01). Add an eval asserting the answer tracks a changed setting.
- Add a golden eval for scoped refusal (SUPAI-02) and for "never sends the message itself" (SUPAI-04).
- Reuse Phase 6 streaming route/UI heavily; this phase is mostly a new system prompt + grounding tools + refusal scope + (optionally) a support surface, not new infra.
</specifics>

<deferred>
## Deferred Ideas

- Order status lookup by order ID (requires exposing order reads to chat) — v1.x; keep tool-surface isolation for launch.
- Persistent multi-visit support history — v1.x (conflicts with KVKK minimization unless explicitly designed).
- Admin content generator — Phase 8.
</deferred>
</output>
