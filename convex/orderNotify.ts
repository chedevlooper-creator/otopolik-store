"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Notify ops when a new WhatsApp order is created.
 * Configure on Convex:
 *   ORDER_WEBHOOK_URL  — Discord/Slack/Make webhook (POST JSON)
 *   ORDER_NOTIFY_EMAIL — destination email (requires RESEND_API_KEY)
 *   RESEND_API_KEY     — https://resend.com
 */
export const notifyAdmin = internalAction({
  args: { orderId: v.id("orders") },
  returns: v.null(),
  handler: async (ctx, { orderId }) => {
    const order = await ctx.runQuery(internal.orders.getByIdInternal, {
      id: orderId,
    });
    if (!order) return null;

    const lines = order.items
      .map(
        (item) =>
          `• ${item.name} (${item.color ?? "—"}) x${item.quantity} — ${item.price}₺`
      )
      .join("\n");

    const summary = [
      `Yeni sipariş — ${order.customerName}`,
      `Tel: ${order.customerPhone}`,
      order.city ? `Şehir: ${order.city}` : null,
      `Toplam: ${order.total}₺`,
      `Ödeme: ${order.paymentMethod}`,
      "",
      lines,
      order.notes ? `\nNot: ${order.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const webhook = process.env.ORDER_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: summary.slice(0, 1900),
            text: summary,
            orderId,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            total: order.total,
            paymentMethod: order.paymentMethod,
          }),
        });
      } catch (error) {
        console.error("ORDER_WEBHOOK_URL notify failed:", error);
      }
    }

    const resendKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.ORDER_NOTIFY_EMAIL;
    if (resendKey && notifyEmail) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.ORDER_NOTIFY_FROM ?? "OTO POLİK <onboarding@resend.dev>",
            to: [notifyEmail],
            subject: `Yeni sipariş — ${order.customerName} (${order.total}₺)`,
            text: summary,
          }),
        });
        if (!response.ok) {
          console.error("Resend notify failed:", await response.text());
        }
      } catch (error) {
        console.error("Resend notify error:", error);
      }
    }

    if (!webhook && !(resendKey && notifyEmail)) {
      console.log("Order notify skipped (no ORDER_WEBHOOK_URL / Resend env):", orderId);
    }

    return null;
  },
});
