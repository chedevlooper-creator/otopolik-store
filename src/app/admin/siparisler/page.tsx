"use client";

import { useCallback, useMemo, useState } from "react";
import {
  SearchIcon,
  FilterIcon,
  CheckCircleIcon,
  TruckIcon,
  ClockIcon,
  XCircleIcon,
  MessageCircleIcon,
  AlertTriangleIcon,
  RefreshCwIcon,
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { isConvexConfiguredClient } from "@/lib/convex-client";
import { useAdminConvexKey } from "@/hooks/useAdminConvexKey";
import type { Id } from "../../../../convex/_generated/dataModel";

type Siparis = {
  id: string;
  musteri: string;
  telefon: string;
  urun: string;
  renk: string;
  adet: number;
  tutar: number;
  durum: "onay-bekliyor" | "onaylandi" | "uretimde" | "kargoda" | "teslim-edildi" | "iptal";
  odeme: string;
  tarih: string;
  not?: string;
  realUuid: string;
};

type RawOrder = Record<string, unknown>;
type RawOrderItem = Record<string, unknown>;

const DURUM_FILTRELERI = [
  { key: "tumu", label: "Tümü" },
  { key: "onay-bekliyor", label: "Onay Bekliyor" },
  { key: "onaylandi", label: "Onaylandı" },
  { key: "kargoda", label: "Kargoda" },
  { key: "teslim-edildi", label: "Teslim Edildi" },
  { key: "iptal", label: "İptal" },
] as const;

const durumBilgisi: Record<string, { label: string; icon: typeof CheckCircleIcon; className: string; nextStatus: string; nextLabel: string }> = {
  "onay-bekliyor": { label: "Onay Bekliyor", icon: ClockIcon, className: "bg-amber-500/10 text-amber-400 border-amber-500/30", nextStatus: "confirmed", nextLabel: "Onayla" },
  "onaylandi": { label: "Onaylandı", icon: CheckCircleIcon, className: "bg-purple-500/10 text-purple-400 border-purple-500/30", nextStatus: "shipped", nextLabel: "Kargoya Ver" },
  "uretimde": { label: "Üretimde", icon: ClockIcon, className: "bg-blue-500/10 text-blue-400 border-blue-500/30", nextStatus: "shipped", nextLabel: "Kargoya Ver" },
  "kargoda": { label: "Kargoda", icon: TruckIcon, className: "bg-sky-500/10 text-sky-400 border-sky-500/30", nextStatus: "delivered", nextLabel: "Teslim Edildi İşaretle" },
  "teslim-edildi": { label: "Teslim Edildi", icon: CheckCircleIcon, className: "bg-green-500/10 text-green-400 border-green-500/30", nextStatus: "cancelled", nextLabel: "İptal Et" },
  "iptal": { label: "İptal", icon: XCircleIcon, className: "bg-surface text-muted border-border", nextStatus: "pending", nextLabel: "Yeniden Aç" },
};

function mapStatus(status: string): Siparis["durum"] {
  switch (status) {
    case "pending":
    case "whatsapp_pending":
      return "onay-bekliyor";
    case "confirmed":
      return "onaylandi";
    case "production":
      return "uretimde";
    case "shipped":
      return "kargoda";
    case "delivered":
      return "teslim-edildi";
    case "cancelled":
      return "iptal";
    default:
      return "onay-bekliyor";
  }
}

function stringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function numberValue(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function mapOrder(order: RawOrder): Siparis {
  const realUuid = stringValue(order._id);
  const items: RawOrderItem[] = Array.isArray(order.items)
    ? order.items.filter(
        (item): item is RawOrderItem => typeof item === "object" && item !== null
      )
    : [];
  const productNames = items
    .map((item) => stringValue(item.name))
    .filter(Boolean)
    .join(", ");
  const colors = items
    .map((item) => {
      const color = stringValue(item.color);
      const config =
        item.configuration && typeof item.configuration === "object"
          ? item.configuration
          : null;
      if (!config) return color;
      const bits = [
        stringValue((config as { vehicle?: unknown }).vehicle),
        stringValue((config as { baseColor?: unknown }).baseColor)
          ? `taban:${stringValue((config as { baseColor?: unknown }).baseColor)}`
          : "",
        stringValue((config as { edgeColor?: unknown }).edgeColor)
          ? `kenar:${stringValue((config as { edgeColor?: unknown }).edgeColor)}`
          : "",
        (config as { heelPad?: unknown }).heelPad ? "topuk" : "",
        (config as { trunkMat?: unknown }).trunkMat ? "bagaj" : "",
      ].filter(Boolean);
      return bits.length ? `${color} (${bits.join(" · ")})` : color;
    })
    .filter(Boolean)
    .join(", ");
  const totalQuantity = items.reduce(
    (sum, item) => sum + Math.max(1, numberValue(item.quantity, 1)),
    0
  );
  const createdAtTimestamp = numberValue(order.createdAt, NaN);
  const createdDate = Number.isFinite(createdAtTimestamp)
    ? new Date(createdAtTimestamp)
    : new Date();
  const status = stringValue(order.status, "pending");
  const note = stringValue(order.notes);

  return {
    id: realUuid ? `#${realUuid.slice(-6).toUpperCase()}` : "#—",
    musteri: stringValue(order.customerName, "İsim belirtilmemiş"),
    telefon: stringValue(order.customerPhone, "Telefon belirtilmemiş"),
    urun: productNames || "Ürün belirtilmemiş",
    renk: colors || "Standart",
    adet: Math.max(1, totalQuantity),
    tutar: numberValue(order.total),
    durum: mapStatus(status),
    odeme: "WhatsApp Onay",
    tarih: Number.isNaN(createdDate.getTime())
      ? "Tarih belirtilmemiş"
      : createdDate.toLocaleDateString("tr-TR"),
    not: note || undefined,
    realUuid,
  };
}

function whatsappNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("90")) return digits;
  if (digits.startsWith("0")) return `90${digits.slice(1)}`;
  if (digits.startsWith("5")) return `90${digits}`;
  return digits;
}

