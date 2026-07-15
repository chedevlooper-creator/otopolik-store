// =============================================================
// OTO POLİK — Ürünler (Convex)
// =============================================================

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdminKey } from "./lib/adminAuth";
import {
  productColorValidator,
  productCompatibilityValidator,
  productDocValidator,
} from "./lib/validators";
import {
  DEFAULT_COMPATIBILITY,
  STANDARD_COLORS,
} from "./seedData";

const CATEGORIES = [
  "eva-3d",
  "eva-havuzlu",
  "hali-paspas",
  "bagaj",
  "bagaj-havuzu",
  "bagaj-cantasi",
  "direksiyon-kilifi",
  "minder-seti",
  "ekran-koruyucu",
] as const;

type ProductCategory = (typeof CATEGORIES)[number];

const defaultColors = STANDARD_COLORS.map((c) => ({
  name: c.name,
  hex: c.hex,
  image: c.image,
}));

export const listAll = query({
  args: { adminKey: v.string() },
  returns: v.array(productDocValidator),
  handler: async (ctx, { adminKey }) => {
    requireAdminKey(adminKey);
    return await ctx.db.query("products").withIndex("by_active").collect();
  },
});

export const listActive = query({
  args: {
    category: v.optional(v.string()),
  },
  returns: v.array(productDocValidator),
  handler: async (ctx, { category }) => {
    if (category) {
      const cat = category as ProductCategory;
      if (!CATEGORIES.includes(cat)) return [];
      const all = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", cat))
        .collect();
      return all.filter((product) => product.isActive);
    }

    return await ctx.db
      .query("products")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

export const listSlugs = query({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    return products.map((p) => p.slug);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  returns: v.union(productDocValidator, v.null()),
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
    gallery: v.optional(v.array(v.string())),
    colors: v.optional(v.array(productColorValidator)),
    description: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    compatibility: v.optional(productCompatibilityValidator),
    setContents: v.optional(v.array(v.string())),
    optionalExtras: v.optional(v.array(v.string())),
    dispatchEstimate: v.optional(v.string()),
    badge: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    inStock: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
  },
  returns: v.id("products"),
  handler: async (ctx, input) => {
    requireAdminKey(input.adminKey);
    if (!CATEGORIES.includes(input.category as ProductCategory)) {
      throw new Error(`Geçersiz kategori: ${input.category}`);
    }
    const now = Date.now();
    const gallery = input.gallery?.length ? input.gallery : [input.image];
    return await ctx.db.insert("products", {
      slug: input.slug,
      name: input.name,
      brand: input.brand ?? "OTO POLİK",
      model: input.model ?? "Tüm Modeller",
      category: input.category as ProductCategory,
      price: input.price,
      oldPrice: input.oldPrice,
      image: input.image,
      gallery,
      colors: input.colors ?? defaultColors,
      description: input.description ?? "",
      features: input.features ?? [],
      compatibility: input.compatibility ?? { ...DEFAULT_COMPATIBILITY },
      setContents: input.setContents ?? [],
      optionalExtras: input.optionalExtras ?? [],
      dispatchEstimate: input.dispatchEstimate ?? "1-3 iş günü",
      badge: input.badge,
      metaTitle: input.metaTitle,
      metaDescription: input.metaDescription,
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
    gallery: v.optional(v.array(v.string())),
    colors: v.optional(v.array(productColorValidator)),
    description: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    compatibility: v.optional(productCompatibilityValidator),
    setContents: v.optional(v.array(v.string())),
    optionalExtras: v.optional(v.array(v.string())),
    dispatchEstimate: v.optional(v.string()),
    badge: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    inStock: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
  },
  returns: v.null(),
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
    return null;
  },
});

export const remove = mutation({
  args: { adminKey: v.string(), id: v.id("products") },
  returns: v.null(),
  handler: async (ctx, { adminKey, id }) => {
    requireAdminKey(adminKey);
    await ctx.db.delete(id);
    return null;
  },
});

export const setActive = mutation({
  args: {
    adminKey: v.string(),
    id: v.id("products"),
    isActive: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, { adminKey, id, isActive }) => {
    requireAdminKey(adminKey);
    await ctx.db.patch(id, { isActive, updatedAt: Date.now() });
    return null;
  },
});
