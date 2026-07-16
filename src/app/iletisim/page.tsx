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
      <span className="spec-label">{kicker?.title ?? "İletişim"}</span>
      <h1 className="mt-4 font-heading text-4xl font-bold text-white sm:text-5xl">
        {page?.title ?? "Bize Ulaşın"}
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        {page?.description ??
          "Aracınıza özel paspas seçimi, kargo durumu veya sipariş öncesi sorularınız için aşağıdaki kanallardan bize ulaşabilirsiniz."}
      </p>

      <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-3">
        <a
          href={`tel:${settings.phoneDisplay.replace(/\s/g, "")}`}
          className="group bg-surface bg-gradient-to-b from-white/[0.035] to-transparent p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,.05)] transition-all hover:bg-surface-hover hover:shadow-[inset_0_1px_0_rgba(255,255,255,.09),0_16px_44px_rgba(0,0,0,.3)]"
        >
          <span className="mx-auto flex h-14 w-14 items-center justify-center border border-white/12 bg-gradient-to-b from-white/[0.06] to-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,.1),0_10px_24px_rgba(0,0,0,.35)] transition-transform duration-300 group-hover:-translate-y-0.5">
            <PhoneIcon className="h-6 w-6 text-sand" aria-hidden="true" />
          </span>
          <p className="mt-4 font-heading text-lg font-bold uppercase text-white">Telefon</p>
          <p className="spec-value mt-1 text-sm text-muted">{settings.phoneDisplay}</p>
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-surface bg-gradient-to-b from-white/[0.035] to-transparent p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,.05)] transition-all hover:bg-surface-hover hover:shadow-[inset_0_1px_0_rgba(255,255,255,.09),0_16px_44px_rgba(0,0,0,.3)]"
        >
          <span className="mx-auto flex h-14 w-14 items-center justify-center border border-white/12 bg-gradient-to-b from-white/[0.06] to-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,.1),0_10px_24px_rgba(0,0,0,.35)] transition-transform duration-300 group-hover:-translate-y-0.5">
            <MessageCircleIcon className="h-6 w-6 text-[#25D366]" aria-hidden="true" />
          </span>
          <p className="mt-4 font-heading text-lg font-bold uppercase text-white">WhatsApp</p>
          <p className="mt-1 text-sm text-muted">
            {whatsappSub?.body ?? "Anında yazışın"}
          </p>
        </a>
        <a
          href={`mailto:${settings.email}`}
          className="group bg-surface bg-gradient-to-b from-white/[0.035] to-transparent p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,.05)] transition-all hover:bg-surface-hover hover:shadow-[inset_0_1px_0_rgba(255,255,255,.09),0_16px_44px_rgba(0,0,0,.3)]"
        >
          <span className="mx-auto flex h-14 w-14 items-center justify-center border border-white/12 bg-gradient-to-b from-white/[0.06] to-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,.1),0_10px_24px_rgba(0,0,0,.35)] transition-transform duration-300 group-hover:-translate-y-0.5">
            <MailIcon className="h-6 w-6 text-sand" aria-hidden="true" />
          </span>
          <p className="mt-4 font-heading text-lg font-bold uppercase text-white">E-posta</p>
          <p className="spec-value mt-1 text-sm text-muted">{settings.email}</p>
        </a>
      </div>

      <div className="mt-10 border border-dashed border-border p-6">
        <p className="inline-flex items-center gap-2 font-heading text-lg font-bold uppercase text-white">
          <MapPinIcon className="h-5 w-5 text-sand" aria-hidden="true" />
          Adres
        </p>
        <p className="mt-2 text-sm text-muted">{settings.address}</p>
        <p className="spec-value mt-1 text-xs text-muted">{settings.businessHours}</p>
      </div>
    </div>
  );
}
