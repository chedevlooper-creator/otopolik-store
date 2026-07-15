// =============================================================
// OTO POLİK — CMS Sunucu Veri Katmanı
// =============================================================

import "server-only";
import { getConvexClient, isConvexConfigured, api } from "@/lib/convex-server";
import { getAdminConvexKey } from "@/lib/admin-convex-key";
import {
  DEFAULT_FAQS,
  DEFAULT_PAGES,
  DEFAULT_PROMOS,
  DEFAULT_SECTIONS,
  DEFAULT_SITE_SEO,
  DEFAULT_TESTIMONIALS,
  getDefaultPage,
  getDefaultPromos,
  getDefaultSections,
  type ContentPage,
  type ContentSection,
  type FaqItem,
  type PromoItem,
  type SiteSeo,
  type TestimonialItem,
} from "@/lib/cms-defaults";

export type { ContentPage, ContentSection, FaqItem, PromoItem, SiteSeo, TestimonialItem };
export { interpolateCmsText } from "@/lib/cms-defaults";

function mapSeo(row: Partial<SiteSeo> | null | undefined): SiteSeo {
  if (!row) return DEFAULT_SITE_SEO;
  return {
    siteName: row.siteName ?? DEFAULT_SITE_SEO.siteName,
    tagline: row.tagline ?? DEFAULT_SITE_SEO.tagline,
    defaultDescription:
      row.defaultDescription ?? DEFAULT_SITE_SEO.defaultDescription,
    siteUrl: row.siteUrl ?? DEFAULT_SITE_SEO.siteUrl,
    defaultOgImage: row.defaultOgImage ?? DEFAULT_SITE_SEO.defaultOgImage,
    locale: row.locale ?? DEFAULT_SITE_SEO.locale,
    titleTemplate: row.titleTemplate ?? DEFAULT_SITE_SEO.titleTemplate,
    ogImageAlt: row.ogImageAlt ?? DEFAULT_SITE_SEO.ogImageAlt,
  };
}

export async function getSiteSeo(): Promise<{
  seo: SiteSeo;
  source: "convex" | "fallback";
}> {
  const client = getConvexClient();
  if (!isConvexConfigured() || !client) {
    return { seo: DEFAULT_SITE_SEO, source: "fallback" };
  }
  try {
    const row = await client.query(api.cms.getSiteSeo, {});
    return { seo: mapSeo(row), source: row ? "convex" : "fallback" };
  } catch (error) {
    console.error("cms siteSeo fetch error:", error);
    return { seo: DEFAULT_SITE_SEO, source: "fallback" };
  }
}

export async function getContentPage(slug: string): Promise<{
  page: ContentPage | null;
  sections: ContentSection[];
  source: "convex" | "fallback";
}> {
  const fallbackPage = getDefaultPage(slug);
  const fallbackSections = getDefaultSections(slug);
  const client = getConvexClient();
  if (!isConvexConfigured() || !client) {
    return {
      page: fallbackPage,
      sections: fallbackSections,
      source: "fallback",
    };
  }
  try {
    const [page, sections] = await Promise.all([
      client.query(api.cms.getPageBySlug, { slug }),
      client.query(api.cms.listSectionsByPage, { pageSlug: slug }),
    ]);
    if (!page) {
      return {
        page: fallbackPage,
        sections: fallbackSections,
        source: "fallback",
      };
    }
    return {
      page: {
        slug: page.slug,
        path: page.path,
        pageType: page.pageType,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        title: page.title,
        description: page.description,
        isPublished: page.isPublished,
        sortOrder: page.sortOrder,
      },
      sections: sections.map((s) => ({
        pageSlug: s.pageSlug,
        sectionKey: s.sectionKey,
        sortOrder: s.sortOrder,
        eyebrow: s.eyebrow,
        title: s.title,
        subtitle: s.subtitle,
        body: s.body,
        ctaLabel: s.ctaLabel,
        ctaHref: s.ctaHref,
        imageUrl: s.imageUrl,
        imageAlt: s.imageAlt,
        iconKey: s.iconKey,
        isPublished: s.isPublished,
      })),
      source: "convex",
    };
  } catch (error) {
    console.error("cms page fetch error:", error);
    return {
      page: fallbackPage,
      sections: fallbackSections,
      source: "fallback",
    };
  }
}

