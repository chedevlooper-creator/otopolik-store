import ScrollReveal from "@/components/ScrollReveal";
import { CarIcon, PaletteIcon, PackageIcon } from "lucide-react";

const STEPS = [
  {
    no: "01",
    Icon: CarIcon,
    title: "Aracınızı Seçin",
    desc: "Marka ve modelinizi seçin, aracınıza özel kalıplanmış seti görüntüleyin.",
  },
  {
    no: "02",
    Icon: PaletteIcon,
    title: "Rengi Belirleyin",
    desc: "Siyah, gri veya bej — iç mekanınıza en uygun rengi seçip sipariş verin.",
  },
  {
    no: "03",
    Icon: PackageIcon,
    title: "Kapınıza Gelsin",
    desc: "Setiniz 1-3 iş günü içinde kargoda. Takmak saniyeler sürer, alet gerekmez.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
      <ScrollReveal className="text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
          Nasıl Çalışır?
        </span>
        <h2 className="font-heading mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          3 Adımda Aracınıza Özel Paspas
        </h2>
      </ScrollReveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <ScrollReveal key={step.no} delay={i * 120}>
            <div className="relative h-full rounded-2xl border border-neutral-700 bg-[#141414] p-7 transition-shadow hover:shadow-lg hover:shadow-black/5">
              <span className="font-heading absolute right-5 top-4 text-4xl font-extrabold text-neutral-100">
                {step.no}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800">
                <step.Icon className="h-5 w-5 text-brand-red" aria-hidden="true" />
              </span>
              <h3 className="font-heading mt-4 text-lg font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">{step.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
