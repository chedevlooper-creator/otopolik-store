import type { Metadata } from "next";
import Image from "next/image";
import { getStoreSettings } from "@/lib/site-settings";
import { getContentPage } from "@/lib/cms";
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
} from "lucide-react";

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
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;

  const channels = [
    {
      href: `tel:${settings.phoneDisplay.replace(/\s/g, "")}`,
      icon: PhoneIcon,
      iconClass: "text-sand",
      title: "Telefon",
      detail: settings.phoneDisplay,
      detailClass: "spec-value",
      external: false,
    },
    {
      href: whatsappHref,
      icon: MessageCircleIcon,
      iconClass: "text-[#25D366]",
      title: "WhatsApp",
      detail: whatsappSub?.body ?? "Anında yazışın",
      detailClass: "",
      external: true,
    },
    {
      href: `mailto:${settings.email}`,
      icon: MailIcon,
      iconClass: "text-sand",
      title: "E-posta",
      detail: settings.email,
      detailClass: "spec-value",
      external: false,
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-40 left-[-8%] h-[26rem] w-[26rem] rounded-full bg-sand/[0.05] blur-[120px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
        <span className="section-kicker">{kicker?.title ?? "İletişim"}</span>
        <h1 className="section-title mt-5">{page?.title ?? "Bize Ulaşın"}</h1>
        <p className="section-copy mt-5 max-w-2xl">
          {page?.description ??
            "Aracınıza özel paspas seçimi, kargo durumu veya sipariş öncesi sorularınız için aşağıdaki kanallardan bize ulaşabilirsiniz."}
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_.65fr] lg:gap-8">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* İletişim kanalları */}
            <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
              {channels.map((channel) => (
                <a
                  key={channel.title}
                  href={channel.href}
                  {...(channel.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group premium-card gradient-border card-lift rounded-xl p-6 text-center"
                >
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/12 bg-gradient-to-b from-white/[0.06] to-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,.1),0_10px_24px_rgba(0,0,0,.35)] transition-transform duration-300 group-hover:-translate-y-0.5">
                    <channel.icon
                      className={`h-6 w-6 ${channel.iconClass}`}
                      aria-hidden="true"
                    />
                  </span>
                  <p className="mt-5 font-heading text-lg font-bold uppercase text-white transition-colors duration-300 group-hover:text-sand">
                    {channel.title}
                  </p>
                  <p className={`${channel.detailClass} mt-1.5 text-sm text-muted`}>
                    {channel.detail}
                  </p>
                </a>
              ))}
            </div>

            {/* Adres + çalışma saatleri */}
            <div className="premium-card gradient-border grid overflow-hidden rounded-xl sm:grid-cols-[1fr_.55fr]">
              <div className="grid gap-7 p-7 min-[480px]:grid-cols-2 sm:grid-cols-1 sm:p-8 lg:grid-cols-2">
                <div>
                  <p className="inline-flex items-center gap-2.5 font-heading text-lg font-bold uppercase text-white">
                    <MapPinIcon className="h-5 w-5 text-sand" aria-hidden="true" />
                    Adres
                  </p>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {settings.address}
                  </p>
                  <a
                    href={mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-slide mt-4 inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-sand hover:text-white"
                  >
                    Yol tarifi al
                    <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
                <div>
                  <p className="inline-flex items-center gap-2.5 font-heading text-lg font-bold uppercase text-white">
                    <ClockIcon className="h-5 w-5 text-sand" aria-hidden="true" />
                    Çalışma saatleri
                  </p>
                  <p className="spec-value mt-3 text-sm leading-7 text-muted">
                    {settings.businessHours}
                  </p>
                </div>
              </div>
              <figure className="relative hidden min-h-[13rem] border-l border-white/[0.08] sm:block">
                <Image
                  src="/media/water-drops-closeup.jpg"
                  alt="EVA hücre dokusu üzerinde su damlaları"
                  fill
                  sizes="(min-width: 640px) 24vw, 100vw"
                  className="object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,6,.55),transparent_55%)]"
                  aria-hidden="true"
                />
              </figure>
            </div>
          </div>

          {/* WhatsApp paneli — ana sayfadaki SSS yan paneliyle aynı dil */}
          <div className="premium-card gradient-border premium-grid h-fit overflow-hidden rounded-2xl p-7 sm:p-8 lg:sticky lg:top-32">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#25D366]/20 bg-[#25D366]/[0.06] text-[#68e99a]">
              <MessageCircleIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mt-7 font-heading text-3xl font-bold text-white">
              En hızlı yanıt WhatsApp&apos;ta
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/55">
              Marka, model, yıl ve kasa bilginizi gönderin. Doğru kalıbı birlikte
              teyit edip size uygun seti belirleyelim.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/60">
              {[
                "Ücretsiz uyumluluk kontrolü",
                "Sipariş öncesi kalıp teyidi",
                "Renk ve set önerisi",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sand/8 text-sand">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#25D366]/25 bg-[#25D366]/[0.06] px-5 text-sm font-bold text-[#7bf0a7] hover:border-[#25D366]/45 hover:bg-[#25D366]/[0.1]"
              >
                WhatsApp&apos;tan yaz
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
