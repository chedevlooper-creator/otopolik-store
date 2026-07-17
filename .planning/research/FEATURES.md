# Feature Research

**Domain:** Premium-minimal commerce storefront simplification (Turkish single-SKU-category EVA mat brand; WhatsApp checkout; brownfield Next.js + Convex)
**Researched:** 2026-07-17
**Confidence:** MEDIUM (industry UX/CRO patterns + luxury ecommerce guidance cross-checked; Otopolik-specific mapping from live codebase inventory; no A/B data from this store yet)

**Milestone focus:** v1.2 Sade Lüks Deneyim — simplify all customer UI; delete/repetition-cut before adding; preserve OLED black/red, WhatsApp order flow, core mat configuration; hide customer AI UI, keep code.

## Feature Landscape

### Table Stakes (Users Expect These After a "Sade Lüks" Pass)

For a premium single-product-category store, "simplification" is judged by whether the path to order still feels complete — not by how many sections remain. Missing these after a declutter pass feels broken or cheap, not luxurious.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| One clear primary action from first viewport | Shoppers must know the next step in &lt;3 seconds (configure / WhatsApp) | LOW | Hero budget: brand + one headline + one short line + one primary CTA (+ optional secondary text link). No stats strips, promo chips, or floating badges on hero media |
| Intact configure → cart → WhatsApp path | Simplification must not break the revenue path | LOW | Preserve `MatConfigurator` core (vehicle, floor/edge color, extras, `calculateMatPrice`) + cart + `/odeme` WhatsApp handoff. Shorten chrome around it; do not invent a parallel checkout |
| Product/value clarity without section spam | Luxury buyers still need rational support for emotional decisions (material, fit, shipping) | LOW–MEDIUM | Prefer one concise proof block or FAQ over repeated "premium story" sections. Controlled clarity ≠ empty minimalism (Uxphoria luxury CRO) |
| Short checkout, WhatsApp-native | ~18% abandon for "checkout too long/complicated" (Baymard); this store already has no payment gateway | LOW | Keep required fields lean (name, phone, city, address; note optional). Avoid adding account creation, multi-step checkout wizard, or credit-card UI reactivation in v1.2 |
| Trust at decision points, not as wallpaper | High-ticket hesitation needs reassurance near CTA, not banner farms | LOW | Shipping / özel kesim / WhatsApp onay — one line or icon row near configurator CTA and checkout submit; not homepage promo ribbons |
| Mobile thumb path (sticky price + CTA) | Most sessions are mobile; long vertical configs drop off when price/CTA scroll away | MEDIUM | Sticky summary bar on `/olusturucu` and checkout primary button always reachable; large tap targets; no hover-only affordances |
| Consistent OLED black / Racing Red brand | Brand is the product experience; flattening to a generic dark template kills positioning | LOW | Keep `--brand-red`, OLED black surfaces, Syne/Instrument/JetBrains. Cut gold/glow/EVA spectacle density, not the identity |
| `prefers-reduced-motion` respected | Accessibility expectation + Turkish KVKK-adjacent "respectful UX" bar | LOW | Gate Lenis parallax, scroll-linked hero scale/blur, spring steppers. Reduced-motion users get static layout, same content hierarchy |
| Nav that matches real destinations | Dead or redundant links (`/#ozellikler` if section gone; AI Destek) erode trust | LOW | Cap primary nav ~5–7 items (luxury IA guidance). Hide `/destek` and AI entry points from customer chrome |
| AI surfaces hidden but recoverable | Milestone requirement: hide customer AI UI, retain code | LOW | Feature-flag / render-gate `ConfiguratorChat`, `VehicleMatchInput` customer chrome, `/destek` nav. Keep routes/API/admin AI intact for later re-enable |

### Differentiators (Competitive Advantage — Deletion Done Well)

