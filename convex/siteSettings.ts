// =============================================================
// OTO POLİK — Site Ayarları (Convex)
// =============================================================

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { siteSettingsDefaults } from "./defaults";
import { requireAdminKey } from "./lib/adminAuth";
import { siteSettingsDocValidator } from "./lib/validators";

const SINGLETON = "site" as const;

export const getSettings = query({
  args: {},
  returns: v.union(siteSettingsDocValidator, v.null()),
  handler: async (ctx) => {
    return await ctx.db
      .query("siteSettings")
      .withIndex("by_singleton", (q) => q.eq("singleton", SINGLETON))
      .unique();
  },
});

export const ensureSettings = mutation({
  args: { adminKey: v.string() },
  returns: v.id("siteSettings"),
  handler: async (ctx, { adminKey }) => {
    requireAdminKey(adminKey);
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
  },
});

export const updateSettings = mutation({
  args: {
    adminKey: v.string(),
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
  returns: v.id("siteSettings"),
  handler: async (ctx, { adminKey, ...patch }) => {
    requireAdminKey(adminKey);
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_singleton", (q) => q.eq("singleton", SINGLETON))
      .unique();
    const id = existing
      ? existing._id
      : await ctx.db.insert("siteSettings", {
          singleton: SINGLETON,
          ...siteSettingsDefaults(),
          updatedAt: Date.now(),
        });
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(patch)) {
      if (value !== undefined) cleaned[key] = value;
    }
    await ctx.db.patch(id, { ...cleaned, updatedAt: Date.now() });
    return id;
  },
});
