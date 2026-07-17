---
phase: 08-admin-content-generator
subsystem: admin-ai
tags: [ai-sdk, convex, grounding, admin-auth, eval]
plans: ["08-01", "08-02", "08-03"]
requires:
  - phase: 05-ai-infrastructure-vehicle-matcher
    provides: shared AI client, guardrails, rate limiter, kill switch, eval conventions
provides:
  - Grounded premium Turkish product, SEO, and FAQ draft generation
  - Draft-only storage with explicit authenticated publication
  - In-place /admin/icerik workflow using both admin-key paths
  - Deterministic no-live-write and grounding regression gate
affects: [release]
requirements-pending-human: [CNTGEN-01, CNTGEN-02, CNTGEN-03, CNTGEN-04, AIINF-02]
metrics:
  plans: 3
  auto-tasks: 8
  ai-tests: 95
  content-evals: 5
  completed: 2026-07-17
status: human_needed
---

# Phase 8: Admin Content Generator Summary

**OTO POLİK now has an admin-only, fact-grounded Turkish content studio where AI output remains isolated as a draft until a separately authenticated publish action is approved.**

## Delivered
- `contentGenerations` draft records with indexed, admin-key-gated CRUD.
- Reusable premium Turkish style guide and product/SEO/FAQ output contracts.
- Exact product/vehicle grounding with explicit unknown-product refusal.
- Session-gated, rate-limited `/api/admin/ai/content` route reusing Phase 5.
- AI Taslak tab inside the existing `/admin/icerik` ContentManager.
- Explicit publication through existing product and CMS mutations.
- API-key-free golden eval covering style, grounding, no-live-write, auth, and dual admin keys.

## Automated Evidence
- Typecheck: PASS.
- Focused Phase 8 lint: PASS.
- Full AI tests: PASS, 95/95.
- Content generator eval: PASS, 5/5.
- Existing vehicle/configurator/support evals: PASS.
- Production build: PASS.
- Full repository lint remains the documented pre-existing failure: 571 errors, 155 warnings; no Phase 8 file appears.
- Unauthenticated `/admin/icerik` smoke: PASS, redirects to `/admin/login`.

## Core Safety Result
Generation calls only `contentGenerations.upsertDraft`. Live product/CMS updates exist only in `publishContentGenerationAction`, which rechecks the admin session, obtains the server admin key, reloads a ready draft, publishes through existing mutations, and then marks the draft approved.

## Known Stubs
None.

## Status
Implementation and automated verification are complete. Phase status is `human_needed` until the keyed admin UX checklist in `08-VERIFICATION.md` is approved. Milestone transition was not run.

## Self-Check: PASSED
All plan summaries, verification document, source files, evals, and task commits exist.
