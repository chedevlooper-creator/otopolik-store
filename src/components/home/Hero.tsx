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
 * First viewport = one composition:
 * Brand (OTOPOLİK) → one headline → one sentence → CTA group → full-bleed cabin.
 * No trust strips, slide counters, or overlay chips in the hero.
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
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,2,2,.97)_0%,rgba(2,2,2,.88)_24%,rgba(2,2,2,.35)_52%,rgba(2,2,2,.08)_78%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.35)_0%,transparent_38%,rgba(0,0,0,.78)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:pb-24 lg:pt-32">
        <div className="max-w-3xl text-left">
          {/* Brand is the hero signal — not an eyebrow */}
          <p className="hero-brand font-heading text-[clamp(3.4rem,9vw,7.5rem)] font-medium leading-[0.9] tracking-[-0.045em] text-white">
            OTOPOLİK
          </p>

          {/* Laser-cut contour — manufacturing vernacular as signature */}
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

          <h1 className="hero-line mt-8 max-w-xl font-heading text-[clamp(1.55rem,2.8vw,2.35rem)] font-medium leading-[1.2] tracking-[-0.03em] text-sand">
            {headline}
          </h1>

          <p className="hero-fade mt-5 max-w-md text-base leading-7 text-white/70 sm:text-[17px]">
            {hero?.body ??
              "Lazer kesim kalıp. Premium EVA. 1–3 günde kargo."}
          </p>

          <div className="hero-fade hero-fade--late mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href={hero?.ctaHref ?? "/#arac-sec"}
              className="btn-press btn-red-rich inline-flex min-h-12 items-center justify-center gap-2 rounded-sm px-8 text-[11px] font-bold uppercase tracking-[0.12em] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand"
            >
              {hero?.ctaLabel ?? "Aracını seç"}
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={secondary?.ctaHref ?? "/urunler"}
              className="btn-press btn-ghost-rich inline-flex min-h-12 items-center justify-center gap-2 rounded-sm px-8 text-[11px] font-bold uppercase tracking-[0.12em] text-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand"
            >
              {secondary?.ctaLabel ?? "Koleksiyonu keşfet"}
            </Link>
          </div>
        </div>
      </div>

      <a
        href="#arac-sec"
        className="hero-fade absolute bottom-6 left-4 z-20 hidden items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-white/50 transition hover:text-sand focus-visible:text-sand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand sm:left-6 lg:flex"
      >
        <span className="flex h-7 w-4 items-start justify-center rounded-full border border-white/40 p-1" aria-hidden="true">
          <span className="h-1.5 w-px animate-bounce bg-sand" />
        </span>
        Aşağı
      </a>
    </section>
  );
}
