// =============================================================
// OTO POLİK — Siparişler (Convex)
// =============================================================

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

type OrderRecord = {
  createdAt: number;
  customerName: string;
  total: number;
  status: string;
};

const STATUS_VALUES = [
  "pending",
  "confirmed",
  "production",
  "shipped",
  "delivered",
  "cancelled",
  "whatsapp_pending",
] as const;

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
        name: v.string(),
        price: v.number(),
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
    subtotal: v.number(),
    shippingFee: v.number(),
    total: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, input) => {
    const now = Date.now();
    return await ctx.db.insert("orders", {
      ...input,
      status: "whatsapp_pending",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const listAll = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const q = ctx.db.query("orders").withIndex("by_created");
    if (limit) return await q.order("desc").take(limit);
    return await q.order("desc").collect();
  },
});

export const listRecent = query({
  args: { limit: v.number() },
  handler: async (ctx, { limit }) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_created")
      .order("desc")
      .take(limit);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, { id, status }) => {
    if (!STATUS_VALUES.includes(status as any)) {
      throw new Error(`Geçersiz durum: ${status}`);
    }
    await ctx.db.patch(id, {
      status: status as any,
      updatedAt: Date.now(),
    });
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const all = (await ctx.db.query("orders").collect()) as OrderRecord[];
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;

    const last7 = all.filter((o: OrderRecord) => now - o.createdAt < sevenDaysMs);
    const prev7 = all.filter((o) => {
      const age = now - o.createdAt;
      return age >= sevenDaysMs && age < fourteenDaysMs;
    });

    const last7Customers = new Set(last7.map((o: OrderRecord) => o.customerName)).size;
    const prev7Customers = new Set(prev7.map((o: OrderRecord) => o.customerName)).size;

    const sumLast7 = last7.reduce((a: number, o: OrderRecord) => a + o.total, 0);
    const sumPrev7 = prev7.reduce((a: number, o: OrderRecord) => a + o.total, 0);

    const totalRevenue = all
      .filter((o: OrderRecord) => o.status !== "cancelled")
      .reduce((a: number, o: OrderRecord) => a + o.total, 0);

    // 7 günlük dağılım
    const dayLabels = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
    const days: { day: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = dayStart.getTime() + 24 * 60 * 60 * 1000;
      const dayLabel = dayLabels[dayStart.getDay()];
      const count = all.filter(
        (o: OrderRecord) => o.createdAt >= dayStart.getTime() && o.createdAt < dayEnd
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
