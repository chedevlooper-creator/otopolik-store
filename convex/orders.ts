// =============================================================
// OTO POLİK — Siparişler (Convex)
// =============================================================

import { v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { requireAdminKey } from "./lib/adminAuth";
import { siteSettingsDefaults } from "./defaults";
import {
  orderDocValidator,
  paymentMethodValidator,
} from "./lib/validators";

const STATUS_VALUES = [
  "pending",
  "confirmed",
  "production",
  "shipped",
  "delivered",
  "cancelled",
  "whatsapp_pending",
] as const;

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const MAX_QTY = 9;

const SINGLETON = "site" as const;

const statsValidator = v.object({
  totalOrders: v.number(),
  totalRevenue: v.number(),
  last7Orders: v.number(),
  prev7Orders: v.number(),
  last7Customers: v.number(),
  prev7Customers: v.number(),
  last7Revenue: v.number(),
  prev7Revenue: v.number(),
  weekly: v.array(v.object({ day: v.string(), count: v.number() })),
  ordersChangePercent: v.union(v.number(), v.null()),
  revenueChangePercent: v.union(v.number(), v.null()),
  customersChangePercent: v.union(v.number(), v.null()),
});

/** Public: storefront creates WhatsApp-backed orders; prices recomputed server-side. */
export const create = mutation({
  args: {
    customerName: v.string(),
    customerPhone: v.string(),
    customerEmail: v.optional(v.string()),
    city: v.optional(v.string()),
    address: v.optional(v.string()),
    items: v.array(
      v.object({
        slug: v.string(),
        name: v.optional(v.string()),
        price: v.optional(v.number()),
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
    paymentMethod: paymentMethodValidator,
    notes: v.optional(v.string()),
  },
  returns: v.id("orders"),
  handler: async (ctx, input) => {
    const now = Date.now();
    const phone = input.customerPhone.replace(/[\s()-]/g, "");
    if (!phone || phone.length < 10) {
      throw new Error("Geçerli bir telefon numarası gerekli.");
    }
    if (!input.items.length) {
      throw new Error("Sepet boş.");
    }

    const recent = await ctx.db
      .query("orders")
      .withIndex("by_phone_created", (q) =>
        q.eq("customerPhone", phone).gte("createdAt", now - RATE_LIMIT_WINDOW_MS)
      )
      .collect();
    if (recent.length >= RATE_LIMIT_MAX) {
      throw new Error(
        "Çok fazla sipariş denemesi. Lütfen birkaç dakika sonra tekrar deneyin."
      );
    }

    const settings =
      (await ctx.db
        .query("siteSettings")
        .withIndex("by_singleton", (q) => q.eq("singleton", SINGLETON))
        .unique()) ?? siteSettingsDefaults();

    const resolvedItems = [];
    for (const item of input.items) {
      const qty = Math.min(MAX_QTY, Math.max(1, Math.floor(item.quantity)));
      const product = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", item.slug))
        .unique();

      if (product && product.isActive) {
        resolvedItems.push({
          slug: product.slug,
          name: product.name,
          price: product.price,
          quantity: qty,
          color: item.color,
          image: item.image ?? product.image,
          configuration: item.configuration,
        });
      } else if (item.slug.startsWith("ozel-tasarim-")) {
        // Konfigüratör özel tasarım — client fiyatı kabul (sunucu ayarları ile sınırlanır)
        const price = Math.max(
          0,
          Math.min(
            settings.matBasePrice +
              settings.matHeelPadPrice +
              settings.matTrunkPrice,
            Number(item.price) || settings.matBasePrice
          )
        );
        resolvedItems.push({
          slug: item.slug,
          name: item.name ?? "Özel Tasarım EVA Paspas",
          price,
          quantity: qty,
          color: item.color,
          image: item.image,
          configuration: item.configuration,
        });
      } else {
        throw new Error(`Ürün bulunamadı veya pasif: ${item.slug}`);
      }
    }

    const subtotal = resolvedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingFee =
      subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
    const total = subtotal + shippingFee;

    const orderId = await ctx.db.insert("orders", {
      customerName: input.customerName.trim(),
      customerPhone: phone,
      customerEmail: input.customerEmail,
      city: input.city,
      address: input.address,
      items: resolvedItems,
      subtotal,
      shippingFee,
      total,
      paymentMethod: input.paymentMethod,
      status: "whatsapp_pending",
      notes: input.notes,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.scheduler.runAfter(0, internal.orderNotify.notifyAdmin, {
      orderId,
    });

    return orderId;
  },
});

export const getByIdInternal = internalQuery({
  args: { id: v.id("orders") },
  returns: v.union(orderDocValidator, v.null()),
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const listAll = query({
  args: { adminKey: v.string(), limit: v.optional(v.number()) },
  returns: v.array(orderDocValidator),
  handler: async (ctx, { adminKey, limit }) => {
    requireAdminKey(adminKey);
    const q = ctx.db.query("orders").withIndex("by_created");
    if (limit) return await q.order("desc").take(limit);
    return await q.order("desc").collect();
  },
});

export const listRecent = query({
  args: { adminKey: v.string(), limit: v.number() },
  returns: v.array(orderDocValidator),
  handler: async (ctx, { adminKey, limit }) => {
    requireAdminKey(adminKey);
    return await ctx.db
      .query("orders")
      .withIndex("by_created")
      .order("desc")
      .take(limit);
  },
});

export const updateStatus = mutation({
  args: {
    adminKey: v.string(),
    id: v.id("orders"),
    status: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, { adminKey, id, status }) => {
    requireAdminKey(adminKey);
    if (!STATUS_VALUES.includes(status as (typeof STATUS_VALUES)[number])) {
      throw new Error(`Geçersiz durum: ${status}`);
    }
    await ctx.db.patch(id, {
      status: status as (typeof STATUS_VALUES)[number],
      updatedAt: Date.now(),
    });
    return null;
  },
});

export const getStats = query({
  args: { adminKey: v.string(), now: v.number() },
  returns: statsValidator,
  handler: async (ctx, { adminKey, now }) => {
    requireAdminKey(adminKey);
    const all = await ctx.db.query("orders").collect();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;

    const last7 = all.filter((o) => now - o.createdAt < sevenDaysMs);
    const prev7 = all.filter((o) => {
      const age = now - o.createdAt;
      return age >= sevenDaysMs && age < fourteenDaysMs;
    });

    const last7Customers = new Set(last7.map((o) => o.customerName)).size;
    const prev7Customers = new Set(prev7.map((o) => o.customerName)).size;

    const sumLast7 = last7.reduce((a, o) => a + o.total, 0);
    const sumPrev7 = prev7.reduce((a, o) => a + o.total, 0);

    const totalRevenue = all
      .filter((o) => o.status !== "cancelled")
      .reduce((a, o) => a + o.total, 0);

    const dayLabels = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
    const days: { day: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = dayStart.getTime() + 24 * 60 * 60 * 1000;
      const dayLabel = dayLabels[dayStart.getDay()] ?? "";
      const count = all.filter(
        (o) => o.createdAt >= dayStart.getTime() && o.createdAt < dayEnd
      ).length;
      days.push({ day: dayLabel, count });
    }

    function pct(curr: number, prev: number): number | null {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100);
    }

    return {
      totalOrders: all.length,
      totalRevenue,
      last7Orders: last7.length,
      prev7Orders: prev7.length,
      last7Customers,
      prev7Customers,
      last7Revenue: sumLast7,
      prev7Revenue: sumPrev7,
      weekly: days,
      ordersChangePercent: pct(last7.length, prev7.length),
      revenueChangePercent: pct(sumLast7, sumPrev7),
      customersChangePercent: pct(last7Customers, prev7Customers),
    };
  },
});
