import ScrollReveal from "@/components/ScrollReveal";
import { CarIcon, PaletteIcon, PackageCheckIcon } from "lucide-react";

const STEPS = [
  {
    no: "01",
    icon: CarIcon,
    title: "Aracınızı Seçin",
    desc: "Marka ve modelinizi seçin, aracınıza özel kalıplanmış seti görüntüleyin.",
  },
  {
    no: "02",
    icon: PaletteIcon,
    title: "Rengi Belirleyin",
    desc: "Taban ve kenar rengini seçin, ekranda anında görün.",
  },
  {
    no: "03",
    icon: PackageCheckIcon,
    title: "Kapınıza Gelsin",
    desc: "Setiniz 1-3 iş günü içinde kargoda. Takmak saniyeler sürer, alet gerekmez.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
      <ScrollReveal>
        <span className="spec-label">Sipariş süreci</span>
        <h2 className="mt-4 font-heading text-4xl font-bold text-white sm:text-5xl">
          3 adımda aracınıza özel paspas
        </h2>
      </ScrollReveal>

      <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <ScrollReveal key={step.no} delay={i * 120} className="h-full">
            <div className="flex h-full flex-col bg-surface p-7 transition-colors hover:bg-surface-hover sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="spec-value text-sm text-sand">{step.no}</span>
                <span className="h-px flex-1 bg-border" aria-hidden="true" />
              </div>
              <step.icon className="h-8 w-8 text-sand/70" aria-hidden="true" />
              <h3 className="mt-4 font-heading text-2xl font-bold text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
