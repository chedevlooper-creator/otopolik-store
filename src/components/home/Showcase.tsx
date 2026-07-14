import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import {
  ArrowRightIcon,
  DropletsIcon,
  Layers3Icon,
  RulerIcon,
  ShieldCheckIcon,
} from "lucide-react";

const FEATURES = [
  { icon: RulerIcon, title: "Milimetrik kalıp", text: "Aracın taban hattına özel CNC kesim" },
  { icon: DropletsIcon, title: "Hücreli yüzey", text: "Su ve çamuru paspasın içinde tutar" },
  { icon: Layers3Icon, title: "Güçlendirilmiş set", text: "Sürücü topukluğu ve sabitleme noktaları" },
  { icon: ShieldCheckIcon, title: "Dört mevsim", text: "Kokusuz, esnek ve su geçirmez EVA" },
];

export default function Showcase() {
  return (
    <section className="home-section relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4">
        <ScrollReveal>
          <div className="mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="section-kicker">Malzeme ve gerçek uygulama</span>
              <h2 className="section-title mt-5">
                Yakından bakınca fark edilen <span className="text-sand">EVA işçiliği.</span>
              </h2>
              <p className="section-copy mt-5 max-w-2xl">
                Gösteriş için değil, araç tabanında kusursuz çalışması için tasarlandı. Görsellerin tamamı gerçek EVA set ve uygulama detaylarıdır.
              </p>
            </div>
            <Link
              href="/olusturucu"
              className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-sand transition-colors hover:text-white"
            >
              Kendi setini oluştur
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid gap-4 lg:grid-cols-12 lg:auto-rows-[260px]">
          <ScrollReveal delay={60} className="h-full lg:col-span-7 lg:row-span-2">
            <figure className="proof-card group relative h-[420px] overflow-hidden lg:h-full">
              <Image
                src="/media/scraped/evaotopaspas/paspas-seti/03-gallery-1.jpg"
                alt="Kırmızı kenarlı siyah EVA paspasın araç içindeki gerçek uygulaması"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                quality={90}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/5 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <span className="spec-value text-[10px] font-semibold uppercase tracking-[0.16em] text-sand">01 · Gerçek uygulama</span>
                <p className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">Taban hattını eksiksiz takip eder</p>
                <p className="mt-2 max-w-lg text-sm leading-6 text-white/68">Kenar kıvrımları, sabitleme noktaları ve pedal boşluğu araca göre kesilir.</p>
              </figcaption>
            </figure>
          </ScrollReveal>

          <ScrollReveal delay={110} className="h-full lg:col-span-5">
            <figure className="proof-card premium-grid group relative h-[320px] overflow-hidden bg-[#111318] lg:h-full">
              <Image
                src="/media/scraped/evaotopaspas/paspas-seti/01-siyah-urun.png"
                alt="Beş parçalı siyah EVA oto paspas seti"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                quality={90}
                className="object-contain p-7 transition-transform duration-700 ease-out group-hover:scale-[1.02] sm:p-10"
              />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5">
                <span className="spec-value text-[10px] font-semibold uppercase tracking-[0.15em] text-sand">02 · Tam set</span>
                <p className="mt-1 font-heading text-2xl font-bold text-white">Ön ve arka sıra birlikte</p>
              </figcaption>
            </figure>
          </ScrollReveal>

          <ScrollReveal delay={150} className="h-full lg:col-span-3">
            <figure className="proof-card group relative h-[300px] overflow-hidden lg:h-full">
              <Image
                src="/media/scraped/evaotopaspas/paspas-seti/04-gallery-2.jpg"
                alt="Bej EVA paspasın araç içindeki gerçek uygulaması"
                fill
                sizes="(min-width: 1024px) 25vw, 100vw"
                quality={90}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5">
                <span className="spec-value text-[10px] font-semibold uppercase tracking-[0.15em] text-sand">03 · Renk uyumu</span>
                <p className="mt-1 font-heading text-2xl font-bold text-white">İç mekâna göre seçim</p>
              </figcaption>
            </figure>
          </ScrollReveal>

          <ScrollReveal delay={190} className="h-full lg:col-span-2">
            <figure className="proof-card group relative h-[300px] overflow-hidden lg:h-full">
              <Image
                src="/media/scraped/evaotopaspas/paspas-seti/06-metal-topukluk.jpg"
                alt="EVA paspas üzerindeki metal sürücü topukluğu"
                fill
                sizes="(min-width: 1024px) 17vw, 100vw"
                quality={90}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5">
                <span className="spec-value text-[10px] font-semibold uppercase tracking-[0.15em] text-sand">04 · Detay</span>
                <p className="mt-1 font-heading text-2xl font-bold text-white">Metal topukluk</p>
              </figcaption>
            </figure>
          </ScrollReveal>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }, index) => (
            <ScrollReveal key={title} delay={index * 60}>
              <article className="flex h-full gap-3 rounded-2xl border border-white/8 bg-white/[0.025] p-4 transition-[border-color,background-color] hover:border-white/14 hover:bg-white/[0.045]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-sand">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-white">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-white/62">{text}</p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