const LOAD_ERROR_MESSAGE =
  "Siparişler alınamadı. Convex bağlantısını ve dev sunucusunun çalıştığını kontrol edin (npx convex dev).";

export default function AdminSiparisler() {
  const convexReady = isConvexConfiguredClient();
  const adminKeyState = useAdminConvexKey();
  const adminKey =
    adminKeyState.status === "ready" ? adminKeyState.adminKey : null;
  const orders = useQuery(
    api.orders.listAll,
    convexReady && adminKey ? { adminKey } : "skip"
  );
  const updateStatusMutation = useMutation(api.orders.updateStatus);

  const [actionError, setActionError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [durumFilter, setDurumFilter] = useState("tumu");
  const [search, setSearch] = useState("");
  const [selectedSiparis, setSelectedSiparis] = useState<Siparis | null>(null);

  const loading =
    convexReady &&
    (adminKeyState.status === "loading" ||
      (adminKey !== null && orders === undefined));
  const loadError = !convexReady
    ? LOAD_ERROR_MESSAGE
    : adminKeyState.status === "error"
      ? adminKeyState.message
      : null;
  const siparisler = useMemo(
    () => (convexReady && orders !== undefined ? (orders as RawOrder[]).map((order) => mapOrder(order)) : []),
    [convexReady, orders]
  );

  const fetchOrders = useCallback(async () => {
    window.location.reload();
  }, []);

  async function updateOrderStatus(siparis: Siparis) {
    if (!siparis.realUuid) return;
    if (!adminKey) {
      setActionError(
        adminKeyState.status === "error"
          ? adminKeyState.message
          : "Admin yetkisi yükleniyor. Birkaç saniye sonra tekrar deneyin."
      );
      return;
    }
    const currentConf = durumBilgisi[siparis.durum];
    const nextStatus = currentConf?.nextStatus || "pending";

    try {
      setActionError(null);
      setUpdatingOrderId(siparis.realUuid);
      await updateStatusMutation({
        adminKey,
        id: siparis.realUuid as Id<"orders">,
        status: nextStatus,
      });
      setSelectedSiparis(null);
    } catch (err) {
      console.error("Error updating order status:", err);
      setActionError(
        "Sipariş durumu güncellenemedi. Bağlantıyı ve güncelleme erişimini kontrol edip yeniden deneyin."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  }

  const filtered = siparisler.filter((s) => {
    if (durumFilter !== "tumu" && s.durum !== durumFilter) return false;
    if (search) {
      const q = search.toLocaleLowerCase("tr-TR");
      return `${s.musteri} ${s.urun} ${s.id}`.toLocaleLowerCase("tr-TR").includes(q);
    }
    return true;
  });

  const totalCiro = filtered.reduce((sum, s) => sum + (s.durum !== "iptal" ? s.tutar : 0), 0);
  const selectedWhatsappNumber = selectedSiparis
    ? whatsappNumber(selectedSiparis.telefon)
    : "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">
            Siparişler
          </h1>
          <p className="mt-1 text-sm text-muted" aria-live="polite">
            {loading
              ? "Siparişler yükleniyor..."
              : loadError
                ? "Sipariş verisine ulaşılamadı"
                : `${filtered.length} sipariş · Toplam: ${formatPrice(totalCiro)}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void fetchOrders()}
          disabled={loading}
          className="inline-flex min-h-11 items-center justify-center gap-2 border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-brand-red hover:text-brand-red disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          <RefreshCwIcon
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          {loading ? "Yükleniyor" : "Yenile"}
        </button>
      </div>

      {/* Filtreler */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {DURUM_FILTRELERI.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setDurumFilter(f.key)}
              className={`border px-4 py-1.5 text-xs font-semibold transition-colors ${
                durumFilter === f.key
                  ? "border-brand-red bg-brand-red text-white"
                  : "border-border bg-surface text-muted hover:border-border"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <label htmlFor="admin-order-search" className="sr-only">
            Müşteri, ürün veya sipariş numarası ara
          </label>
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            id="admin-order-search"
            name="orderSearch"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Müşteri veya sipariş ara..."
            className="w-full border border-border py-2 pl-10 pr-4 text-sm focus:border-white focus:outline-none sm:w-64"
          />
        </div>
      </div>

      {/* Sipariş listesi */}
      <div className="overflow-hidden border border-border bg-surface">
        {loading ? (
          <div className="px-6 py-16 text-center" role="status">
            <RefreshCwIcon className="mx-auto h-7 w-7 animate-spin text-white" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold text-foreground">Siparişler yükleniyor</p>
            <p className="mt-1 text-xs text-muted">Bu işlem bağlantı hızına göre birkaç saniye sürebilir.</p>
          </div>
        ) : loadError ? (
          <div className="px-5 py-12 text-center" role="alert">
            <AlertTriangleIcon className="mx-auto h-8 w-8 text-amber-400" aria-hidden="true" />
            <p className="mt-3 font-heading text-base font-bold text-white">Siparişler yüklenemedi</p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted">{loadError}</p>
            <button
              type="button"
              onClick={() => void fetchOrders()}
              className="mt-5 inline-flex min-h-11 items-center gap-2 bg-brand-red px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-red-dark"
            >
              <RefreshCwIcon className="h-4 w-4" aria-hidden="true" />
              Tekrar Dene
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FilterIcon className="mx-auto h-8 w-8 text-white" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold text-foreground">
              {siparisler.length === 0 ? "Henüz sipariş yok" : "Eşleşen sipariş bulunamadı"}
            </p>
            <p className="mt-1 text-xs text-muted">
              {siparisler.length === 0
                ? "Yeni siparişler geldiğinde burada görünecek."
                : "Arama metnini veya durum filtrelerini değiştirin."}
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-border md:hidden">
              {filtered.map((s) => {
                const d = durumBilgisi[s.durum] || durumBilgisi["onay-bekliyor"];
                const DurumIcon = d.icon;
                return (
                  <article key={s.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-xs font-semibold text-brand-red">{s.id}</p>
                        <h2 className="mt-1 text-sm font-bold text-white">{s.musteri}</h2>
                        <p className="mt-0.5 text-xs text-muted">{s.telefon}</p>
                      </div>
                      <p className="shrink-0 font-heading text-base font-extrabold text-white">
                        {formatPrice(s.tutar)}
                      </p>
                    </div>
                    <div>
                      <p className="line-clamp-2 text-sm text-foreground">{s.urun}</p>
                      <p className="mt-1 text-xs text-muted">{s.renk} · {s.adet} adet</p>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[11px] font-semibold ${d.className}`}>
                          <DurumIcon className="h-3 w-3" aria-hidden="true" />
                          {d.label}
                        </span>
                        <p className="text-[11px] text-muted">{s.tarih}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedSiparis(selectedSiparis?.id === s.id ? null : s)}
                        className="min-h-11 border border-brand-red px-4 text-xs font-bold text-brand-red"
                        aria-expanded={selectedSiparis?.id === s.id}
                      >
                        Detayları Gör
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted">Sipariş</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted">Müşteri</th>
                <th className="hidden px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted lg:table-cell">Ürün</th>
                <th className="hidden px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted lg:table-cell">Ödeme</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted text-right">Tutar</th>
                <th className="hidden px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted md:table-cell">Durum</th>
                <th className="hidden px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted lg:table-cell">Tarih</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((s) => {
                const d = durumBilgisi[s.durum] || durumBilgisi["onay-bekliyor"];
                const DurumIcon = d.icon;
                return (
                  <tr key={s.id} className="transition-colors hover:bg-surface-hover">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs font-semibold text-brand-red">{s.id}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-white">{s.musteri}</p>
                      <p className="text-xs text-muted">{s.telefon}</p>
                    </td>
                    <td className="hidden px-5 py-3.5 lg:table-cell">
                      <div className="max-w-[180px]">
                        <p className="truncate text-foreground" title={s.urun}>{s.urun}</p>
                        <p className="text-xs text-muted">{s.renk} · {s.adet} adet</p>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3.5 text-xs text-muted lg:table-cell">{s.odeme}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-white">{formatPrice(s.tutar)}</td>
                    <td className="hidden px-5 py-3.5 md:table-cell">
                      <span className={`inline-flex items-center gap-1.5 border px-2.5 py-0.5 text-[11px] font-semibold ${d.className}`}>
                        <DurumIcon className="h-3 w-3" aria-hidden="true" />
                        {d.label}
                      </span>
                    </td>
                    <td className="hidden px-5 py-3.5 text-xs text-muted lg:table-cell">{s.tarih}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedSiparis(selectedSiparis?.id === s.id ? null : s)}
                        className="text-xs font-semibold text-brand-red hover:underline"
                      >
                        Detay
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
            </div>
          </>
        )}
      </div>

      {/* Sipariş detay paneli */}
      {selectedSiparis && (
        <div className="border border-brand-red/30 bg-surface p-4 shadow-lg sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-sm font-bold text-brand-red">{selectedSiparis.id}</span>
              <h3 className="font-heading mt-1 text-lg font-bold text-white">{selectedSiparis.urun}</h3>
            </div>
            <button
              type="button"
              onClick={() => setSelectedSiparis(null)}
              className="flex h-11 w-11 shrink-0 items-center justify-center text-muted hover:bg-surface-hover hover:text-white"
              aria-label="Sipariş detayını kapat"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="bg-background p-3">
              <span className="text-[11px] font-bold uppercase text-muted">Müşteri</span>
              <p className="mt-0.5 text-sm font-semibold text-white">{selectedSiparis.musteri}</p>
              <p className="text-xs text-muted">{selectedSiparis.telefon}</p>
            </div>
            <div className="bg-background p-3">
              <span className="text-[11px] font-bold uppercase text-muted">Renk / Adet</span>
              <p className="mt-0.5 text-sm font-semibold text-white">{selectedSiparis.renk}</p>
              <p className="text-xs text-muted">{selectedSiparis.adet} adet</p>
            </div>
            <div className="bg-background p-3">
              <span className="text-[11px] font-bold uppercase text-muted">Ödeme / Tutar</span>
              <p className="mt-0.5 text-sm font-semibold text-white">{selectedSiparis.odeme}</p>
              <p className="text-xs text-muted">Toplam: {formatPrice(selectedSiparis.tutar)}</p>
            </div>
          </div>
          {selectedSiparis.not && (
            <div className="mt-3 bg-amber-500/10 p-3">
              <span className="text-[11px] font-bold uppercase text-amber-400">Not</span>
              <p className="mt-0.5 text-sm text-amber-400">{selectedSiparis.not}</p>
            </div>
          )}
          {actionError ? (
            <p role="alert" className="mt-3 border border-brand-red/30 bg-brand-red/10 p-3 text-sm text-foreground">
              {actionError}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void updateOrderStatus(selectedSiparis)}
              disabled={updatingOrderId === selectedSiparis.realUuid}
              className="inline-flex min-h-11 items-center gap-1.5 bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700 disabled:cursor-wait disabled:opacity-60"
            >
              {updatingOrderId === selectedSiparis.realUuid ? (
                <RefreshCwIcon className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <CheckCircleIcon className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {updatingOrderId === selectedSiparis.realUuid
                ? "Güncelleniyor"
                : durumBilgisi[selectedSiparis.durum]?.nextLabel || "Durumu Güncelle"}
            </button>
            {selectedWhatsappNumber ? (
              <a
                href={`https://wa.me/${selectedWhatsappNumber}?text=${encodeURIComponent(`Merhaba ${selectedSiparis.musteri}, ${selectedSiparis.id} numaralı siparişiniz hakkında bilgi vermek istiyorum.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 bg-[#25D366] px-4 py-2 text-xs font-bold text-white hover:bg-[#22c35e]"
              >
                <MessageCircleIcon className="h-3.5 w-3.5" aria-hidden="true" />
                WhatsApp ile İletişime Geç
              </a>
            ) : (
              <span className="inline-flex min-h-11 cursor-not-allowed items-center gap-1.5 border border-border px-4 py-2 text-xs font-bold text-muted">
                <MessageCircleIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Geçerli telefon yok
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
