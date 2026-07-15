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

export default function Hero({ content }: Props) {
  const hero = content?.hero;
  const secondary = content?.secondaryCta;

  return (
    <section className="relative flex min-h-[calc(100svh-7.25rem)] flex-col justify-between overflow-hidden bg-black text-white lg:min-h-[calc(100svh-7.75rem)]">
      <div className="absolute inset-0 z-0">
        <HeroMedia />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.93)_0%,rgba(0,0,0,.68)_45%,rgba(0,0,0,.16)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-0 pt-12 sm:pt-16 lg:pt-20">
        <div className="max-w-4xl">
          <div className="hero-kicker flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-sand sm:text-[11px]">
            <span className="h-[2px] w-6 bg-brand-red" aria-hidden="true" />
            <span>
              {hero?.eyebrow ??
                "Araca Özel Kalıp • Premium EVA • 1-3 Günde Kargo"}
            </span>
          </div>

          <h1 className="mt-6 font-heading text-[clamp(3rem,7.2vw,5.5rem)] font-bold uppercase leading-[0.94] tracking-[-0.025em]">
            <span className="hero-line-mask">
              <span className="hero-line sm:whitespace-nowrap">
                {hero?.title ?? "ARACINIZIN TABANINA"}
              </span>
            </span>
            <span className="hero-line-mask mt-2">
              <span className="hero-line hero-line--2 relative block w-fit pb-2 text-sand sm:whitespace-nowrap sm:pb-3">
                {hero?.subtitle ?? "MİLİMETRİK UYUM"}
                <span
                  className="hero-underline absolute bottom-0 left-0 h-1 w-full bg-brand-red sm:h-1.5"
                  aria-hidden="true"
                />
              </span>
            </span>
          </h1>

          <p className="animate-hero-delay-2 mt-6 max-w-xl text-sm leading-7 text-white/76 sm:text-base">
            {hero?.body ??
              "Marka ve modelinize göre kalıplanan EVA paspas setleri. Suyu ve çamuru içinde tutar, tek sıkım suyla temizlenir, dört mevsim dayanır."}
          </p>

          <div className="animate-hero-delay-3 mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href={hero?.ctaHref ?? "/olusturucu"}
              className="btn-press inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-brand-red px-7 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_18px_50px_rgba(227,25,55,.26)] hover:bg-[#f02142]"
            >
              {hero?.ctaLabel ?? "PASPASINI TASARLA"}
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={secondary?.ctaHref ?? "/urunler"}
              className="btn-press inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-white/18 bg-black/25 px-7 text-sm font-bold uppercase tracking-[0.1em] text-white backdrop-blur-sm hover:border-sand/55 hover:text-sand"
            >
              {secondary?.ctaLabel ?? "ÜRÜNLERİ İNCELE"}
            </Link>
          </div>
        </div>

        <div className="relative z-10 mt-12 -mb-px sm:mt-16 lg:mt-20">
          <VehicleFinder />
        </div>
      </div>
    </section>
  );
}
