import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { ArrowRightIcon, CarFrontIcon, PaletteIcon, PackageCheckIcon } from "lucide-react";

const STEPS = [
  {
    no: "01",
    icon: CarFrontIcon,
    title: "Aracını seç",
    desc: "Marka, model ve model yılını seç; aracına özel kalıbı saniyeler içinde bul.",
  },
  {
    no: "02",
    icon: PaletteIcon,
    title: "Tarzını belirle",
    desc: "Taban ve kenar rengini eşleştir, aracının iç mekânına özel kombinasyonunu oluştur.",
  },
  {
    no: "03",
    icon: PackageCheckIcon,
    title: "Üretime gönder",
    desc: "Uyumluluğu birlikte teyit edelim; setin 1-3 iş günü içinde kargoya çıksın.",
  },
];

export default function HowItWorks() {
  return (
    <section className="home-section relative overflow-hidden border-y border-white/8 bg-surface/40">
      <div className="premium-grid pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4">
        <ScrollReveal>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="section-kicker">Size özel üretim</span>
              <h2 className="section-title mt-5 max-w-3xl">
                Üç adımda kusursuz uyum
              </h2>
            </div>
            <Link href="/olusturucu" className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-sand transition-colors hover:text-white">
              Tasarlamaya başla
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="relative mt-12 grid gap-4 lg:grid-cols-3 lg:gap-5">
          <div className="absolute left-[16.5%] right-[16.5%] top-10 hidden h-px bg-gradient-to-r from-transparent via-brand-red/45 to-transparent lg:block" aria-hidden="true" />
          {STEPS.map((step, index) => (
            <ScrollReveal key={step.no} delay={index * 80} className="h-full">
              <article className="premium-card card-lift group relative flex h-full min-h-60 flex-col overflow-hidden rounded-[1.5rem] p-6 hover:border-white/16 sm:p-8">
                <span className="absolute -right-3 -top-8 font-heading text-[8rem] font-bold leading-none text-white/[0.025] transition-colors group-hover:text-brand-red/[0.07]" aria-hidden="true">
                  {step.no}
                </span>
                <div className="relative flex items-center justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-sand shadow-xl shadow-black/20">
                    <step.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="spec-value rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-white/58">ADIM {step.no}</span>
                </div>
                <h3 className="relative mt-8 font-heading text-3xl font-bold text-white">{step.title}</h3>
                <p className="relative mt-3 max-w-sm text-sm leading-7 text-white/65">{step.desc}</p>
                <div className="relative mt-auto pt-7">
                  <span className="block h-1 w-12 rounded-full bg-gradient-to-r from-brand-red to-[#ff667d] shadow-[0_0_16px_rgba(227,25,55,.45)]" />
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
