"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeroMedia from "@/components/home/HeroMedia";
import { ArrowRightIcon } from "lucide-react";
import type { ContentSection } from "@/lib/cms-defaults";

type Props = {
  content?: {
    hero: ContentSection | null;
    secondaryCta: ContentSection | null;
  };
};

/**
 * Mac product-launch first viewport:
 * Brand (OTOPOLİK) → one headline → one sentence → CTA group → full-bleed cabin.
 * No trust strips, scroll cues, or overlay chips in the hero.
 */
export default function Hero({ content }: Props) {
  const hero = content?.hero;
  const secondary = content?.secondaryCta;
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setMotionReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const headline =
    hero?.title && hero?.subtitle
      ? `${hero.title} ${hero.subtitle}`.replace(/\s+/g, " ").trim()
      : hero?.title ?? "Araca özel havuzlu paspas";

  return (
    <section
      className={`relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-black text-white ${
        motionReady ? "hero-ready" : ""
      }`}
    >
      <div className="absolute inset-0 z-0">
        <div className="hero-parallax absolute inset-0">
          <HeroMedia />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.96)_0%,rgba(0,0,0,.82)_28%,rgba(0,0,0,.28)_58%,rgba(0,0,0,.06)_82%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.4)_0%,transparent_42%,rgba(0,0,0,.82)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pb-20 pt-24 sm:px-6 sm:pb-24 lg:pb-28">
        <div className="max-w-3xl text-left">
          <p className="hero-brand font-heading text-[clamp(3.2rem,8.5vw,7rem)] font-medium leading-[0.9] tracking-[-0.05em] text-white">
            OTOPOLİK
          </p>

          <svg
            className="hero-laser mt-3 w-full max-w-md text-brand-red"
            viewBox="0 0 420 18"
            fill="none"
            aria-hidden="true"
          >
            <path
              className="hero-laser-path"
              d="M2 12 C48 4, 72 16, 118 9 S190 3, 230 11 S310 16, 360 7 L418 10"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
            <circle className="hero-laser-dot" cx="2" cy="12" r="2" fill="currentColor" />
          </svg>

          <h1 className="hero-line mt-8 max-w-xl font-heading text-[clamp(1.5rem,2.6vw,2.2rem)] font-medium leading-[1.2] tracking-[-0.03em] text-sand">
            {headline}
          </h1>

          <p className="hero-fade mt-5 max-w-md text-base leading-7 text-white/68 sm:text-[17px]">
            {hero?.body ?? "Lazer kesim kalıp. Premium EVA. 1-3 günde kargo."}
          </p>

          <div className="hero-fade hero-fade--late mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-3">
            <Link
              href={hero?.ctaHref ?? "/#arac-sec"}
              className="btn-press btn-red-rich inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-8 text-[11px] font-bold uppercase tracking-[0.12em] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand"
            >
              {hero?.ctaLabel ?? "Aracını seç"}
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={secondary?.ctaHref ?? "/urunler"}
              className="btn-press btn-ghost-rich inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-8 text-[11px] font-bold uppercase tracking-[0.12em] text-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand"
            >
              {secondary?.ctaLabel ?? "Koleksiyonu keşfet"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
