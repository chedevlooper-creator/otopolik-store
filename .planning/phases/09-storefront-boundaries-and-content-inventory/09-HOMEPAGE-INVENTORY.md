# Phase 9 Homepage Content Inventory

This inventory records the current homepage composition for Phase 10. Phase 9 does not change mounts in `src/app/page.tsx`, edit `Hero.tsx`, delete Convex rows, or remove `CONTENT_SECTIONS_SEED` entries.

| sectionKey | mounted_on_home | consumer_component | keep_or_unmount_candidate | reversible_notes |
|---|---|---|---|---|
| `hero` | Yes | `Hero` | Keep candidate | Passed from `src/app/page.tsx`; retain the CMS row even if Phase 10 changes presentation. |
| `hero-secondary-cta` | Yes | `Hero` | Review candidate | Passed to the existing Hero secondary CTA; do not edit the user's `Hero.tsx` work. |
| `featured` | Yes | `FeaturedProducts` | Keep candidate | Mounted directly from the `home` section collection. |
| `faq` | Yes | `Faq` | Keep candidate | Supplies the FAQ heading; FAQ items are fetched separately. |
| `faq-sidebar` | Yes | `Faq` | Review candidate | Supplies sidebar/contact copy and works with the settings-derived WhatsApp link. |
| `chrome-header` | Yes, via layout chrome | `Header` through `getHomeChromeContent()` | Keep candidate | Not mounted by `page.tsx`; resolved from home CMS content with a static fallback. |
| `chrome-footer` | Yes, via layout chrome | `Footer` through `getHomeChromeContent()` | Keep candidate | Not mounted by `page.tsx`; resolved from home CMS content with a static fallback. |
| `steps` | No; seeded only | None on homepage | Unmount candidate | Seed remains available for reversible remounting. |
| `step-01` | No; seeded only | None on homepage | Unmount candidate | Historical how-it-works step; preserve its seed row. |
| `step-02` | No; seeded only | None on homepage | Unmount candidate | Historical how-it-works step; preserve its seed row. |
| `step-03` | No; seeded only | None on homepage | Unmount candidate | Historical how-it-works step; preserve its seed row. |
| `showcase` | No; seeded only | None on homepage | Unmount candidate | Showcase heading/body remain available for a future remount. |
| `showcase-gallery-01` | No; seeded only | None on homepage | Unmount candidate | Preserve gallery media metadata in the seed. |
| `showcase-gallery-02` | No; seeded only | None on homepage | Unmount candidate | Preserve gallery media metadata in the seed. |
| `showcase-gallery-03` | No; seeded only | None on homepage | Unmount candidate | Preserve gallery media metadata in the seed. |
| `showcase-gallery-04` | No; seeded only | None on homepage | Unmount candidate | Preserve gallery media metadata in the seed. |
| `showcase-feature-01` | No; seeded only | None on homepage | Unmount candidate | Preserve material-feature copy in the seed. |
| `showcase-feature-02` | No; seeded only | None on homepage | Unmount candidate | Preserve material-feature copy in the seed. |
| `showcase-feature-03` | No; seeded only | None on homepage | Unmount candidate | Preserve material-feature copy in the seed. |
| `showcase-feature-04` | No; seeded only | None on homepage | Unmount candidate | Preserve material-feature copy in the seed. |
| `testimonials` | No on homepage; seeded | `Testimonials` on product detail | Review candidate | The home seed is not mounted by `page.tsx`; testimonial UI is used elsewhere and must not be deleted. |
| *(none — hardcoded)* | Yes | `HomeConfiguratorShowcase` | Review candidate | The homepage mini-configurator has no CMS `sectionKey`; Phase 10 can unmount the component without a data deletion. |
| *(none — orphan code)* | No | `FeatureStrip` | Unmount candidate | Unmounted component inventory only; no CMS row or production deletion in Phase 9. |
| *(none — orphan code)* | No | `LuxuryInterior` | Unmount candidate | Unmounted component inventory only; no CMS row or production deletion in Phase 9. |
| *(none — orphan code)* | No | `PremiumExperience` | Unmount candidate | Unmounted component inventory only; no CMS row or production deletion in Phase 9. |

## Phase 10 handoff

- Phase 10 owns all actual homepage unmount decisions and changes to `src/app/page.tsx`.
- Composition changes should remove React mounts only; CMS fallback data, Convex rows, and seed entries remain intact so every decision is reversible.
- `HomeConfiguratorShowcase` and the orphan home components have no CMS keys, so they are tracked as code inventory rather than seeded content.
- `chrome-header` and `chrome-footer` belong to shared layout chrome, not the homepage component tree.
