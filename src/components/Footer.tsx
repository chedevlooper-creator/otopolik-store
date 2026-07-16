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
    <footer className="border-t border-white/[0.04] bg-[#070810] text-white">
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <div className="relative overflow-hidden rounded-2xl border border-brand-red/20 bg-gradient-to-br from-brand-red via-[#c5112d] to-[#790b1c] px-6 py-8 shadow-[0_30px_90px_rgba(227,25,55,.12)] sm:px-9 sm:py-10">
          <div className="premium-grid pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-white/80">
                {footer?.eyebrow ?? "Aracınıza özel üretim"}
              </p>
              <h2 className="mt-3 max-w-3xl font-heading text-3xl font-bold text-white sm:text-4xl">
                {footer?.title ?? "Doğru kalıbı seçin, tarzınızı yola taşıyın."}
              </h2>
            </div>
            <Link
              href={footer?.ctaHref ?? "/olusturucu"}
              className="btn-press btn-light-rich inline-flex min-h-13 w-fit shrink-0 items-center justify-center gap-2 rounded-full px-7 text-sm font-bold text-background"
            >
              {footer?.ctaLabel ?? "Tasarımını başlat"}
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
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
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/62 hover:border-pink-500/40 hover:bg-pink-500/10 hover:text-pink-300">
                <CameraIcon className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="https://youtube.com/@otopolik" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-icon flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/62 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300">
                <PlayIcon className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-sand/80">Keşfet</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {PAGE_LINKS.map((item) => (
                <li key={item.href}><Link href={item.href} className="link-slide inline-block text-white/62 transition-colors hover:text-white">{item.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-sand/80">Destek</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {INFO_LINKS.map((item) => (
                <li key={item.href}><Link href={item.href} className="link-slide inline-block text-white/62 transition-colors hover:text-white">{item.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-sand">Bize ulaşın</h3>
            <div className="mt-5 space-y-4 text-sm text-white/65">
              <a href={`tel:${settings.phoneDisplay.replace(/\s/g, "")}`} className="link-slide-reverse inline-flex items-center gap-3 text-white/65 hover:text-white">
                <PhoneIcon className="h-4 w-4 shrink-0 text-sand transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
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
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-press mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#25D366]/30 bg-[#25D366]/[0.08] px-5 text-xs font-bold text-[#7bf0a7] hover:border-[#25D366]/50 hover:bg-[#25D366]/12">
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