export async function getFaqs(): Promise<{
  items: FaqItem[];
  source: "convex" | "fallback";
}> {
  const client = getConvexClient();
  if (!isConvexConfigured() || !client) {
    return { items: DEFAULT_FAQS, source: "fallback" };
  }
  try {
    const rows = await client.query(api.cms.listFaqs, {});
    if (!rows.length) return { items: DEFAULT_FAQS, source: "fallback" };
    return {
      items: rows.map((r) => ({
        id: String(r._id),
        sortOrder: r.sortOrder,
        question: r.question,
        answer: r.answer,
        isPublished: r.isPublished,
      })),
      source: "convex",
    };
  } catch (error) {
    console.error("cms faq fetch error:", error);
    return { items: DEFAULT_FAQS, source: "fallback" };
  }
}

export async function getPromos(
  kind: PromoItem["kind"]
): Promise<{ items: PromoItem[]; source: "convex" | "fallback" }> {
  const client = getConvexClient();
  if (!isConvexConfigured() || !client) {
    return { items: getDefaultPromos(kind), source: "fallback" };
  }
  try {
    const rows = await client.query(api.cms.listPromosByKind, { kind });
    if (!rows.length) {
      return { items: getDefaultPromos(kind), source: "fallback" };
    }
    return {
      items: rows.map((r) => ({
        id: String(r._id),
        kind: r.kind,
        sortOrder: r.sortOrder,
        label: r.label,
        detail: r.detail,
        href: r.href,
        iconKey: r.iconKey,
        isPublished: r.isPublished,
      })),
      source: "convex",
    };
  } catch (error) {
    console.error("cms promo fetch error:", error);
    return { items: getDefaultPromos(kind), source: "fallback" };
  }
}

export async function getTestimonials(): Promise<{
  items: TestimonialItem[];
  source: "convex" | "fallback";
}> {
  const client = getConvexClient();
  if (!isConvexConfigured() || !client) {
    return { items: DEFAULT_TESTIMONIALS, source: "fallback" };
  }
  try {
    const rows = await client.query(api.cms.listTestimonials, {});
    if (!rows.length) {
      return { items: DEFAULT_TESTIMONIALS, source: "fallback" };
    }
    return {
      items: rows.map((r) => ({
        id: String(r._id),
        sortOrder: r.sortOrder,
        name: r.name,
        location: r.location,
        rating: r.rating,
        text: r.text,
        isPublished: r.isPublished,
      })),
      source: "convex",
    };
  } catch (error) {
    console.error("cms testimonials fetch error:", error);
    return { items: DEFAULT_TESTIMONIALS, source: "fallback" };
  }
}

export async function getHomeChromeContent(): Promise<{
  header: ContentSection | null;
  footer: ContentSection | null;
  source: "convex" | "fallback";
}> {
  const { sections, source } = await getContentPage("home");
  return {
    header:
      sections.find((s) => s.sectionKey === "chrome-header") ??
      DEFAULT_SECTIONS.find((s) => s.sectionKey === "chrome-header") ??
      null,
    footer:
      sections.find((s) => s.sectionKey === "chrome-footer") ??
      DEFAULT_SECTIONS.find((s) => s.sectionKey === "chrome-footer") ??
      null,
    source,
  };
}

export async function saveSiteSeo(
  input: SiteSeo
): Promise<{ ok: true } | { ok: false; message: string }> {
  const client = getConvexClient();
  if (!isConvexConfigured() || !client) {
    return { ok: false, message: "Convex bağlı değil." };
  }
  try {
    await client.mutation(api.cms.updateSiteSeo, {
      adminKey: getAdminConvexKey(),
      ...input,
    });
    return { ok: true };
  } catch (error) {
    console.error("cms seo save error:", error);
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "SEO kaydı başarısız oldu.",
    };
  }
}

