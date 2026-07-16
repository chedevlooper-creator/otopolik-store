import {
  DropletsIcon,
  ShieldCheckIcon,
  SparklesIcon,
  LeafIcon,
  GemIcon,
} from "lucide-react";

const FEATURES = [
  { label: "Su geçirmez", icon: DropletsIcon },
  { label: "Kolay temizlik", icon: SparklesIcon },
  { label: "Kaymaz yüzey", icon: ShieldCheckIcon },
  { label: "Kokusuz EVA", icon: LeafIcon },
  { label: "Uzun ömürlü", icon: GemIcon },
] as const;

export default function FeatureBar() {
  return (
    <section
      id="ozellikler"
      aria-label="Ürün özellikleri"
      className="feature-bar border-y border-white/[0.06] bg-[#050608]"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4 lg:py-10">
        {FEATURES.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-3 text-center sm:justify-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-sand/35 text-sand">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
