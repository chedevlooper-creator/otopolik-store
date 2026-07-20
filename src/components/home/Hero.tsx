import Link from "next/link";
import HeroMedia from "@/components/home/HeroMedia";
import HeroVehicleSelector from "@/components/home/HeroVehicleSelector";
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
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-black text-center pt-24 pb-32">
      {/* Background Media with HUD overlays */}
      <div className="absolute inset-0 z-0">
        <HeroMedia />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/95 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 flex flex-col justify-center h-full w-full">
        <div className="flex-1 flex flex-col justify-center items-center mt-12 mb-8">
          <span className="mb-6 inline-block font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
            HASSAS MÜHENDİSLİK PROTOKOLÜ
          </span>
          <h1 className="mb-6 font-heading text-5xl font-extrabold tracking-[-0.04em] text-gradient-white sm:text-7xl">
            Aracının zeminine <br className="hidden sm:block" /><span className="opacity-45">kusursuz</span> uyum.
          </h1>
          
          {/* Modern HUD Laser Line */}
          <div className="mx-auto my-8 h-px max-w-sm w-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60" />

          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
            {hero?.body ?? "Premium EVA teknolojisi ile üretilen, 6.000'den fazla araç modeline özel lazer kesim havuzlu paspaslar. 1-3 iş gününde kapında."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/olusturucu"
              className="btn-press btn-red-rich flex h-14 items-center justify-center rounded-full px-8 text-sm font-bold uppercase tracking-wider text-white"
            >
              {hero?.ctaLabel ?? "Aracını Seç"} →
            </Link>
            <Link 
              href="#ozellikler"
              className="btn-press flex h-14 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 text-sm font-bold uppercase tracking-wider text-white transition-all hover:border-white/30 hover:bg-white/10"
            >
              {secondary?.ctaLabel ?? "Özellikleri Keşfet"}
            </Link>
          </div>
        </div>

        <div className="relative z-20 w-full mb-12">
          <HeroVehicleSelector />
        </div>
      </div>

      {/* Premium Marquee */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/5 bg-black/60 backdrop-blur-md">
        <div className="marquee mono py-4">
          <div className="track flex items-center gap-8 text-[10px] font-medium tracking-[0.2em] text-white/40">
            {[1, 2].map((i) => (
              <span key={i} className="flex whitespace-nowrap items-center gap-8">
                <span><b className="text-[var(--brand-red)]">6.000+</b> ARAÇ MODELİ</span> <i className="text-white/20">✦</i>
                <span>LAZER KESİM <b className="text-white/80">±0,5 MM</b></span> <i className="text-white/20">✦</i>
                <span><b className="text-white/80">10 MM</b> HAVUZLU EVA</span> <i className="text-white/20">✦</i>
                <span><b className="text-[var(--brand-red)]">1-3 GÜN</b> KARGO</span> <i className="text-white/20">✦</i>
                <span>1.500₺ ÜZERİ ÜCRETSİZ</span> <i className="text-white/20">✦</i>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
