import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

export default function SpecsBanner() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
      <ScrollReveal>
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-neutral-700 shadow-2xl shadow-black/10 ring-1 ring-black/5 sm:aspect-[16/10]">
          <Image
            src="/media/features-silver.jpg"
            alt="OTO POLİK EVA paspas teknik özellikleri: kaymaz taban, güçlendirilmiş topukluk, yüksek kenar yapısı, premium EVA malzeme"
            fill
            sizes="(min-width: 1024px) 1024px, 100vw"
            quality={90}
            className="object-cover"
          />
        </div>
      </ScrollReveal>
    </section>
  );
}
