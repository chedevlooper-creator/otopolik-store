"use client";

import { useState, useEffect } from "react";
import {
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  CheckCircleIcon,
  TruckIcon,
  ClockIcon,
  XCircleIcon,
  MessageCircleIcon,
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import { supabase } from "@/lib/supabase";

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
  rawStatus: string;
  realUuid: string;
};

const DURUM_FILTRELERI = [
  { key: "tumu", label: "Tümü" },
  { key: "onay-bekliyor", label: "Onay Bekliyor" },
  { key: "onaylandi", label: "Onaylandı" },
  { key: "kargoda", label: "Kargoda" },
  { key: "teslim-edildi", label: "Teslim Edildi" },
  { key: "iptal", label: "İptal" },
] as const;

const durumBilgisi: Record<string, { label: string; icon: typeof CheckCircleIcon; className: string; nextStatus: string; nextLabel: string }> = {
  "onay-bekliyor": { label: "Onay Bekliyor", icon: ClockIcon, className: "bg-amber-50 text-amber-700 border-amber-200", nextStatus: "confirmed", nextLabel: "Onayla" },
  "onaylandi": { label: "Onaylandı", icon: CheckCircleIcon, className: "bg-purple-50 text-purple-700 border-purple-200", nextStatus: "shipped", nextLabel: "Kargoya Ver" },
  "uretimde": { label: "Üretimde", icon: ClockIcon, className: "bg-blue-50 text-blue-700 border-blue-200", nextStatus: "shipped", nextLabel: "Kargoya Ver" },
  "kargoda": { label: "Kargoda", icon: TruckIcon, className: "bg-sky-50 text-sky-700 border-sky-200", nextStatus: "completed", nextLabel: "Teslim Edildi İşaretle" },
  "teslim-edildi": { label: "Teslim Edildi", icon: CheckCircleIcon, className: "bg-green-50 text-green-700 border-green-200", nextStatus: "cancelled", nextLabel: "İptal Et" },
  "iptal": { label: "İptal", icon: XCircleIcon, className: "bg-neutral-900 text-neutral-500 border-neutral-700", nextStatus: "pending", nextLabel: "Yeniden Aç" },
};

function mapStatus(status: string): Siparis["durum"] {
  switch (status) {
    case "pending":
      return "onay-bekliyor";
    case "confirmed":
      return "onaylandi";
    case "shipped":
      return "kargoda";
    case "completed":
      return "teslim-edildi";
    case "cancelled":
      return "iptal";
    default:
      return "onay-bekliyor";
  }
}

