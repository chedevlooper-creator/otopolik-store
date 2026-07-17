# Pitfalls Research

**Domain:** Brownfield simplification of a mature luxury Turkish e-commerce storefront (OTO POLİK — Next.js App Router + Convex + WhatsApp checkout + OLED-black design system + shipped v1.1 AI surfaces)
**Milestone:** v1.2 Sade Lüks Deneyim
**Researched:** 2026-07-17
**Confidence:** MEDIUM (web industry patterns cross-checked; project-specific failure modes grounded in live code paths — `page.tsx`, `CheckoutPageClient.tsx`, `cmsSeedData.ts`, `api/ai/*`, `ConfigSummary.tsx`, `Header`/`Footer` nav)

## Critical Pitfalls

### Pitfall 1: Deleting homepage sections without a CMS / seed inventory → orphan admin content and silent copy loss

**What goes wrong:**
Homepage currently composes `Hero` (`hero`, `hero-secondary-cta`), `HomeConfiguratorShowcase`, `FeaturedProducts` (`featured`), and `Faq` (`faq`, `faq-sidebar`) from `getContentPage("home")`. Convex/seed still carries many additional home keys (`steps`, `step-01..03`, `showcase`, `showcase-gallery-*`, `showcase-feature-*`, `testimonials`, …) plus unused components (`LuxuryInterior`, `PremiumExperience`, `FeatureStrip`). A “clean homepage” PR that removes React sections without updating `convex/cmsSeedData.ts`, `/admin/icerik` expectations, or documenting which keys stay live leaves admins editing ghost sections — or worse, deletes a section that still owned the only Turkish copy for a CTA while hardcoding English/stale fallbacks.

**Why it happens:**
UI composition (`src/app/page.tsx`) and CMS data (`CONTENT_SECTIONS_SEED`) drift independently. Developers treat unused seed rows as harmless; ContentManager still lists them as editable.

**How to avoid:**
- Before removing any homepage block, produce a **section-key matrix**: `sectionKey` → component → keep / hide-in-admin / delete-from-seed.
- Prefer **unmount in `page.tsx` + `isPublished: false` (or admin hide)** over deleting Convex rows until UAT passes.
- Keep hardcoded `??` Turkish fallbacks only for keys that remain mounted; never leave admin-editable keys with no consumer.

**Warning signs:**
- `/admin/icerik` shows sections that never appear on `/`.
- Grep finds `section("…")` removed but seed keys untouched (or the reverse).
- Showcase/FAQ copy changes in admin with no storefront effect.

**Phase to address:**
**Phase 1 — Homepage composition & CMS inventory** (first; unlocks safe visual simplification).

---

### Pitfall 2: “Shorter page” redistributes attention to the wrong CTA and quietly tanks conversion

**What goes wrong:**
Industry redesign post-mortems show shorter pages don’t just remove noise — they **move scroll gravity**. Content that was below the fold (secondary WhatsApp CTA, footer promo, weak path) suddenly dominates. For OTO POLİK, collapsing hero + showcase + featured + FAQ into a thin stack can over-promote a secondary path (e.g. generic WhatsApp “bilgi al”) while starving the primary path (`/olusturucu` → cart → `/odeme`).

**Why it happens:**
Teams optimize for “looks calmer” without locking a single primary conversion job per viewport. Multiple CTAs (Hero secondary, showcase, FeaturedProducts, Faq WhatsApp, Footer) compete after clutter is removed.

**How to avoid:**
- Define one primary CTA per first viewport (configurator or WhatsApp order — pick one hierarchy and stick to it).
- After each section removal, manually walk: home → ürün/oluşturucu → sepet → ödeme; confirm no new competing CTA steals the path.
- Do **not** bundle section deletion + CTA relabeling + nav changes in one untested ship.

**Warning signs:**
- Heat/scroll intuition: users hit footer WhatsApp before `/olusturucu`.
- “Looks cleaner” demos, but checkout starts drop vs. pre-v1.2 baseline.
- Hero secondary CTA and FAQ WhatsApp both equally loud.

