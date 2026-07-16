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
import type { ContentSection } from "@/lib/cms-defaults";

const FEATURE_ICONS = [RulerIcon, DropletsIcon, Layers3Icon, ShieldCheckIcon];

const GALLERY_LAYOUTS = [
  {
    delay: 60,
    className: "h-full lg:col-span-7 lg:row-span-2",
    figureClassName: "proof-card group relative h-[420px] overflow-hidden lg:h-full",
    imageClassName:
      "parallax-media object-cover transition-all duration-700 ease-out group-hover:brightness-110",
    sizes: "(min-width: 1024px) 58vw, 100vw",
    captionClassName: "absolute inset-x-0 bottom-0 p-6 sm:p-8",
    titleClassName: "mt-2 font-heading text-2xl font-bold text-white sm:text-3xl",
    showBody: true,
  },
  {
    delay: 120,
    className: "h-full lg:col-span-5",
    figureClassName:
      "proof-card premium-grid group relative h-[320px] overflow-hidden bg-[#0c0e16] lg:h-full",
    imageClassName:
      "object-contain p-7 transition-all duration-700 ease-out group-hover:scale-[1.03] sm:p-10",
    sizes: "(min-width: 1024px) 42vw, 100vw",
    captionClassName: "absolute inset-x-0 bottom-0 p-5",
    titleClassName: "mt-1 font-heading text-xl font-bold text-white sm:text-2xl",
    showBody: false,
  },
  {
    delay: 180,
    className: "h-full lg:col-span-3",
    figureClassName: "proof-card group relative h-[300px] overflow-hidden lg:h-full",
    imageClassName:
      "parallax-media object-cover transition-all duration-700 ease-out group-hover:brightness-110",
    sizes: "(min-width: 1024px) 25vw, 100vw",
    captionClassName: "absolute inset-x-0 bottom-0 p-5",
    titleClassName: "mt-1 font-heading text-xl font-bold text-white sm:text-2xl",
    showBody: false,
  },
  {
    delay: 240,
    className: "h-full lg:col-span-2",
    figureClassName: "proof-card group relative h-[300px] overflow-hidden lg:h-full",
    imageClassName:
      "parallax-media object-cover transition-all duration-700 ease-out group-hover:brightness-110",
    sizes: "(min-width: 1024px) 17vw, 100vw",
    captionClassName: "absolute inset-x-0 bottom-0 p-5",
    titleClassName: "mt-1 font-heading text-xl font-bold text-white",
    showBody: false,
  },
] as const;

const GALLERY_FALLBACKS: ContentSection[] = [
  {
    pageSlug: "home",
    sectionKey: "showcase-gallery-01",
    sortOrder: 41,
    eyebrow: "01 · Gerçek uygulama",
    title: "Taban hattını eksiksiz takip eder",
    body: "Kenar kıvrımları, sabitleme noktaları ve pedal boşluğu araca göre kesilir.",
    imageUrl: "/media/galeri/musteri/photo_5845771899898629467_w.webp",
    imageAlt: "Jeep iç mekânında siyah EVA paspasın gerçek uygulaması",
    isPublished: true,
  },
  {
    pageSlug: "home",
    sectionKey: "showcase-gallery-02",
    sortOrder: 42,
    eyebrow: "02 · Tam set",
    title: "Ön ve arka sıra birlikte",
    body: "",
    imageUrl: "/media/scraped/evaotopaspas/paspas-seti/01-siyah-urun.png",
    imageAlt: "Beş parçalı siyah EVA oto paspas seti",
    iconKey: "contain",
    isPublished: true,
  },
  {
    pageSlug: "home",
    sectionKey: "showcase-gallery-03",
    sortOrder: 43,
    eyebrow: "03 · Renk uyumu",
    title: "İç mekâna göre seçim",
    body: "",
    imageUrl: "/media/galeri/musteri/photo_5906683564177165681_w.webp",
    imageAlt: "Mercedes iç mekânında kahverengi EVA paspasın gerçek uygulaması",
    isPublished: true,
  },
  {
    pageSlug: "home",
    sectionKey: "showcase-gallery-04",
    sortOrder: 44,
    eyebrow: "04 · Detay",
    title: "Metal topukluk",
    body: "",
    imageUrl: "/media/galeri/musteri/photo_5866003077058465479_w.webp",
    imageAlt: "Mavi EVA paspasın gerçek araç içi uygulaması",
    isPublished: true,
  },
];

