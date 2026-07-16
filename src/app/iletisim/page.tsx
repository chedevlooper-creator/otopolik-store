import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/site-settings";
import { getContentPage } from "@/lib/cms";
import { PhoneIcon, MessageCircleIcon, MailIcon, MapPinIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getContentPage("iletisim");
  return {
    title: page?.metaTitle ?? "İletişim",
    description: page?.metaDescription,
  };
}

export default async function ContactPage() {
  const [settings, { page, sections }] = await Promise.all([
    getStoreSettings(),
    getContentPage("iletisim"),
  ]);
  const kicker = sections.find((s) => s.sectionKey === "kicker");
  const whatsappSub = sections.find((s) => s.sectionKey === "whatsapp-subtitle");
  const whatsappHref = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Merhaba, bilgi almak istiyorum.")}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:py-20">
      <span className="section-kicker">{kicker?.title ?? "İletişim"}</span>
      <h1 className="mt-5 font-heading text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
        {page?.title ?? "Bize ulaşın"}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">
        {page?.description ??
          "Aracınıza özel paspas seçimi, kargo durumu veya sipariş öncesi sorularınız için aşağıdaki kanallardan bize ulaşabilirsiniz."}
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        <a
          href={`tel:${settings.phoneDisplay.replace(/\s/g, "")}`}
          className="group border border-white/10 bg-[#0a0c12] p-6 transition-colors hover:border-sand/35"
        >
          <span className="flex h-11 w-11 items-center justify-center border border-sand/30 text-sand">
            <PhoneIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-4 font-heading text-lg font-bold text-white">Telefon</p>
          <p className="spec-value mt-1 text-sm text-white/50">{settings.phoneDisplay}</p>
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group border border-white/10 bg-[#0a0c12] p-6 transition-colors hover:border-sand/35"
        >
          <span className="flex h-11 w-11 items-center justify-center border border-[#25D366]/40 text-[#25D366]">
            <MessageCircleIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-4 font-heading text-lg font-bold text-white">WhatsApp</p>
          <p className="mt-1 text-sm text-white/50">
            {whatsappSub?.body ?? "Anında yazışın"}
          </p>
        </a>
        <a
          href={`mailto:${settings.email}`}
          className="group border border-white/10 bg-[#0a0c12] p-6 transition-colors hover:border-sand/35"
        >
          <span className="flex h-11 w-11 items-center justify-center border border-sand/30 text-sand">
            <MailIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-4 font-heading text-lg font-bold text-white">E-posta</p>
          <p className="spec-value mt-1 text-sm text-white/50">{settings.email}</p>
        </a>
      </div>

      <div className="mt-6 border border-white/10 bg-[#0a0c12] p-6">
        <p className="inline-flex items-center gap-2 font-heading text-lg font-bold text-white">
          <MapPinIcon className="h-5 w-5 text-sand" aria-hidden="true" />
          Adres
        </p>
        <p className="mt-2 text-sm text-white/55">{settings.address}</p>
        <p className="spec-value mt-1 text-xs text-white/40">{settings.businessHours}</p>
      </div>
    </div>
  );
}
