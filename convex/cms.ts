// =============================================================
// OTO POLİK — CMS Convex API
// =============================================================

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdminKey } from "./lib/adminAuth";
import {
  contentPageDocValidator,
  contentSectionDocValidator,
  faqItemDocValidator,
  pageTypeValidator,
  promoItemDocValidator,
  promoKindValidator,
  siteSeoDocValidator,
  testimonialDocValidator,
} from "./lib/validators";
import {
  CONTENT_PAGES_SEED,
  CONTENT_SECTIONS_SEED,
  FAQ_SEED,
  PROMO_SEED,
  SITE_SEO_SEED,
  TESTIMONIALS_SEED,
} from "./cmsSeedData";

const SEO_SINGLETON = "seo" as const;

export const getSiteSeo = query({
  args: {},
  returns: v.union(siteSeoDocValidator, v.null()),
  handler: async (ctx) => {
    return await ctx.db
      .query("siteSeo")
      .withIndex("by_singleton", (q) => q.eq("singleton", SEO_SINGLETON))
      .unique();
  },
});

export const updateSiteSeo = mutation({
  args: {
    adminKey: v.string(),
    siteName: v.string(),
    tagline: v.string(),
    defaultDescription: v.string(),
    siteUrl: v.string(),
    defaultOgImage: v.string(),
    locale: v.string(),
    titleTemplate: v.string(),
    ogImageAlt: v.string(),
  },
  returns: v.id("siteSeo"),
  handler: async (ctx, { adminKey, ...fields }) => {
    requireAdminKey(adminKey);
    const existing = await ctx.db
      .query("siteSeo")
      .withIndex("by_singleton", (q) => q.eq("singleton", SEO_SINGLETON))
      .unique();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { ...fields, updatedAt: now });
      return existing._id;
    }
    return await ctx.db.insert("siteSeo", {
      singleton: SEO_SINGLETON,
      ...fields,
      updatedAt: now,
    });
  },
});

export const getPageBySlug = query({
  args: { slug: v.string() },
  returns: v.union(contentPageDocValidator, v.null()),
  handler: async (ctx, { slug }) => {
    const page = await ctx.db
      .query("contentPages")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!page || !page.isPublished) return null;
    return page;
  },
});

