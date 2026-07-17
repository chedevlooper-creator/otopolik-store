import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  BotIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
} from "lucide-react";

import SupportChat from "@/components/support/SupportChat";
import { isAiConfigured } from "@/lib/ai/config";
import { getStoreSettings } from "@/lib/site-settings";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "AI Destek ve Sipariş Asistanı",
  description:
    "Kargo, ölçü, bakım ve sipariş taslağı için canlı mağaza bilgileriyle çalışan OTO POLİK AI Asistan.",
};

const fallbackLinks = [
  { href: "/#sss", label: "Sık sorulan sorular" },
  { href: "/bilgiler/kargo", label: "Kargo ve teslimat" },
  { href: "/iletisim", label: "İletişim bilgileri" },
];

export default async function SupportPage() {
  const [aiEnabled, settings] = await Promise.all([
    Promise.resolve(isAiConfigured()),
    getStoreSettings(),
  ]);
  const whatsappHref = buildWhatsAppLink(
    settings.whatsappNumber,
    "Merhaba OTO POLİK, kargo, ölçü veya sipariş konusunda destek almak istiyorum."
  );

  return (
    <div className="relative overflow-hidden bg-black">
      <div
        className="premium-grid pointer-events-none absolute inset-0 opacity-20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[var(--brand-red)]/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-20">
        <header className="mx-auto mb-8 max-w-3xl text-center sm:mb-12">
          <span className="section-kicker inline-flex items-center gap-2">
            <BotIcon className="size-4" aria-hidden="true" />
            OTO POLİK AI DESTEK
          </span>
          <h1 className="mt-5 font-heading text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            Sorunuzdan çözüme,
            <span className="block text-white/55">tek bir konuşmada.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
            Kargo, araç uyumu, paspas bakımı ve WhatsApp sipariş taslağı için
            canlı mağaza bilgileriyle çalışan yapay zekâ yardımcısı.
          </p>
        </header>

        {aiEnabled ? (
          <SupportChat />
        ) : (
          <section
            aria-labelledby="support-fallback-title"
            className="surface-glass mac-glass mx-auto max-w-3xl rounded-2xl border border-white/10 bg-black p-6 sm:p-9"
          >
            <span className="icon-badge-rich flex size-12 items-center justify-center">
              <BotIcon className="size-5" aria-hidden="true" />
            </span>
            <h2
              id="support-fallback-title"
              className="mt-5 font-heading text-2xl font-bold text-white sm:text-3xl"
            >
              AI Asistan şu anda çevrimdışı
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
              Manuel mağaza deneyimi kesintisiz devam ediyor. Kargo ve ürün
              bilgilerine göz atabilir veya hazırladığımız mesajla doğrudan
              WhatsApp ekibine ulaşabilirsiniz.
            </p>

            <nav
              aria-label="Alternatif destek seçenekleri"
              className="mt-6 grid gap-2 sm:grid-cols-3"
            >
              {fallbackLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="btn-ghost-rich btn-press inline-flex min-h-12 items-center justify-between gap-2 px-4 text-xs font-semibold"
                >
                  {item.label}
                  <ArrowRightIcon className="size-4" aria-hidden="true" />
                </Link>
              ))}
            </nav>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-red-rich btn-press mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 px-5 text-sm font-bold"
            >
              <MessageCircleIcon className="size-4" aria-hidden="true" />
              WhatsApp desteğine geç
            </a>

            <p className="mt-5 flex items-start gap-2 text-[11px] leading-5 text-white/40">
              <ShieldCheckIcon
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              AI özelliğinin kapalı olması sepet, tasarım, iletişim veya
              WhatsApp sipariş akışını etkilemez.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