**Phase to address:**
**Phase 1 — Homepage composition** (structure) + **Phase 5 — Conversion / mobile verification** (measure).

---

### Pitfall 3: Breaking WhatsApp checkout by moving `window.open` after async work

**What goes wrong:**
`CheckoutPageClient` deliberately opens a blank window **synchronously** on submit (`window.open("", "_blank")` then `location.replace(wa.me)`), then writes the Convex order. Browsers block popups opened after `await`. Any “simplify checkout” refactor that awaits `createOrder` / validation / animation before `window.open` will show a success UI while WhatsApp never opens — conversion death for a store with **no payment gateway**.

**Why it happens:**
Simplification often “cleans” submit handlers into linear async/await. Popup-blocker rules are invisible on desktop with popups allowed.

**How to avoid:**
- Treat the sync-open-then-persist pattern as a **hard invariant** (already commented in code).
- If fields are removed, keep submit on a real user gesture with open-first.
- Always test with popup blocker **on** (Chrome default) on mobile Safari and desktop.

**Warning signs:**
- Submit handler has `await` before any `window.open`.
- QA only tested with “always allow popups.”
- Error string for blocked popup removed “to simplify.”

**Phase to address:**
**Phase 3 — Commerce flow shortening** (configurator / cart / checkout). Gate any checkout PR on popup-blocker verification.

---

### Pitfall 4: Hiding customer AI in the UI while leaving live `/api/ai/*` + nav deep links (dead-but-shipped)

**What goes wrong:**
v1.1 shipped customer AI: `ConfiguratorChat` on `/olusturucu`, `VehicleMatchInput`, `SupportChat` on `/destek`, Footer label **“AI Destek”**, Header **Destek**. Milestone goal is hide customer AI while **keeping code**. Classic failure: `aiEnabled ? <ConfiguratorChat /> : null` and remove nav items, but:
1. Routes stay callable if someone sets `AI_FEATURES_ENABLED` / has a key — or worse, UI hides while server still serves when env is on.
2. Bookmarks/`/destek` remain in sitemap-adjacent discovery or footer leftovers.
3. Bundle still ships AI client code → weight without benefit.
4. Security lesson (CWE-602): **hiding UI ≠ disabling capability**. Cost/abuse still hits `checkAiRateLimit` only if routes stay up with keys configured.

**Current good baseline:** `/api/ai/chat` and `/api/ai/support` already return 503 when `!isAiFeaturesEnabled() || !isAiConfigured()`. Vehicle-match also checks the flag. **Do not regress this** when “just commenting out” components.

**Why it happens:**
“Preserve code” is misread as “leave everything wired; only CSS `display:none`.” Nav/footer labels forgotten. Admin AI (`/api/admin/ai/content`) accidentally disabled with customer AI.

**How to avoid:**
- Hide via **server-enforced** `AI_FEATURES_ENABLED=false` (or dedicated customer-surface flag) **and** stop mounting customer widgets; keep admin generator independently gated.
- Remove/relabel Header `/destek` and Footer “AI Destek”; decide whether `/destek` 404s, redirects to `/iletisim`, or becomes static FAQ-only (no chat mount).
- Verify with curl: `POST /api/ai/chat` and `/api/ai/support` return 503 when customer AI is “hidden.”
- Do **not** delete eval harness / `src/lib/ai/**` — that’s “preserve code.”

**Warning signs:**
- Footer still says “AI Destek” after “AI hidden” ship.
- Network tab shows chat transport init on `/olusturucu` despite no visible UI.
- `AI_FEATURES_ENABLED` unset (defaults **enabled** if key present — see `isAiFeaturesEnabled`) while UI removed → public API still live.

**Phase to address:**
**Phase 4 — Customer AI surface hide (server + chrome)**. Explicitly out of scope: disabling admin content generator.

---

### Pitfall 5: Orphaning SEO landing pages and structured data while “simplifying marketing”

