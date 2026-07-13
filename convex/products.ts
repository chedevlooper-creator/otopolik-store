// =============================================================
// OTO POLİK — Ürünler (Convex)
// =============================================================

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { IndexQuery } from "./_types";

type ProductRecord = {
  isActive: boolean;
};

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
  args: {},
  handler: async (ctx) => {
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
      const all = (await ctx.db
        .query("products")
        .withIndex("by_category", (q: IndexQuery) => q.eq("category", cat))
        .collect()) as ProductRecord[];
      return all;
    }

    const all = (await ctx.db
      .query("products")
      .withIndex("by_active", (q: IndexQuery) => q.eq("isActive", true))
      .collect()) as ProductRecord[];
    return all.filter((p) => p.isActive);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q: IndexQuery) => q.eq("slug", slug))
      .unique();
  },
});

export const create = mutation({
  args: {
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
  handler: async (ctx, { id, ...patch }) => {
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
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const setActive = mutation({
  args: { id: v.id("products"), isActive: v.boolean() },
  handler: async (ctx, { id, isActive }) => {
    await ctx.db.patch(id, { isActive, updatedAt: Date.now() });
  },
});
