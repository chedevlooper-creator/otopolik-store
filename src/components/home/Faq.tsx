import { siteConfig } from "@/lib/site-config";
import { PlusIcon } from "lucide-react";

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
  return (
    <section className="border-t border-neutral-800 bg-[#141414]">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:py-14">
        <h2 className="font-heading text-xl font-extrabold text-white sm:text-2xl">
          Sıkça Sorulan Sorular
        </h2>
        <div className="mt-6 divide-y divide-neutral-100">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3.5 text-sm font-semibold text-neutral-200 [&::-webkit-details-marker]:hidden">
                {faq.q}
                <PlusIcon className="h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200 group-open:rotate-45" />
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-neutral-500">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
