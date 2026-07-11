import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function ThankYouPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-5xl">✅</p>
      <h1 className="font-heading mt-4 text-3xl font-extrabold text-white">
        Siparişiniz Alındı
      </h1>
      <p className="mt-3 text-neutral-400">
        WhatsApp sohbet penceresinde sipariş detaylarınızı gönderin, ekibimiz
        en kısa sürede sizinle iletişime geçerek siparişinizi onaylayacaktır.
        Herhangi bir sorunuz olursa {siteConfig.phoneDisplay} numaralı
        hattımızdan bize ulaşabilirsiniz.
      </p>
      <Link
        href="/urunler"
        className="mt-8 inline-flex rounded-full bg-brand-red px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-red-dark"
      >
        Alışverişe Devam Et
      </Link>
    </div>
  );
}
