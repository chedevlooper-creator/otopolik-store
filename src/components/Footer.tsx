import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { PhoneIcon, MailIcon, MapPinIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <span className="font-heading text-xl font-extrabold tracking-tight">
              OTO<span className="text-brand-red">POLİK</span>
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/50">
              Premium EVA paspas setleri. Her araca özel, milimetrik uyumlu üretim.
            </p>
            <div className="mt-5 space-y-2 text-sm text-white/60">
              <a
                href={`tel:${siteConfig.phoneDisplay.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-white"
              >
                <PhoneIcon className="h-4 w-4 text-brand-red" />
                {siteConfig.phoneDisplay}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-white"
              >
                <MailIcon className="h-4 w-4 text-brand-red" />
                {siteConfig.email}
              </a>
              <span className="inline-flex items-start gap-2">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                {siteConfig.address}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:gap-8">
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white/30">Sayfalar</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/urunler" className="text-white/50 hover:text-white">Ürünler</Link></li>
                <li><Link href="/olusturucu" className="text-white/50 hover:text-white">Paspas Tasarla</Link></li>
                <li><Link href="/iletisim" className="text-white/50 hover:text-white">İletişim</Link></li>
                <li><Link href="/hakkimizda" className="text-white/50 hover:text-white">Hakkımızda</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white/30">Bilgi</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/bilgiler/kargo" className="text-white/50 hover:text-white">Kargo ve Teslimat</Link></li>
                <li><Link href="/bilgiler/iade" className="text-white/50 hover:text-white">İade ve Değişim</Link></li>
                <li><Link href="/bilgiler/gizlilik" className="text-white/50 hover:text-white">Gizlilik</Link></li>
                <li><Link href="/sepet" className="text-white/50 hover:text-white">Sepetim</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-white/30 flex items-center justify-between">
          <span>© {new Date().getFullYear()} {siteConfig.name}</span>
          <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white/60">Instagram</a>
        </div>
      </div>
    </footer>
  );
}