Differentiation for v1.2 is **editorial restraint**, not new capabilities. Competitors (generic Turkish mat stores) stay noisy; premium-minimal brands win by looking confident enough to remove.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Ruthless homepage section budget | Feels like a flagship, not a landing-page template | MEDIUM | Current live home is already Hero → HomeConfiguratorShowcase → FeaturedProducts → Faq. Audit for *functional duplication*: showcase mini-configurator vs `/olusturucu` full flow. Prefer one deep configure entry + light social/FAQ proof over two config UIs |
| Micro-interaction over spectacle | Apple/Porsche cue: restraint signals quality | MEDIUM | Replace scroll-blur, multi-layer shine sweeps, and continuous Lenis theater with 2–3 intentional motions (CTA press, cart confirm, step change). Heavy animation is a documented luxury conversion drag (slow / complex feel) |
| Configurator step compression | Fewer decisions → higher completion for made-to-order | MEDIUM | Today: Aracınız → Taban → Kenar → Ekstralar (4). Strong candidate: merge Taban+Kenar into one "Renkler" step, or make Ekstralar an optional accordion on the color step. Keep live preview + sticky price (Cartier / Nissan light-configurator pattern: progressive disclosure + always-visible price) |
| Single conversion spine in nav | Less choice paralysis; brand confidence | LOW | Primary: Tasarla / Ürünler / Galeri / İletişim (+ Sepet). Demote or footer-only: Hakkımızda, Destek, dead hash links |
| Quiet cart & checkout chrome | Commitment stage should feel calm, not promotional | LOW | On `/sepet` and `/odeme`, strip marketing sections, secondary CTAs, and AI offers. Logo + support/WhatsApp escape hatch only (checkout-header simplification pattern) |
| Proof without collage clutter | Gallery/FAQ as curated evidence, not infinite masonry theater | LOW–MEDIUM | Galeri remains, but homepage should not re-embed a second full gallery experience. One featured strip max if needed |

### Anti-Features (Seem Premium / Helpful — Harm This Milestone)

Prioritize **not building** these. Deletion/simplification is the product work.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| More animations / 3D / glass layers to "feel luxury" | v1.0 equated polish with motion density | Over-animation slows mobile, triggers vestibular issues, and reads as insecure luxury (trying too hard). Documented conversion risk for heavy luxury visuals | Cut to intentional micro-interactions; keep OLED/red static craft |
| Re-adding removed homepage story blocks (LuxuryInterior / PremiumExperience / FeatureStrip style) | "Homepage feels empty" after declutter | Empty feeling is usually weak hierarchy or weak hero, not missing sections. Re-adding repeats the clutter problem | Fix hero composition and one proof block; do not restore orphan components to the page |
| Parallel mini-configurator + full configurator both heavily promoted | Showcase feels interactive and premium | Two config mental models → abandonment and inconsistent pricing UX if one drifts | One configure surface owns depth; homepage at most deep-links or a thin teaser |
| Re-surfacing customer AI (chat, Destek, vehicle-match chrome) for "modern" | v1.1 investment feels wasted if hidden | Competing entry points increase cognitive load; AI chat lengthens time-to-order for users who just want dropdowns; milestone explicitly hides customer AI | Keep code + admin AI; customer path is manual configure → WhatsApp. Revisit AI UX only after simplification metrics |
| Empty minimalism (strip shipping/FAQ/materials copy) | "Apple-like white space" misread as delete all text | Over-minimal luxury sites confuse value and raise hesitation (Uxphoria) | Sparse but specific: fit guarantee, EVA material, shipping/dispatch, WhatsApp onay — once each |
| Multi-step checkout wizard / account gate | Feels "enterprise" | Extra steps contradict WhatsApp-native flow; Baymard field-count research argues fewer fields, not more pages | Single-page checkout; guest-only (already true) |
| Enabling disabled credit-card payment UI | Looks more "real store" | Half-disabled payment options create distrust and support load | Keep WhatsApp + kapıda only until a real gateway ships in a later milestone |
| New promo banners, countdown timers, badge clusters | CRO folklore | Mass-market tactics cheapen luxury positioning | One quiet trust line near CTA |
| Auto-playing video / ambient motion behind copy | Cinematic brand films | Competes with CTA readability; battery/data cost on mobile TR networks | Static hero media or user-initiated play |
| Expanding nav with SEO landing dumps (`/arac/*` mega-menu) | SEO discovery | Primary nav overload; vehicle SEO pages can stay linked from products/search | Keep `/arac/[slug]` for SEO; do not promote dozens in header |

## Observable UX Outcomes (Success Signals)

Use these as acceptance criteria for roadmap phases — behavior, not "looks nicer."

| Outcome | Observable signal | Failure signal |
|---------|-------------------|----------------|
| Faster path to configure | From `/`, primary CTA lands on `/olusturucu` (or equivalent) without scrolling past ≥2 marketing sections | User must hunt past showcase + featured + FAQ before finding configure |
| Lower scroll tax on home | Above-the-fold communicates brand + offer + CTA; subsequent sections each have one job | Repeated "premium" claims / duplicate CTAs every screenful |
| Configurator completion feels short | ≤3 decision screens for core config (vehicle + colors + optional extras); price always visible on mobile | 4+ full-screen steps with price only at end; spring theater delaying taps |
| Checkout calm | `/odeme` is form + order summary + WhatsApp CTA; no AI, no promos, no competing nav | Header still offers 8 destinations during commit |
| AI invisible to customers | No Destek/AI Asistan entry in header/footer/configurator when flag off; direct `/destek` URL either redirects or soft-lands without chat chrome (policy choice) | Chat widgets, "AI Destek" footer label, VehicleMatchInput still prominent |
| Motion respects preference | With `prefers-reduced-motion: reduce`, no scroll-linked scale/blur/parallax; content still readable | Reduced-motion users get broken opacity/transform states |
| Brand preserved | First viewport still reads OTO POLİK (OLED + red) without nav | After removing nav, page could be any dark Shopify theme |
| Conversion risk contained | WhatsApp open-on-submit still sync during user gesture; cart line still keyed by config | Simplification refactors break popup timing or price source |

