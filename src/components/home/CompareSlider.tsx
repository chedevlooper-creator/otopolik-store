"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { CheckIcon, XIcon } from "lucide-react";

const LEFT = {
  title: "Standart halı paspas",
  points: ["Toz ve kiri emer", "Koku yapabilir", "Çabuk aşınır"],
  image: "/media/galeri/paspas-seti/14-gri-arka-sira.jpg",
};

const RIGHT = {
  title: "OTO POLİK EVA",
  points: ["Kiri hücrelerde tutar", "Kokusuz formül", "Tek sıkımda temizlenir"],
  image: "/media/scraped/evaotopaspas/paspas-seti/05-comparison.webp",
};

export default function CompareSlider() {
  const [pos, setPos] = useState(50);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(92, Math.max(8, next)));
  }, []);

  return (
    <section className="home-section compare-section border-t border-white/[0.04] bg-[#07080c]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-2xl">
          <p className="section-kicker">Karşılaştırma</p>
          <h2 className="section-title mt-5">Neden EVA?</h2>
          <p className="mt-4 text-sm leading-7 text-white/55">
            Klasik halı paspas ile premium EVA farkını kaydırarak görün.
          </p>
        </div>

        <div
          ref={trackRef}
          className="relative mx-auto mt-10 aspect-[16/9] max-w-5xl cursor-ew-resize overflow-hidden border border-white/10 select-none"
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            updateFromClientX(e.clientX);
          }}
          onPointerMove={(e) => {
            if (!dragging.current) return;
            updateFromClientX(e.clientX);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
        >
          <Image
            src={RIGHT.image}
            alt={RIGHT.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 64rem"
            draggable={false}
          />
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          >
            <Image
              src={LEFT.image}
              alt={LEFT.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 64rem"
              draggable={false}
            />
          </div>

          <div
            className="pointer-events-none absolute inset-y-0 z-10 w-px bg-sand"
            style={{ left: `${pos}%` }}
            aria-hidden="true"
          >
            <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-sand bg-black text-[10px] font-bold tracking-wider text-sand">
              ↔
            </span>
          </div>

          <label className="sr-only" htmlFor="compare-range">
            Karşılaştırma kaydırıcısı
          </label>
          <input
            id="compare-range"
            type="range"
            min={8}
            max={92}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            className="absolute inset-x-0 bottom-3 z-20 mx-auto block w-[min(90%,28rem)] accent-[var(--sand)]"
          />
        </div>

        <div className="mx-auto mt-8 grid max-w-5xl gap-6 sm:grid-cols-2">
          <div className="border border-white/8 bg-white/[0.02] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
              {LEFT.title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {LEFT.points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-white/55">
                  <XIcon className="h-4 w-4 text-brand-red" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-sand/25 bg-sand/[0.04] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sand">
              {RIGHT.title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {RIGHT.points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-white/80">
                  <CheckIcon className="h-4 w-4 text-sand" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
