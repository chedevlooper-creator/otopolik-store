"use client";

import {
  BanknoteIcon,
  GemIcon,
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
    <section aria-label="Ürün ve alışveriş güvenceleri" className="border-y border-white/[0.07] bg-[#060606]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-sand/[0.08] px-4 sm:grid-cols-3 lg:grid-cols-5 lg:divide-y-0 lg:px-0">
        {trust.slice(0, 4).map((item) => {
          const Icon =
            (item.iconKey && ICON_MAP[item.iconKey as keyof typeof ICON_MAP]) ||
            RulerIcon;
          return (
            <div key={item.label} className="group flex min-h-[86px] items-center gap-3 bg-[#060606] px-4 py-4 transition-all duration-400 hover:bg-surface sm:px-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center text-sand transition-transform duration-400 group-hover:scale-105">
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-white">{item.label}</p>
                <p className="mt-1 text-xs leading-5 text-white/65">
                  {item.detail}
                </p>
              </div>
            </div>
          );
        })}
        <div className="group flex min-h-[86px] items-center gap-3 bg-[#060606] px-4 py-4 transition-all duration-400 hover:bg-surface sm:px-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center text-sand transition-transform duration-400 group-hover:scale-105">
            <GemIcon className="h-[19px] w-[19px]" aria-hidden="true" />
          </span>
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-white">Uzun ömürlü</p>
            <p className="mt-1 text-xs leading-5 text-white/65">Aşınmaya karşı dayanıklı özel malzeme</p>
          </div>
        </div>
      </div>
    </section>
  );
}