export const listPublishedPages = query({
  args: {},
  returns: v.array(contentPageDocValidator),
  handler: async (ctx) => {
    const pages = await ctx.db
      .query("contentPages")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .collect();
    return pages.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const listAllPages = query({
  args: { adminKey: v.string() },
  returns: v.array(contentPageDocValidator),
  handler: async (ctx, { adminKey }) => {
    requireAdminKey(adminKey);
    const pages = await ctx.db.query("contentPages").collect();
    return pages.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const upsertPage = mutation({
  args: {
    adminKey: v.string(),
    slug: v.string(),
    path: v.string(),
    pageType: pageTypeValidator,
    metaTitle: v.string(),
    metaDescription: v.string(),
    title: v.string(),
    description: v.string(),
    isPublished: v.boolean(),
    sortOrder: v.number(),
  },
  returns: v.id("contentPages"),
  handler: async (ctx, { adminKey, slug, ...fields }) => {
    requireAdminKey(adminKey);
    const existing = await ctx.db
      .query("contentPages")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { ...fields, updatedAt: now });
      return existing._id;
    }
    return await ctx.db.insert("contentPages", {
      slug,
      ...fields,
      updatedAt: now,
    });
  },
});

export const listSectionsByPage = query({
  args: { pageSlug: v.string() },
  returns: v.array(contentSectionDocValidator),
  handler: async (ctx, { pageSlug }) => {
    const sections = await ctx.db
      .query("contentSections")
      .withIndex("by_page_sort", (q) => q.eq("pageSlug", pageSlug))
      .collect();
    return sections
      .filter((s) => s.isPublished)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const listAllSectionsByPage = query({
  args: { adminKey: v.string(), pageSlug: v.string() },
  returns: v.array(contentSectionDocValidator),
  handler: async (ctx, { adminKey, pageSlug }) => {
    requireAdminKey(adminKey);
    const sections = await ctx.db
      .query("contentSections")
      .withIndex("by_page_sort", (q) => q.eq("pageSlug", pageSlug))
      .collect();
    return sections.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const upsertSection = mutation({
  args: {
    adminKey: v.string(),
    pageSlug: v.string(),
    sectionKey: v.string(),
    sortOrder: v.number(),
    eyebrow: v.optional(v.string()),
    title: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    body: v.string(),
    ctaLabel: v.optional(v.string()),
    ctaHref: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageAlt: v.optional(v.string()),
    iconKey: v.optional(v.string()),
    isPublished: v.boolean(),
  },
  returns: v.id("contentSections"),
  handler: async (ctx, { adminKey, pageSlug, sectionKey, ...fields }) => {
    requireAdminKey(adminKey);
    const existing = await ctx.db
      .query("contentSections")
      .withIndex("by_page_key", (q) =>
        q.eq("pageSlug", pageSlug).eq("sectionKey", sectionKey)
      )
      .unique();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { ...fields, updatedAt: now });
      return existing._id;
    }
    return await ctx.db.insert("contentSections", {
      pageSlug,
      sectionKey,
      ...fields,
      updatedAt: now,
    });
  },
});

export const listFaqs = query({
  args: {},
  returns: v.array(faqItemDocValidator),
  handler: async (ctx) => {
    const items = await ctx.db.query("faqItems").withIndex("by_sort").collect();
    return items
      .filter((i) => i.isPublished)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const listAllFaqs = query({
  args: { adminKey: v.string() },
  returns: v.array(faqItemDocValidator),
  handler: async (ctx, { adminKey }) => {
    requireAdminKey(adminKey);
    const items = await ctx.db.query("faqItems").collect();
    return items.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const upsertFaq = mutation({
  args: {
    adminKey: v.string(),
    id: v.optional(v.id("faqItems")),
    sortOrder: v.number(),
    question: v.string(),
    answer: v.string(),
    isPublished: v.boolean(),
  },
  returns: v.id("faqItems"),
  handler: async (ctx, { adminKey, id, ...fields }) => {
    requireAdminKey(adminKey);
    const now = Date.now();
    if (id) {
      const existing = await ctx.db.get(id);
      if (!existing) throw new Error("SSS kaydı bulunamadı");
      await ctx.db.patch(id, { ...fields, updatedAt: now });
      return id;
    }
    return await ctx.db.insert("faqItems", { ...fields, updatedAt: now });
  },
});

export const removeFaq = mutation({
  args: { adminKey: v.string(), id: v.id("faqItems") },
  returns: v.null(),
  handler: async (ctx, { adminKey, id }) => {
    requireAdminKey(adminKey);
    await ctx.db.delete(id);
    return null;
  },
});

export const listPromosByKind = query({
  args: { kind: promoKindValidator },
  returns: v.array(promoItemDocValidator),
  handler: async (ctx, { kind }) => {
    const items = await ctx.db
      .query("promoItems")
      .withIndex("by_kind_sort", (q) => q.eq("kind", kind))
      .collect();
    return items
      .filter((i) => i.isPublished)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const listAllPromos = query({
  args: { adminKey: v.string() },
  returns: v.array(promoItemDocValidator),
  handler: async (ctx, { adminKey }) => {
    requireAdminKey(adminKey);
    const items = await ctx.db.query("promoItems").collect();
    return items.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const upsertPromo = mutation({
  args: {
    adminKey: v.string(),
    id: v.optional(v.id("promoItems")),
    kind: promoKindValidator,
    sortOrder: v.number(),
    label: v.string(),
    detail: v.optional(v.string()),
    href: v.optional(v.string()),
    iconKey: v.optional(v.string()),
    isPublished: v.boolean(),
  },
  returns: v.id("promoItems"),
  handler: async (ctx, { adminKey, id, ...fields }) => {
    requireAdminKey(adminKey);
    const now = Date.now();
    if (id) {
      const existing = await ctx.db.get(id);
      if (!existing) throw new Error("Promo kaydı bulunamadı");
      await ctx.db.patch(id, { ...fields, updatedAt: now });
      return id;
    }
    return await ctx.db.insert("promoItems", { ...fields, updatedAt: now });
  },
});

export const removePromo = mutation({
  args: { adminKey: v.string(), id: v.id("promoItems") },
  returns: v.null(),
  handler: async (ctx, { adminKey, id }) => {
    requireAdminKey(adminKey);
    await ctx.db.delete(id);
    return null;
  },
});

export const listTestimonials = query({
  args: {},
  returns: v.array(testimonialDocValidator),
  handler: async (ctx) => {
    const items = await ctx.db
      .query("testimonials")
      .withIndex("by_sort")
      .collect();
    return items
      .filter((i) => i.isPublished)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const listAllTestimonials = query({
  args: { adminKey: v.string() },
  returns: v.array(testimonialDocValidator),
  handler: async (ctx, { adminKey }) => {
    requireAdminKey(adminKey);
    const items = await ctx.db.query("testimonials").collect();
    return items.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const upsertTestimonial = mutation({
  args: {
    adminKey: v.string(),
    id: v.optional(v.id("testimonials")),
    sortOrder: v.number(),
    name: v.string(),
    location: v.string(),
    rating: v.number(),
    text: v.string(),
    isPublished: v.boolean(),
  },
  returns: v.id("testimonials"),
  handler: async (ctx, { adminKey, id, rating, ...fields }) => {
    requireAdminKey(adminKey);
    if (rating < 1 || rating > 5) {
      throw new Error("Puan 1–5 arasında olmalıdır");
    }
    const now = Date.now();
    if (id) {
      const existing = await ctx.db.get(id);
      if (!existing) throw new Error("Yorum bulunamadı");
      await ctx.db.patch(id, { ...fields, rating, updatedAt: now });
      return id;
    }
    return await ctx.db.insert("testimonials", {
      ...fields,
      rating,
      updatedAt: now,
    });
  },
});

export const removeTestimonial = mutation({
  args: { adminKey: v.string(), id: v.id("testimonials") },
  returns: v.null(),
  handler: async (ctx, { adminKey, id }) => {
    requireAdminKey(adminKey);
    await ctx.db.delete(id);
    return null;
  },
});

export const seedCms = mutation({
  args: { adminKey: v.string() },
  returns: v.object({
    pages: v.number(),
    sections: v.number(),
    faqs: v.number(),
    promos: v.number(),
    testimonials: v.number(),
  }),
  handler: async (ctx, { adminKey }) => {
    requireAdminKey(adminKey);
    const now = Date.now();

    const seoExisting = await ctx.db
      .query("siteSeo")
      .withIndex("by_singleton", (q) => q.eq("singleton", SEO_SINGLETON))
      .unique();
    if (seoExisting) {
      await ctx.db.patch(seoExisting._id, { ...SITE_SEO_SEED, updatedAt: now });
    } else {
      await ctx.db.insert("siteSeo", {
        singleton: SEO_SINGLETON,
        ...SITE_SEO_SEED,
        updatedAt: now,
      });
    }

    for (const page of CONTENT_PAGES_SEED) {
      const existing = await ctx.db
        .query("contentPages")
        .withIndex("by_slug", (q) => q.eq("slug", page.slug))
        .unique();
      const payload = {
        ...page,
        isPublished: true,
        updatedAt: now,
      };
      if (existing) await ctx.db.patch(existing._id, payload);
      else await ctx.db.insert("contentPages", payload);
    }

    for (const section of CONTENT_SECTIONS_SEED) {
      const existing = await ctx.db
        .query("contentSections")
        .withIndex("by_page_key", (q) =>
          q.eq("pageSlug", section.pageSlug).eq("sectionKey", section.sectionKey)
        )
        .unique();
      const payload = {
        ...section,
        isPublished: true,
        updatedAt: now,
      };
      if (existing) await ctx.db.patch(existing._id, payload);
      else await ctx.db.insert("contentSections", payload);
    }

    const existingFaqs = await ctx.db.query("faqItems").collect();
    if (existingFaqs.length === 0) {
      for (const faq of FAQ_SEED) {
        await ctx.db.insert("faqItems", {
          ...faq,
          isPublished: true,
          updatedAt: now,
        });
      }
    }

    const existingPromos = await ctx.db.query("promoItems").collect();
    if (existingPromos.length === 0) {
      for (const promo of PROMO_SEED) {
        await ctx.db.insert("promoItems", {
          ...promo,
          isPublished: true,
          updatedAt: now,
        });
      }
    }

    const existingTestimonials = await ctx.db.query("testimonials").collect();
    if (existingTestimonials.length === 0) {
      for (const t of TESTIMONIALS_SEED) {
        await ctx.db.insert("testimonials", {
          ...t,
          isPublished: true,
          updatedAt: now,
        });
      }
    }

    return {
      pages: CONTENT_PAGES_SEED.length,
      sections: CONTENT_SECTIONS_SEED.length,
      faqs: FAQ_SEED.length,
      promos: PROMO_SEED.length,
      testimonials: TESTIMONIALS_SEED.length,
    };
  },
});
