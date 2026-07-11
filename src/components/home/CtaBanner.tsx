import Link from "next/link";
import { buildWhatsAppOrderLink } from "@/lib/site-config";

export default function CtaBanner() {
  const whatsappHref = buildWhatsAppOrderLink(
    "Merhaba, aracıma özel EVA paspas siparişi vermek istiyorum."
  );

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-brand-red via-brand-red to-brand-red-dark">
      <div className="bg-dots-dark absolute inset-0" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-black/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center text-white sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h2 className="font-heading text-2xl font-extrabold sm:text-3xl">
            Aracınıza özel paspas için hazırız
          </h2>
          <p className="mt-2 max-w-md text-red-100">
            Marka ve modelinizi belirtin, size en uygun seti önerelim.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/urunler"
            className="btn-press rounded-full bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-red shadow-lg shadow-black/20 hover:bg-neutral-100"
          >
            Ürünleri İncele
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-press rounded-full border border-white/50 bg-white/10 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white backdrop-blur hover:bg-white/20"
          >
            WhatsApp&apos;tan Yaz
          </a>
        </div>
      </div>
    </section>
  );
}
