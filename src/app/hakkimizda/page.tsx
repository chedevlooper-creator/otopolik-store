import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getContentPage, getSiteSeo, interpolateCmsText } from "@/lib/cms";
import { getStoreSettings } from "@/lib/site-settings";
import {
  ArrowRightIcon,
  DropletsIcon,
  HeartHandshakeIcon,
  ShieldCheckIcon,
  WrenchIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getContentPage("hakkimizda");
  return {
    title: page?.metaTitle ?? "Hakkımızda",
    description: page?.metaDescription,
  };
}

// p2, p3, ... kartlarında sırayla dönen ikonlar
const PARAGRAPH_ICONS = [
  DropletsIcon,
  ShieldCheckIcon,
  WrenchIcon,
  HeartHandshakeIcon,
];

export default async function AboutPage() {
  const [{ page, sections }, { seo }, settings] = await Promise.all([
    getContentPage("hakkimizda"),
    getSiteSeo(),
    getStoreSettings(),
  ]);
  const kicker = sections.find((s) => s.sectionKey === "kicker");
  const image = sections.find((s) => s.sectionKey === "image");
  const paragraphs = sections
    .filter((s) => s.sectionKey.startsWith("p"))
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const [lead, ...rest] = paragraphs;

  const stats = [
    { value: "6.000+", label: "Araç modeli için özel kalıp" },
    { value: settings.estimatedDispatch, label: "İçinde üretim ve kargo" },
    { value: "%100", label: "Araca özel milimetrik kesim" },
    { value: "4 Mevsim", label: "Su geçirmez EVA koruma" },
  ];

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-40 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-white/[0.05] blur-[120px]"
        aria-hidden="true"
      />

      {/* Giriş: başlık + görsel */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_.95fr] lg:gap-14 lg:pb-20">
        <div>
          <span className="section-kicker">{kicker?.title ?? "Hakkımızda"}</span>
          <h1 className="section-title mt-5">
            {page?.title ?? "Aracınız İçin Üstün Koruma"}
          </h1>
          {lead && (
            <p className="section-copy mt-6 max-w-xl text-base">
              {interpolateCmsText(lead.body, { siteName: seo.siteName })}
            </p>
          )}
          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Link
              href="/olusturucu"
              className="btn-press btn-red-rich inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg px-7 text-xs font-bold uppercase tracking-[0.08em]"
            >
              Tasarımını başlat
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/galeri"
              className="btn-press btn-ghost-rich inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg px-7 text-xs font-bold uppercase tracking-[0.08em] text-white/90"
            >
              Uygulama galerisi
            </Link>
          </div>
        </div>

        <figure className="group relative overflow-hidden rounded-xl border border-white/10 shadow-[0_36px_90px_rgba(0,0,0,.4)]">
          <div className="relative aspect-[4/3]">
            <Image
              src={image?.imageUrl ?? "/media/eva-rear-black.png"}
              alt={image?.imageAlt ?? "OTO POLİK EVA paspas"}
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              priority
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,.68)_100%)]"
            aria-hidden="true"
          />
          <figcaption className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-3">
            <span className="spec-value rounded-full border border-white/10 bg-black/55 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-md">
              İstanbul&apos;da üretilir
            </span>
            <span className="spec-value hidden rounded-full border border-white/15 bg-black/55 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-md sm:inline-flex">
              Türkiye&apos;ye gönderilir
            </span>
          </figcaption>
        </figure>
      </section>

      {/* Rakamlarla bant — ana sayfadaki koyu şerit diliyle uyumlu */}
      <section className="bg-eva-strong border-y border-white/[0.07] bg-[#000000]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-4 py-10 sm:py-12 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-start gap-2 border-white/[0.06] px-2 py-4 sm:px-6 lg:border-l lg:first:border-l-0 lg:py-2"
            >
              <span className="spec-value text-3xl font-bold text-white sm:text-4xl">
                {stat.value}
              </span>
              <span className="text-xs uppercase tracking-[0.12em] text-white/55">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Yaklaşımımız: kalan CMS paragrafları + atölye görseli */}
      {rest.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
          <div className="grid items-stretch gap-8 lg:grid-cols-[1fr_.85fr] lg:gap-12">
            <div>
              <span className="section-kicker">Yaklaşımımız</span>
              <h2 className="mt-5 max-w-xl font-heading text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                Malzemeden işçiliğe, aynı titizlik
              </h2>
              <div className="mt-9 space-y-4 lg:space-y-5">
                {rest.map((p, index) => {
                  const Icon = PARAGRAPH_ICONS[index % PARAGRAPH_ICONS.length];
                  return (
                    <article
                      key={p.sectionKey}
                      className="premium-card gradient-border card-lift flex gap-5 rounded-xl p-6 sm:gap-6 sm:p-7"
                    >
                      <span className="icon-badge-rich flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        {p.title && (
                          <h3 className="font-heading text-xl font-bold text-white">
                            {p.title}
                          </h3>
                        )}
                        <p className={`${p.title ? "mt-2" : ""} leading-7 text-white/60`}>
                          {interpolateCmsText(p.body, { siteName: seo.siteName })}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="relative min-h-[18rem] sm:min-h-[22rem] lg:min-h-[26rem]">
              <figure className="group absolute inset-0 overflow-hidden rounded-xl border border-white/10 shadow-[0_36px_90px_rgba(0,0,0,.4)]">
                <Image
                  src="/media/eva_mat_pedestal.jpg"
                  alt="Sergi platformunda premium EVA paspas seti"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(0,0,0,.62)_100%)]"
                  aria-hidden="true"
                />
                <figcaption className="absolute inset-x-5 bottom-5">
                  <span className="spec-value rounded-full border border-white/10 bg-black/55 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-md">
                    Premium EVA · Atölye işçiliği
                  </span>
                </figcaption>
              </figure>
              <figure className="absolute -left-6 top-8 hidden w-40 overflow-hidden rounded-lg border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,.55)] xl:block">
                <div className="relative aspect-square">
                  <Image
                    src="/media/water-drops-closeup.jpg"
                    alt="EVA hücre dokusu üzerinde su damlaları"
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
              </figure>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
