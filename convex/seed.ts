// =============================================================
// OTO POLİK — Seed / Migration
// =============================================================
// npx convex run seed:seedProducts '{"adminKey":"..."}'
// =============================================================

import { v } from "convex/values";
import { internalMutation, mutation, type MutationCtx } from "./_generated/server";
import { requireAdminKey } from "./lib/adminAuth";
import { siteSettingsDefaults } from "./defaults";
import {
  DEFAULT_COMPATIBILITY,
  SEED_PRODUCTS,
  STANDARD_COLORS,
} from "./seedData";

const SINGLETON = "site" as const;

async function ensureSiteSettings(ctx: MutationCtx) {
  const existing = await ctx.db
    .query("siteSettings")
    .withIndex("by_singleton", (q) => q.eq("singleton", SINGLETON))
    .unique();
  if (existing) return existing._id;
  return await ctx.db.insert("siteSettings", {
    singleton: SINGLETON,
    ...siteSettingsDefaults(),
    updatedAt: Date.now(),
  });
}

async function upsertProducts(ctx: MutationCtx, now: number) {
  let inserted = 0;
  let updated = 0;

  for (const seed of SEED_PRODUCTS) {
    const existing = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", seed.slug))
      .unique();

    const payload = {
      slug: seed.slug,
      name: seed.name,
      brand: seed.brand,
      model: seed.model,
      category: seed.category,
      price: seed.price,
      oldPrice: seed.oldPrice,
      image: seed.image,
      gallery: seed.gallery,
      colors: STANDARD_COLORS.map((c) => ({
        name: c.name,
        hex: c.hex,
        image: c.image,
      })),
      description: seed.description,
      features: seed.features,
      compatibility: { ...DEFAULT_COMPATIBILITY },
      setContents: seed.setContents,
      optionalExtras: seed.optionalExtras,
      dispatchEstimate: seed.dispatchEstimate,
      badge: seed.badge,
      inStock: true,
      isActive: true,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      updated += 1;
    } else {
      await ctx.db.insert("products", {
        ...payload,
        createdAt: now,
      });
      inserted += 1;
    }
  }

  return { inserted, updated, total: SEED_PRODUCTS.length };
}

export const seedProducts = mutation({
  args: { adminKey: v.string() },
  returns: v.object({
    inserted: v.number(),
    updated: v.number(),
    total: v.number(),
    settingsId: v.string(),
  }),
  handler: async (ctx, { adminKey }) => {
    requireAdminKey(adminKey);
    const now = Date.now();
    const settingsId = await ensureSiteSettings(ctx);
    const result = await upsertProducts(ctx, now);
    return { ...result, settingsId: String(settingsId) };
  },
});

export const seedProductsInternalFn = internalMutation({
  args: {},
  returns: v.object({
    inserted: v.number(),
    updated: v.number(),
    total: v.number(),
  }),
  handler: async (ctx) => {
    const now = Date.now();
    await ensureSiteSettings(ctx);
    return await upsertProducts(ctx, now);
  },
});
