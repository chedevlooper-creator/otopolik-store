# Phase 8 Plan Check

**Status:** PASS
**Phase:** 08-admin-content-generator
**Plans verified:** 3 (9 tasks: 8 auto + 1 human checkpoint)
**Checked:** 2026-07-17

## VERIFICATION PASSED

**Phase goal:** Admins can generate premium Turkish product/SEO/FAQ copy as drafts and publish only after explicit review.

**Status:** All goal-critical checks passed. Minor non-blocking concerns only — execution may proceed.

### Coverage Summary

| Requirement | Plans | Status |
|-------------|-------|--------|
| CNTGEN-01 | 01 (grounding), 02 (generate + kinds), 03 (grounding eval + human) | Covered |
| CNTGEN-02 | 01 (draft-only table/API), 02 (generate≠publish), 03 (no-live-write source scan + human) | Covered |
| CNTGEN-03 | 02 (ContentManager embed + both admin-key paths), 03 (embed/key eval + human + login) | Covered |
| CNTGEN-04 | 01 (style guide + prompt), 02 (generation uses prompt), 03 (style golden + human tone) | Covered |
| AIINF-02 (carryover) | 01 (content-generator AiFeature + isAiConfigured), 02 (503/hide tab), 03 (human AI-off) | Covered |

### Success Criteria Trace

| # | Criterion | Delivered by |
|---|-----------|--------------|
| 1 | Authenticated admin generates Turkish product/SEO/FAQ grounded in product/vehicle facts | 08-01 grounding + style/prompt; 08-02 `generateContentDraft` + `/api/admin/ai/content` + kinds; 08-03 grounding/style evals + human |
| 2 | Draft-only until explicit publish; never auto-publish | 08-01 `contentGenerations` isolated from live CMS; 08-02 separate generate route vs `publishContentGenerationAction`; 08-03 no-live-write source scan + human regenerate-vs-publish |
| 3 | Inside `/admin/icerik` ContentManager; admin-key-gated | 08-02 tab + `ContentGeneratorPanel` at real path; `getAdminConvexKey` (server) + `useAdminConvexKey` (client); Convex `requireAdminKey`; 08-03 human after `/admin/login` |
| 4 | Premium Turkish Apple/Porsche brand voice via written style guide | 08-01 `CONTENT_STYLE_GUIDE` + system prompt; 08-03 style golden + human tone check |

### Guardrails (focus areas / carryovers)

- **Draft isolation (CNTGEN-02 / D-02):** Generate writes only `contentGenerations`; publish is a distinct server action that alone may call `saveFaqItem` / `saveSiteSeo` / `saveContentSection` / `api.products.update`. Eval source-scans generate helper + route for absence of live write helpers.
- **Dual admin-key + re-verify (CNTGEN-03 / D-03):** Server generate/publish use `getAdminConvexKey`; panel list/query uses `useAdminConvexKey` → `/api/admin/convex-key`; every new Convex draft mutation calls `requireAdminKey` (mirror `convex/files.ts`). Proxy alone is not trusted.
- **Grounding (CNTGEN-01 / D-01):** `buildContentGroundingFacts` from `products`/`catalog` + `vehicle-data` — no invented prices/specs; unknown slug refuses invention.
- **Reuse Phase 5 (D-05):** Next.js admin route + `getLanguageModel("content-generator")` / rate-limit / kill-switch — no new Anthropic Convex env for interactive generate; no scheduled `api.*`.
- **AI / CMS fallback (AIINF-02):** AI unset → hide/disable generator tab; hand CMS editors unchanged. Manual CMS remains usable when generator cannot run.
- **Admin styling (D-06):** Plain sharp-corner admin only — no `*-rich` / `mac-glass*` / `.premium-site`.
- **Deferred excluded:** Bulk catalog generation, image gen, in-place live edit — Plan 03 explicitly forbids.

### Code grounding (spot-check)

| Claim | Verified |
|-------|----------|
| ContentManager path is `src/app/admin/icerik/ContentManager.tsx` (not `src/components/admin/…`) | Yes — only one ContentManager; CONTEXT.md code_context path is stale; plans use correct path |
| `getAdminConvexKey` / `useAdminConvexKey` / `/api/admin/convex-key` exist | Yes — session-gated key for browser; server-only secret helper |
| `requireAdminKey` pattern in `convex/files.ts` + `convex/cms.ts` | Yes — adminKey arg + `requireAdminKey` |
| Phase 5 AI stack reusable (`getLanguageModel` / `isAiConfigured` / kill switch) | Yes — `config.ts`, `anthropic-client.ts`, `rate-limit.ts`; `AiFeature` currently lacks `content-generator` (Plan 01 adds it) |
| `api.products.update` exposes `description`, `metaTitle`, `metaDescription` | Yes — optional args on `convex/products.ts` `update` |
| `getProductBySlug` / catalog Convex-first read | Yes — `products.ts` sync + `catalog.ts` async Convex-first |
| Existing icerik `actions.ts` has `guard` + CMS saves + `getAdminConvexKey` | Yes — publish can extend this file |
| `ai:eval:*` script pattern exists | Yes — Plan 03 adds `ai:eval:content-generator` alongside support/configurator |

