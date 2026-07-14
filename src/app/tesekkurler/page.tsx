import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { CheckIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Sipariş Özeti Hazır",
  description: "OTO POLİK sipariş talebinizi WhatsApp üzerinden tamamlayın.",
};

export default function ThankYouPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:py-28">
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] border-2 border-sand bg-surface shadow-[0_24px_60px_rgba(225,201,162,.14)]">
        <CheckIcon className="h-10 w-10 text-sand" aria-hidden="true" />
      </span>
      <h1 className="mt-8 font-heading text-4xl font-bold uppercase text-white sm:text-5xl">
        Sipariş Özetiniz Hazır
      </h1>
      <p className="mt-5 leading-relaxed text-muted">
        WhatsApp sohbet penceresinde hazırlanan sipariş detaylarını göndererek
        talebinizi tamamlayın. Mesaj gönderilmeden sipariş kesinleşmez. Ekibimiz
        mesajınızın ardından uyumluluğu teyit edip sizinle iletişime geçecektir.
        Herhangi bir sorunuz olursa
      </p>
      <a
        href={`tel:${siteConfig.phoneDisplay.replace(/\s/g, "")}`}
        className="spec-value mt-1 inline-block text-lg font-semibold text-sand transition-colors hover:text-white"
      >
        {siteConfig.phoneDisplay}
      </a>
      <p className="mt-1 text-sm text-muted">numaralı hattımızdan bize ulaşabilirsiniz.</p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link
          href="/urunler"
          className="btn-press inline-flex rounded-full bg-brand-red px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-brand-red/20 hover:bg-brand-red-dark"
        >
          Alışverişe Devam Et
        </Link>
        <Link
          href="/"
          className="btn-press inline-flex rounded-full border border-border px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-foreground hover:border-sand hover:text-sand"
        >
          Ana Sayfa
        </Link>
      </div>
    </div>
  );
}