**What goes wrong:**
`/arac/[slug]` pages are code-generated SEO assets (`vehicle-seo.ts`), not CMS. Homepage FAQ injects `faqPageSchema` JSON-LD from live FAQ items. Aggressive simplification that:
- removes visible FAQ but leaves mismatched JSON-LD,
- strips FAQ entirely (loses on-page answers for users/AI crawlers),
- changes `/olusturucu` or product URLs without redirects,
- drops `/arac/*` internal links from simplified home/showcase,

…hurts organic discovery even if Google’s FAQ **rich results** were deprecated (May 2026). Unused accurate FAQPage markup is mostly harmless; **invisible or deleted Q&A content** is the real loss. `sitemap.ts` lists home, `/urunler`, `/olusturucu`, `/galeri`, legal — not `/destek` or `/arac/*` today; don’t assume sitemap alone protects vehicle landings — internal links do.

**Why it happens:**
Teams equate “schema cleanup” with SEO hygiene, or treat `/arac` as optional marketing fluff during a homepage diet.

**How to avoid:**
- Keep at least one visible trust/FAQ block **or** relocate FAQs to `/bilgiler` / product pages before removing home FAQ.
- If FAQ UI is removed, remove or update `renderJsonLd(faqPageSchema(…))` so markup matches DOM.
- Never rename `/arac/[slug]` or `/urunler/[slug]` in this milestone.
- Smoke-check a sample of vehicle slugs after home link changes.

**Warning signs:**
- JSON-LD FAQ questions not present as visible text.
- Showcase removal eliminates all paths to `/olusturucu` or `/arac/…`.
- Search Console soft-404s / crawl anomalies on vehicle URLs post-launch.

**Phase to address:**
**Phase 1** (home FAQ decision) + **Phase 5 — SEO & regression verification**.

---

### Pitfall 6: Motion diet that either guts premium brand feel or breaks `prefers-reduced-motion` / Lenis contracts

**What goes wrong:**
v1.0 invested in Lenis (`SmoothScroll.tsx`), `.reveal` / `ScrollReveal`, `hero-ready`, spring stepper, loupe gallery, `btn-press`. Two opposite failures:
1. **Strip everything** → site feels like a generic black template (fails Core Value / brand-first bar).
2. **Half-remove** → orphan CSS animations, scroll reveals that leave content at `opacity: 0`, or Lenis removed while CSS still assumes Lenis scroll — layout/scroll bugs, especially with modals.

**Why it happens:**
“Reduce animation” is interpreted as delete `SmoothScroll` and all `animate=` props without an intentional micro-interaction budget.

**How to avoid:**
- Define an allowlist: e.g. keep `btn-press`, focus rings, one hero entrance, cart feedback; cut scroll-linked cascades and 3D flair.
- Preserve `prefers-reduced-motion: reduce` paths in `globals.css` / `SmoothScroll` early-return.
- After changes, verify no `.reveal` nodes stuck invisible without `.reveal-visible`.

**Warning signs:**
- Content blank until scroll on mobile.
- Reduced-motion users still get Lenis or endless springs.
- Brand review: “looks cheap / flat” after motion purge.

**Phase to address:**
**Phase 2 — Motion diet** (dedicated; don’t mix with checkout edits).

---

### Pitfall 7: Configurator / cart “step reduction” that drops sticky mobile purchase affordances or pricing truth

**What goes wrong:**
`MatConfigurator` uses multi-step UI + `ConfigSummary` with `lg:sticky` and mobile bottom summary / add-to-cart. Collapsing steps into one long form, or removing sticky summary “for calm UI,” recreates classic mobile PDP friction: user configures colors then can’t find add-to-cart without scrolling. Separately, “simplifying” price display by hardcoding strings (instead of `calculateMatPrice` / site settings) reintroduces dual sources of truth — especially dangerous next to dormant AI tools that still call pricing helpers.

**Why it happens:**
Desktop-first visual QA; sticky bars feel “busy” in screenshots. Price formatting duplicated for fewer components.

**How to avoid:**
- On mobile, keep **one always-reachable purchase control** (sticky summary or equivalent) through configurator completion.
- Any step merge must preserve vehicle → colors → extras → price → `useCart().addItem()` order and `mat-pricing.ts` as sole math.
- Manual test: iPhone-width, full config, add to cart without scrolling hunting.

