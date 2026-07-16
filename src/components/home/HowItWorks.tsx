import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { ArrowRightIcon, CarFrontIcon, PaletteIcon, PackageCheckIcon } from "lucide-react";
import type { ContentSection } from "@/lib/cms-defaults";

const ICONS = [CarFrontIcon, PaletteIcon, PackageCheckIcon];

type Props = {
  header?: ContentSection | null;
  steps?: Array<ContentSection | null>;
};

export default function HowItWorks({ header, steps }: Props) {
  const resolved = (steps ?? []).filter(Boolean) as ContentSection[];

  return (
    <section className="home-section relative overflow-hidden border-y border-white/[0.04] bg-surface/30">
      <div className="premium-grid pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-brand-red/[0.03] blur-[120px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4">
        <ScrollReveal>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {header?.eyebrow !== undefined && header?.eyebrow !== null ? (
                header.eyebrow && header.eyebrow.toUpperCase() !== "EYEBROW" ? (
                  <span className="section-kicker">{header.eyebrow}</span>
                ) : null
              ) : (
                <span className="section-kicker">Size Özel Üretim</span>
              )}
              <h2 className="section-title mt-6 max-w-3xl">
                {header?.title ?? "Üç adımda kusursuz uyum"}
              </h2>
            </div>
            <Link href={header?.ctaHref ?? "/olusturucu"} className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-sand transition-colors hover:text-white">
              {header?.ctaLabel ?? "Tasarlamaya başla"}
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="relative mt-14 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {/* Bağlantı çizgisi — animated gradient */}
          <div className="absolute left-[16.5%] right-[16.5%] top-12 hidden h-px bg-gradient-to-r from-transparent via-brand-red/30 to-transparent lg:block" aria-hidden="true" />
          {resolved.map((step, index) => {
            const Icon = ICONS[index] ?? CarFrontIcon;
            const no = String(index + 1).padStart(2, "0");
            return (
              <ScrollReveal key={step.sectionKey} delay={index * 100} className="h-full">
                <article className="premium-card gradient-border card-lift group relative flex h-full min-h-64 flex-col overflow-hidden rounded-2xl p-7 sm:p-8">
                  <span className="absolute -right-4 -top-10 font-heading text-[9rem] font-bold leading-none text-white/[0.015] transition-colors duration-500 group-hover:text-brand-red/[0.05]" aria-hidden="true">
                    {no}
                  </span>
                  <div className="relative flex items-center justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-sand shadow-xl shadow-black/20 transition-all duration-400 group-hover:border-white/10 group-hover:bg-sand/[0.06] group-hover:shadow-[0_0_28px_rgba(223,200,150,.06)]">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="spec-value rounded-full border border-white/8 bg-white/[0.02] px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-white/50">ADIM {no}</span>
                  </div>
                  <h3 className="relative mt-8 font-heading text-2xl font-bold text-white sm:text-3xl">{step.title}</h3>
                  <p className="relative mt-3 max-w-sm text-sm leading-7 text-white/55">{step.body}</p>
                  <div className="relative mt-auto pt-8">
                    <span className="block h-1 w-14 rounded-full bg-gradient-to-r from-brand-red to-[#ff667d] shadow-[0_0_20px_rgba(227,25,55,.35)]" />
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
