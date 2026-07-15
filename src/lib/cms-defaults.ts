// =============================================================
// OTO POLİK — CMS Varsayılan Metinler (Convex yoksa fallback)
// =============================================================

import {
  CONTENT_PAGES_SEED,
  CONTENT_SECTIONS_SEED,
  FAQ_SEED,
  PROMO_SEED,
  SITE_SEO_SEED,
  TESTIMONIALS_SEED,
  type SeedPage,
  type SeedSection,
} from "../../convex/cmsSeedData";

export type SiteSeo = {
  siteName: string;
  tagline: string;
  defaultDescription: string;
  siteUrl: string;
  defaultOgImage: string;
  locale: string;
  titleTemplate: string;
  ogImageAlt: string;
};

export type ContentPage = {
  slug: string;
  path: string;
  pageType: "marketing" | "legal" | "utility";
  metaTitle: string;
  metaDescription: string;
  title: string;
  description: string;
  isPublished: boolean;
  sortOrder: number;
};

export type ContentSection = {
  pageSlug: string;
  sectionKey: string;
  sortOrder: number;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
  imageAlt?: string;
  iconKey?: string;
  isPublished: boolean;
};

export type FaqItem = {
  id?: string;
  sortOrder: number;
  question: string;
  answer: string;
  isPublished: boolean;
};

export type PromoItem = {
  id?: string;
  kind: "marquee" | "trust" | "header_badge" | "footer_cta";
  sortOrder: number;
  label: string;
  detail?: string;
  href?: string;
  iconKey?: string;
  isPublished: boolean;
};

export type TestimonialItem = {
  id?: string;
  sortOrder: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  isPublished: boolean;
};

export type CmsTokens = {
  siteName?: string;
  freeShippingThreshold?: number;
  shippingFee?: number;
  estimatedDispatch?: string;
  phoneDisplay?: string;
  email?: string;
  address?: string;
};

export const DEFAULT_SITE_SEO: SiteSeo = { ...SITE_SEO_SEED };

export const DEFAULT_PAGES: ContentPage[] = CONTENT_PAGES_SEED.map((p: SeedPage) => ({
  ...p,
  isPublished: true,
}));

export const DEFAULT_SECTIONS: ContentSection[] = CONTENT_SECTIONS_SEED.map(
  (s: SeedSection) => ({
    ...s,
    isPublished: true,
  })
);

export const DEFAULT_FAQS: FaqItem[] = FAQ_SEED.map((f) => ({
  ...f,
  isPublished: true,
}));

export const DEFAULT_PROMOS: PromoItem[] = PROMO_SEED.map((p) => ({
  ...p,
  isPublished: true,
}));

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = TESTIMONIALS_SEED.map(
  (t) => ({
    ...t,
    isPublished: true,
  })
);

export function interpolateCmsText(
  template: string,
  tokens: CmsTokens = {}
): string {
  const map: Record<string, string> = {
    siteName: tokens.siteName ?? DEFAULT_SITE_SEO.siteName,
    freeShippingThreshold:
      tokens.freeShippingThreshold?.toLocaleString("tr-TR") ?? "3.500",
    shippingFee: String(tokens.shippingFee ?? 99),
    estimatedDispatch: tokens.estimatedDispatch ?? "1-3 iş günü",
    phoneDisplay: tokens.phoneDisplay ?? "",
    email: tokens.email ?? "",
    address: tokens.address ?? "",
  };
  return template.replace(/\{(\w+)\}/g, (_, key: string) => map[key] ?? "");
}

export function getDefaultPage(slug: string): ContentPage | null {
  return DEFAULT_PAGES.find((p) => p.slug === slug) ?? null;
}

export function getDefaultSections(pageSlug: string): ContentSection[] {
  return DEFAULT_SECTIONS.filter((s) => s.pageSlug === pageSlug).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}

export function getDefaultSection(
  pageSlug: string,
  sectionKey: string
): ContentSection | null {
  return (
    DEFAULT_SECTIONS.find(
      (s) => s.pageSlug === pageSlug && s.sectionKey === sectionKey
    ) ?? null
  );
}

export function getDefaultPromos(
  kind: PromoItem["kind"]
): PromoItem[] {
  return DEFAULT_PROMOS.filter((p) => p.kind === kind).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}
