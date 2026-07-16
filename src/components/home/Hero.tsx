"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeroMedia from "@/components/home/HeroMedia";
import { ArrowRightIcon, MouseIcon } from "lucide-react";

export default function Hero() {
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.requestAnimationFrame(() => {
      if (reduced) {
        setMotionReady(true);
        return;
      }
      window.requestAnimationFrame(() => setMotionReady(true));
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <section
      className={`relative flex min-h-[calc(100svh-4.5rem)] flex-col overflow-hidden bg-black text-white ${
        motionReady ? "hero-ready" : ""
      }`}
    >
      <div className="absolute inset-0 z-0">
        <HeroMedia />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(0,0,0,.78)_0%,rgba(0,0,0,.45)_45%,rgba(0,0,0,.2)_72%,rgba(0,0,0,.5)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-16 sm:py-20 lg:py-24">
        <div className="max-w-xl lg:max-w-2xl">
          <h1 className="font-heading text-[clamp(2.5rem,5.8vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.04em] text-white">
            <span className="hero-line-mask">
              <span className="hero-line block">Mükemmel Uyum.</span>
            </span>
            <span className="hero-line-mask mt-1 block">
              <span className="hero-line hero-line--2 block">Üstün Koruma.</span>
            </span>
          </h1>

          <p className="hero-fade mt-6 max-w-md text-sm leading-7 text-white/65 sm:text-[0.95rem] sm:leading-8">
            3D tarama ve CNC kesimle aracınıza özel üretilen premium EVA paspaslar.
            Su tutar, kokmaz, dört mevsim dayanır.
          </p>

          <div className="hero-fade hero-fade--late mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/#arac-sec"
              className="btn-press btn-sand-rich inline-flex min-h-12 items-center justify-center gap-2 px-7 text-[11px] font-bold uppercase tracking-[0.12em] text-background"
            >
              Aracını seç
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/urunler"
              className="btn-press inline-flex min-h-12 items-center justify-center gap-2 border border-white/25 bg-transparent px-7 text-[11px] font-bold uppercase tracking-[0.12em] text-white/90 transition-colors hover:border-white/45 hover:bg-white/[0.04]"
            >
              Koleksiyonu keşfet
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-end justify-between px-4 pb-8">
        <a
          href="#ozellikler"
          className="hero-fade inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-sand"
        >
          <MouseIcon className="h-4 w-4" aria-hidden="true" />
          Scroll
        </a>
        <ol className="hero-fade hidden items-center gap-3 sm:flex" aria-hidden="true">
          {["01", "02", "03", "04"].map((n, i) => (
            <li
              key={n}
              className={`font-mono text-[10px] tracking-[0.14em] ${
                i === 0 ? "text-sand" : "text-white/30"
              }`}
            >
              {n}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
