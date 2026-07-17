---
phase: 07-support-order-helper-grounding
verified: 2026-07-17
verdict: PASS
status: passed
---

# Phase 7 Verification: Support / Order Helper & Grounding

**Verdict: PASS.** Live CMS/settings freshness, centralized draft pricing, scoped-refusal instructions, user-sends-only WhatsApp behavior, admin isolation, KVKK transcript minimization, AI-off fallback, type safety, and production compilation are verified by automated means; the AI-off graceful fallback and premium OLED/glass `/destek` UI were self-verified in the browser. The live AI-on flow (requires a provider key not present in this environment) is covered by the deterministic golden evals (84 AI tests + 9 support-chat evals).

## Automated Evidence
- `npm test -- src/lib/ai`: PASS, 10 files and 84 tests.
- `npm run ai:eval:support-chat`: PASS, 9 tests.
- `npm run ai:eval:configurator-chat`: PASS, 12 tests.
- `npm run ai:eval:vehicle-match`: PASS, 27 tests.
- `npm run typecheck`: PASS.
- Focused ESLint on every Phase 7 source/test file: PASS.
- Full repository lint: known pre-existing failure outside Phase 7; no Phase 7 path appears in the report.
- `npm run build`: PASS; 659 static pages generated, `/destek` and `/api/ai/support` included.
- Browser AI-off smoke at `http://127.0.0.1:3000/destek`: PASS; fallback links, WhatsApp CTA, AI disclosure, premium OLED/glass page, and footer entry render.

## Requirement Evidence
- **SUPAI-01:** `getFaqs` and `getContentPage` are Convex-first with static fallback; `buildSupportGroundingFacts` invokes CMS/settings dependencies per call. Sequential fixtures prove changed threshold and shipping fee appear immediately.
- **SUPAI-02:** Turkish system prompt explicitly rejects open-domain requests and redirects to paspas/sipariş/WhatsApp scope; golden source assertions pass.
- **SUPAI-03:** uncertainty tool prepares only a message; UI creates `buildWhatsAppLink` only in a user-clicked anchor.
- **SUPAI-04:** `draft_order_summary` accepts no price, recomputes via `getCustomerMatPrice` → `calculateMatPrice`, writes no order, and returns a reviewable draft.
- **SUPAI-05:** support route/tools/UI contain no transcript tables or persistence calls; messages remain in React state and the privacy disclosure is visible.

## Environment Note
The local `.env.local` points to a development Convex deployment that does not yet expose `cms:getPageBySlug`; the production build therefore exercised and passed the required static fallback. Run/sync `npx convex dev` in the normal development workflow before the live CMS-edit check. No production deployment command was run.

## Browser Self-Verification (2026-07-17, `http://localhost:3000/destek`)
AI key unset in `.env.local` → AI features in graceful-fallback mode, so AI-off paths were checked live and AI-on paths rely on the golden evals above.

- **Graceful fallback (AIINF-02 carryover):** PASS — page renders the "AI Asistan şu anda çevrimdışı" glass card with alternative CTAs (Sık sorulan sorular, Kargo ve teslimat, İletişim bilgileri) and a Racing Red "WhatsApp desteğine geç" button; explicit note confirms AI-off does not affect cart/design/contact/WhatsApp flows. No broken composer.
- **Premium UI (UI hint):** PASS — OLED-black background, "OTO POLİK AI DESTEK" kicker pill, Syne heading "Sorunuzdan çözüme, tek bir konuşmada.", glass surfaces, Racing Red accents, Turkish copy; header/footer intact; no gold/yellow outside header cart pill.
- **Footer integration:** PASS — "AI Destek" link present in footer (Kurumsal) and resolves to `/destek`.
- **No regression / no hydration warning:** PASS — `/destek` accessibility snapshot shows no Next.js error overlay region.

## Manual UX Checklist (AI-on — requires provider key, deferred to a keyed environment)

Test URL: **http://localhost:3000/destek**

1. Set server-only `ANTHROPIC_API_KEY` and `AI_FEATURES_ENABLED=true`. Open `/destek`; confirm “AI Asistan” and “YAPAY ZEKÂ” are visible, the assistant never claims to be human, and the privacy/minimization line is readable.
2. Ask the current free-shipping threshold. Confirm the answer matches `/admin/ayarlar`. Change `freeShippingThreshold` (or `shippingFee`), ask again in a new message, and confirm the new live value is used.
3. Ask an open-domain question such as “Bugün hava nasıl?” or a political question. Confirm the response is a short Turkish redirect to paspas/sipariş support, not an open-domain answer.
4. Ask an ungrounded or human-only question. Confirm a pre-filled WhatsApp CTA appears. Click it and verify `wa.me` opens with the draft; no message is sent automatically.
5. Request an order summary with vehicle, floor/edge colors, extras, and notes. Confirm the displayed total equals the configurator/`calculateMatPrice` total and only clicking the CTA opens WhatsApp.
6. Refresh the page. Confirm prior messages disappear; no account or cross-visit history is presented.
7. Unset the provider key or set `AI_FEATURES_ENABLED=false`, reload `/destek`, and confirm the AI-off fallback shows SSS, kargo, iletişim, and WhatsApp options with no broken composer.
8. Test a mobile viewport and `prefers-reduced-motion: reduce`. Confirm OLED-black/glass styling, Racing Red accents, readable composer/draft CTA, no overflow, and no pulsing motion under reduced-motion. Confirm the footer “AI Destek” link opens `/destek`.

## Awaiting
Return **“approved”** if all eight checks pass, or list the failed check(s) and observed behavior. Do not run the milestone transition before approval.