### Plan Summary

| Plan | Tasks | Files | Wave | depends_on | Status |
|------|-------|-------|------|------------|--------|
| 08-01 | 3 | 8 | 1 | [] | Valid |
| 08-02 | 3 | 7 | 2 | 08-01 | Valid |
| 08-03 | 3 (1 human checkpoint) | 5 | 3 | 08-02 | Valid |

### Dimension Notes

| Dimension | Result |
|-----------|--------|
| 1 Requirement coverage | PASS — CNTGEN-01…04 (+ AIINF-02 carryover) in frontmatter + concrete tasks/evals |
| 2 Task completeness | PASS — files/action/verify/done present; blocking human-verify in 08-03 with `/admin/login` |
| 3 Dependency correctness | PASS — acyclic 01→02→03; waves consistent |
| 4 Key links planned | PASS — grounding→catalog/vehicle; generate→draft upsert; publish→live CMS/products; panel→both admin-key paths |
| 5 Scope sanity | PASS — 3 tasks/plan; files within budget |
| 6 Verification derivation | PASS — user-observable truths; no-live-write eval + human cover CNTGEN-02 |
| 7 Context compliance (D-01…D-06) | PASS — locked decisions mapped; deferred bulk/image/in-place edit excluded |
| 7b Scope reduction | PASS — no silent “static v1” of draft-then-publish or grounding; Next transport is discretion, not reduction |
| 7c Architectural tier | SKIPPED (no phase RESEARCH.md responsibility map) |
| 8 Nyquist | SKIPPED (no phase RESEARCH.md / Validation Architecture; plans still embed vitest/typecheck/eval + blocking human checkpoint) |
| 9 Cross-plan data contracts | PASS — Plan 01 drafts/prompt/grounding consumed by Plan 02 generate/publish; Plan 03 scans those sources |
| 10 CLAUDE.md | PASS — admin outside `.premium-site`; admin-key dual path; Convex validators/`requireAdminKey`; reuse Phase 5; no new payment/WhatsApp scope |
| 11 Research resolution | SKIPPED (no phase RESEARCH.md) |
| 12 Pattern compliance | SKIPPED (no PATTERNS.md) |

### Non-blocking concerns

```yaml
issues:
  - plan: null
    dimension: nyquist_compliance
    severity: warning
    description: "Nyquist is enabled in .planning/config.json but phase has no 08-RESEARCH.md / 08-VALIDATION.md. Plans already embed vitest/typecheck/eval + blocking human checkpoint; treat as process debt, not a goal blocker (same posture as Phases 5–7)."
    fix_hint: "Optional: /gsd-plan-phase 8 --research to add Validation Architecture + 08-VALIDATION.md on a refresh."
  - plan: null
    dimension: context_compliance
    severity: info
    description: "08-CONTEXT.md code_context still cites src/components/admin/ContentManager.tsx; real file is src/app/admin/icerik/ContentManager.tsx. Plans correctly use the real path."
    fix_hint: "Optional doc fix in CONTEXT on next discuss/refresh — do not change plan paths."
  - plan: "08-02"
    dimension: key_links_planned
    severity: warning
    description: "product_seo publish mapping is 'metaTitle/metaDescription and/or siteSeo' — ambiguous. products.update already accepts metaTitle/metaDescription; executor could under-deliver product SEO if only siteSeo is updated."
    task: 2
    fix_hint: "During execute: for kind product_seo prefer api.products.update metaTitle/metaDescription (resolve id via getBySlug); use saveSiteSeo only for site-level SEO targets labeled in the panel."
  - plan: "08-02"
    dimension: verification_derivation
    severity: info
    description: "Tasks 2–3 rely on typecheck for publish action + ContentManager wiring; CNTGEN-02/03 UX observability is deferred to Plan 03 human checkpoint + generate-path source scan."
    fix_hint: "Acceptable — keep human verify blocking; do not weaken checkpoint."
  - plan: "08-03"
    dimension: verification_derivation
    severity: info
    description: "CNTGEN-03 automated eval asserts embed/admin-key 'patterns' but does not explicitly require both getAdminConvexKey and useAdminConvexKey symbols in the scan."
    fix_hint: "Optional during execute: assert both path symbols appear in generate route/actions vs ContentGeneratorPanel sources."
  - plan: "08-01"
    dimension: claude_md_compliance
    severity: info
    description: "listRecent may use indexed .collect() + TS sort for small admin lists — @convex-dev/no-query-collect may warn; plan already scopes to small admin lists."
    fix_hint: "Executor: keep limit arg; paginate only if lint/runtime requires it."
```

### Recommendation

**PASS** — proceed to `/gsd-execute-phase 8`. No blockers. Path correction to `src/app/admin/icerik/ContentManager.tsx` is correct; `products.update` already supports description + meta SEO fields needed for publish.
