// =============================================================
// OTO POLİK — Convex Şeması
// =============================================================
// Tüm tablolar tek şemada tanımlanır. Convex CLI (`npx convex dev`)
// bu dosyayı okuyup veritabanını otomatik migrate eder.
// =============================================================

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    // ---------------------------------------------------------
    // siteSettings — Site genelinde ayarlar (tek satır)
    // ---------------------------------------------------------
    siteSettings: defineTable({
      // Tek kayıt için sabit kimlik
      singleton: v.literal("site"),

      // İletişim
      phoneDisplay: v.string(),
      whatsappNumber: v.string(),
      email: v.string(),
      address: v.string(),
      instagram: v.string(),

      // Kargo
      freeShippingThreshold: v.number(),
      shippingFee: v.number(),
      estimatedDispatch: v.string(),
      businessHours: v.string(),

      // Konfigüratör fiyatlandırma
      matBasePrice: v.number(),
      matHeelPadPrice: v.number(),
      matTrunkPrice: v.number(),

      updatedAt: v.number(),
    }).index("by_singleton", ["singleton"]),

    // ---------------------------------------------------------
    // products — Katalog ürünleri
    // ---------------------------------------------------------
    products: defineTable({
      slug: v.string(),
      name: v.string(),
      brand: v.string(),
      model: v.string(),
      category: v.union(
        v.literal("eva-3d"),
        v.literal("eva-havuzlu"),
        v.literal("bagaj"),
        v.literal("bagaj-havuzu"),
        v.literal("bagaj-cantasi"),
        v.literal("direksiyon-kilifi"),
        v.literal("minder-seti"),
        v.literal("ekran-koruyucu")
      ),
      price: v.number(),
      oldPrice: v.optional(v.number()),
      image: v.string(),
      badge: v.optional(v.string()),
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
      .searchIndex("search_orders", {
        searchField: "customerName",
        filterFields: ["status"],
      }),
  },
  {
    schemaValidation: true,
  }
);
