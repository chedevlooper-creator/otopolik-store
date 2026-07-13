import type { Metadata } from "next";
import { buildWhatsAppOrderLink, siteConfig } from "@/lib/site-config";
import { PhoneIcon, MessageCircleIcon, MailIcon, MapPinIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "İletişim",
};

export default function ContactPage() {
  const whatsappHref = buildWhatsAppOrderLink("Merhaba, bilgi almak istiyorum.");

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:py-20">
      <span className="spec-label">İletişim</span>
      <h1 className="mt-4 font-heading text-4xl font-bold text-white sm:text-5xl">
        Bize Ulaşın
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Aracınıza özel paspas seçimi, kargo durumu veya sipariş öncesi
        sorularınız için aşağıdaki kanallardan bize ulaşabilirsiniz.
      </p>

      <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-3">
        <a
          href={`tel:${siteConfig.phoneDisplay.replace(/\s/g, "")}`}
          className="group bg-surface p-6 text-center transition-colors hover:bg-surface-hover"
        >
          <span className="mx-auto flex h-14 w-14 items-center justify-center border border-border bg-background">
            <PhoneIcon className="h-6 w-6 text-sand" aria-hidden="true" />
          </span>
          <p className="mt-4 font-heading text-lg font-bold uppercase text-white">Telefon</p>
          <p className="spec-value mt-1 text-sm text-muted">{siteConfig.phoneDisplay}</p>
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-surface p-6 text-center transition-colors hover:bg-surface-hover"
        >
          <span className="mx-auto flex h-14 w-14 items-center justify-center border border-border bg-background">
            <MessageCircleIcon className="h-6 w-6 text-[#25D366]" aria-hidden="true" />
          </span>
          <p className="mt-4 font-heading text-lg font-bold uppercase text-white">WhatsApp</p>
          <p className="mt-1 text-sm text-muted">Anında yazışın</p>
        </a>
        <a
          href={`mailto:${siteConfig.email}`}
          className="group bg-surface p-6 text-center transition-colors hover:bg-surface-hover"
        >
          <span className="mx-auto flex h-14 w-14 items-center justify-center border border-border bg-background">
            <MailIcon className="h-6 w-6 text-sand" aria-hidden="true" />
          </span>
          <p className="mt-4 font-heading text-lg font-bold uppercase text-white">E-posta</p>
          <p className="spec-value mt-1 text-sm text-muted">{siteConfig.email}</p>
        </a>
      </div>

      <div className="mt-10 border border-dashed border-border p-6">
        <p className="inline-flex items-center gap-2 font-heading text-lg font-bold uppercase text-white">
          <MapPinIcon className="h-5 w-5 text-sand" aria-hidden="true" />
          Adres
        </p>
        <p className="mt-2 text-sm text-muted">{siteConfig.address}</p>
        <p className="spec-value mt-1 text-xs text-muted">{siteConfig.businessHours}</p>
      </div>
    </div>
  );
}
