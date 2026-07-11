import ScrollReveal from "@/components/ScrollReveal";

const STATS = [
  { value: "Araca Özel", label: "Kalıp ve üretim" },
  { value: "EVA", label: "Suya dayanıklı yüzey" },
  { value: "3 Adım", label: "Kolay sipariş süreci" },
  { value: "1-3 Gün", label: "Tahmini kargoya teslim" },
];

export default function Stats() {
  return (
    <section className="bg-brand-black text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-14 text-center lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <ScrollReveal key={stat.label} delay={i * 100}>
            <p className="font-heading text-3xl font-extrabold text-brand-red sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-neutral-300">{stat.label}</p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
