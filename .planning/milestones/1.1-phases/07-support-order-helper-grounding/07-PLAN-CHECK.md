# Phase 7 Plan Check

**Status:** PASS
**Phase:** 07-support-order-helper-grounding
**Plans verified:** 3 (7 tasks: 6 auto + 1 human checkpoint)
**Checked:** 2026-07-17

## VERIFICATION PASSED

**Phase goal:** Customers can get shipping/sizing/care answers grounded in live site content and draft a WhatsApp order message without the AI placing the order.

**Status:** All goal-critical checks passed. Minor non-blocking concerns only — execution may proceed.

### Coverage Summary

| Requirement | Plans | Status |
|-------------|-------|--------|
| SUPAI-01 | 01 (cms + grounding), 03 (freshness eval + human) | Covered |
| SUPAI-02 | 01 (prompt), 02 (UI domain copy), 03 (prompt scan + human) | Covered |
| SUPAI-03 | 01 (handoff tool), 02 (user-gesture wa.me CTA), 03 | Covered |
| SUPAI-04 | 01 (draft_order_summary contract), 02 (user send), 03 | Covered |
| SUPAI-05 | 01 (no transcript writes), 02 (client-only state), 03 (KVKK scan) | Covered |

### Success Criteria Trace

| # | Criterion | Delivered by |
|---|-----------|--------------|
| 1 | Shipping/sizing/care answers match live CMS/site-settings (not baked prompts) | 07-01 wire `getFaqs`/`getContentPage` Convex-first + `buildSupportGroundingFacts` re-fetch; 07-03 freshness eval + human threshold check |
| 2 | Off-topic → scoped Turkish redirect | 07-01 `SUPPORT_SYSTEM_PROMPT`; 07-03 prompt golden + human off-topic check |
| 3 | Uncertain → pre-filled wa.me; order draft user-sends | 07-01 `prepare_whatsapp_handoff` / `draft_order_summary`; 07-02 SupportChat CTA via `buildWhatsAppLink`; 07-03 user-sends scan + human |
| 4 | KVKK minimization (short TTL / no training pipeline) | 07-01/02 no Convex transcript tables; client session only; 07-03 source scan + privacy note |

### Guardrails (focus areas / carryovers)

- **Live grounding (SUPAI-01 / D-01):** Confirmed pre-existing gap — `src/lib/cms.ts` `getFaqs` / `getContentPage` currently always return static fallback (`source: "fallback"`) even though `convex/cms.ts` already exposes `listFaqs`, `getPageBySlug`, `listSectionsByPage`. Plan 07-01 Task 1 explicitly wires Convex-first + graceful fallback (mirror `getSiteSettings` in `site-settings.ts`, which is already live). Answer-time tool pack; no shipping numbers baked into the system prompt.
- **Graceful fallback (AIINF-02):** 07-01 route 503 `ai_unavailable` + kill switch/rate limit mirror of `/api/ai/chat`; 07-02 `/destek` gated on `isAiConfigured()` with FAQ/WhatsApp fallback.
- **Price integrity (AIINF-03):** Tools use `getCustomerMatPrice` → `calculateMatPrice`; draft price recomputed server-side; 07-03 golden equality.
- **Tool isolation (AIINF-05):** Isolation source scans on support-tools/route/UI; no `adminKey` / `requireAdminKey` / Convex mutations; separate `/api/ai/support` keeps configurator stepper tools out.
- **User-sends-not-AI (SUPAI-03/04):** Draft tools never open wa.me or write orders; UI CTA is user-gesture `<a href={buildWhatsAppLink(...)}>`.

### Code grounding (spot-check)

| Claim | Verified |
|-------|----------|
| `getFaqs` / `getContentPage` ignore Convex today | Yes — unconditional static return in `cms.ts` L36–55 |
| `getStoreSettings` already Convex-first | Yes — `site-settings.ts` |
| Phase 5/6 AI stack reusable | Yes — `config.ts`, `anthropic-client.ts`, `rate-limit.ts`, `customer-tools.ts`, `/api/ai/chat` |
| `getCustomerMatPrice` → `calculateMatPrice` | Yes — `customer-tools.ts` |
| `buildWhatsAppLink` exists | Yes — `whatsapp.ts` (+ settings-context re-export) |
| Convex FAQ/page queries exist | Yes — `convex/cms.ts` `listFaqs` / `getPageBySlug` / `listSectionsByPage` |
| `"kargo"` is a real CMS slug | Yes — `cmsSeedData.ts` + `/bilgiler/kargo` |