**Warning signs:**
- Add-to-cart only above the fold on a long step.
- Price text not traceable to `calculateMatPrice` / settings.
- Heel pad / trunk mat toggles removed “for simplicity” without product decision.

**Phase to address:**
**Phase 3 — Commerce flow shortening**, with mobile checklist in **Phase 5**.

---

### Pitfall 8: Accidental admin / backend regressions while editing shared chrome and providers

**What goes wrong:**
Simplification touches `Header`, `Footer`, `SiteChrome`, globals under `.premium-site`. Admin is **intentionally outside** `.premium-site`. Shared edits can: break admin nav, strip WhatsApp float needed for conversion, change cookie/consent layout, or “simplify” context providers and break cart hydration (`isHydrated` / `useSyncExternalStore`).

**Why it happens:**
Shared layout components look like one surface; premium classes get applied globally “for consistency.”

**How to avoid:**
- Scope visual simplification to `.premium-site` customer routes only.
- After chrome changes, smoke `/admin/login`, `/admin/icerik`, `/admin/ayarlar`.
- Don’t touch Convex schema, order notify, or admin AI publish flow in v1.2.

**Warning signs:**
- Admin picks up `mac-glass` / Racing Red customer chrome.
- Cart empty after refresh (hydration regression).
- Consent banner broken on mobile after hero CSS edits.

**Phase to address:**
**Phase 2–4** as a standing constraint; verify in **Phase 5**.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| `display:none` / CSS-only hide for AI widgets | Fast “AI gone” demo | Routes, cost, and deep links still live; false sense of off | Never as the only control — pair with server flag |
| Delete unused home components but leave CMS seed keys | Smaller `page.tsx` | Admin edits ghost content; future re-enable confusion | Only with documented deferred keys or seed cleanup in same PR |
| Remove Lenis entirely in one PR | Simpler scroll | Scroll/modal assumptions break; brand feels abrupt | Prefer tune/disable under reduced-motion first; full remove only after scroll QA |
| Collapse checkout fields + rewrite submit async | Fewer inputs | Popup blocker regression; lost order notify | Field reduction OK; submit open-order **invariant** never |
| Hardcode hero copy, ignore CMS | Faster design tweaks | `/admin/icerik` lies; Convex/static fallback diverge | Never for keys still in admin; OK for truly retired keys after seed update |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| WhatsApp (`wa.me` via `buildWhatsAppLink`) | Open after `await createOrder` | Sync `window.open` shell on click, then replace URL; order write best-effort after |
| Convex CMS (`contentSections` / FAQs) | Unmount React section, leave published seed | Inventory keys; unpublish or remove seed; keep admin UI honest |
| `AI_FEATURES_ENABLED` + `ANTHROPIC_API_KEY` | Assume UI hide disables spend | Server 503 on customer routes; set flag false in prod for v1.2 hide; keep rate limit |
| Admin AI `/api/admin/ai/content` | Toggle same flag as customer chat | Keep admin path independently available when customer surfaces hidden |
| JSON-LD (`faqPageSchema`) | Delete FAQ UI, leave schema (or opposite) | Markup ↔ visible content parity |
| Lenis / overflow locks | Remove Lenis, keep transform-based assumptions | Re-test drawers/modals (`CartDrawer`) after scroll changes |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| AI client JS still in main customer bundles after “hide” | Heavier `/olusturucu` despite no chat UI | Dynamic import behind flag, or don’t import chat components when disabled | Immediate on mid-tier mobile |
| Home still fetches unused CMS sections then discards | Extra Convex/payload work | Stop requesting unused keys or trim page query | Grows with CMS size; noticeable on slow 4G |
| Scroll-reveal observers left on removed sections | Wasted IO / layout thrash | Delete dead `ScrollReveal` wrappers with sections | Low traffic OK; messy on long pages |
| Dual animation systems (Framer + CSS) half-disabled | Jank, stuck opacity | One motion strategy per surface after diet | Mid-range Android |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Client-only AI hide | Abusive `POST /api/ai/*` still burns tokens if key+flag on | Enforce `isAiFeaturesEnabled` / `isAiConfigured` on every customer AI route (already present — don’t remove) |
| Leaving `/destek` chat mounted “for power users” | Contradicts milestone; expands attack/cost surface | No customer chat mount; support via WhatsApp/`/iletisim` |
| Shipping debug AI status endpoints without auth | Capability fingerprinting | Keep `/api/ai/status` minimal; don’t expand |
| Simplifying admin auth while touching chrome | Accidental session/cookie breakage | Don’t touch `proxy.ts` / `admin-auth` in v1.2 |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Calm luxury that removes all hierarchy | Brand feels empty; no clear next step | One hero signal + one CTA + one proof block |
| Removing sticky configurator summary on mobile | Can’t complete purchase without scroll search | Keep sticky/summary purchase affordance |
| Relabeling nav (“AI Destek” → vague “Yardım”) without destination | Dead ends | Point to `/iletisim` or WhatsApp with clear intent |
| Over-shortening checkout | Missing phone/address → failed WhatsApp fulfillment | Cut optional UI chrome, not Turkey-required fields |
| Cutting gallery / social proof entirely | Trust drop for high-AOV mats | Keep one proof surface (FAQ, featured, or galeri link) |

