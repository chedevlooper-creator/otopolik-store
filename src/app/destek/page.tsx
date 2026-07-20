import type { Metadata } from "next";
import {
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
            className="mx-auto max-w-3xl py-10 flex flex-col items-center text-center"
          >
            <span className="icon-badge-rich flex size-16 items-center justify-center rounded-full mb-6">
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
              className="btn-red-rich btn-press mt-6 inline-flex h-14 w-fit items-center justify-center gap-3 rounded-full px-8 text-sm font-bold uppercase tracking-wider"
            >
              <MessageCircleIcon className="size-5" aria-hidden="true" />
              WhatsApp&apos;tan Destek Al
            </a>

            <p className="mt-6 flex items-center justify-center gap-2 text-[11px] leading-5 text-white/40">
              <ShieldCheckIcon
                className="size-4 shrink-0"
                aria-hidden="true"
              />
              Sepet, tasarım ve WhatsApp sipariş akışınız kesintisiz devam eder.
            </p>

            {/* SSS Accordions */}
            <div className="mt-20 w-full text-left border-t border-white/5 pt-12">
              <h3 className="font-heading text-xl font-bold text-white mb-8 text-center uppercase tracking-wider">
                Sıkça Sorulan Sorular
              </h3>
              <div className="space-y-5 max-w-2xl mx-auto">
                <details className="group border-b border-white/5 pb-4">
                  <summary className="flex cursor-pointer items-center justify-between font-semibold text-white/90 group-open:text-white transition-colors list-none [&::-webkit-details-marker]:hidden">
                    <span>Paspaslar aracıma tam uyum sağlar mı?</span>
                    <span className="text-[var(--brand-red)] font-mono transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-white/60">
                    Evet, tüm paspaslarımız 3D lazer tarama cihazları ile alınmış milimetrik araç şablonlarına göre CNC lazer makinelerinde kesilir. OTO POLİK olarak %100 uyum garantisi sunuyoruz.
                  </p>
                </details>
                <details className="group border-b border-white/5 pb-4">
                  <summary className="flex cursor-pointer items-center justify-between font-semibold text-white/90 group-open:text-white transition-colors list-none [&::-webkit-details-marker]:hidden">
                    <span>Sipariş verdikten sonra ne zaman kargolanır?</span>
                    <span className="text-[var(--brand-red)] font-mono transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-white/60">
                    Her paspas sipariş üzerine özel olarak üretilir. Üretim ve kalite kontrol süreçlerimiz genellikle 1 ila 3 iş günü sürer ve ardından hızlı kargo ile adresinize gönderilir.
                  </p>
                </details>
                <details className="group border-b border-white/5 pb-4">
                  <summary className="flex cursor-pointer items-center justify-between font-semibold text-white/90 group-open:text-white transition-colors list-none [&::-webkit-details-marker]:hidden">
                    <span>EVA paspasların bakımı ve temizliği nasıldır?</span>
                    <span className="text-[var(--brand-red)] font-mono transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-white/60">
                    Hücre yapısı sayesinde kiri ve suyu hapseder. Temizlemek için paspası ters çevirip hafifçe vurmanız veya suyla durulamanız yeterlidir. Hızlı kuruyan yapısıyla saniyeler içinde tekrar kullanıma hazır hale gelir.
                  </p>
                </details>
                <details className="group border-b border-white/5 pb-4">
                  <summary className="flex cursor-pointer items-center justify-between font-semibold text-white/90 group-open:text-white transition-colors list-none [&::-webkit-details-marker]:hidden">
                    <span>İade veya değişim koşulları nelerdir?</span>
                    <span className="text-[var(--brand-red)] font-mono transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-white/60">
                    Ürünlerimiz sipariş üzerine tamamen sizin seçtiğiniz renk kombinasyonlarında ve aracınıza özel ölçülerde üretildiği için cayma hakkı kapsamında iade alınamamaktadır. Ancak üretim kaynaklı hatalarda veya ölçü uyumsuzluğunda ücretsiz revizyon ve değişim desteği sağlıyoruz.
                  </p>
                </details>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
