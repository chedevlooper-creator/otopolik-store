"use client";

import { useCmsChrome } from "@/context/cms-context";

export default function Marquee() {
  const { marquee } = useCmsChrome();
  const items = marquee.map((m) => m.label);

  return (
    <div className="blur-edge overflow-hidden border-y border-white/[0.04] bg-gradient-to-r from-brand-red/[0.03] via-brand-red/[0.06] to-brand-red/[0.03] py-4">
      <div className="animate-marquee spec-value flex w-max gap-12 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.18em] text-white/55 sm:text-[11px]">
        {[...items, ...items].map((item, index) => (
          <span
            key={`${item}-${index}`}
            aria-hidden={index >= items.length || undefined}
            className="flex items-center gap-12"
          >
            {item}
            <span
              className="h-1 w-1 rounded-full bg-brand-red/60 shadow-[0_0_6px_rgba(227,25,55,.5)]"
              aria-hidden="true"
            />
          </span>
        ))}
      </div>
    </div>
  );
}
