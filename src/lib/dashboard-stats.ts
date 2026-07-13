// =============================================================
// OTO POLİK — Admin Dashboard Veri Katmanı (Convex)
// =============================================================
// Convex bağlıysa gerçek veri çeker; bağlı değilse (env yok / hata)
// mock placeholder döner ki panel patlamasın.
// =============================================================

import "server-only";
import { getConvexClient, isConvexConfigured, api } from "@/lib/convex-server";
import { products } from "@/lib/products";

export type RecentOrder = {
  id: string;
  musteri: string;
  urun: string;
  tutar: number;
  durum: string;
  tarih: string;
};

export type DailyOrder = {
  day: string;
  count: number;
};

export type DashboardStats = {
  totalOrders: number;
  totalRevenue: number;
  activeProducts: number;
  newCustomers: number;
  ordersChangePercent: number | null;
  revenueChangePercent: number | null;
  customersChangePercent: number | null;
  weekly: DailyOrder[];
  recentOrders: RecentOrder[];
  dataSource: "convex" | "fallback";
  warning: string | null;
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Onay bekleniyor",
  confirmed: "Onaylandı",
  production: "Üretimde",
  shipped: "Kargoya verildi",
  delivered: "Teslim edildi",
  cancelled: "İptal edildi",
  whatsapp_pending: "WhatsApp onayı bekleniyor",
};

function formatDate(timestamp: number): string {
  if (!Number.isFinite(timestamp)) return "—";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp));
}

function shortId(id: string): string {
  return `#${id.replace(/-/g, "").slice(0, 4).toUpperCase()}`;
}

function getFallbackStats(): DashboardStats {
  return {
    totalOrders: 0,
    totalRevenue: 0,
    activeProducts: products.filter((p) => p.inStock !== false).length,
    newCustomers: 0,
    ordersChangePercent: null,
    revenueChangePercent: null,
    customersChangePercent: null,
    weekly: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"].map((day) => ({
      day,
      count: 0,
    })),
    recentOrders: [],
    dataSource: "fallback",
    warning:
      "Convex bağlı değil. npx convex dev çalıştırın ve NEXT_PUBLIC_CONVEX_URL env değişkenini ayarlayın.",
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const client = getConvexClient();
  if (!isConvexConfigured() || !client) {
    return getFallbackStats();
  }

  try {
    const stats = await client.query(api.orders.getStats, {});
    const recentRaw = await client.query(api.orders.listRecent, { limit: 5 });

    const recentOrders: RecentOrder[] = (recentRaw as any[]).map((o) => ({
      id: shortId(String(o._id)),
      musteri: o.customerName ?? "—",
      urun: o.items?.[0]?.name ?? "Özel tasarım",
      tutar: Number(o.total) || 0,
      durum: STATUS_LABELS[o.status] ?? o.status ?? "—",
      tarih: formatDate(o.createdAt),
    }));

    return {
      totalOrders: stats.totalOrders,
      totalRevenue: stats.totalRevenue,
      activeProducts: products.filter((p) => p.inStock !== false).length,
      newCustomers: stats.last7Customers,
      ordersChangePercent: stats.ordersChangePercent,
      revenueChangePercent: stats.revenueChangePercent,
      customersChangePercent: stats.customersChangePercent,
      weekly: stats.weekly,
      recentOrders,
      dataSource: "convex",
      warning: null,
    };
  } catch (error) {
    console.error("Convex dashboard stats error:", error);
    return {
      ...getFallbackStats(),
      warning:
        "Convex sorgusu başarısız oldu. npx convex dev çalışıyor mu kontrol edin.",
    };
  }
}
