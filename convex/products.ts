// =============================================================
// OTO POLİK — Ürünler (Convex)
// =============================================================

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdminKey } from "./lib/adminAuth";

const CATEGORIES = [
  "eva-3d",
  "eva-havuzlu",
  "bagaj",
  "bagaj-havuzu",
  "bagaj-cantasi",
  "direksiyon-kilifi",
  "minder-seti",
  "ekran-koruyucu",
] as const;

type ProductCategory = (typeof CATEGORIES)[number];

// Admin: tüm ürünler (aktif/pasif)
export const listAll = query({
  args: { adminKey: v.string() },
  handler: async (ctx, { adminKey }) => {
    requireAdminKey(adminKey);
    return await ctx.db.query("products").withIndex("by_active").collect();
  },
});

// Public: sadece aktif ürünler
export const listActive = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, { category }) => {
    if (category) {
      const cat = category as ProductCategory;
      const all = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", cat))
        .collect();
      return all.filter((product) => product.isActive);
    }

    const all = await ctx.db
      .query("products")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    return all;
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!product || !product.isActive) return null;
    return product;
  },
});

export const create = mutation({
  args: {
    adminKey: v.string(),
    slug: v.string(),
    name: v.string(),
    brand: v.optional(v.string()),
    model: v.optional(v.string()),
    category: v.string(),
    price: v.number(),
    oldPrice: v.optional(v.number()),
    image: v.string(),
    badge: v.optional(v.string()),
    inStock: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, input) => {
    requireAdminKey(input.adminKey);
    if (!CATEGORIES.includes(input.category as ProductCategory)) {
      throw new Error(`Geçersiz kategori: ${input.category}`);
    }
    const now = Date.now();
    return await ctx.db.insert("products", {
      slug: input.slug,
      name: input.name,
      brand: input.brand ?? "OTO POLİK",
      model: input.model ?? "Tüm Modeller",
      category: input.category as ProductCategory,
      price: input.price,
      oldPrice: input.oldPrice,
      image: input.image,
      badge: input.badge,
      inStock: input.inStock ?? true,
      isActive: input.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    adminKey: v.string(),
    id: v.id("products"),
    name: v.optional(v.string()),
    brand: v.optional(v.string()),
    model: v.optional(v.string()),
    category: v.optional(v.string()),
    price: v.optional(v.number()),
    oldPrice: v.optional(v.number()),
    image: v.optional(v.string()),
    badge: v.optional(v.string()),
    inStock: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { adminKey, id, ...patch }) => {
    requireAdminKey(adminKey);
    if (patch.category && !CATEGORIES.includes(patch.category as ProductCategory)) {
      throw new Error(`Geçersiz kategori: ${patch.category}`);
    }
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(patch)) {
      if (value !== undefined) cleaned[key] = value;
    }
    await ctx.db.patch(id, { ...cleaned, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { adminKey: v.string(), id: v.id("products") },
  handler: async (ctx, { adminKey, id }) => {
    requireAdminKey(adminKey);
    await ctx.db.delete(id);
  },
});

export const setActive = mutation({
  args: {
    adminKey: v.string(),
    id: v.id("products"),
    isActive: v.boolean(),
  },
  handler: async (ctx, { adminKey, id, isActive }) => {
    requireAdminKey(adminKey);
    await ctx.db.patch(id, { isActive, updatedAt: Date.now() });
  },
});
