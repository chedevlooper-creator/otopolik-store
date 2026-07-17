---
phase: 09
slug: storefront-boundaries-and-content-inventory
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-17
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Derived from `09-RESEARCH.md` Validation Architecture and `09-01` / `09-02` PLAN verify blocks.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest ^4.1.10 (+ Playwright optional for e2e) |
| **Config file** | Existing repo Vitest config (AI / lib tests) |
| **Quick run command** | `npx vitest run src/lib/storefront-flags.test.ts` |
| **Full suite command** | `npm test` |
| **Typecheck** | `npm run typecheck` |
| **Estimated runtime** | ~15–60 seconds (quick); full suite longer |

---

## Sampling Rate

- **After every task commit:** `npx vitest run src/lib/storefront-flags.test.ts` (and `src/lib/ai/config.test.ts` when touching AI config adjacency)
- **After every plan wave:** `npm test` + `npm run typecheck`
- **Before `/gsd-verify-work`:** Full suite green + phase-gate manual smoke below
- **Max feedback latency:** < 60 seconds for quick run

---

## Requirements → Validation Map

| Req ID | Behavior | Test Type | Automated Command | Evidence Expected | File Exists? |
|--------|----------|-----------|-------------------|-------------------|--------------|
| BOUND-01 | `isCustomerAiUiEnabled()` defaults off; true/1 + configured AI enables; does not alter `isAiFeaturesEnabled` / admin API gates | unit | `npx vitest run src/lib/storefront-flags.test.ts src/lib/ai/config.test.ts` | All new + existing config tests green; `.env.example` documents `CUSTOMER_AI_UI_ENABLED=false` | ❌ Wave 0 — create `storefront-flags.test.ts` in 09-01 |
| BOUND-02 | No AI-branded Destek in Header/Footer; no customer chat mounts when UI flag off | source assert + route gate | Plan 09-02 Task 1–2 node asserts; no static `SupportChat` import on default path | Header/Footer chrome clean; `/destek` and `/olusturucu` use `isCustomerAiUiEnabled()` | ❌ Wave 0 optional Playwright |
| BOUND-03 | `/destek` is WhatsApp/contact fallback (no chat UI) when flag off | source assert + manual | Plan 09-02 Task 2 node assert; manual smoke | Page uses `buildWhatsAppLink` + settings; no chat region when flag unset | ❌ Wave 0 optional e2e |
| BOUND-04 | Primary `NAV_LINKS` = Tasarla → Ürünler → Galeri → İletişim; Sepet dedicated control; no dead hash anchors in Header/Footer link lists | source assert | Plan 09-02 Task 1 node assert (rejects `/#renkler`, `/#ozellikler`, `/#sss`, AI-branded Destek) | Spine matches; Sepet button preserved | ❌ Wave 0 — plan verify only |

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 09-01-01 | 01 | 1 | BOUND-01 | T-09-01, T-09-02, T-09-03 | UI flag ≠ API auth; server-only env | unit | `npx vitest run src/lib/storefront-flags.test.ts src/lib/ai/config.test.ts` | ❌ W0 | ⬜ pending |
| 09-01-02 | 01 | 1 | (inventory prep) | T-09-04 | Inventory has no secrets | file assert | node read `09-HOMEPAGE-INVENTORY.md` | ❌ W0 create | ⬜ pending |
| 09-02-01 | 02 | 2 | BOUND-02, BOUND-04 | T-09-08 | Fixed non-AI chrome; no client env | source assert | Header/Footer node verify in PLAN | ✅ files exist | ⬜ pending |
| 09-02-02 | 02 | 2 | BOUND-02, BOUND-03 | T-09-05, T-09-06, T-09-07 | No chat import when off; WhatsApp from settings | source assert | destek/olusturucu node verify in PLAN | ✅ files exist | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Create `src/lib/storefront-flags.ts` + `src/lib/storefront-flags.test.ts` (09-01 Task 1) — covers BOUND-01
- [ ] Document `CUSTOMER_AI_UI_ENABLED=false` in `.env.example`
- [ ] Create `09-HOMEPAGE-INVENTORY.md` during execute (not a test; Phase 10 input)
- [ ] Optional (not blocking): Playwright smoke — Header has no `/destek` in primary nav; `/destek` has no chat region when flag unset

Existing Vitest infrastructure covers the flag helper; no new test framework install.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `/destek` contact-first UX (WhatsApp CTA, Turkish copy, no chat chrome) | BOUND-03 | Visual/UX judgment | With `CUSTOMER_AI_UI_ENABLED` unset/false: open `/destek`, confirm WhatsApp CTA and no chat UI |
| Primary nav + Sepet on desktop/mobile | BOUND-04 | Layout/a11y smoke | Home: nav shows Tasarla, Ürünler, Galeri, İletişim; Sepet still opens drawer |
| Admin AI still available when configured | BOUND-01 / D-01 | Cross-surface | With Anthropic configured and `AI_FEATURES_ENABLED` on: `/admin/icerik` AI generator still offered; customer chrome remains non-AI |
| Configurator has no chat when flag off | BOUND-02 | Visual | `/olusturucu` shows MatConfigurator only; no ConfiguratorChat panel |

---

## Expected Evidence (phase gate)

1. Vitest: `storefront-flags.test.ts` + `config.test.ts` green
2. Source asserts from 09-02 PLAN Task 1–2 exit 0
3. `npm run typecheck` green for touched routes
4. `git status` / diff excludes `src/components/home/Hero.tsx` (do not overwrite user WIP)
5. Manual smoke checklist above completed or noted

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s for quick run
- [ ] `nyquist_compliant: true` set in frontmatter after execute validation

**Approval:** pending
