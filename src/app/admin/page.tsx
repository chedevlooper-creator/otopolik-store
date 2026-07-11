"use client";

import {
  ShoppingBagIcon,
  BanknoteIcon,
  PackageIcon,
  UsersIcon,
  TrendingUpIcon,
  ClockIcon,
  ArrowRightIcon,
  SettingsIcon,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import DataTable from "@/components/admin/DataTable";
import { formatPrice } from "@/lib/format";

const SON_SIPARISLER = [
  {
    id: "#1024",
    musteri: "Ahmet Yılmaz",
    urun: "VW Golf 8 3D EVA Paspas",
    renk: "Siyah / Kırmızı kenar",
    tutar: 1299,
    durum: "Kargoya verildi",
    tarih: "11 Tem 2026",
  },
  {
    id: "#1023",
    musteri: "Zeynep Kaya",
    urun: "Renault Clio 5 Havuzlu EVA Paspas",
    renk: "Gri / Bej kenar",
    tutar: 1899,
    durum: "Onaylandı — üretimde",
    tarih: "10 Tem 2026",
  },
  {
    id: "#1022",
    musteri: "Mehmet Demir",
    urun: "Özel Tasarım EVA Paspas",
    renk: "Bej taban / Lacivert kenar + topuk pedi",
    tutar: 1547,
    durum: "WhatsApp onayı bekleniyor",
    tarih: "10 Tem 2026",
  },
  {
    id: "#1021",
    musteri: "Ayşe Çelik",
    urun: "Fiat Egea 3D EVA Paspas",
    renk: "Siyah / Siyah kenar",
    tutar: 1149,
    durum: "Teslim edildi",
    tarih: "9 Tem 2026",
  },
  {
    id: "#1020",
    musteri: "Burak Aslan",
    urun: "Toyota Corolla Havuzlu EVA + Bagaj Seti",
    renk: "Antrasit / Gri kenar + bagaj",
    tutar: 2348,
    durum: "Kargoya verildi",
    tarih: "8 Tem 2026",
  },
];

const durumStili = (durum: string) => {
  if (durum.includes("Teslim")) return "bg-green-50 text-green-700";
  if (durum.includes("Kargo")) return "bg-blue-50 text-blue-700";
  if (durum.includes("onay")) return "bg-amber-50 text-amber-700";
  return "bg-purple-50 text-purple-700";
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Başlık */}
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          OTO POLİK yönetim paneline hoş geldiniz. Son 7 günün özeti.
        </p>
      </div>

      {/* İstatistik kartları */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Toplam Sipariş"
          value={24}
          change="+12%"
          icon={ShoppingBagIcon}
          variant="default"
        />
        <StatCard
          label="Toplam Ciro"
          value={`${formatPrice(38420)}`}
          change="+18%"
          icon={BanknoteIcon}
          variant="green"
        />
        <StatCard
          label="Aktif Ürün"
          value={27}
          icon={PackageIcon}
          variant="blue"
        />
        <StatCard
          label="Yeni Müşteri"
          value={18}
          change="+8%"
          icon={UsersIcon}
          variant="red"
        />
      </div>

      {/* Grafik placeholder + Son siparişler */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Haftalık trend */}
        <div className="rounded-2xl border border-neutral-700 bg-[#141414] p-6 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-sm font-bold text-white">
              Haftalık Sipariş
            </h2>
            <TrendingUpIcon className="h-4 w-4 text-green-600" aria-hidden="true" />
          </div>
          <div className="mt-5 flex items-end gap-2 h-32">
            {[8, 12, 5, 15, 9, 14, 24].map((val, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className="w-full rounded-t-md bg-brand-red transition-all hover:bg-brand-red-dark"
                  style={{ height: `${(val / 24) * 100}%` }}
                />
                <span className="text-[10px] font-medium text-neutral-400">
                  {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"][i]}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-neutral-800 pt-3 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="h-3 w-3" aria-hidden="true" />
              Son güncelleme: az önce
            </span>
            <span className="font-semibold text-green-600">+24 sipariş</span>
          </div>
        </div>

        {/* Son siparişler */}
        <div className="rounded-2xl border border-neutral-700 bg-[#141414] p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-sm font-bold text-white">
              Son Siparişler
            </h2>
            <a
              href="/admin/siparisler"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:underline"
            >
              Tümünü gör
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="mt-4 -mx-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="pb-3 pl-6 pr-3 text-xs font-bold uppercase tracking-wider text-neutral-500">Sipariş</th>
                  <th className="pb-3 px-3 text-xs font-bold uppercase tracking-wider text-neutral-500">Müşteri</th>
                  <th className="hidden pb-3 px-3 text-xs font-bold uppercase tracking-wider text-neutral-500 sm:table-cell">Ürün</th>
                  <th className="pb-3 px-3 text-xs font-bold uppercase tracking-wider text-neutral-500 text-right">Tutar</th>
                  <th className="hidden pb-3 px-3 text-xs font-bold uppercase tracking-wider text-neutral-500 lg:table-cell">Durum</th>
                  <th className="pb-3 pl-3 pr-6 text-xs font-bold uppercase tracking-wider text-neutral-500 text-right">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {SON_SIPARISLER.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-neutral-800/50">
                    <td className="py-3 pl-6 pr-3 font-mono text-xs font-semibold text-brand-red">{s.id}</td>
                    <td className="py-3 px-3 font-medium text-white">{s.musteri}</td>
                    <td className="hidden py-3 px-3 text-neutral-500 sm:table-cell">
                      <div className="max-w-[160px] truncate" title={s.urun}>{s.urun}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-white">{formatPrice(s.tutar)}</td>
                    <td className="hidden py-3 px-3 lg:table-cell">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${durumStili(s.durum)}`}>
                        {s.durum}
                      </span>
                    </td>
                    <td className="py-3 pl-3 pr-6 text-right text-xs text-neutral-400">{s.tarih}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Hızlı işlemler */}
      <div className="grid gap-4 sm:grid-cols-3">
        <a
          href="/olusturucu"
          className="group flex items-center gap-4 rounded-2xl border border-neutral-700 bg-[#141414] p-5 transition-colors hover:border-brand-red/40 hover:shadow-md"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-800 transition-colors group-hover:bg-neutral-600">
            <PackageIcon className="h-5 w-5 text-brand-red" />
          </span>
          <div>
            <p className="font-heading text-sm font-bold text-white">Özel Tasarım Oluştur</p>
            <p className="text-xs text-neutral-500">Müşteriye özel paspas tasarla</p>
          </div>
        </a>
        <a
          href="/urunler"
          className="group flex items-center gap-4 rounded-2xl border border-neutral-700 bg-[#141414] p-5 transition-colors hover:border-brand-red/40 hover:shadow-md"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 transition-colors group-hover:bg-blue-100">
            <ShoppingBagIcon className="h-5 w-5 text-blue-700" />
          </span>
          <div>
            <p className="font-heading text-sm font-bold text-white">Kataloğu Gör</p>
            <p className="text-xs text-neutral-500">Ürünleri ön yüzden incele</p>
          </div>
        </a>
        <a
          href="/admin/ayarlar"
          className="group flex items-center gap-4 rounded-2xl border border-neutral-700 bg-[#141414] p-5 transition-colors hover:border-brand-red/40 hover:shadow-md"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 transition-colors group-hover:bg-amber-100">
            <SettingsIcon className="h-5 w-5 text-amber-700" />
          </span>
          <div>
            <p className="font-heading text-sm font-bold text-white">Site Ayarları</p>
            <p className="text-xs text-neutral-500">İletişim ve kargo bilgilerini güncelle</p>
          </div>
        </a>
      </div>
    </div>
  );
}
