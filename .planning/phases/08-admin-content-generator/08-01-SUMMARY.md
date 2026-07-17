---
phase: 08-admin-content-generator
plan: "01"
subsystem: ai-content-foundation
tags: [convex, ai-sdk, grounding, prompts, admin-auth]
requires:
  - phase: 05-ai-infrastructure-vehicle-matcher
    provides: server-only AI client, model config, kill switch
provides:
  - Admin-key-gated content draft storage isolated from live CMS
  - Premium Turkish content style and output contracts
  - Product and vehicle fact grounding with unknown-product refusal
affects: [08-02, 08-03]
tech-stack:
  added: []
  patterns: [draft isolation, structured grounding, reusable brand prompt]
key-files:
  created:
    - convex/contentGenerations.ts
    - src/lib/ai/content-style-guide.ts
    - src/lib/ai/content-prompt.ts
    - src/lib/ai/content-grounding.ts
  modified:
    - convex/schema.ts
    - src/lib/ai/config.ts
key-decisions:
  - "Content drafts use a dedicated Convex table and cannot write live CMS or product tables."
  - "Content generation uses claude-opus-4-8 with a 4096-token cap for quality-focused long-form Turkish copy."
requirements-completed: [CNTGEN-01, CNTGEN-02, CNTGEN-04, AIINF-02]
duration: 7min
completed: 2026-07-17
status: complete
---

# Phase 8 Plan 01: Draft, Prompt, and Grounding Foundation Summary

**Indexed Convex drafts, a reusable restrained Turkish luxury voice, and exact catalog/vehicle fact packs now form a live-content-isolated generation foundation.**

## Automated Evidence
- Config and grounding tests: 14/14 passed.
- Typecheck: passed.
- Focused Phase 8 lint: passed.
- Live-table identifier scan in `convex/contentGenerations.ts`: no matches.

## Task Commits
1. `bae3c26`, `7b52519` — draft schema/API and generated bindings.
2. `9e75041`, `066599b` — failing config contract, style guide, prompts, and model config.
3. `a1575b5`, `afbbcbb` — failing grounding contracts and structured grounding builder.

## Deviations from Plan
- Added optional validated vehicle selection to the grounding builder so vehicle metadata and code-owned pricing can be represented without inferring a vehicle from generic catalog products.

## Known Stubs
None.

## Self-Check: PASSED
All listed source files and commits exist.