### Mobile implications

- Prefer vertical compression (fewer sections, shorter steps) over desktop-only multi-column showcases.
- Sticky configure/checkout CTAs beat another "luxury panel."
- Touch: color swatches and vehicle picks need ≥44px targets; remove hover-sheen as the only feedback.
- Network: fewer animated layers and autoplay media → better LCP/INP on mid-range Android (primary TR audience).

### Accessibility implications

- Reduced motion is mandatory for any retained Framer/Lenis effects.
- Do not rely on animation to communicate step progress — keep `aria-current` / text labels on stepper.
- Hiding AI must not leave focus traps or empty landmarks (`/destek` if kept as page).
- Contrast: platinum `--sand` on OLED must remain readable after glass/opacity cuts.

### Conversion risks (what simplification can break)

| Risk | Why it happens | Mitigation |
|------|----------------|------------|
| Over-deletion removes trust | FAQ/shipping cut entirely → hesitation on made-to-order | Keep one FAQ or shipping line near purchase |
| Showcase deletion without CTA upgrade | Removing `HomeConfiguratorShowcase` without strengthening hero → drop in configure starts | Hero primary CTA + optional featured products must clearly lead to `/olusturucu` |
| Merging color steps without preview | Users lose floor/edge mental model | Keep dual pickers on one screen with live preview |
| Hiding AI without flag discipline | Env mismatch shows broken chat or 404 Destek | Explicit `AI_FEATURES_ENABLED` / storefront chrome flag; soft-hide components, keep APIs |
| Checkout field over-trimming | Dropping city/address breaks fulfillment WhatsApp message | Do not remove fields required for dispatch; only remove UI chrome around them |

## Feature Dependencies

```
Homepage section budget
    └──requires──> Hero primary CTA clarity
    └──conflicts──> Dual heavy configurators (home showcase + /olusturucu both deep)
    └──enhances──> Nav link reduction (fewer hash/dead links)

Motion reduction
    └──requires──> prefers-reduced-motion policy on Hero / Lenis / stepper
    └──enhances──> Mobile performance perception
    └──conflicts──> "More glass/shine to compensate for deleted sections"

Configurator shorten
    └──requires──> Intact calculateMatPrice + cart addItem
    └──requires──> Live preview + sticky price/CTA
    └──enhances──> Cart/checkout calm (fewer confused configs)
    └──conflicts──> Customer AI chat as default entry (hides manual shorten wins)

Hide customer AI
    └──requires──> Feature flag / conditional render (keep code)
    └──requires──> Nav/footer label cleanup (Destek / AI Destek)
    └──conflicts──> Homepage or checkout AI upsell modules

Checkout/cart calm chrome
    └──requires──> WhatsApp sync-open pattern preserved
    └──enhances──> Trust-near-CTA (shipping line by submit)
    └──conflicts──> Promo strips / disabled card payment tease
```

### Dependency Notes

- **Homepage budget requires hero CTA clarity:** Deleting the home mini-configurator only works if the hero (and maybe featured products) unambiguously start configuration. Otherwise conversion regresses.
- **Configurator shorten requires pricing/cart invariants:** UI step merge is cosmetic; price must still come from `mat-pricing.ts`, line identity from `(slug, color/config)`.
- **Hide AI conflicts with using AI as a crutch for long flows:** Do not lengthen the manual stepper "because chat will fix it later." Shorten the manual path first.
- **Motion reduction conflicts with compensating spectacle:** After cutting sections, resist filling whitespace with new effects.

## MVP Definition

### Launch With (v1.2 — this milestone)

Minimum successful "Sade Lüks" ship — deletion and shortening first.

- [ ] Homepage section budget enforced (no redundant story/config blocks; one primary path) — essential to stop cognitive overload
- [ ] Hero first-viewport discipline (brand + headline + support + CTA; no overlay clutter) — brand test + conversion
- [ ] Motion diet (micro-interactions only; reduced-motion safe) — premium feel without performance/a11y tax
- [ ] Configurator shortened (≤3 decision surfaces; sticky price/CTA; core config preserved) — main drop-off risk
- [ ] Products / cart / checkout chrome shortened (no marketing theater on commit pages) — Baymard-aligned calm commit
- [ ] Customer AI UI hidden (code retained; nav cleaned) — explicit milestone requirement
- [ ] OLED/red brand + WhatsApp order flow unchanged — non-negotiable constraints

