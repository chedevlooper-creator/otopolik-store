import ScrollReveal from "@/components/ScrollReveal";

const FEATURES = [
  { icon: "🛡️", title: "4 Mevsim Kullanım", desc: "Yazın serin, kışın sıcak tutar." },
  { icon: "✨", title: "Kolay Temizlik", desc: "Hızlıca çıkarılır, pratikçe temizlenir." },
  { icon: "🔗", title: "Araca Özel Üretim", desc: "Tam uyum sağlar, boşluk bırakmaz." },
  { icon: "🏆", title: "Yüksek Kalite", desc: "Uzun ömürlü premium kalite." },
];

export default function FeatureStrip() {
  return (
    <section className="bg-dots border-b border-neutral-100 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-12 sm:grid-cols-4">
        {FEATURES.map((feature, i) => (
          <ScrollReveal key={feature.title} delay={i * 80}>
            <div className="card-lift group flex h-full flex-col items-center gap-3 rounded-2xl border border-neutral-100 bg-white/80 p-5 text-center backdrop-blur-sm hover:border-brand-red/30 hover:shadow-lg hover:shadow-brand-red/5 sm:flex-row sm:text-left">
              <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-50 to-red-100/60 text-2xl ring-1 ring-red-100 transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </span>
              <div>
                <p className="font-heading text-sm font-bold text-neutral-900">{feature.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">{feature.desc}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