## "Looks Done But Isn't" Checklist

- [ ] **Homepage CMS matrix:** Every mounted `sectionKey` documented; every admin-visible home key has a consumer or is unpublished — verify in `/admin/icerik` vs `/`.
- [ ] **Primary CTA path:** Cold load `/` → reach `/olusturucu` or checkout in ≤2 purposeful taps — verify on mobile width.
- [ ] **WhatsApp popup blocker:** Submit `/odeme` with popups blocked — must show error or still open; never silent fail after “success.”
- [ ] **Order still persists:** Convex order (when configured) still created after WhatsApp open — verify network/`createOrder`.
- [ ] **Customer AI truly off:** No `ConfiguratorChat` / `SupportChat` mount; Header/Footer have no “AI Destek”; `POST /api/ai/chat` → 503 when flag off.
- [ ] **Admin AI still on:** `/admin/icerik` content generator still reachable when customer AI hidden.
- [ ] **FAQ/schema parity:** If FAQ UI exists, JSON-LD matches; if removed, schema removed/updated.
- [ ] **Vehicle SEO intact:** Sample `/arac/[slug]` renders; internal links not all deleted.
- [ ] **Motion + a11y:** `prefers-reduced-motion` shows content immediately; no stuck `.reveal`.
- [ ] **Mobile purchase:** Configurator add-to-cart reachable without hunting; cart drawer + checkout usable.
- [ ] **Admin chrome:** `/admin` unaffected by `.premium-site` simplification.
- [ ] **Cart hydration:** Refresh mid-cart; lines persist; no SSR mismatch flash that clears cart.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Conversion drop after section purge | MEDIUM | Re-mount last known primary CTA block from git; restore FAQ/trust; avoid full revert unless nav also broken |
| WhatsApp popup regression | HIGH (lost orders) | Hotfix submit handler to sync-open pattern; message users who saw success without WA if orders missing |
| AI “hidden” but billed | MEDIUM | Set `AI_FEATURES_ENABLED=false`; confirm 503s; rotate key if abuse suspected |
| CMS/admin confusion | LOW–MEDIUM | Unpublish orphan sections; align seed; note in admin UI |
| Stuck invisible reveal content | LOW | Add `reveal-visible` fallback or remove reveal wrappers; ship CSS hotfix |
| Mobile ATC regression | MEDIUM | Restore `ConfigSummary` sticky / equivalent bar |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| 1. CMS/section orphaning | **Phase 1 — Homepage composition & CMS inventory** | Diff section-key matrix; admin vs home screenshot pair |
| 2. Wrong CTA gravity after shortening | **Phase 1** + **Phase 5 — Conversion/mobile/SEO verification** | Scripted path home→config→checkout; compare CTA hierarchy |
| 3. WhatsApp `window.open` after await | **Phase 3 — Commerce flow shortening** | Popup-blocker-on submit test (mobile + desktop) |
| 4. Dead-but-shipped AI | **Phase 4 — Customer AI hide (server + chrome)** | curl 503; no AI nav labels; admin generator smoke |
| 5. SEO / FAQ / `/arac` breakage | **Phase 1** (FAQ decision) + **Phase 5** | View-source schema parity; sample vehicle URLs; sitemap sanity |
| 6. Motion diet brand/a11y failure | **Phase 2 — Motion diet** | Reduced-motion + brand visual check; no stuck opacity |
| 7. Configurator sticky / pricing truth | **Phase 3** + **Phase 5** | Mobile full-config add-to-cart; price equals `calculateMatPrice` |
| 8. Admin/shared chrome regression | Standing constraint in **Phases 2–4**; confirm **Phase 5** | `/admin/*` smoke; cart refresh test |

