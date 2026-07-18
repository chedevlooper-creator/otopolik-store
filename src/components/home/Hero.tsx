import Link from "next/link";
import HeroMedia from "@/components/home/HeroMedia";
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
    <section className="hero">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        <HeroMedia />
        <div className="shade" />
      </div>

      <div className="content wrap">
        <span className="mono kicker">HASSAS MÜHENDİSLİK PROTOKOLÜ</span>
        <h1>
          Aracının zeminine <span className="fade">kusursuz</span> uyum.
        </h1>
        <div className="laser">
          <svg viewBox="0 0 420 24" fill="none" aria-hidden="true">
            <path pathLength="1" d="M2 16 H128 V8 H160 V16 H272 V22 H304 V16 H418" />
          </svg>
        </div>
        <p className="sub">
          {hero?.body ?? "Premium EVA teknolojisi ile üretilen, 6.000'den fazla araç modeline özel lazer kesim havuzlu paspaslar. 1-3 iş gününde kapında."}
        </p>
        <div className="cta-row">
          <Link className="btn btn-red" href="/olusturucu">
            {hero?.ctaLabel ?? "Aracını Seç"} →
          </Link>
          <Link className="btn btn-ghost" href="#urunler">
            {secondary?.ctaLabel ?? "Koleksiyonu Keşfet"}
          </Link>
        </div>
      </div>

      <div className="marquee mono">
        <div className="track">
          <span>
            <b>6.000+</b> ARAÇ MODELİ <i>✦</i> LAZER KESİM <b>±0,5 MM</b> <i>✦</i>{" "}
            <b>10 MM</b> HAVUZLU EVA <i>✦</i> <b>1-3 GÜN</b> KARGO <i>✦</i> 1.500₺ ÜZERİ
            ÜCRETSİZ <i>✦</i>
          </span>
          <span>
            <b>6.000+</b> ARAÇ MODELİ <i>✦</i> LAZER KESİM <b>±0,5 MM</b> <i>✦</i>{" "}
            <b>10 MM</b> HAVUZLU EVA <i>✦</i> <b>1-3 GÜN</b> KARGO <i>✦</i> 1.500₺ ÜZERİ
            ÜCRETSİZ <i>✦</i>
          </span>
        </div>
      </div>
    </section>
  );
}