type Props = {
  header?: ContentSection | null;
  gallery?: Array<ContentSection | null>;
  features?: Array<ContentSection | null>;
};

export default function Showcase({ header, gallery, features }: Props) {
  const resolvedFeatures = (features ?? []).filter(Boolean) as ContentSection[];
  const resolvedGallery = (gallery ?? [])
    .map((panel, index) => panel ?? GALLERY_FALLBACKS[index] ?? null)
    .filter(Boolean) as ContentSection[];

  return (
    <section className="home-section relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4">
        <ScrollReveal>
          <div className="mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              {header?.eyebrow !== undefined && header?.eyebrow !== null ? (
                header.eyebrow && header.eyebrow.toUpperCase() !== "EYEBROW" ? (
                  <span className="section-kicker">{header.eyebrow}</span>
                ) : null
              ) : (
                <span className="section-kicker">Malzeme ve gerçek uygulama</span>
              )}
              <h2 className="section-title mt-5">
                {header?.title ??
                  "Yakından bakınca fark edilen EVA işçiliği."}
              </h2>
              <p className="section-copy mt-5 max-w-2xl">
                {header?.body ??
                  "Gösteriş için değil, araç tabanında kusursuz çalışması için tasarlandı. Görsellerin tamamı gerçek EVA set ve uygulama detaylarıdır."}
              </p>
            </div>
            <Link
              href={header?.ctaHref ?? "/olusturucu"}
              className="btn-press inline-flex min-h-12 w-fit items-center gap-2 border border-white/15 px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:border-sand hover:text-sand"
            >
              {header?.ctaLabel ?? "Kendi setini oluştur"}
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid gap-4 lg:grid-cols-12 lg:auto-rows-[260px]">
          {resolvedGallery.map((panel, index) => {
            const layout = GALLERY_LAYOUTS[index];
            if (!layout || !panel.imageUrl) return null;
            const isContain = panel.iconKey === "contain" || index === 1;

            return (
              <ScrollReveal
                key={panel.sectionKey}
                delay={layout.delay}
                className={layout.className}
              >
                <figure className={layout.figureClassName}>
                  <Image
                    src={panel.imageUrl}
                    alt={panel.imageAlt ?? panel.title ?? "EVA paspas görseli"}
                    fill
                    sizes={layout.sizes}
                    quality={90}
                    className={layout.imageClassName}
                  />
                  <div
                    className={
                      isContain
                        ? "absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 to-transparent"
                        : "absolute inset-0 bg-gradient-to-t from-black/88 via-black/5 to-transparent"
                    }
                  />
                  <figcaption className={layout.captionClassName}>
                    {panel.eyebrow ? (
                      <span className="spec-value text-[10px] font-semibold uppercase tracking-[0.15em] text-sand sm:tracking-[0.16em]">
                        {panel.eyebrow}
                      </span>
                    ) : null}
                    {panel.title ? (
                      <p className={layout.titleClassName}>{panel.title}</p>
                    ) : null}
                    {layout.showBody && panel.body ? (
                      <p className="mt-2 max-w-lg text-sm leading-6 text-white/68">
                        {panel.body}
                      </p>
                    ) : null}
                  </figcaption>
                </figure>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {resolvedFeatures.map((feature, index) => {
            const Icon = FEATURE_ICONS[index] ?? RulerIcon;
            return (
              <ScrollReveal key={feature.sectionKey} delay={index * 80}>
                <article className="group flex h-full gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5 transition-all duration-400 hover:border-white/[0.1] hover:bg-white/[0.03]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] text-sand transition-all duration-400 group-hover:bg-sand/[0.06] group-hover:shadow-[0_0_16px_rgba(223,200,150,.06)]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-white/50">
                      {feature.body}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
