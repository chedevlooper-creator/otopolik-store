import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { PhoneIcon, MailIcon, MapPinIcon, RulerIcon, ShieldCheckIcon, TruckIcon, ScissorsIcon } from "lucide-react";

const TRUST_BADGES = [
  { icon: RulerIcon, label: "Araca özel lazer kalıp", sub: "Milimetrik uyum" },
  { icon: ScissorsIcon, label: "Premium EVA malzeme", sub: "Kokusuz, dayanıklı" },
  { icon: TruckIcon, label: "1-3 günde kargoda", sub: "Ücretsiz gönderim fırsatı" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background text-white">
      {/* Trust badges band */}
      <div className="border-b border-dashed border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-stretch px-4">
          {TRUST_BADGES.map(({ icon: Icon, label, sub }, index) => (
            <div
              key={label}
              className={`flex flex-1 items-center gap-3 py-5 min-[480px]:min-w-[180px] ${
                index !== 0 ? "border-l border-border pl-5 sm:pl-6" : ""
              } ${index !== TRUST_BADGES.length - 1 ? "sm:pr-6" : ""}`}
            >
              <Icon className="h-5 w-5 shrink-0 text-sand" aria-hidden="true" />
              <div>
                <p className="spec-value text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                  {label}
                </p>
                <p className="mt-0.5 text-[10px] text-white/40">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <span className="font-heading text-3xl font-bold uppercase tracking-wide">
              OTO<span className="text-brand-red">POLİK</span>
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Premium EVA paspas setleri. Her araca özel, milimetrik uyumlu üretim. 4 mevsim, tek sıkım suyla temizlik.
            </p>
            <div className="mt-6 space-y-3 text-sm text-foreground/70">
              <a
                href={`tel:${siteConfig.phoneDisplay.replace(/\s/g, "")}`}
                className="spec-value inline-flex items-center gap-2.5 transition-colors hover:text-sand"
              >
                <PhoneIcon className="h-4 w-4 text-sand" aria-hidden="true" />
                {siteConfig.phoneDisplay}
              </a>
              <br />
              <a
                href={`mailto:${siteConfig.email}`}
                className="spec-value inline-flex items-center gap-2.5 transition-colors hover:text-sand"
              >
                <MailIcon className="h-4 w-4 text-sand" aria-hidden="true" />
                {siteConfig.email}
              </a>
              <span className="flex items-start gap-2.5">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-sand" aria-hidden="true" />
                <span className="leading-relaxed">{siteConfig.address}</span>
              </span>
            </div>
          </div>

          <div>
            <h3 className="spec-label mb-5">Sayfalar</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/urunler" className="text-foreground/60 transition-colors hover:text-sand">Ürünler</Link></li>
              <li><Link href="/olusturucu" className="text-foreground/60 transition-colors hover:text-sand">Paspas Tasarla</Link></li>
              <li><Link href="/iletisim" className="text-foreground/60 transition-colors hover:text-sand">İletişim</Link></li>
              <li><Link href="/hakkimizda" className="text-foreground/60 transition-colors hover:text-sand">Hakkımızda</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="spec-label mb-5">Bilgi</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/bilgiler/kargo" className="text-foreground/60 transition-colors hover:text-sand">Kargo ve Teslimat</Link></li>
              <li><Link href="/bilgiler/iade" className="text-foreground/60 transition-colors hover:text-sand">İade ve Değişim</Link></li>
              <li><Link href="/bilgiler/gizlilik" className="text-foreground/60 transition-colors hover:text-sand">Gizlilik</Link></li>
              <li><Link href="/sepet" className="text-foreground/60 transition-colors hover:text-sand">Sepetim</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-dashed border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-muted">
          <span className="spec-value">© {new Date().getFullYear()} {siteConfig.name}</span>
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-sand"
            >
              Instagram
            </a>
            <span className="spec-value text-white/20" aria-hidden="true">|</span>
            <span className="spec-value">Premium EVA Paspas Üreticisi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
