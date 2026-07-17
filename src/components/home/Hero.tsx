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

// "Hassas Mühendislik Protokolü" vaadini görünür kılan kompakt teknik künye
const HERO_SPECS = [
  { value: "850", unit: "kg/m³", label: "Yoğunluk" },
  { value: "%100", unit: "", label: "Premium EVA" },
  { value: "-40°/+80°", unit: "C", label: "Sıcaklık" },
  { value: "4", unit: "L", label: "Sıvı kapasitesi" },
] as const;

export default function Hero({ content }: Props) {
  const hero = content?.hero;
  const secondary = content?.secondaryCta;

  const headline =
    hero?.title && hero?.subtitle
      ? `${hero.title} ${hero.subtitle}`.replace(/\s+/g, " ").trim()
      : hero?.title ?? "Araca özel havuzlu paspas";
  const primaryHref =
    hero?.ctaHref && !hero.ctaHref.startsWith("/#")
      ? hero.ctaHref
      : "/olusturucu";

  return (
    <section className="relative flex min-h-[calc(100svh-7.375rem)] flex-col justify-center overflow-hidden bg-black text-white sm:min-h-[calc(100svh-8.3125rem)] lg:min-h-[calc(100svh-9.25rem)]">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        <HeroMedia />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.55)_0%,rgba(0,0,0,.22)_38%,rgba(0,0,0,.92)_100%)]" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 mx-auto flex w-full max-w-screen-2xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-12 2xl:px-8 lg:py-12">
        <div className="flex flex-col items-center text-center">
          <span className="section-kicker">
            Hassas Mühendislik Protokolü
          </span>

          <p className="mt-3 font-heading text-[clamp(2.8rem,7vw,5.75rem)] font-medium leading-[0.88] tracking-[-0.055em] text-white">
            OTOPOLİK
          </p>

          <div className="mx-auto mt-3 h-[18px] w-full max-w-md text-brand-red">
            <svg viewBox="0 0 420 18" fill="none" aria-hidden="true">
              <path
                d="M2 12 C48 4, 72 16, 118 9 S190 3, 230 11 S310 16, 360 7 L418 10"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className="mt-5 max-w-2xl font-heading text-[clamp(1.25rem,2.1vw,1.85rem)] font-medium leading-[1.15] tracking-[-0.03em] text-white">
            {headline}
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-white/68 sm:text-base">
            {hero?.body ?? "Lazer kesim kalıp. Premium EVA. 1-3 günde kargo."}
          </p>

          <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href={primaryHref}
              className="btn-press btn-red-rich inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-8 text-[11px] font-bold uppercase tracking-[0.12em] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {hero?.ctaLabel ?? "Aracını seç"}
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={secondary?.ctaHref ?? "/urunler"}
              className="btn-press inline-flex min-h-12 items-center justify-center px-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/65 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {secondary?.ctaLabel ?? "Koleksiyonu keşfet"}
            </Link>
          </div>

          <div className="mt-10 grid w-full max-w-xl grid-cols-2 divide-x divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-black/25 backdrop-blur-md sm:grid-cols-4 sm:divide-y-0">
            {HERO_SPECS.map((spec) => (
              <div
                key={spec.label}
                className="flex flex-col items-center gap-1 px-3 py-4"
              >
                <p className="spec-value text-lg font-semibold leading-none text-white sm:text-xl">
                  {spec.value}
                  {spec.unit ? (
                    <span className="ml-1 text-xs font-normal text-white/50">
                      {spec.unit}
                    </span>
                  ) : null}
                </p>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/50">
                  {spec.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
