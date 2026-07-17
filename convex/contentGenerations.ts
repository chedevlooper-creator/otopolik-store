import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { requireAdminKey } from "./lib/adminAuth";

const contentKindValidator = v.union(
  v.literal("product_description"),
  v.literal("product_seo"),
  v.literal("faq")
);

const contentStatusValidator = v.union(
  v.literal("pending"),
  v.literal("ready"),
  v.literal("approved"),
  v.literal("rejected"),
  v.literal("failed")
);

const contentGenerationValidator = v.object({
  _id: v.id("contentGenerations"),
  _creationTime: v.number(),
  kind: contentKindValidator,
  targetSlug: v.string(),
  prompt: v.string(),
  draft: v.optional(v.string()),
  status: contentStatusValidator,
  failureReason: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

export const listRecent = query({
  args: {
    adminKey: v.string(),
    limit: v.optional(v.number()),
  },
  returns: v.array(contentGenerationValidator),
  handler: async (ctx, { adminKey, limit }) => {
    requireAdminKey(adminKey);
    const safeLimit = Math.min(Math.max(Math.trunc(limit ?? 30), 1), 100);
    const drafts = await ctx.db
      .query("contentGenerations")
      .order("desc")
      .take(safeLimit);
    return drafts.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const getById = query({
  args: {
    adminKey: v.string(),
    id: v.id("contentGenerations"),
  },
  returns: v.union(contentGenerationValidator, v.null()),
  handler: async (ctx, { adminKey, id }) => {
    requireAdminKey(adminKey);
    return await ctx.db.get(id);
  },
});

export const upsertDraft = mutation({
  args: {
    adminKey: v.string(),
    id: v.optional(v.id("contentGenerations")),
    kind: contentKindValidator,
    targetSlug: v.string(),
    prompt: v.string(),
    draft: v.optional(v.string()),
    status: contentStatusValidator,
    failureReason: v.optional(v.string()),
  },
  returns: v.id("contentGenerations"),
  handler: async (ctx, { adminKey, id, ...input }) => {
    requireAdminKey(adminKey);
    const now = Date.now();

    if (id) {
      const existing = await ctx.db.get(id);
      if (!existing) throw new Error("İçerik taslağı bulunamadı.");
      await ctx.db.patch(id, { ...input, updatedAt: now });
      return id;
    }

    return await ctx.db.insert("contentGenerations", {
      ...input,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const markStatus = mutation({
  args: {
    adminKey: v.string(),
    id: v.id("contentGenerations"),
    status: contentStatusValidator,
    failureReason: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, { adminKey, id, status, failureReason }) => {
    requireAdminKey(adminKey);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("İçerik taslağı bulunamadı.");
    await ctx.db.patch(id, {
      status,
      failureReason,
      updatedAt: Date.now(),
    });
    return null;
  },
});
