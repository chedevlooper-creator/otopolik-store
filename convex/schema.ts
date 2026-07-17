// =============================================================
// OTO POLİK — Convex Şeması
// =============================================================
// Tüm tablolar tek şemada tanımlanır. Convex CLI (`npx convex dev`)
// bu dosyayı okuyup veritabanını otomatik migrate eder.
// =============================================================

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const productColor = v.object({
  name: v.string(),
  hex: v.string(),
  image: v.optional(v.string()),
});

const productCompatibility = v.object({
  yearRange: v.string(),
  bodyOrChassis: v.string(),
  note: v.string(),
});

const productCategory = v.union(
  v.literal("eva-3d"),
  v.literal("eva-havuzlu"),
  v.literal("hali-paspas"),
  v.literal("bagaj"),
  v.literal("bagaj-havuzu"),
  v.literal("bagaj-cantasi"),
  v.literal("direksiyon-kilifi"),
  v.literal("minder-seti"),
  v.literal("ekran-koruyucu")
);

export default defineSchema(
  {
    // ---------------------------------------------------------
    // siteSettings — Site genelinde ayarlar (tek satır)
    // ---------------------------------------------------------
    siteSettings: defineTable({
      singleton: v.literal("site"),

      phoneDisplay: v.string(),
      whatsappNumber: v.string(),
      email: v.string(),
      address: v.string(),
      instagram: v.string(),

      freeShippingThreshold: v.number(),
      shippingFee: v.number(),
      estimatedDispatch: v.string(),
      businessHours: v.string(),

      matBasePrice: v.number(),
      matHeelPadPrice: v.number(),
      matTrunkPrice: v.number(),

      updatedAt: v.number(),
    }).index("by_singleton", ["singleton"]),

    // ---------------------------------------------------------
    // siteSeo — Site genel SEO (tek satır)
    // ---------------------------------------------------------
    siteSeo: defineTable({
      singleton: v.literal("seo"),
      siteName: v.string(),
      tagline: v.string(),
      defaultDescription: v.string(),
      siteUrl: v.string(),
      defaultOgImage: v.string(),
      locale: v.string(),
      titleTemplate: v.string(),
      ogImageAlt: v.string(),
      updatedAt: v.number(),
    }).index("by_singleton", ["singleton"]),

    // ---------------------------------------------------------
    // contentPages — Sayfa meta + yol bilgisi
    // ---------------------------------------------------------
    contentPages: defineTable({
      slug: v.string(),
      path: v.string(),
      pageType: v.union(
        v.literal("marketing"),
        v.literal("legal"),
        v.literal("utility")
      ),
      metaTitle: v.string(),
      metaDescription: v.string(),
      title: v.string(),
      description: v.string(),
      isPublished: v.boolean(),
      sortOrder: v.number(),
      updatedAt: v.number(),
    })
      .index("by_slug", ["slug"])
      .index("by_published", ["isPublished"])
      .index("by_type", ["pageType"]),

    // ---------------------------------------------------------
    // contentSections — Sayfa bölümleri
    // ---------------------------------------------------------
    contentSections: defineTable({
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
      updatedAt: v.number(),
    })
      .index("by_page_sort", ["pageSlug", "sortOrder"])
      .index("by_page_key", ["pageSlug", "sectionKey"]),

    // ---------------------------------------------------------
    // faqItems — Ana sayfa SSS
    // ---------------------------------------------------------
    faqItems: defineTable({
      sortOrder: v.number(),
      question: v.string(),
      answer: v.string(),
      isPublished: v.boolean(),
      updatedAt: v.number(),
    }).index("by_sort", ["sortOrder"]),

    // ---------------------------------------------------------
    // promoItems — Marquee, trust, header rozetleri
    // ---------------------------------------------------------
    promoItems: defineTable({
      kind: v.union(
        v.literal("marquee"),
        v.literal("trust"),
        v.literal("header_badge"),
        v.literal("footer_cta")
      ),
      sortOrder: v.number(),
      label: v.string(),
      detail: v.optional(v.string()),
      href: v.optional(v.string()),
      iconKey: v.optional(v.string()),
      isPublished: v.boolean(),
      updatedAt: v.number(),
    }).index("by_kind_sort", ["kind", "sortOrder"]),

    // ---------------------------------------------------------
    // testimonials — Müşteri yorumları
    // ---------------------------------------------------------
    testimonials: defineTable({
      sortOrder: v.number(),
      name: v.string(),
      location: v.string(),
      rating: v.number(),
      text: v.string(),
      isPublished: v.boolean(),
      updatedAt: v.number(),
    }).index("by_sort", ["sortOrder"]),

    // ---------------------------------------------------------
    // contentGenerations — AI üretimi, yayından izole taslaklar
    // ---------------------------------------------------------
    contentGenerations: defineTable({
      kind: v.union(
        v.literal("product_description"),
        v.literal("product_seo"),
        v.literal("faq")
      ),
      targetSlug: v.string(),
      prompt: v.string(),
      draft: v.optional(v.string()),
      status: v.union(
        v.literal("pending"),
        v.literal("ready"),
        v.literal("approved"),
        v.literal("rejected"),
        v.literal("failed")
      ),
      failureReason: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_status", ["status"])
      .index("by_target", ["targetSlug"]),

    // ---------------------------------------------------------
    // products — Katalog ürünleri
    // ---------------------------------------------------------
    products: defineTable({
      slug: v.string(),
      name: v.string(),
      brand: v.string(),
      model: v.string(),
      category: productCategory,
      price: v.number(),
      oldPrice: v.optional(v.number()),
      image: v.string(),
      gallery: v.array(v.string()),
      colors: v.array(productColor),
      description: v.string(),
      features: v.array(v.string()),
      compatibility: productCompatibility,
      setContents: v.array(v.string()),
      optionalExtras: v.array(v.string()),
      dispatchEstimate: v.string(),
      badge: v.optional(v.string()),
      metaTitle: v.optional(v.string()),
      metaDescription: v.optional(v.string()),
      inStock: v.boolean(),
      isActive: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_slug", ["slug"])
      .index("by_active", ["isActive"])
      .index("by_category", ["category"])
      .searchIndex("search_products", {
        searchField: "name",
        filterFields: ["category", "isActive", "brand"],
      }),

    // ---------------------------------------------------------
    // orders — Müşteri siparişleri
    // ---------------------------------------------------------
    orders: defineTable({
      customerName: v.string(),
      customerPhone: v.string(),
      customerEmail: v.optional(v.string()),
      city: v.optional(v.string()),
      address: v.optional(v.string()),
      items: v.array(
        v.object({
          slug: v.string(),
          name: v.string(),
          price: v.number(),
          quantity: v.number(),
          color: v.optional(v.string()),
          image: v.optional(v.string()),
          configuration: v.optional(
            v.object({
              vehicle: v.optional(v.string()),
              baseColor: v.optional(v.string()),
              edgeColor: v.optional(v.string()),
              heelPad: v.optional(v.boolean()),
              trunkMat: v.optional(v.boolean()),
            })
          ),
        })
      ),
      subtotal: v.number(),
      shippingFee: v.number(),
      total: v.number(),
      paymentMethod: v.optional(
        v.union(v.literal("whatsapp"), v.literal("kapida"))
      ),
      status: v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("production"),
        v.literal("shipped"),
        v.literal("delivered"),
        v.literal("cancelled"),
        v.literal("whatsapp_pending")
      ),
      notes: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_created", ["createdAt"])
      .index("by_status", ["status"])
      .index("by_phone_created", ["customerPhone", "createdAt"])
      .searchIndex("search_orders", {
        searchField: "customerName",
        filterFields: ["status"],
      }),
  },
  {
    schemaValidation: true,
  }
);
