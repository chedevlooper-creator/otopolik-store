import Link from "next/link";
import VehicleFinder from "@/components/home/VehicleFinder";
import { ArrowRightIcon, TruckIcon, ShieldCheckIcon, RulerIcon } from "lucide-react";

const SPEC_TICKS = [
  { icon: RulerIcon, label: "ARACA ÖZEL KALIP", detail: "Birebir uyum" },
  { icon: ShieldCheckIcon, label: "PREMIUM EVA", detail: "Kokusuz · dayanıklı" },
  { icon: TruckIcon, label: "1-3 GÜNDE KARGO", detail: "Türkiye'nin her yerine" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background text-white">
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover opacity-60"
          src="/media/hero-video.mp4"
          poster="/media/hero-poster.jpg"
          autoPlay muted loop playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-16 sm:pt-28 lg:pt-32">
        <div className="max-w-3xl">
          <div className="animate-hero flex flex-wrap items-stretch gap-y-2">
            {SPEC_TICKS.map(({ icon: Icon, label, detail }, index) => (
              <span
                key={label}
                className={`flex items-center gap-2.5 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] sm:text-[11px] ${
                  index !== 0 ? "border-l border-white/10 sm:pl-5" : ""
                } ${index !== SPEC_TICKS.length - 1 ? "sm:pr-5" : ""}`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-sand" aria-hidden="true" />
                <span>
                  <span className="text-white">{label}</span>
                  <span className="mt-0.5 block text-[9px] font-medium normal-case tracking-normal text-white/40 sm:text-[10px]">
                    {detail}
                  </span>
                </span>
              </span>
            ))}
          </div>

          <h1 className="animate-hero-delay-1 mt-5 font-heading text-[2.8rem] font-bold uppercase leading-[0.92] sm:mt-6 sm:text-7xl lg:text-8xl">
            <span className="block sm:inline">Aracınızın</span>{" "}
            <span className="block sm:inline">tabanına</span>
            <span className="relative mt-2 block w-fit pb-2 sm:pb-3">
              milimetrik uyum
              <span className="mt-2 block h-[5px] w-full bg-brand-red sm:mt-3 sm:h-[7px]" aria-hidden="true" />
            </span>
          </h1>

          <p className="animate-hero-delay-2 mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:mt-6 sm:text-lg">
            SUV, sedan ya da hatchback. Aracınıza özel üretilen, dört mevsim
            dayanıklı premium EVA paspasla sürüş alanınızı tamamlayın.
          </p>

          <div className="animate-hero-delay-2 mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <Link
              href="/olusturucu"
              className="btn-press inline-flex items-center justify-center gap-2 bg-brand-red px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-red-dark"
            >
              Paspasını Tasarla
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/urunler"
              className="btn-press inline-flex items-center justify-center gap-2 border border-white/15 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white/80 hover:border-sand/60 hover:text-sand"
            >
              Ürünleri İncele
            </Link>
          </div>
        </div>

        {/* Araç bulucu — kesim föyünün alt plakası gibi hero'nun altına oturur */}
        <div className="relative z-10 mt-10 -mb-px sm:mt-20">
          <VehicleFinder />
        </div>
      </div>
    </section>
  );
}
