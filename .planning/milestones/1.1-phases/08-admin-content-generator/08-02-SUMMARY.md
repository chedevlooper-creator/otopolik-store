---
phase: 08-admin-content-generator
plan: "02"
subsystem: admin-content-generator
tags: [nextjs, convex, ai-sdk, admin-auth, react]
requires:
  - phase: 08-admin-content-generator
    plan: "01"
    provides: draft API, prompts, grounding, AI feature config
provides:
  - Authenticated draft-only generation route using Phase 5 guardrails
  - Explicit publish action for product copy, product SEO, and FAQ
  - AI Taslak panel embedded in /admin/icerik with both admin-key paths
affects: [08-03, release-verification]
tech-stack:
  added: []
  patterns: [generate-review-publish, dual admin-key plumbing, graceful AI-off UI]
key-files:
  created:
    - src/lib/ai/content-generate.ts
    - src/app/api/admin/ai/content/route.ts
    - src/app/admin/icerik/ContentGeneratorPanel.tsx
  modified:
    - src/app/admin/icerik/actions.ts
    - src/app/admin/icerik/ContentManager.tsx
    - src/app/admin/icerik/page.tsx
key-decisions:
  - "Generation is a Next.js admin route and writes only contentGenerations; publication is a separate server action."
  - "The AI tab is hidden unless both AI and Convex are configured, leaving all manual CMS tabs unchanged."
requirements-completed: [CNTGEN-01, CNTGEN-02, CNTGEN-03, CNTGEN-04, AIINF-02]
duration: 8min
completed: 2026-07-17
status: complete
---

# Phase 8 Plan 02: Admin Draft and Publish Workflow Summary

**Authenticated admins can create grounded drafts inside ContentManager, edit them, and explicitly publish through existing product/CMS mutations without any generate-time live write.**

## Automated Evidence
- Generation helper tests: 2/2 passed.
- Typecheck: passed.
- Focused Phase 8 lint: passed.
- Protected route smoke: `/admin/icerik` returns 307 to `/admin/login?next=%2Fadmin%2Ficerik` without a session.

## Task Commits
1. `b175c3b`, `d92e687` — failing generation contracts and guarded draft route.
2. `5233d87` — separately authenticated publish action.
3. `41c00f1` — browser-key-gated AI Taslak panel and AI-off integration.

## Deviations from Plan
None — plan executed as specified.

## Threat Flags
The planned admin route and publish trust boundaries are protected by `isAuthenticated`, `getAdminConvexKey`, Convex `requireAdminKey`, rate limiting, and draft/live separation.

## Known Stubs
None.

## Self-Check: PASSED
All listed source files and commits exist.
