"use client";

import { useMemo } from "react";
import Image from "next/image";
import { SearchIcon, ZoomInIcon } from "lucide-react";

const COLORS = [
  { name: "Siyah", hex: "#1a1a1a", image: "/media/scraped/evaotopaspas/paspas-seti/01-siyah-urun.png" },
  { name: "Gri", hex: "#8a8a8a", image: "/media/galeri/paspas-seti/15-gri-surucu.jpg" },
  { name: "Bej", hex: "#c9b79c", image: "/media/galeri/paspas-seti/01-taba-surucu-detay.jpg" },
  { name: "Kırmızı", hex: "#c41e3a", image: "/media/scraped/evaotopaspas/paspas-seti/02-siyah-urun-tam.png" },
  { name: "Mavi", hex: "#2c4a6e", image: "/media/galeri/paspas-seti/16-mavi-on-yolcu.jpg" },
  { name: "Beyaz", hex: "#e8e4dc", image: "/media/galeri/paspas-seti/12-siyah-beyaz-kenar-arka.jpg" },
] as const;

type Props = {
  color: string;
  onColorChange: (name: string) => void;
};

export default function ColorPreview({ color, onColorChange }: Props) {
  const active = useMemo(
    () => COLORS.find((c) => c.name === color) ?? COLORS[0],
    [color]
  );

  return (
    <section className="home-section border-t border-white/[0.04] bg-[#050608]" aria-label="Renk önizleme">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 lg:grid-cols-[1fr_1.4fr_auto]">
        <div>
          <p className="section-kicker">Renk</p>
          <h2 className="mt-4 font-heading text-2xl font-bold tracking-[-0.03em] text-white sm:text-3xl">
            Rengini seç
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {COLORS.map((c) => {
              const selected = c.name === active.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => onColorChange(c.name)}
                  className={`group flex flex-col items-center gap-2 ${selected ? "text-sand" : "text-white/50"}`}
                  aria-pressed={selected}
                >
                  <span
                    className={`h-10 w-10 rounded-full border-2 transition-transform ${
                      selected
                        ? "scale-110 border-sand"
                        : "border-white/20 group-hover:border-white/40"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(223,200,150,0.12),transparent_65%)]" />
          <Image
            src={active.image}
            alt={`${active.name} EVA paspas seti`}
            fill
            className="object-contain p-4 drop-shadow-[0_30px_60px_rgba(0,0,0,0.65)]"
            sizes="(max-width: 768px) 90vw, 28rem"
          />
        </div>

        <div className="hidden flex-col gap-3 lg:flex" aria-hidden="true">
          <span className="inline-flex h-11 w-11 items-center justify-center border border-white/15 text-sand">
            <SearchIcon className="h-4 w-4" />
          </span>
          <span className="inline-flex h-11 w-11 items-center justify-center border border-white/15 text-sand">
            <ZoomInIcon className="h-4 w-4" />
          </span>
          <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
            Examine
          </span>
        </div>
      </div>
    </section>
  );
}

export { COLORS };
export type { Props as ColorPreviewProps };
