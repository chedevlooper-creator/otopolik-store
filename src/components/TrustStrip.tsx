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
    <section aria-label="Ürün ve alışveriş güvenceleri" className="border-y border-white/8 bg-[#090a0d]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/8 px-4 sm:px-0 lg:grid-cols-4">
        {trust.map((item) => {
          const Icon =
            (item.iconKey && ICON_MAP[item.iconKey as keyof typeof ICON_MAP]) ||
            RulerIcon;
          return (
            <div key={item.label} className="group flex min-h-24 items-center gap-3 bg-background px-3 py-5 transition-colors hover:bg-surface sm:px-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sand transition-colors group-hover:border-sand/25 group-hover:bg-sand/8">
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="mt-1 text-[11px] leading-4 text-white/62 sm:text-xs">
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
