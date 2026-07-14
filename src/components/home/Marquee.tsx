import { siteConfig } from "@/lib/site-config";

const MARQUEE_ITEMS = [
  `${siteConfig.freeShippingThreshold.toLocaleString("tr-TR")}₺ üzeri ücretsiz kargo`,
  "Araca özel milimetrik kalıp",
  "Su ile kolay temizlik",
  "Sipariş öncesi uyumluluk onayı",
  "Kokusuz premium EVA",
];

export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-brand-red/25 bg-gradient-to-r from-brand-red/8 via-brand-red/14 to-brand-red/8 py-3.5">
      <div className="animate-marquee spec-value flex w-max gap-10 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.17em] text-white/70 sm:text-[11px]">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => (
          <span key={`${item}-${index}`} aria-hidden={index >= MARQUEE_ITEMS.length || undefined} className="flex items-center gap-10">
            {item}
            <span className="h-1.5 w-1.5 rotate-45 bg-brand-red shadow-[0_0_12px_rgba(227,25,55,.8)]" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}
