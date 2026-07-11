import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="relative bg-brand-black text-neutral-300">
      {/* Marka kırmızısı üst vurgu çizgisi */}
      <div className="h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent" />
      <div className="bg-dots-dark pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Image src="/media/logo.jpg" alt={siteConfig.name} width={56} height={56} quality={95} className="rounded-full ring-2 ring-white/15" />
            <span className="font-heading font-extrabold text-white text-xl tracking-tight">
              OTO <span className="text-brand-red">POLİK</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-neutral-400">{siteConfig.description}</p>
        </div>

        <div>
          <h3 className="font-heading font-bold text-white mb-3">Hızlı Bağlantılar</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/urunler" className="hover:text-brand-red">Tüm Ürünler</Link></li>
            <li><Link href="/olusturucu" className="hover:text-brand-red">Paspas Tasarla</Link></li>
            <li><Link href="/hakkimizda" className="hover:text-brand-red">Hakkımızda</Link></li>
            <li><Link href="/iletisim" className="hover:text-brand-red">İletişim</Link></li>
            <li><Link href="/sepet" className="hover:text-brand-red">Sepetim</Link></li>
            <li><Link href="/bilgiler/kargo" className="hover:text-brand-red">Kargo ve Teslimat</Link></li>
            <li><Link href="/bilgiler/iade" className="hover:text-brand-red">İade ve Değişim</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading font-bold text-white mb-3">Kategoriler</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/urunler?kategori=eva-3d" className="hover:text-brand-red">3D EVA Paspas</Link></li>
            <li><Link href="/urunler?kategori=eva-havuzlu" className="hover:text-brand-red">Havuzlu EVA Paspas</Link></li>
            <li><Link href="/urunler?kategori=bagaj" className="hover:text-brand-red">Bagaj Paspası</Link></li>
            <li><Link href="/bilgiler/ozel-uretim" className="hover:text-brand-red">Özel Üretim</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading font-bold text-white mb-3">İletişim</h3>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li>📞 {siteConfig.phoneDisplay}</li>
            <li>✉️ {siteConfig.email}</li>
            <li>📍 {siteConfig.address}</li>
            <li>🕒 {siteConfig.businessHours}</li>
            <li><a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-brand-red">Instagram&apos;da @otopolik</a></li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {siteConfig.name}. Tüm hakları saklıdır.</span>
          <Link href="/bilgiler/gizlilik" className="hover:text-brand-red">Gizlilik ve Ön Bilgilendirme</Link>
        </div>
      </div>
    </footer>
  );
}
