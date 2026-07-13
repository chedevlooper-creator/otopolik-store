const MARQUEE_ITEMS = [
  "3.500₺ üzeri ücretsiz kargo",
  "Araca özel tam uyum garantisi",
  "Tek sıkım suyla temizlik",
  "14 gün iade garantisi",
  "Premium EVA malzeme",
];

// Kesim föyündeki kesikli kesim çizgisi gibi iki hatlı duyuru bandı
export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-dashed border-border bg-surface py-3">
      <div className="animate-marquee spec-value flex w-max gap-12 whitespace-nowrap text-xs font-medium uppercase tracking-[0.16em] text-sand">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span
            key={i}
            aria-hidden={i >= MARQUEE_ITEMS.length || undefined}
            className="flex items-center gap-12"
          >
            {item} <span className="text-sand-dim" aria-hidden="true">+</span>
          </span>
        ))}
      </div>
    </div>
  );
}
