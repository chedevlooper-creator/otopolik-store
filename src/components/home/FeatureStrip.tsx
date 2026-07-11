import ScrollReveal from "@/components/ScrollReveal";
import { ShieldCheckIcon, SparklesIcon, LinkIcon, TrophyIcon } from "lucide-react";

const FEATURES = [
  { Icon: ShieldCheckIcon, title: "4 Mevsim Kullanım", desc: "Yazın serin, kışın sıcak tutar." },
  { Icon: SparklesIcon, title: "Kolay Temizlik", desc: "Hızlıca çıkarılır, pratikçe temizlenir." },
  { Icon: LinkIcon, title: "Araca Özel Üretim", desc: "Tam uyum sağlar, boşluk bırakmaz." },
  { Icon: TrophyIcon, title: "Yüksek Kalite", desc: "Uzun ömürlü premium kalite." },
];

export default function FeatureStrip() {
  return (
    <section className="bg-dots border-b border-neutral-800 bg-[#141414]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-12 sm:grid-cols-4">
        {FEATURES.map((feature, i) => (
          <ScrollReveal key={feature.title} delay={i * 80}>
            <div className="card-lift group flex h-full flex-col items-center gap-3 rounded-2xl border border-neutral-800 bg-[#141414]/80 p-5 text-center backdrop-blur-sm hover:border-brand-red/30 hover:shadow-lg hover:shadow-brand-red/5 sm:flex-row sm:text-left">
              <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200/60 ring-1 ring-neutral-200 transition-transform duration-300 group-hover:scale-110">
                <feature.Icon className="h-5 w-5 text-brand-red" aria-hidden="true" />
              </span>
              <div>
                <p className="font-heading text-sm font-bold text-white">{feature.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">{feature.desc}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