export async function saveContentPage(
  page: ContentPage
): Promise<{ ok: true } | { ok: false; message: string }> {
  const client = getConvexClient();
  if (!isConvexConfigured() || !client) {
    return { ok: false, message: "Convex bağlı değil." };
  }
  try {
    await client.mutation(api.cms.upsertPage, {
      adminKey: getAdminConvexKey(),
      ...page,
    });
    return { ok: true };
  } catch (error) {
    console.error("cms page save error:", error);
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Sayfa kaydı başarısız oldu.",
    };
  }
}

export async function saveContentSection(
  section: ContentSection
): Promise<{ ok: true } | { ok: false; message: string }> {
  const client = getConvexClient();
  if (!isConvexConfigured() || !client) {
    return { ok: false, message: "Convex bağlı değil." };
  }
  try {
    await client.mutation(api.cms.upsertSection, {
      adminKey: getAdminConvexKey(),
      ...section,
    });
    return { ok: true };
  } catch (error) {
    console.error("cms section save error:", error);
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Bölüm kaydı başarısız oldu.",
    };
  }
}

export async function saveFaqItem(
  item: FaqItem
): Promise<{ ok: true } | { ok: false; message: string }> {
  const client = getConvexClient();
  if (!isConvexConfigured() || !client) {
    return { ok: false, message: "Convex bağlı değil." };
  }
  try {
    const args: {
      adminKey: string;
      id?: never;
      sortOrder: number;
      question: string;
      answer: string;
      isPublished: boolean;
    } = {
      adminKey: getAdminConvexKey(),
      sortOrder: item.sortOrder,
      question: item.question,
      answer: item.answer,
      isPublished: item.isPublished,
    };
    if (item.id) {
      Object.assign(args, { id: item.id });
    }
    await client.mutation(api.cms.upsertFaq, args);
    return { ok: true };
  } catch (error) {
    console.error("cms faq save error:", error);
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "SSS kaydı başarısız oldu.",
    };
  }
}

export async function savePromoItem(
  item: PromoItem
): Promise<{ ok: true } | { ok: false; message: string }> {
  const client = getConvexClient();
  if (!isConvexConfigured() || !client) {
    return { ok: false, message: "Convex bağlı değil." };
  }
  try {
    const args = {
      adminKey: getAdminConvexKey(),
      kind: item.kind,
      sortOrder: item.sortOrder,
      label: item.label,
      detail: item.detail,
      href: item.href,
      iconKey: item.iconKey,
      isPublished: item.isPublished,
      ...(item.id ? { id: item.id as never } : {}),
    };
    await client.mutation(api.cms.upsertPromo, args);
    return { ok: true };
  } catch (error) {
    console.error("cms promo save error:", error);
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Promo kaydı başarısız oldu.",
    };
  }
}

export async function saveTestimonialItem(
  item: TestimonialItem
): Promise<{ ok: true } | { ok: false; message: string }> {
  const client = getConvexClient();
  if (!isConvexConfigured() || !client) {
    return { ok: false, message: "Convex bağlı değil." };
  }
  try {
    const args = {
      adminKey: getAdminConvexKey(),
      sortOrder: item.sortOrder,
      name: item.name,
      location: item.location,
      rating: item.rating,
      text: item.text,
      isPublished: item.isPublished,
      ...(item.id ? { id: item.id as never } : {}),
    };
    await client.mutation(api.cms.upsertTestimonial, args);
    return { ok: true };
  } catch (error) {
    console.error("cms testimonial save error:", error);
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Yorum kaydı başarısız oldu.",
    };
  }
}

export { DEFAULT_PAGES, DEFAULT_SECTIONS, DEFAULT_FAQS, DEFAULT_PROMOS };
