// =============================================================
// OTO POLİK — Site Ayarları (Convex)
// =============================================================

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { siteSettingsDefaults } from "./defaults";

const SINGLETON = "site" as const;

async function ensureSingleton(ctx: any): Promise<any> {
  const existing = await ctx.db
    .query("siteSettings")
    .withIndex("by_singleton", (q: any) => q.eq("singleton", SINGLETON))
    .unique();
  if (existing) return existing._id;
  return await ctx.db.insert("siteSettings", {
    singleton: SINGLETON,
    ...siteSettingsDefaults(),
    updatedAt: Date.now(),
  });
}

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("siteSettings")
      .withIndex("by_singleton", (q: any) => q.eq("singleton", SINGLETON))
      .unique();
  },
});

export const ensureSettings = mutation({
  args: {},
  handler: async (ctx) => {
    return await ensureSingleton(ctx);
  },
});

export const updateSettings = mutation({
  args: {
    phoneDisplay: v.optional(v.string()),
    whatsappNumber: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    instagram: v.optional(v.string()),
    freeShippingThreshold: v.optional(v.number()),
    shippingFee: v.optional(v.number()),
    estimatedDispatch: v.optional(v.string()),
    businessHours: v.optional(v.string()),
    matBasePrice: v.optional(v.number()),
    matHeelPadPrice: v.optional(v.number()),
    matTrunkPrice: v.optional(v.number()),
  },
  handler: async (ctx, patch) => {
    const id = await ensureSingleton(ctx);
    // undefined değerleri atla — patch partial update
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(patch)) {
      if (value !== undefined) cleaned[key] = value;
    }
    await ctx.db.patch(id, { ...cleaned, updatedAt: Date.now() });
    return id;
  },
});
