import type { Metadata } from "next";
import { buildWhatsAppOrderLink, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `İletişim | ${siteConfig.name}`,
};

export default function ContactPage() {
  const whatsappHref = buildWhatsAppOrderLink("Merhaba, bilgi almak istiyorum.");

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:py-20">
      <span className="text-xs font-bold uppercase tracking-widest text-brand-red">İletişim</span>
      <h1 className="font-heading mt-2 text-3xl font-extrabold text-neutral-900 sm:text-4xl">
        Bize Ulaşın
      </h1>
      <p className="mt-3 max-w-2xl text-neutral-600">
        Aracınıza özel paspas seçimi, kargo durumu veya sipariş öncesi
        sorularınız için aşağıdaki kanallardan bize ulaşabilirsiniz.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <a
          href={`tel:${siteConfig.phoneDisplay.replace(/\s/g, "")}`}
          className="rounded-2xl border border-neutral-200 p-6 text-center transition-colors hover:border-brand-red"
        >
          <p className="text-3xl">📞</p>
          <p className="font-heading mt-3 font-bold text-neutral-900">Telefon</p>
          <p className="mt-1 text-sm text-neutral-600">{siteConfig.phoneDisplay}</p>
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl border border-neutral-200 p-6 text-center transition-colors hover:border-brand-red"
        >
          <p className="text-3xl">💬</p>
          <p className="font-heading mt-3 font-bold text-neutral-900">WhatsApp</p>
          <p className="mt-1 text-sm text-neutral-600">Anında yazışın</p>
        </a>
        <a
          href={`mailto:${siteConfig.email}`}
          className="rounded-2xl border border-neutral-200 p-6 text-center transition-colors hover:border-brand-red"
        >
          <p className="text-3xl">✉️</p>
          <p className="font-heading mt-3 font-bold text-neutral-900">E-posta</p>
          <p className="mt-1 text-sm text-neutral-600">{siteConfig.email}</p>
        </a>
      </div>

      <div className="mt-10 rounded-2xl bg-neutral-50 p-6">
        <p className="font-heading font-bold text-neutral-900">Adres</p>
        <p className="mt-1 text-sm text-neutral-600">{siteConfig.address}</p>
      </div>
    </div>
  );
}
