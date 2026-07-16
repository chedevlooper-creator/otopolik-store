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
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_singleton", (q) => q.eq("singleton", SINGLETON))
      .unique();
    if (!existing) return null;

    const canonical = siteSettingsDefaults();
    return {
      ...existing,
      matBasePrice: canonical.matBasePrice,
      matHeelPadPrice: canonical.matHeelPadPrice,
      matTrunkPrice: canonical.matTrunkPrice,
    };
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
    if (existing) {
      const canonical = siteSettingsDefaults();
      await ctx.db.patch(existing._id, {
        matBasePrice: canonical.matBasePrice,
        matHeelPadPrice: canonical.matHeelPadPrice,
        matTrunkPrice: canonical.matTrunkPrice,
      });
      return existing._id;
    }
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
    const canonical = siteSettingsDefaults();
    await ctx.db.patch(id, {
      ...cleaned,
      matBasePrice: canonical.matBasePrice,
      matHeelPadPrice: canonical.matHeelPadPrice,
      matTrunkPrice: canonical.matTrunkPrice,
      updatedAt: Date.now(),
    });
    return id;
  },
});
