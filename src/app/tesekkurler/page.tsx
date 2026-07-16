import type { Metadata } from "next";
import Link from "next/link";
import { getContentPage } from "@/lib/cms";
import { getStoreSettings } from "@/lib/site-settings";
import { CheckIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getContentPage("tesekkurler");
  return {
    title: page?.metaTitle ?? "Sipariş Özeti Hazır",
    description:
      page?.metaDescription ??
      "OTO POLİK sipariş talebinizi WhatsApp üzerinden tamamlayın.",
  };
}

export default async function ThankYouPage() {
  const [{ page, sections }, settings] = await Promise.all([
    getContentPage("tesekkurler"),
    getStoreSettings(),
  ]);
  const body = sections.find((s) => s.sectionKey === "body");
  const title = body?.title ?? page?.title ?? "Sipariş Özetiniz Hazır";
  const description =
    body?.body ??
    page?.description ??
    "WhatsApp sohbet penceresinde hazırlanan sipariş detaylarını göndererek talebinizi tamamlayın.";
  const primaryCta = body?.ctaLabel ?? "Alışverişe Devam Et";
  const primaryHref = body?.ctaHref ?? "/urunler";
  const secondaryCta = body?.subtitle ?? "Ana Sayfa";

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:py-28">
      <span className="mx-auto flex h-16 w-16 items-center justify-center border border-sand bg-[#0a0c12]">
        <CheckIcon className="h-8 w-8 text-sand" aria-hidden="true" />
      </span>
      <h1 className="mt-8 font-heading text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 text-sm leading-7 text-white/55">{description}</p>
      <p className="mt-5 text-sm text-white/45">Herhangi bir sorunuz olursa</p>
      <a
        href={`tel:${settings.phoneDisplay.replace(/\s/g, "")}`}
        className="spec-value mt-1 inline-block text-lg font-semibold text-sand transition-colors hover:text-white"
      >
        {settings.phoneDisplay}
      </a>
      <p className="mt-1 text-sm text-white/45">
        numaralı hattımızdan bize ulaşabilirsiniz.
      </p>

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href={primaryHref}
          className="btn-press btn-sand-rich inline-flex min-h-12 px-7 text-[11px] font-bold uppercase tracking-[0.12em] text-background"
        >
          {primaryCta}
        </Link>
        <Link
          href="/"
          className="btn-press inline-flex min-h-12 items-center border border-white/15 px-7 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:border-sand hover:text-sand"
        >
          {secondaryCta}
        </Link>
      </div>
    </div>
  );
}
