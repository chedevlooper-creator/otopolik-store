"use client";

import {
  TruckIcon,
  BadgeCheckIcon,
  ShieldCheckIcon,
  RotateCcwIcon,
  type LucideIcon,
} from "lucide-react";
import { useCmsChrome } from "@/context/cms-context";

const DEFAULT_TRUST: { label: string; detail: string; Icon: LucideIcon }[] = [
  {
    label: "Ücretsiz kargo",
    detail: "Belirli tutar üzeri Türkiye geneli",
    Icon: TruckIcon,
  },
  {
    label: "%100 müşteri memnuniyeti",
    detail: "Kalıp uyumu teyit edilerek üretilir",
    Icon: BadgeCheckIcon,
  },
  {
    label: "Güvenli ödeme",
    detail: "Kapıda ödeme seçeneği mevcut",
    Icon: ShieldCheckIcon,
  },
  {
    label: "Kolay iade",
    detail: "Üretim öncesi iptal ve destek",
    Icon: RotateCcwIcon,
  },
];

const ICON_BY_KEY: Record<string, LucideIcon> = {
  ruler: TruckIcon,
  layers: BadgeCheckIcon,
  check: ShieldCheckIcon,
  banknote: RotateCcwIcon,
  truck: TruckIcon,
  shield: ShieldCheckIcon,
};

export default function TrustStrip() {
  const { trust } = useCmsChrome();

  const items =
    trust.length > 0
      ? trust.map((item, i) => ({
          label: item.label,
          detail: item.detail ?? "",
          Icon:
            (item.iconKey && ICON_BY_KEY[item.iconKey]) ||
            DEFAULT_TRUST[i % DEFAULT_TRUST.length]!.Icon,
        }))
      : DEFAULT_TRUST;

  return (
    <section
      aria-label="Alışveriş güvenceleri"
      className="trust-bar border-y border-white/[0.06] bg-[#050608]"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 border-white/[0.04] px-4 py-5 sm:justify-center sm:px-6 sm:py-6 [&:nth-child(odd)]:border-r lg:border-r lg:[&:last-child]:border-r-0"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center text-sand">
              <item.Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/85">
                {item.label}
              </p>
              {item.detail ? (
                <p className="mt-0.5 truncate text-[10px] text-white/40 sm:text-[11px]">
                  {item.detail}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
