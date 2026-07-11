import Link from "next/link";
import { buildWhatsAppOrderLink } from "@/lib/site-config";
import { MessageCircleIcon, ArrowRightIcon } from "lucide-react";

export default function CtaBanner() {
  const whatsappHref = buildWhatsAppOrderLink(
    "Merhaba, aracıma özel EVA paspas siparişi vermek istiyorum."
  );

  return (
    <section className="border-t border-neutral-800 bg-[#141414]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-14">
        <div className="flex flex-col gap-5 rounded-2xl bg-neutral-900 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="font-heading text-lg font-extrabold text-white sm:text-xl">
              Aracınıza özel sipariş için hazırız
            </h2>
            <p className="mt-1 text-sm text-white/60">
              Marka ve modelinizi belirtin, size en uygun seti önerelim.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 rounded-xl bg-[#141414] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-600"
            >
              Ürünleri İncele
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#22c35e]"
            >
              <MessageCircleIcon className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
