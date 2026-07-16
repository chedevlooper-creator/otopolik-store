"use client";

import {
  BanknoteIcon,
  Layers3Icon,
  MessageCircleCheckIcon,
  RulerIcon,
} from "lucide-react";
import { useCmsChrome } from "@/context/cms-context";

const ICON_MAP = {
  ruler: RulerIcon,
  layers: Layers3Icon,
  check: MessageCircleCheckIcon,
  banknote: BanknoteIcon,
} as const;

export default function TrustStrip() {
  const { trust } = useCmsChrome();

  return (
    <section aria-label="Ürün ve alışveriş güvenceleri" className="border-y border-white/[0.04] bg-[#070810]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/[0.04] px-4 sm:px-0 lg:grid-cols-4">
        {trust.map((item) => {
          const Icon =
            (item.iconKey && ICON_MAP[item.iconKey as keyof typeof ICON_MAP]) ||
            RulerIcon;
          return (
            <div key={item.label} className="group flex min-h-24 items-center gap-4 bg-background px-4 py-6 transition-all duration-400 hover:bg-surface sm:px-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-sand transition-all duration-400 group-hover:border-sand/20 group-hover:bg-sand/[0.06] group-hover:shadow-[0_0_20px_rgba(223,200,150,.08)]">
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="mt-1 text-[11px] leading-4 text-white/55 sm:text-xs">
                  {item.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
