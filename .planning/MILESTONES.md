# Milestones

## 1.1 AI Destekli Lüks Deneyim (Shipped: 2026-07-17)

**Phases completed:** 4 phases (5-8), 12 plans

**Key accomplishments:**

- Server-only AI client layer (`src/app/api/ai/*`) with cost controls (rate limit / token caps / kill switch) and a reusable golden-eval harness — keys never reach the browser.
- Deterministic-first Turkish vehicle matcher (fuzzy/token → LLM fallback) with disambiguation, pre-filling the real `MatConfigurator`.
- Premium Turkish streaming configurator assistant that drives the real stepper and adds `calculateMatPrice`-correct items to the real cart.
- Grounded support/order helper on `/destek` (live CMS/settings, scoped refusals, `wa.me` handoff, user-sent order drafts, KVKK minimization) — also fixed `cms.ts` to read live Convex data.
- Admin AI content generator (draft-then-publish, product/SEO/FAQ, admin-key-gated, premium brand voice) inside `/admin/icerik`.
- Full graceful degradation: with AI disabled, the storefront runs entirely on its existing manual flows.

**Audit:** PASSED — 24/24 requirements, 4/4 phases, 5/5 integration seams, 3/3 E2E flows ([archive](milestones/1.1-MILESTONE-AUDIT.md)).

**Archive:** [roadmap](milestones/1.1-ROADMAP.md) · [requirements](milestones/1.1-REQUIREMENTS.md)

---

## 1.0 Otopolik - Ultra Luxury Reimagined (Shipped: 2026-07-17)

**Phases completed:** 4 phases, 4 plans, 0 tasks

**Key accomplishments:**

- Lenis smooth scrolling, scroll-linked hero + 3D integration, luxury configurator/gallery interactions, and cross-device polish ("Ölen Kalite").

**Archive:** [roadmap](milestones/1.0-ROADMAP.md) · [requirements](milestones/1.0-REQUIREMENTS.md)

---