export default function AdminSiparisler() {
  const [siparisler, setSiparisler] = useState<Siparis[]>([]);
  const [loading, setLoading] = useState(true);
  const [durumFilter, setDurumFilter] = useState("tumu");
  const [search, setSearch] = useState("");
  const [selectedSiparis, setSelectedSiparis] = useState<Siparis | null>(null);

  async function fetchOrders() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders from Supabase:", error);
        return;
      }

      if (data) {
        const mapped: Siparis[] = data.map((order: any) => {
          const itemsList = Array.isArray(order.items) ? order.items : [];
          const urunNames = itemsList.map((i: any) => i.name).join(", ") || "Belirtilmemiş";
          const colors = itemsList.map((i: any) => i.color).join(", ") || "Standart";
          const totalQty = itemsList.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0);

          return {
            id: `#${order.id.slice(0, 6).toUpperCase()}`,
            musteri: order.full_name,
            telefon: order.phone,
            urun: urunNames,
            renk: colors,
            adet: totalQty,
            tutar: order.order_total,
            durum: mapStatus(order.status),
            odeme: order.payment_method === "kapida" ? "Kapıda Ödeme" : "WhatsApp Onay",
            tarih: new Date(order.created_at).toLocaleDateString("tr-TR"),
            not: order.note,
            rawStatus: order.status,
            realUuid: order.id,
          };
        });
        setSiparisler(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function updateOrderStatus(siparis: Siparis) {
    if (!siparis.realUuid) return;
    const currentConf = durumBilgisi[siparis.durum];
    const nextStatus = currentConf?.nextStatus || "pending";

    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: nextStatus })
        .eq("id", siparis.realUuid);

      if (error) {
        console.error("Error updating order status:", error);
        alert("Durum güncellenirken hata oluştu.");
        return;
      }

      await fetchOrders();
      setSelectedSiparis(null);
    } catch (err) {
      console.error(err);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">
            Siparişler
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {loading ? "Yükleniyor..." : `${filtered.length} sipariş · Toplam: ${formatPrice(totalCiro)}`}
          </p>
        </div>
        <button
          type="button"
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-600 bg-[#141414] px-5 py-2.5 text-sm font-semibold text-neutral-300 transition-colors hover:border-brand-red hover:text-brand-red"
        >
          Yenile
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
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                durumFilter === f.key
                  ? "border-brand-red bg-brand-red text-white"
                  : "border-neutral-700 bg-[#141414] text-neutral-400 hover:border-neutral-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Müşteri veya sipariş ara..."
            className="w-full rounded-full border border-neutral-600 py-2 pl-10 pr-4 text-sm focus:border-brand-red focus:outline-none sm:w-64"
          />
        </div>
      </div>

      {/* Sipariş listesi */}
      <div className="overflow-hidden rounded-2xl border border-neutral-700 bg-[#141414]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/80">
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-500">Sipariş</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-500">Müşteri</th>
                <th className="hidden px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-500 lg:table-cell">Ürün</th>
                <th className="hidden px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-500 sm:table-cell">Ödeme</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-500 text-right">Tutar</th>
                <th className="hidden px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-500 md:table-cell">Durum</th>
                <th className="hidden px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-500 lg:table-cell">Tarih</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {filtered.map((s) => {
                const d = durumBilgisi[s.durum] || durumBilgisi["onay-bekliyor"];
                const DurumIcon = d.icon;
                return (
                  <tr key={s.id} className="transition-colors hover:bg-neutral-800/50">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs font-semibold text-brand-red">{s.id}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-white">{s.musteri}</p>
                      <p className="text-xs text-neutral-400">{s.telefon}</p>
                    </td>
                    <td className="hidden px-5 py-3.5 lg:table-cell">
                      <div className="max-w-[180px]">
                        <p className="truncate text-neutral-300" title={s.urun}>{s.urun}</p>
                        <p className="text-xs text-neutral-400">{s.renk} · {s.adet} adet</p>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3.5 text-xs text-neutral-500 sm:table-cell">{s.odeme}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-white">{formatPrice(s.tutar)}</td>
                    <td className="hidden px-5 py-3.5 md:table-cell">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${d.className}`}>
                        <DurumIcon className="h-3 w-3" aria-hidden="true" />
                        {d.label}
                      </span>
                    </td>
                    <td className="hidden px-5 py-3.5 text-xs text-neutral-400 lg:table-cell">{s.tarih}</td>
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
        {filtered.length === 0 && (
          <div className="px-6 py-16 text-center">
            <FilterIcon className="mx-auto h-8 w-8 text-neutral-300" aria-hidden="true" />
            <p className="mt-2 text-sm text-neutral-500">
              {loading ? "Siparişler yükleniyor..." : "Filtrelere uygun sipariş bulunamadı."}
            </p>
          </div>
        )}
      </div>

      {/* Sipariş detay paneli */}
      {selectedSiparis && (
        <div className="rounded-2xl border border-brand-red/30 bg-[#141414] p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-sm font-bold text-brand-red">{selectedSiparis.id}</span>
              <h3 className="font-heading mt-1 text-lg font-bold text-white">{selectedSiparis.urun}</h3>
            </div>
            <button
              type="button"
              onClick={() => setSelectedSiparis(null)}
              className="text-neutral-400 hover:text-neutral-400"
              aria-label="Kapat"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-neutral-900 p-3">
              <span className="text-[11px] font-bold uppercase text-neutral-400">Müşteri</span>
              <p className="mt-0.5 text-sm font-semibold text-white">{selectedSiparis.musteri}</p>
              <p className="text-xs text-neutral-500">{selectedSiparis.telefon}</p>
            </div>
            <div className="rounded-xl bg-neutral-900 p-3">
              <span className="text-[11px] font-bold uppercase text-neutral-400">Renk / Adet</span>
              <p className="mt-0.5 text-sm font-semibold text-white">{selectedSiparis.renk}</p>
              <p className="text-xs text-neutral-500">{selectedSiparis.adet} adet</p>
            </div>
            <div className="rounded-xl bg-neutral-900 p-3">
              <span className="text-[11px] font-bold uppercase text-neutral-400">Ödeme / Tutar</span>
              <p className="mt-0.5 text-sm font-semibold text-white">{selectedSiparis.odeme}</p>
              <p className="text-xs text-neutral-500">Toplam: {formatPrice(selectedSiparis.tutar)}</p>
            </div>
          </div>
          {selectedSiparis.not && (
            <div className="mt-3 rounded-xl bg-amber-50 p-3">
              <span className="text-[11px] font-bold uppercase text-amber-700">Not</span>
              <p className="mt-0.5 text-sm text-amber-800">{selectedSiparis.not}</p>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => updateOrderStatus(selectedSiparis)}
              className="inline-flex items-center gap-1.5 rounded-full bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700"
            >
              <CheckCircleIcon className="h-3.5 w-3.5" />
              {durumBilgisi[selectedSiparis.durum]?.nextLabel || "Durumu Güncelle"}
            </button>
            <a
              href={`https://wa.me/905550000000?text=${encodeURIComponent(`Merhaba ${selectedSiparis.musteri}, ${selectedSiparis.id} numaralı siparişiniz hakkında bilgi vermek istiyorum.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold text-white hover:bg-[#22c35e]"
            >
              <MessageCircleIcon className="h-3.5 w-3.5" />
              WhatsApp ile İletişime Geç
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
