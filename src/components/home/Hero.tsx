"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import VehicleFinder from "@/components/home/VehicleFinder";
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
 * Hero animasyonları hydrate sonrası başlar — production'da CSS erken yüklenip
 * animasyonun kullanıcı görmeden bitmesini engeller.
 */
export default function Hero({ content }: Props) {
  const hero = content?.hero;
  const secondary = content?.secondaryCta;
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setMotionReady(true);
      return;
    }
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setMotionReady(true));
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <section
      className={`relative flex min-h-[calc(100svh-7.25rem)] flex-col justify-between overflow-hidden bg-black text-white lg:min-h-[calc(100svh-7.75rem)] ${
        motionReady ? "hero-ready" : ""
      }`}
    >
      <div className="absolute inset-0 z-0">
        <HeroMedia />
        {/* Spotlight efekti — merkezi ışık hüzmesi */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_40%,rgba(227,25,55,0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.45)_0%,rgba(0,0,0,.65)_40%,rgba(0,0,0,.88)_75%,rgba(0,0,0,.96)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-0 pt-12 sm:pt-16 lg:pt-20">
        {/* Merkezi sinematik başlık */}
        <div className="mx-auto max-w-5xl text-center">
          <div className="hero-kicker inline-flex items-center gap-2.5 rounded-full border border-sand/15 bg-sand/[0.04] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-sand/90 backdrop-blur-sm sm:text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red shadow-[0_0_8px_rgba(227,25,55,.6)]" aria-hidden="true" />
            <span>
              {hero?.eyebrow ??
                "Araca Özel Kalıp • Premium EVA • 1-3 Günde Kargo"}
            </span>
          </div>

          <h1 className="mt-8 font-heading text-[clamp(2.75rem,7.5vw,5.75rem)] font-bold leading-[0.96] tracking-[-0.04em]">
            <span className="hero-line-mask">
              <span className="hero-line block">
                {hero?.title ?? "ARACINIZIN TABANINA"}
              </span>
            </span>
            <span className="hero-line-mask mt-2 sm:mt-3">
              <span className="hero-line hero-line--2 relative inline-block pb-2 text-sand sm:pb-3">
                {hero?.subtitle ?? "MİLİMETRİK UYUM"}
                <span
                  className="hero-underline absolute bottom-0 left-0 h-1 w-full rounded-full bg-gradient-to-r from-brand-red to-[#ff4d6a] sm:h-1.5"
                  aria-hidden="true"
                />
              </span>
            </span>
          </h1>

          <p className="hero-fade mx-auto mt-7 max-w-2xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
            {hero?.body ??
              "Marka ve modelinize göre kalıplanan EVA paspas setleri. Suyu ve çamuru içinde tutar, tek sıkım suyla temizlenir, dört mevsim dayanır."}
          </p>

          <div className="hero-fade hero-fade--late mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={hero?.ctaHref ?? "/olusturucu"}
              className="btn-press inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-gradient-to-b from-brand-red to-brand-red-dark px-8 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_20px_60px_rgba(227,25,55,.28),inset_0_1px_0_rgba(255,255,255,.12)] hover:from-[#f02142] hover:to-brand-red"
            >
              {hero?.ctaLabel ?? "PASPASINI TASARLA"}
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={secondary?.ctaHref ?? "/urunler"}
              className="btn-press inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] px-8 text-sm font-bold uppercase tracking-[0.08em] text-white/90 backdrop-blur-sm hover:border-sand/40 hover:bg-white/[0.07] hover:text-sand"
            >
              {secondary?.ctaLabel ?? "ÜRÜNLERİ İNCELE"}
            </Link>
          </div>
        </div>

        <div className="relative z-10 mt-14 -mb-px sm:mt-18 lg:mt-22">
          <VehicleFinder />
        </div>
      </div>
    </section>
  );
}
