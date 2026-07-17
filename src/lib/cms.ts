// =============================================================
// OTO POLİK — Yerel CMS okuma + Convex yönetim yazma katmanı
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

export async function getSiteSeo(): Promise<{
  seo: SiteSeo;
  source: "convex" | "fallback";
}> {
  return { seo: DEFAULT_SITE_SEO, source: "fallback" };
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
    const pageRow = await client.query(api.cms.getPageBySlug, { slug });
    if (!pageRow) {
      return {
        page: fallbackPage,
        sections: fallbackSections,
        source: "fallback",
      };
    }

    const sectionRows = await client.query(api.cms.listSectionsByPage, {
      pageSlug: slug,
    });
    const { _id, _creationTime, updatedAt, ...page } = pageRow;
    void _id;
    void _creationTime;
    void updatedAt;

    const sections = sectionRows.map((row) => {
      const {
        _id: sectionId,
        _creationTime: sectionCreationTime,
        updatedAt: sectionUpdatedAt,
        ...section
      } = row;
      void sectionId;
      void sectionCreationTime;
      void sectionUpdatedAt;
      return section;
    });

    return { page, sections, source: "convex" };
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
    const items = rows.map(
      ({ _id, _creationTime, updatedAt, ...item }): FaqItem => {
        void _creationTime;
        void updatedAt;
        return { id: String(_id), ...item };
      }
    );
    return { items, source: "convex" };
  } catch (error) {
    console.error("cms faq fetch error:", error);
    return { items: DEFAULT_FAQS, source: "fallback" };
  }
}

export async function getPromos(
  kind: PromoItem["kind"]
): Promise<{ items: PromoItem[]; source: "convex" | "fallback" }> {
  return { items: getDefaultPromos(kind), source: "fallback" };
}

export async function getTestimonials(): Promise<{
  items: TestimonialItem[];
  source: "convex" | "fallback";
}> {
  return { items: DEFAULT_TESTIMONIALS, source: "fallback" };
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
