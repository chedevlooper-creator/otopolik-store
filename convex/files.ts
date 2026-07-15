import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAdminKey } from "./lib/adminAuth";

/** Admin: get a short-lived upload URL for product / CMS images. */
export const generateUploadUrl = mutation({
  args: { adminKey: v.string() },
  returns: v.string(),
  handler: async (ctx, { adminKey }) => {
    requireAdminKey(adminKey);
    return await ctx.storage.generateUploadUrl();
  },
});

/** Admin: resolve a storage id to a public HTTPS URL. */
export const getUrl = mutation({
  args: {
    adminKey: v.string(),
    storageId: v.id("_storage"),
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, { adminKey, storageId }) => {
    requireAdminKey(adminKey);
    return await ctx.storage.getUrl(storageId);
  },
});
