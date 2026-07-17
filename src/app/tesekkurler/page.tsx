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
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] border-2 border-white bg-surface shadow-[0_24px_60px_rgba(255,255,255,.14)]">
        <CheckIcon className="h-10 w-10 text-white" aria-hidden="true" />
      </span>
      <h1 className="mt-8 font-heading text-4xl font-bold uppercase text-white sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 leading-relaxed text-muted">{description}</p>
      <p className="mt-5 text-sm text-muted">Herhangi bir sorunuz olursa</p>
      <a
        href={`tel:${settings.phoneDisplay.replace(/\s/g, "")}`}
        className="spec-value mt-1 inline-block text-lg font-semibold text-white transition-colors hover:text-white"
      >
        {settings.phoneDisplay}
      </a>
      <p className="mt-1 text-sm text-muted">
        numaralı hattımızdan bize ulaşabilirsiniz.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link
          href={primaryHref}
          className="btn-press btn-red-rich inline-flex min-h-12 items-center rounded-lg px-7 text-xs font-bold uppercase tracking-[0.08em]"
        >
          {primaryCta}
        </Link>
        <Link
          href="/"
          className="btn-press btn-ghost-rich inline-flex min-h-12 items-center rounded-lg px-7 text-xs font-bold uppercase tracking-[0.08em] text-white/90"
        >
          {secondaryCta}
        </Link>
      </div>
    </div>
  );
}
