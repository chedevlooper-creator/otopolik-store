import {
  DropletIcon,
  GemIcon,
  LeafIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";

const FEATURES = [
  {
    icon: DropletIcon,
    label: "Su Geçirmez",
    detail: "Sıvıyı yüzeyde tutar, aracınızı korur.",
  },
  {
    icon: SparklesIcon,
    label: "Kolay Temizlik",
    detail: "Tek harekette çıkarın, yıkayın, takın.",
  },
  {
    icon: ShieldCheckIcon,
    label: "Kaymaz Yüzey",
    detail: "Özel tabanı sayesinde kayma yapmaz.",
  },
  {
    icon: LeafIcon,
    label: "Kokusuz EVA",
    detail: "Sağlığınızı düşünür, koku yapmaz.",
  },
  {
    icon: GemIcon,
    label: "Uzun Ömürlü",
    detail: "Aşınmaya karşı dayanıklı özel malzeme.",
  },
] as const;

/** Referans 5'li ürün özellik şeridi — ikon üstte, ortalanmış kolonlar. */
export default function FeatureStrip() {
  return (
    <section
      id="ozellikler"
      aria-label="EVA paspas özellikleri"
      className="border-y border-white/[0.07] bg-[#060606]"
    >
      <div className="mx-auto grid max-w-screen-2xl 2xl:px-8 grid-cols-2 divide-x divide-y divide-white/[0.06] sm:grid-cols-3 lg:grid-cols-5 lg:divide-y-0">
        {FEATURES.map((item) => (
          <div
            key={item.label}
            className="group flex min-h-[150px] flex-col items-center justify-center gap-3 px-4 py-8 text-center transition-colors duration-400 hover:bg-surface"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white transition-all duration-400 group-hover:scale-110 group-hover:border-brand-red/35 group-hover:text-brand-red group-hover:shadow-[0_0_15px_rgba(237,27,36,0.2)]">
              <item.icon className="h-5 w-5 stroke-[1.5]" aria-hidden="true" />
            </span>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
              {item.label}
            </p>
            <p className="max-w-[200px] text-xs leading-5 text-white/55">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
