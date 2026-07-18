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
  const primaryCta = body?.ctaLabel ?? "Yeni Bir Paspas Tasarla";
  const primaryHref = body?.ctaHref ?? "/olusturucu";
  const secondaryCta = body?.subtitle ?? "Ana Sayfa";

  const fulfillmentSteps = [
    { label: "Talep Alındı", state: "done" as const },
    { label: "WhatsApp Onayı", state: "current" as const },
    { label: "Üretim", state: "pending" as const },
    { label: "Kargo", state: "pending" as const },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 pt-32 pb-20 text-center sm:pt-40 sm:pb-28">
      <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full text-[var(--red-hot)]"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="44"
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
            className="confirm-ring"
          />
        </svg>
        <span
          className="animate-check-spread flex h-16 w-16 items-center justify-center rounded-[1.5rem] border-2 border-[var(--red-hot)]/60 bg-surface shadow-[0_24px_60px_rgba(237,27,36,.18)]"
          style={{ animationDelay: "0.7s" }}
        >
          <CheckIcon className="h-8 w-8 text-[var(--red-hot)]" aria-hidden="true" />
        </span>
      </div>
      <h1 className="mt-8 font-heading text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 leading-relaxed text-muted">{description}</p>

      <ol
        aria-label="Sipariş süreci"
        className="mt-12 flex items-start justify-center"
      >
        {fulfillmentSteps.map((step, i) => (
          <li
            key={step.label}
            className="flex flex-1 items-center first:flex-none last:flex-none sm:flex-1"
          >
            <div className="flex flex-col items-center gap-2.5">
              {step.state === "done" && (
                <span
                  className="h-2.5 w-2.5 rounded-full bg-[var(--red-hot)] shadow-[0_0_10px_rgba(237,27,36,0.6)]"
                  aria-hidden="true"
                />
              )}
              {step.state === "current" && (
                <span
                  className="wa-ring relative h-2.5 w-2.5 rounded-full bg-[#25D366]"
                  aria-hidden="true"
                />
              )}
              {step.state === "pending" && (
                <span
                  className="h-2.5 w-2.5 rounded-full border border-white/25"
                  aria-hidden="true"
                />
              )}
              <span className="spec-value whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
                {step.label}
              </span>
            </div>
            {i < fulfillmentSteps.length - 1 && (
              <div
                aria-hidden="true"
                className={
                  i === 0
                    ? "mx-2 mb-5 h-px w-8 flex-1 bg-[var(--red-hot)]/70 sm:w-auto"
                    : "cut-line mx-2 mb-5 w-8 flex-1 sm:w-auto"
                }
              />
            )}
          </li>
        ))}
      </ol>

      <p className="mt-10 text-sm text-muted">Herhangi bir sorunuz olursa</p>
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
          className="btn-press btn-red-rich inline-flex min-h-12 items-center rounded-full px-7 text-xs font-bold uppercase tracking-[0.08em]"
        >
          {primaryCta}
        </Link>
        <Link
          href="/"
          className="btn-press btn-ghost-rich inline-flex min-h-12 items-center rounded-full px-7 text-xs font-bold uppercase tracking-[0.08em] text-white/90"
        >
          {secondaryCta}
        </Link>
      </div>
    </div>
  );
}
