---
phase: 07-support-order-helper-grounding
subsystem: ai-support
tags: [ai-sdk, convex, grounding, streaming, whatsapp, kvkk, eval]
plans: ["07-01", "07-02", "07-03"]
requires:
  - phase: 05-ai-infrastructure-vehicle-matcher
    provides: shared AI client, guardrails, pricing, and eval conventions
  - phase: 06-streaming-chat-configurator-assistant
    provides: streaming chat and user-controlled WhatsApp patterns
provides:
  - Live CMS/site-settings-grounded Turkish support assistant
  - Scoped refusal and uncertain-case WhatsApp escalation
  - User-reviewed order drafts with code-owned prices
  - Session-only KVKK-minimized premium /destek experience
  - Deterministic support safety regression gate
affects: [phase-08, release]
requirements-pending-human: [SUPAI-01, SUPAI-02, SUPAI-03, SUPAI-04, SUPAI-05]
metrics:
  plans: 3
  auto-tasks: 6
  duration: 10min
  prepared: 2026-07-17
status: human_needed
---

# Phase 7: Support / Order Helper & Grounding Summary

**OTO POLİK now has a premium Turkish support assistant grounded in live storefront facts, constrained to the mat/order domain, and limited to user-reviewed WhatsApp drafts with no transcript persistence.**

## Delivered
- Convex-first FAQ/content reads with safe static fallback.
- Answer-time grounding over current CMS and shipping settings.
- Separate guarded `/api/ai/support` streaming route and customer-only tool surface.
- `/destek` AI chat with AI disclosure, session-only state, and user-clicked WhatsApp drafts.
- Complete AI-off manual support fallback and footer navigation.
- API-key-free golden evals for freshness, refusal, pricing, user-send, admin isolation, and KVKK.

## Commits
- `7552c6d` test(07-01): add failing live grounding contracts
- `7c621cb` feat(07-01): ground support in live storefront facts
- `ed3f6a3` test(07-01): add failing support tool contracts
- `763e383` feat(07-01): stream grounded support assistant
- `9c0da7e` feat(07-02): add premium support chat
- `03cba6f` feat(07-02): mount gated AI support page
- `4c52e94` test(07-03): add failing support golden eval
- `33b76bb` test(07-03): gate support safety regressions

## Automated Evidence
- Production build: PASS, 659 static pages; `/api/ai/support` and `/destek` present.
- Typecheck: PASS.
- AI unit suite: PASS, 84/84.
- Support eval: PASS, 9/9.
- Configurator eval: PASS, 12/12.
- Vehicle matcher eval: PASS, 27/27.
- Focused Phase 7 lint: PASS.
- Full repository lint remains the documented pre-existing failure outside Phase 7.

## Known Stubs
None.

## Threat Flags
No unplanned threat surface. The new public support endpoint is bounded by the planned availability gate, message limits, rate limiter, token cap, customer-only tools, and no-persistence policy.

## Status
Implementation and automated verification are complete. Phase status is `human_needed` until the provider-on grounding, refusal, WhatsApp, order-draft, mobile, and reduced-motion checklist in `07-VERIFICATION.md` is approved. Milestone transition was not run.

## Self-Check: PASSED
All plan summaries, verification document, source files, evals, and task commits exist.
