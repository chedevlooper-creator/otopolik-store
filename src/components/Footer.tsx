"use client";

import Link from "next/link";
import {
  buildWhatsAppLink,
  useStoreSettings,
} from "@/context/settings-context";
import { useCmsChrome } from "@/context/cms-context";
import { siteConfig } from "@/lib/site-config";
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

const URUNLER_LINKS = [
  { href: "/olusturucu", label: "Paspas Tasarla" },
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
    <footer className="border-t border-white/[0.02] bg-[#000000] text-white">
      <div className="mx-auto max-w-screen-2xl 2xl:px-8 px-4 pt-6">
        <div className="reveal relative overflow-hidden rounded-xl border border-white/[0.02] bg-[#000000] px-6 py-8 sm:px-9 sm:py-10">
          <div className="premium-grid pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-white/[0.03] blur-[90px]" aria-hidden="true" />
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
              className="btn-press btn-red-rich inline-flex min-h-13 w-fit shrink-0 items-center justify-center gap-2 rounded-full px-7 text-xs font-bold uppercase tracking-[0.08em]"
            >
              {footer?.ctaLabel ?? "Tasarımını başlat"}
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl 2xl:px-8 px-4 py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_.6fr_.65fr_.65fr_1fr] lg:gap-10">
          <div>
            <Logo variant="header" ariaLabel="OTO POLİK ana sayfa" />
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/50">
              {footer?.body ??
                "Her araca özel kalıp, premium EVA malzeme ve titiz işçilik. Aracınızın iç mekânını koruyan modern çözümler."}
            </p>
            <nav aria-label="Sosyal medya" className="mt-6 flex gap-2">
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="OTO POLİK Instagram hesabı" className="social-icon flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/62 hover:border-pink-500/40 hover:bg-pink-500/10 hover:text-pink-300">
                <CameraIcon className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href={siteConfig.youtube} target="_blank" rel="noopener noreferrer" aria-label="OTO POLİK YouTube kanalı" className="social-icon flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/62 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300">
                <PlayIcon className="h-4 w-4" aria-hidden="true" />
              </a>
            </nav>
          </div>

          <nav aria-labelledby="footer-products-title">
            <h3 id="footer-products-title" className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/80">Ürünler</h3>
            <ul className="mt-3 space-y-0.5 text-sm">
              {URUNLER_LINKS.map((item) => (
                <li key={item.href}><Link href={item.href} className="link-slide inline-flex min-h-11 min-w-11 items-center text-white/62 transition-colors hover:text-white">{item.label}</Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-explore-title">
            <h3 id="footer-explore-title" className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/80">Keşfet</h3>
            <ul className="mt-3 space-y-0.5 text-sm">
              <li><Link href="/galeri" className="link-slide inline-flex min-h-11 min-w-11 items-center text-white/62 transition-colors hover:text-white">Galeri</Link></li>
              <li><Link href="/#ozellikler" className="link-slide inline-flex min-h-11 min-w-11 items-center text-white/62 transition-colors hover:text-white">Özellikler</Link></li>
              <li><Link href="/#sss" className="link-slide inline-flex min-h-11 min-w-11 items-center text-white/62 transition-colors hover:text-white">S.S.S.</Link></li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-support-title">
            <h3 id="footer-support-title" className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/80">Destek & Yasal</h3>
            <ul className="mt-3 space-y-0.5 text-sm">
              <li><Link href="/destek" className="link-slide inline-flex min-h-11 min-w-11 items-center text-white/62 transition-colors hover:text-white">AI Destek Asistanı</Link></li>
              <li><Link href="/bilgiler/mesafeli-satis" className="link-slide inline-flex min-h-11 min-w-11 items-center text-white/62 transition-colors hover:text-white">Mesafeli Satış Sözleşmesi</Link></li>
              <li><Link href="/bilgiler/gizlilik" className="link-slide inline-flex min-h-11 min-w-11 items-center text-white/62 transition-colors hover:text-white">Gizlilik Politikası</Link></li>
              <li><Link href="/bilgiler/iade" className="link-slide inline-flex min-h-11 min-w-11 items-center text-white/62 transition-colors hover:text-white">İade ve Değişim</Link></li>
            </ul>
          </nav>

          <section aria-labelledby="footer-contact-title">
            <h3 id="footer-contact-title" className="text-[10px] font-bold uppercase tracking-[0.16em] text-white">Bize ulaşın</h3>
            <address className="mt-3 not-italic text-sm text-white/65">
              <a href={`tel:${settings.phoneDisplay.replace(/\s/g, "")}`} className="link-slide-reverse flex min-h-11 items-center gap-3 text-white/65 hover:text-white">
                <PhoneIcon className="h-4 w-4 shrink-0 text-white transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                {settings.phoneDisplay}
              </a>
              <a href={`mailto:${settings.email}`} className="link-slide-reverse flex min-h-11 items-center gap-3 text-white/65 hover:text-white">
                <MailIcon className="h-4 w-4 shrink-0 text-white" aria-hidden="true" />
                {settings.email}
              </a>
              <p className="mt-2 flex items-start gap-3 leading-6">
                <MapPinIcon className="mt-1 h-4 w-4 shrink-0 text-white/80" aria-hidden="true" />
                {settings.address}
              </p>
            </address>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-press mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#25D366]/30 bg-[#25D366]/[0.08] px-5 text-xs font-bold text-[#7bf0a7] hover:border-[#25D366]/50 hover:bg-[#25D366]/12">
              <MessageCircleIcon className="h-4 w-4" aria-hidden="true" />
              WhatsApp desteği
            </a>
          </section>
        </div>
      </div>

      <div className="border-t border-white/[0.04]">
        <div className="mx-auto flex max-w-screen-2xl 2xl:px-8 flex-col gap-2 px-4 py-5 text-[10px] uppercase tracking-[0.12em] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {cms.seo.siteName}</span>
          <span>{footer?.subtitle ?? "İstanbul'da üretilir · Türkiye'ye gönderilir"}</span>
        </div>
      </div>
    </footer>
  );
}
