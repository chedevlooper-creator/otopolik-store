"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRightIcon,
  CheckIcon,
  RotateCwIcon,
  ScanLineIcon,
} from "lucide-react";

const COLORS = [
  { name: "Siyah", hex: "#111111", image: "/media/configurator/siyah-siyah.png" },
  { name: "Gri", hex: "#5b5b5b", image: "/media/configurator/siyah-gri.png" },
  { name: "Bej", hex: "#c9b38d", image: "/media/configurator/siyah-bej.png" },
  { name: "Turuncu", hex: "#a65d2f", image: "/media/configurator/siyah-turuncu.png" },
  { name: "Mavi", hex: "#234d8f", image: "/media/configurator/siyah-mavi.png" },
  { name: "Mor", hex: "#5d3a73", image: "/media/configurator/siyah-mor.png" },
] as const;

const REAL_APPLICATIONS = [
  {
    src: "/media/galeri/musteri/photo_5906683564177165681_w.webp",
    alt: "Mercedes iç mekânında kahverengi EVA paspas",
    label: "Mercedes-Benz",
  },
  {
    src: "/media/galeri/musteri/photo_5845771899898629465_w.webp",
    alt: "Araç arka sırasında turuncu EVA paspas",
    label: "Turuncu EVA",
  },
  {
    src: "/media/galeri/musteri/photo_5845771899898629467_w.webp",
    alt: "Jeep iç mekânında siyah EVA paspas",
    label: "Jeep",
  },
  {
    src: "/media/galeri/musteri/photo_6030412024262626515_w.webp",
    alt: "Modern araç iç mekânında siyah EVA paspas",
    label: "Siyah EVA",
  },
  {
    src: "/media/galeri/musteri/photo_5866003077058465479_w.webp",
    alt: "Araç iç mekânında mavi EVA paspas",
    label: "Mavi EVA",
  },
] as const;

