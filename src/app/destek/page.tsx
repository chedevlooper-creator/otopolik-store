import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  BotIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { getStoreSettings } from "@/lib/site-settings";
import { isCustomerAiUiEnabled } from "@/lib/storefront-flags";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Destek ve İletişim",
  description:
    "Kargo, ölçü, bakım ve sipariş sorularınız için OTO POLİK destek ekibine ulaşın.",
};

export default async function SupportPage() {
  const aiEnabled = isCustomerAiUiEnabled();
  const [settings, SupportChat] = await Promise.all([
    getStoreSettings(),
    aiEnabled
      ? import("@/components/support/SupportChat").then(
          (module) => module.default
        )
      : Promise.resolve(null),
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
            {aiEnabled ? (
              <BotIcon className="size-4" aria-hidden="true" />
            ) : (
              <MessageCircleIcon className="size-4" aria-hidden="true" />
            )}
            {aiEnabled ? "OTO POLİK AI DESTEK" : "OTO POLİK DESTEK"}
          </span>
          <h1 className="mt-5 font-heading text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            {aiEnabled ? "Sorunuzdan çözüme," : "Sorunuz için"}
            <span className="block text-white/55">
              {aiEnabled ? "tek bir konuşmada." : "yanınızdayız."}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
            {aiEnabled
              ? "Kargo, araç uyumu, paspas bakımı ve WhatsApp sipariş taslağı için canlı mağaza bilgileriyle çalışan yapay zekâ yardımcısı."
              : "Kargo, araç uyumu, paspas bakımı ve sipariş sorularınız için destek ekibimize WhatsApp üzerinden ulaşın."}
          </p>
        </header>

        {aiEnabled && SupportChat ? (
          <SupportChat />
        ) : (
          <section
            aria-labelledby="support-fallback-title"
            className="surface-glass mac-glass mx-auto max-w-3xl rounded-2xl border border-white/10 bg-black p-6 sm:p-9"
          >
            <span className="icon-badge-rich flex size-12 items-center justify-center">
              <MessageCircleIcon className="size-5" aria-hidden="true" />
            </span>
            <h2
              id="support-fallback-title"
              className="mt-5 font-heading text-2xl font-bold text-white sm:text-3xl"
            >
              En hızlı destek WhatsApp&apos;ta
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
              Kargo ve ürün bilgilerine göz atabilir veya hazırladığımız mesajla
              doğrudan destek ekibimize ulaşabilirsiniz.
            </p>



            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-red-rich btn-press mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 px-5 text-sm font-bold"
            >
              <MessageCircleIcon className="size-4" aria-hidden="true" />
              WhatsApp&apos;tan destek al
            </a>

            <p className="mt-5 flex items-start gap-2 text-[11px] leading-5 text-white/40">
              <ShieldCheckIcon
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              Sepet, tasarım ve WhatsApp sipariş akışınız kesintisiz devam
              eder.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
