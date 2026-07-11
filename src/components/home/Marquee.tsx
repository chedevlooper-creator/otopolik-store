const MARQUEE_ITEMS = [
  "🚚 1.500₺ üzeri ücretsiz kargo",
  "🛡️ Araca özel tam uyum garantisi",
  "💧 Tek sıkım suyla temizlik",
  "↩️ 14 gün iade garantisi",
  "🏆 Premium EVA malzeme",
];

export default function Marquee() {
  return (
    <div className="mt-10 overflow-hidden bg-brand-red py-2.5 text-white">
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap text-sm font-semibold">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            {item} <span className="opacity-40">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