export default function HomeProductLab() {
  const [selectedColor, setSelectedColor] = useState(0);
  const [comparePosition, setComparePosition] = useState(52);
  const color = COLORS[selectedColor];

  return (
    <section className="border-b border-white/[0.07] bg-[#050505]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-18">
        <div className="grid gap-8 lg:grid-cols-[.62fr_1.34fr_.42fr] lg:items-stretch">
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sand/78">
              Renk seçenekleri
            </span>
            <h2 className="mt-4 font-heading text-4xl font-normal leading-[1.05] text-white sm:text-5xl">
              Tarzınıza Uygun
              <span className="mt-1 block text-sand">Rengi Seçin</span>
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/48">
              İç mekânınızla uyumlu kenar rengini seçin; görünümü anında önizleyin.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-x-3 gap-y-5 sm:flex sm:flex-wrap">
              {COLORS.map((item, index) => {
                const active = index === selectedColor;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedColor(index)}
                    aria-pressed={active}
                    className="group flex flex-col items-center gap-2 text-[10px] text-white/55 transition hover:text-white"
                  >
                    <span
                      className={`relative h-12 w-12 rounded-full border-2 transition-all duration-300 ${
                        active
                          ? "scale-105 border-sand shadow-[0_0_0_4px_rgba(196,165,106,.12)]"
                          : "border-white/18 group-hover:border-white/40"
                      }`}
                      style={{ backgroundColor: item.hex }}
                    >
                      {active ? (
                        <CheckIcon className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" aria-hidden="true" />
                      ) : null}
                    </span>
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="premium-grid relative min-h-[420px] overflow-hidden rounded-2xl border border-sand/12 bg-[#0c0c0c] sm:min-h-[540px]">
            <div className="absolute inset-x-[18%] bottom-[13%] h-20 rounded-[50%] bg-black blur-xl" />
            <div
              className="absolute inset-0 opacity-90 transition duration-500"
              style={{ background: `radial-gradient(circle at 50% 52%, ${color.hex}42 0%, rgba(255,255,255,.03) 28%, transparent 67%)` }}
            />
            <div className="absolute bottom-[9%] left-[13%] right-[13%] h-[31%] rounded-[50%] border border-white/[0.08] bg-[linear-gradient(180deg,#222222,#0a0a0a)] shadow-[0_35px_80px_rgba(0,0,0,.85)]" />
            <Image
              src="/media/scraped/evaotopaspas/paspas-seti/01-siyah-urun.png"
              alt={`${color.name} kenar seçeneğiyle premium EVA paspas seti`}
              fill
              sizes="(min-width: 1024px) 56vw, 100vw"
              quality={90}
              className="z-[2] object-contain p-8 pb-20 transition duration-700 hover:scale-[1.025] sm:p-14 sm:pb-24"
              style={{ filter: `drop-shadow(0 25px 28px rgba(0,0,0,.72)) drop-shadow(0 0 18px ${color.hex}38)` }}
            />
            <div className="absolute right-4 top-4 z-[3] h-24 w-32 overflow-hidden rounded-lg border border-white/10 bg-black/65 shadow-2xl sm:h-28 sm:w-40">
              <Image
                key={color.image}
                src={color.image}
                alt={`${color.name} kenarlı EVA paspasın araç içi önizlemesi`}
                fill
                sizes="160px"
                className="object-cover transition duration-500"
              />
              <span className="absolute bottom-1.5 left-2 rounded-full bg-black/70 px-2 py-1 text-[7px] uppercase tracking-[0.12em] text-white/65 backdrop-blur-sm">
                Araç içi
              </span>
            </div>
            <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/78 via-transparent to-black/10" />
            <div className="absolute bottom-5 left-5 right-5 z-[4] flex items-end justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.16em] text-white/42">Seçili kombinasyon</p>
                <p className="mt-1 font-heading text-xl text-white">Siyah taban · {color.name} kenar</p>
              </div>
              <span className="hidden rounded-full border border-white/15 bg-black/50 px-4 py-2 text-[9px] uppercase tracking-[0.13em] text-sand backdrop-blur-md sm:block">
                Canlı önizleme
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0c0c0c] lg:grid-cols-1">
            <div className="flex flex-col items-center justify-center gap-3 border-b border-r border-white/[0.07] p-6 text-center lg:border-r-0">
              <RotateCwIcon className="h-6 w-6 text-sand" aria-hidden="true" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70">360° Görünüm</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
              <ScanLineIcon className="h-6 w-6 text-sand" aria-hidden="true" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70">Yakınlaştır</p>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-sand/10 pt-16">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sand/78">
                Standart ile premium arasındaki fark
              </span>
              <h2 className="mt-3 font-heading text-3xl font-normal text-white sm:text-5xl">
                Temizliği sürükleyerek görün.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-white/45">
              EVA yüzey suyu, çamuru ve tozu hücrelerinde tutar; araç zeminine geçmesini engeller.
            </p>
          </div>

          <div className="relative h-[420px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0b0a] sm:h-[560px]">
            <Image
              src="/media/galeri/musteri/photo_6030412024262626515_w.webp"
              alt="Temiz siyah EVA paspasın gerçek araç içi uygulaması"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }}>
              <Image
                src="/media/scraped/evaotopaspas/paspas-seti/05-comparison.webp"
                alt="Kirlenmiş standart kauçuk paspas"
                fill
                sizes="100vw"
                className="object-cover object-center grayscale-[.15]"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
            <div className="absolute inset-y-0 w-px bg-white/80" style={{ left: `${comparePosition}%` }}>
              <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-black/80 text-sm font-semibold text-white shadow-2xl">
                ↔
              </span>
            </div>
            <input
              type="range"
              min="18"
              max="82"
              value={comparePosition}
              onChange={(event) => setComparePosition(Number(event.target.value))}
              aria-label="Standart paspas ile EVA paspas karşılaştırması"
              className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-5 sm:p-7">
              <span className="rounded-full border border-white/10 bg-black/60 px-4 py-2 text-[9px] uppercase tracking-[0.14em] text-white/60 backdrop-blur-md">
                Standart paspas
              </span>
              <span className="rounded-full border border-white/15 bg-black/60 px-4 py-2 text-[9px] uppercase tracking-[0.14em] text-sand backdrop-blur-md">
                Premium EVA
              </span>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-sand/10 pt-14">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sand/78">Gerçek araçlar</span>
              <h2 className="mt-3 font-heading text-3xl font-normal text-white sm:text-4xl">Gerçek uygulamalar.</h2>
            </div>
            <Link href="/galeri" className="hidden items-center gap-2 text-xs font-semibold text-sand hover:text-white sm:flex">
              Tüm galeriyi gör <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid auto-cols-[78%] grid-flow-col gap-3 overflow-x-auto pb-3 sm:auto-cols-[42%] lg:grid-cols-5 lg:auto-cols-auto lg:overflow-visible">
            {REAL_APPLICATIONS.map((item) => (
              <figure key={item.src} className="group relative h-[320px] overflow-hidden rounded-xl border border-white/[0.07] bg-[#0c0c0c]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 20vw, 78vw"
                  quality={90}
                  className="object-cover transition duration-700 group-hover:scale-[1.035]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <figcaption className="absolute bottom-0 left-0 p-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/75">
                  {item.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
