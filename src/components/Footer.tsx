"use client";

import Link from "next/link";
import {
  buildWhatsAppLink,
  useStoreSettings,
} from "@/context/settings-context";
import { useCmsChrome } from "@/context/cms-context";
import {
  ArrowRightIcon,
  CameraIcon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
  PlayIcon,
} from "lucide-react";
import Logo from "@/components/Logo";

const PAGE_LINKS = [
  { href: "/urunler", label: "Tüm ürünler" },
  { href: "/olusturucu", label: "Paspas tasarla" },
  { href: "/galeri", label: "Uygulama galerisi" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

const INFO_LINKS = [
  { href: "/bilgiler/kargo", label: "Kargo ve teslimat" },
  { href: "/bilgiler/iade", label: "İade ve değişim" },
  { href: "/bilgiler/mesafeli-satis", label: "Mesafeli satış" },
  { href: "/bilgiler/on-bilgilendirme", label: "Ön bilgilendirme" },
  { href: "/bilgiler/gizlilik", label: "Gizlilik" },
  { href: "/bilgiler/ozel-uretim", label: "Özel üretim" },
  { href: "/sepet", label: "Sepetim" },
];

export default function Footer() {
  const settings = useStoreSettings();
  const cms = useCmsChrome();
  const whatsappHref = buildWhatsAppLink(
    settings.whatsappNumber,
    "Merhaba, aracıma uygun EVA paspas seti hakkında bilgi almak istiyorum."
  );
  const footer = cms.footer;

  return (
    <footer className="site-footer border-t border-white/[0.04] bg-[#070810] text-white">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:pt-10">
        <div className="footer-cta">
          <div className="footer-cta__mesh" aria-hidden="true" />
          <div className="footer-cta__sheen" aria-hidden="true" />
          <div className="footer-cta__content">
            <div className="footer-cta__copy">
              <p className="footer-cta__eyebrow">
                {footer?.eyebrow ?? "Aracınıza özel üretim"}
              </p>
              <h2 className="footer-cta__title">
                {footer?.title ?? "Doğru kalıbı seçin, tarzınızı yola taşıyın."}
              </h2>
              <p className="footer-cta__sub">
                CNC kesim · Premium EVA · {settings.estimatedDispatch} içinde kargo
              </p>
            </div>
            <div className="footer-cta__actions">
              <Link
                href={footer?.ctaHref ?? "/olusturucu"}
                className="btn-press btn-sand-rich footer-cta__btn"
              >
                {footer?.ctaLabel ?? "Tasarımını başlat"}
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/urunler" className="footer-cta__ghost">
                Ürünleri incele
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_.75fr_.75fr_1fr] lg:gap-12">
          <div>
            <Logo size="lg" />
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/50">
              {footer?.body ??
                "Her araca özel kalıp, premium EVA malzeme ve titiz işçilik. Aracınızın iç mekânını koruyan modern çözümler."}
            </p>
            <div className="mt-6 flex gap-2">
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social">
                <CameraIcon className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="https://youtube.com/@otopolik" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="footer-social">
                <PlayIcon className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="footer-col-title">Keşfet</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {PAGE_LINKS.map((item) => (
                <li key={item.href}><Link href={item.href} className="footer-link">{item.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="footer-col-title">Destek</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {INFO_LINKS.map((item) => (
                <li key={item.href}><Link href={item.href} className="footer-link">{item.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="footer-col-title">Bize ulaşın</h3>
            <div className="mt-5 space-y-4 text-sm text-white/55">
              <a href={`tel:${settings.phoneDisplay.replace(/\s/g, "")}`} className="flex items-center gap-3 transition-colors hover:text-white">
                <PhoneIcon className="h-4 w-4 shrink-0 text-sand/80" aria-hidden="true" />
                {settings.phoneDisplay}
              </a>
              <a href={`mailto:${settings.email}`} className="link-slide-reverse inline-flex items-center gap-3 text-white/65 hover:text-white">
                <MailIcon className="h-4 w-4 shrink-0 text-sand" aria-hidden="true" />
                {settings.email}
              </a>
              <p className="flex items-start gap-3 leading-6">
                <MapPinIcon className="mt-1 h-4 w-4 shrink-0 text-sand/80" aria-hidden="true" />
                {settings.address}
              </p>
            </div>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-press mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#25D366]/30 bg-[#25D366]/[0.08] px-5 text-xs font-bold text-[#7bf0a7] hover:border-[#25D366]/50 hover:bg-[#25D366]/12">
              <MessageCircleIcon className="h-4 w-4" aria-hidden="true" />
              WhatsApp desteği
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.04]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-[10px] uppercase tracking-[0.12em] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {cms.seo.siteName}</span>
          <span>{footer?.subtitle ?? "İstanbul'da üretilir · Türkiye'ye gönderilir"}</span>
        </div>
      </div>
    </footer>
  );
}
