import Link from "next/link";
import { siteConfig, buildWhatsAppOrderLink } from "@/lib/site-config";
import { PlusIcon, MessageCircleIcon, ArrowRightIcon } from "lucide-react";

export const FAQS = [
  {
    q: "EVA paspas her araca uyar mı?",
    a: "Her set, seçtiğiniz marka ve modelin taban kalıbına göre üretilir; boşluk bırakmadan tam oturur. Listede aracınızı bulamazsanız WhatsApp'tan yazın.",
  },
  {
    q: "Nasıl temizlenir?",
    a: "Paspası araçtan çıkarın, üzerine su tutun — deterjan gerekmez. Tek sıkım suyla saniyeler içinde temizlenir.",
  },
  {
    q: "Kargo ne kadar sürer?",
    a: `${siteConfig.estimatedDispatch} içinde kargoya verilir. ${siteConfig.freeShippingThreshold.toLocaleString("tr-TR")}₺ üzeri siparişlerde kargo ücretsizdir.`,
  },
];

export default function Faq() {
  const whatsappHref = buildWhatsAppOrderLink(
    "Merhaba, aracıma özel EVA paspas siparişi vermek istiyorum."
  );

  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-px w-7 bg-sand" aria-hidden="true" />
            <span className="spec-value text-[10px] font-bold uppercase tracking-[0.18em] text-sand">
              SSS
            </span>
          </div>
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            Sipariş öncesi merak edilenler
          </h2>
          <div className="mt-6">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group border-b border-dashed border-border">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-sm font-semibold text-foreground transition-colors hover:text-sand [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <PlusIcon className="h-4 w-4 shrink-0 text-sand transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
                </summary>
                <p className="pb-5 text-sm leading-relaxed text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center lg:pl-8">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-px w-7 bg-brand-red" aria-hidden="true" />
            <span className="spec-value text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red">
              Uyumluluk
            </span>
          </div>
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            Aracınıza uygun seti birlikte belirleyelim
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Marka, model, yıl ve kasa bilginizi paylaşın; siparişe geçmeden
            önce ürün uyumluluğunu teyit edelim.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press inline-flex items-center gap-2 bg-[#25D366] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-[#22c35e]"
            >
              <MessageCircleIcon className="h-4 w-4" aria-hidden="true" />
              WhatsApp&apos;tan Sor
            </a>
            <Link
              href="/urunler"
              className="btn-press inline-flex items-center gap-2 border border-border px-6 py-3 text-sm font-bold uppercase tracking-wider text-foreground hover:border-sand hover:text-sand"
            >
              Ürünleri İncele
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