### Suggested phase order (for roadmap)

1. **Homepage composition & CMS inventory** — safest deletion boundary  
2. **Motion diet** — visual calm without touching money path  
3. **Commerce flow shortening** — configurator/cart/checkout with WhatsApp invariant  
4. **Customer AI hide** — server flag + chrome; preserve code & admin AI  
5. **Conversion / mobile / SEO verification** — catch redistribution, sticky, schema, admin

## Sources

- [We Made the UX 'Better' and Conversion Dropped (Atticus Li)](https://atticusli.com/blog/posts/we-made-the-ux-better-and-conversion-dropped/) — shorter pages redistribute attention to weaker paths *(confidence: MEDIUM)*
- [Why Conversion Rates Dip After Poorly Planned Redesigns](https://stephens.world/blogs/insights/why-conversion-rates-often-dip-after-poorly-planned-redesigns) — nav/muscle-memory and “what already converts” audits *(confidence: MEDIUM)*
- [FAQ Schema after May 2026 deprecation of rich results](https://www.quattr.com/blog/faq-schema-in-2026) — keep accurate Q&A content; unused schema not a ranking penalty *(confidence: MEDIUM)*
- [MDN `Window.open` / popup blockers](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) + checkout plugin advisories — sync open on user gesture *(confidence: MEDIUM)*
- [Feature flags: hiding UI isn’t authorization (CWE-602 / AuditBuffet AB-002251)](https://auditbuffet.com/patterns/ab-002251) + [ConfigCat flag mistakes](https://configcat.com/blog/feature-flag-best-practices/) *(confidence: MEDIUM)*
- Sticky ATC mobile evidence (mixed): [Traction Marketing test](https://tractionmarketing.nz/insights/unlocking-small-wins-that-scale-what-we-learned-from-testing-a-sticky-add-to-cart-button-on-mobile/), [RevenueFlows aggregate](https://revenueflows.ai/blog/shopify-sticky-add-to-cart-button-myth) *(confidence: MEDIUM — directional only)*
- **Codebase (project-specific, treat as authoritative for local behavior):**
  - `src/app/page.tsx` — live home section composition + FAQ JSON-LD
  - `convex/cmsSeedData.ts` — full `sectionKey` inventory vs mounted UI
  - `src/app/odeme/CheckoutPageClient.tsx` — sync WhatsApp `window.open` invariant
  - `src/lib/ai/config.ts` — `AI_FEATURES_ENABLED` default (enabled unless `"false"`/`"0"`)
  - `src/app/api/ai/chat/route.ts`, `support/route.ts`, `vehicle-match/route.ts` — server gates + rate limit
  - `src/components/configurator/ConfigSummary.tsx`, `MatConfigurator.tsx` — sticky / step UX
  - `src/components/Header.tsx`, `Footer.tsx` — `/destek`, “AI Destek” labels
  - `src/components/SmoothScroll.tsx`, `ScrollReveal.tsx`, `globals.css` — Lenis + reduced-motion
  - `CLAUDE.md`, `.planning/PROJECT.md` — preserve WhatsApp, configurator, SEO, admin; hide customer AI

---
*Pitfalls research for: OTO POLİK v1.2 Sade Lüks Deneyim — luxury storefront simplification*
*Researched: 2026-07-17*