### Plan Summary

| Plan | Tasks | Files | Wave | depends_on | Status |
|------|-------|-------|------|------------|--------|
| 07-01 | 2 | 9 | 1 | [] | Valid |
| 07-02 | 2 | 3 | 2 | 07-01 | Valid |
| 07-03 | 3 (1 human checkpoint) | 4 | 3 | 07-02 | Valid |

### Dimension Notes

| Dimension | Result |
|-----------|--------|
| 1 Requirement coverage | PASS — SUPAI-01…05 in plan frontmatter + concrete tasks |
| 2 Task completeness | PASS — files/action/verify/done present; blocking human-verify checkpoint in 07-03 |
| 3 Dependency correctness | PASS — acyclic 01→02→03; waves consistent |
| 4 Key links planned | PASS — grounding→CMS/settings, SupportChat→`/api/ai/support`, WhatsApp user-gesture, AI gate |
| 5 Scope sanity | PASS — 2–3 tasks/plan; files within budget |
| 6 Verification derivation | PASS — user-observable truths; evals + human cover SUPAI |
| 7 Context compliance (D-01…D-07) | PASS — locked decisions mapped; deferred order-status / multi-visit history / Phase 8 excluded |
| 7b Scope reduction | PASS — no silent “static v1” of live grounding; Convex wire is full |
| 7c Architectural tier | SKIPPED (no phase RESEARCH.md responsibility map) |
| 8 Nyquist | SKIPPED (no phase RESEARCH.md / Validation Architecture; plans still embed automated verifies + human checkpoint) |
| 9 Cross-plan data contracts | PASS — Plan 01 tool contracts consumed by Plan 02 CTA; no conflicting transforms |
| 10 CLAUDE.md | PASS — Convex-first+fallback; premium `/destek`; `calculateMatPrice`; WhatsApp draft-then-send; no admin mutation from tools |
| 11 Research resolution | SKIPPED (no phase RESEARCH.md) |
| 12 Pattern compliance | SKIPPED (no PATTERNS.md) |

### Non-blocking concerns

```yaml
issues:
  - plan: null
    dimension: nyquist_compliance
    severity: warning
    description: "Nyquist is enabled in .planning/config.json but phase has no 07-RESEARCH.md / 07-VALIDATION.md. Plans already embed vitest/typecheck/eval + blocking human checkpoint; treat as process debt, not a goal blocker (same posture as Phases 5–6)."
    fix_hint: "Optional: /gsd-plan-phase 7 --research to add Validation Architecture + 07-VALIDATION.md on a refresh."
  - plan: "07-01"
    dimension: verification_derivation
    severity: warning
    description: "Task 1 verifies via support-grounding.test.ts with injectable/mocked fetchers — does not directly assert cms.ts calls api.cms.listFaqs / getPageBySlug. Incorrect Convex wiring could still pass mocked grounding tests until human/live smoke."
    task: 1
    fix_hint: "Optional during execute: add a thin cms.ts unit test with mocked getConvexClient proving Convex path vs fallback; Plan 03 human step 2 still covers live settings freshness."
  - plan: "07-02"
    dimension: verification_derivation
    severity: info
    description: "Tasks 1–2 rely on typecheck only for SupportChat /destek wiring; SUPAI-03/04 UX observability is deferred to Plan 03 human checkpoint."
    fix_hint: "Acceptable for this phase — keep human verify blocking; do not weaken checkpoint."
  - plan: "07-03"
    dimension: verification_derivation
    severity: info
    description: "SUPAI-02 automated gate is prompt-source scan (no live LLM refusal run); live open-domain behavior is human-verified only."
    fix_hint: "Acceptable — matches Phase 6 disclosure posture; do not add ANTHROPIC-dependent evals to the gate script."
```

### Recommendation

**PASS** — proceed to `/gsd-execute-phase 7`. No blockers. The flagged `cms.ts` static-fallback gap is in scope for 07-01 and is load-bearing for SUPAI-01.
