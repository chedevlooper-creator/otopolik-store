import {
  ShoppingBagIcon,
  BanknoteIcon,
  PackageIcon,
  UsersIcon,
  TrendingUpIcon,
  ClockIcon,
  ArrowRightIcon,
  SettingsIcon,
  AlertTriangleIcon,
} from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/admin/StatCard";
import { formatPrice } from "@/lib/format";
import { getDashboardStats } from "@/lib/dashboard-stats";

export const dynamic = "force-dynamic";

const durumStili = (durum: string) => {
  if (durum.includes("Teslim")) return "bg-green-500/10 text-green-400";
  if (durum.includes("Kargo")) return "bg-blue-500/10 text-blue-400";
  if (durum.includes("iptal") || durum.includes("İptal"))
    return "bg-red-500/10 text-red-400";
  if (durum.includes("onay") || durum.includes("Onay") || durum.includes("bekleniyor"))
    return "bg-amber-500/10 text-amber-400";
  return "bg-purple-500/10 text-purple-400";
};

const TREND_UP_THRESHOLD = 0; // %0 üzeri pozitif

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const weeklyMax = Math.max(...stats.weekly.map((d) => d.count), 1);

  return (
    <div className="space-y-8">
      {/* Başlık */}
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">
          OTO POLİK yönetim paneline hoş geldiniz. Son 7 günün özeti.
        </p>
      </div>

      {/* Veri kaynağı uyarısı */}
      {stats.warning ? (
        <div className="flex items-start gap-3 border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-xs text-amber-200">
          <AlertTriangleIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{stats.warning}</p>
        </div>
      ) : null}

      {/* İstatistik kartları */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Toplam Sipariş"
          value={stats.totalOrders}
          change={
            stats.ordersChangePercent === null
              ? null
              : `${stats.ordersChangePercent >= 0 ? "+" : ""}${stats.ordersChangePercent}% son 7 gün`
          }
          icon={ShoppingBagIcon}
          variant="default"
        />
        <StatCard
          label="Toplam Ciro"
          value={formatPrice(stats.totalRevenue)}
          change={
            stats.revenueChangePercent === null
              ? null
              : `${stats.revenueChangePercent >= 0 ? "+" : ""}${stats.revenueChangePercent}% son 7 gün`
          }
          icon={BanknoteIcon}
          variant="green"
        />
        <StatCard
          label="Aktif Ürün"
          value={stats.activeProducts}
          icon={PackageIcon}
          variant="blue"
        />
        <StatCard
          label="Yeni Müşteri"
          value={stats.newCustomers}
          change={
            stats.customersChangePercent === null
              ? null
              : `${stats.customersChangePercent >= 0 ? "+" : ""}${stats.customersChangePercent}% son 7 gün`
          }
          icon={UsersIcon}
          variant="red"
        />
      </div>

      {/* Grafik + Son siparişler */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Haftalık trend */}
        <div className="border border-border bg-surface p-6 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-sm font-bold text-white">
              Haftalık Sipariş
            </h2>
            <TrendingUpIcon
              className="h-4 w-4 text-green-600"
              aria-hidden="true"
            />
          </div>
          <div className="mt-5 flex items-end gap-2 h-32">
            {stats.weekly.map((d, i) => {
              const heightPct = (d.count / weeklyMax) * 100;
              return (
                <div
                  key={`${d.day}-${i}`}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                >
                  <div
                    className="w-full bg-brand-red transition-all hover:bg-brand-red-dark"
                    style={{ height: `${Math.max(heightPct, 3)}%` }}
                    title={`${d.count} sipariş`}
                  />
                  <span className="text-[10px] font-medium text-muted">
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="h-3 w-3" aria-hidden="true" />
              Son güncelleme: az önce
            </span>
            <span
              className={`font-semibold ${
                (stats.ordersChangePercent ?? 0) > TREND_UP_THRESHOLD
                  ? "text-green-600"
                  : "text-muted"
              }`}
            >
              {stats.ordersChangePercent === null
                ? "—"
                : `${stats.ordersChangePercent >= 0 ? "+" : ""}${stats.ordersChangePercent} sipariş`}
            </span>
          </div>
        </div>

        {/* Son siparişler */}
        <div className="border border-border bg-surface p-6 lg:col-span-2">
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
                <tr className="border-b border-border">
                  <th className="pb-3 pl-6 pr-3 text-xs font-bold uppercase tracking-wider text-muted">
                    Sipariş
                  </th>
                  <th className="pb-3 px-3 text-xs font-bold uppercase tracking-wider text-muted">
                    Müşteri
                  </th>
                  <th className="hidden pb-3 px-3 text-xs font-bold uppercase tracking-wider text-muted sm:table-cell">
                    Ürün
                  </th>
                  <th className="pb-3 px-3 text-xs font-bold uppercase tracking-wider text-muted text-right">
                    Tutar
                  </th>
                  <th className="hidden pb-3 px-3 text-xs font-bold uppercase tracking-wider text-muted lg:table-cell">
                    Durum
                  </th>
                  <th className="pb-3 pl-3 pr-6 text-xs font-bold uppercase tracking-wider text-muted text-right">
                    Tarih
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stats.recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-xs text-muted"
                    >
                      Henüz sipariş bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map((s) => (
                    <tr
                      key={s.id}
                      className="transition-colors hover:bg-surface-hover"
                    >
                      <td className="py-3 pl-6 pr-3 font-mono text-xs font-semibold text-brand-red">
                        {s.id}
                      </td>
                      <td className="py-3 px-3 font-medium text-white">
                        {s.musteri}
                      </td>
                      <td className="hidden py-3 px-3 text-muted sm:table-cell">
                        <div className="max-w-[160px] truncate" title={s.urun}>
                          {s.urun}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-white">
                        {formatPrice(s.tutar)}
                      </td>
                      <td className="hidden py-3 px-3 lg:table-cell">
                        <span
                          className={`inline-flex px-2.5 py-0.5 text-[11px] font-semibold ${durumStili(s.durum)}`}
                        >
                          {s.durum}
                        </span>
                      </td>
                      <td className="py-3 pl-3 pr-6 text-right text-xs text-muted">
                        {s.tarih}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Hızlı işlemler */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/olusturucu"
          className="group flex items-center gap-4 border border-border bg-surface p-5 transition-colors hover:border-brand-red/40 hover:shadow-md"
        >
          <span className="flex h-12 w-12 items-center justify-center bg-surface-hover transition-colors group-hover:bg-border">
            <PackageIcon className="h-5 w-5 text-brand-red" />
          </span>
          <div>
            <p className="font-heading text-sm font-bold text-white">
              Özel Tasarım Oluştur
            </p>
            <p className="text-xs text-muted">Müşteriye özel paspas tasarla</p>
          </div>
        </Link>
        <Link
          href="/urunler"
          className="group flex items-center gap-4 border border-border bg-surface p-5 transition-colors hover:border-brand-red/40 hover:shadow-md"
        >
          <span className="flex h-12 w-12 items-center justify-center bg-blue-500/10 transition-colors group-hover:bg-blue-500/20">
            <ShoppingBagIcon className="h-5 w-5 text-blue-400" />
          </span>
          <div>
            <p className="font-heading text-sm font-bold text-white">
              Kataloğu Gör
            </p>
            <p className="text-xs text-muted">
              Ürünleri ön yüzden incele
            </p>
          </div>
        </Link>
        <Link
          href="/admin/ayarlar"
          className="group flex items-center gap-4 border border-border bg-surface p-5 transition-colors hover:border-brand-red/40 hover:shadow-md"
        >
          <span className="flex h-12 w-12 items-center justify-center bg-amber-500/10 transition-colors group-hover:bg-amber-500/20">
            <SettingsIcon className="h-5 w-5 text-amber-400" />
          </span>
          <div>
            <p className="font-heading text-sm font-bold text-white">
              Site Ayarları
            </p>
            <p className="text-xs text-muted">
              İletişim ve kargo bilgilerini güncelle
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