### Add After Validation (v1.2.x / next)

- [ ] Re-enable customer AI behind improved short manual flow — only if analytics show demand and short path already converts
- [ ] Homepage A/B: teaser vs no home configurator — needs traffic
- [ ] Further checkout field UX (phone mask polish, city autocomplete) — after chrome is calm

### Future Consideration (v2+)

- [ ] Real payment gateway (then redesign checkout; not a simplification project)
- [ ] Concierge booking / phone appointment luxury pattern — only if ASP and volume justify
- [ ] AR try-on / 3D cabin view — high cost; defer until core path is quiet and converting

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Hide customer AI chrome (keep code) | HIGH (focus) | LOW | P1 |
| Homepage delete/dedupe sections | HIGH | LOW–MEDIUM | P1 |
| Hero viewport discipline | HIGH | LOW | P1 |
| Motion diet + reduced-motion | HIGH | MEDIUM | P1 |
| Configurator step compression + sticky CTA | HIGH | MEDIUM | P1 |
| Cart/checkout calm chrome | HIGH | LOW | P1 |
| Nav reduction (≤7, remove Destek/dead links) | MEDIUM–HIGH | LOW | P1 |
| Trust line near CTA (not badge farm) | MEDIUM | LOW | P2 |
| Products listing/detail copy/layout tighten | MEDIUM | MEDIUM | P2 |
| Gallery homepage re-embed | LOW | LOW | P3 (avoid) |
| New animation systems | LOW (negative) | HIGH | P3 (anti) |
| Payment card UI | LOW now | HIGH | P3 (defer) |

**Priority key:**
- P1: Must have for v1.2 launch
- P2: Should have once P1 deletion lands
- P3: Nice / future / actively avoid in this milestone

## Competitor / Pattern Feature Analysis

| Feature | Mass-market TR mat stores | Luxury DTC / Apple-like flagships | OTO POLİK v1.2 approach |
|---------|---------------------------|-----------------------------------|-------------------------|
| Homepage length | Long: promo, features, testimonials, blog, chat | Short: hero, product, proof, buy | Short editorial; delete repetition before adding proof |
| Configurator | Often absent or WhatsApp-only | Guided few steps + live preview + sticky price | Keep config; shorten steps; hide AI chat overlay |
| Motion | Cheap sliders / popups | Sparse, intentional | Cut v1.0 spectacle density |
| Checkout | Form + bank transfer noise | Minimal fields, calm chrome | Keep WhatsApp fields; strip chrome |
| Trust | Badge walls, countdowns | Quiet policy near CTA | One quiet trust cluster |
| AI chat | Generic widgets | Rare on flagship configure path | Hide customer AI; retain code |

## Sources

- Live codebase inventory: `src/app/page.tsx` (Hero, HomeConfiguratorShowcase, FeaturedProducts, Faq); unused home orphans `LuxuryInterior`, `PremiumExperience`, `FeatureStrip`; `MatConfigurator` 4-step labels; `Header` 8-link nav incl. Destek; `CheckoutPageClient` WhatsApp/kapıda fields; AI surfaces `ConfiguratorChat`, `SupportChat`, `/destek`
- `.planning/PROJECT.md` — v1.2 Sade Lüks goals and constraints
- Uxphoria — *How to Improve Conversion for Luxury Ecommerce Brands* (controlled clarity vs empty minimalism; heavy visuals/animation as conversion drag) — MEDIUM confidence
- Hubako / KN Digital luxury ecommerce UX roundups — nav limits, whitespace, avoid popup/badge clutter — MEDIUM confidence
- Baymard Institute — checkout complexity abandonment (~18% cite "too long/complicated"); field minimization guidance (target ~6–8 vs bloated averages) — MEDIUM confidence (verified web summaries; full Baymard paywall)
- Configurator UX: Cartier progressive disclosure; Nissan light configurator (phased &gt; all-at-once; price each step; mobile gaps); Vervaunt configurable-product sticky price/CTA — MEDIUM confidence
- Industry cart abandonment ~70% average (multiple secondary citations of Baymard meta) — use as context, not Otopolik baseline — LOW for this store specifically

---
*Feature research for: OTO POLİK storefront simplification (v1.2 Sade Lüks Deneyim)*
*Researched: 2026-07-17*
*Downstream use: requirements scoping — prefer deletion/simplification over new features*
