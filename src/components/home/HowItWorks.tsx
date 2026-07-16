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
    <section className="home-section relative overflow-hidden border-y border-white/[0.04] bg-[#07080c]">
      <div className="relative mx-auto max-w-7xl px-4">
        <ScrollReveal>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="section-kicker">{header?.eyebrow ?? "Size özel üretim"}</span>
              <h2 className="section-title mt-5 max-w-3xl">
                {header?.title ?? "Üç adımda kusursuz uyum"}
              </h2>
            </div>
            <Link href={header?.ctaHref ?? "/olusturucu"} className="inline-flex min-h-11 w-fit items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-sand transition-colors hover:text-white">
              {header?.ctaLabel ?? "Tasarlamaya başla"}
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="relative mt-12 grid gap-3 lg:grid-cols-3 lg:gap-4">
          <div className="absolute left-[16.5%] right-[16.5%] top-12 hidden h-px bg-gradient-to-r from-transparent via-sand/30 to-transparent lg:block" aria-hidden="true" />
          {resolved.map((step, index) => {
            const Icon = ICONS[index] ?? CarFrontIcon;
            const no = String(index + 1).padStart(2, "0");
            return (
              <ScrollReveal key={step.sectionKey} delay={index * 100} className="h-full">
                <article className="premium-card card-lift group relative flex h-full min-h-64 flex-col overflow-hidden p-7 sm:p-8">
                  <span className="absolute -right-4 -top-10 font-heading text-[9rem] font-bold leading-none text-white/[0.02]" aria-hidden="true">
                    {no}
                  </span>
                  <div className="relative flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center border border-sand/30 text-sand">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="spec-value border border-white/10 px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-white/50">ADIM {no}</span>
                  </div>
                  <h3 className="relative mt-8 font-heading text-2xl font-bold text-white sm:text-3xl">{step.title}</h3>
                  <p className="relative mt-3 max-w-sm text-sm leading-7 text-white/55">{step.body}</p>
                  <div className="relative mt-auto pt-8">
                    <span className="block h-px w-14 bg-sand" />
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
