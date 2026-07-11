import ScrollReveal from "@/components/ScrollReveal";
import { siteConfig } from "@/lib/site-config";

export const FAQS = [
  {
    q: "EVA paspas her araca uyar mı?",
    a: "Her set, seçtiğiniz marka ve modelin taban kalıbına göre üretilir; bu sayede boşluk bırakmadan tam oturur. Listede aracınızı bulamazsanız WhatsApp'tan yazın, kalıbımız varsa özel üretim yapalım.",
  },
  {
    q: "Nasıl temizlenir?",
    a: "Paspası araçtan çıkarın ve üzerine su tutun — deterjan gerekmez. Petek yapı kiri yüzeyde tuttuğu için tek sıkım suyla saniyeler içinde temizlenir, hemen kurur.",
  },
  {
    q: "Kargo ne kadar sürer?",
    a: `Siparişleriniz ${siteConfig.estimatedDispatch} içinde kargoya verilir. ${siteConfig.freeShippingThreshold.toLocaleString("tr-TR")}₺ üzeri siparişlerde kargo ücretsizdir; altındaki siparişlerde sabit kargo ücreti uygulanır.`,
  },
  {
    q: "Malzeme ve kullanım bilgisi nedir?",
    a: "EVA yüzey suyu emmez ve günlük kullanımda kolay temizlenir. Ürüne özel teknik bilgi veya uyumluluk sorunuz için siparişten önce bizimle iletişime geçebilirsiniz.",
  },
  {
    q: "İade edebilir miyim?",
    a: "İade ve değişim koşulları ürünün üretim durumuna göre değişebilir. Sipariş vermeden önce İade ve Değişim sayfasındaki güncel koşulları inceleyin.",
  },
];

export default function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <ScrollReveal className="text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-red">SSS</span>
        <h2 className="font-heading mt-2 text-3xl font-extrabold text-neutral-900 sm:text-4xl">
          Sıkça Sorulan Sorular
        </h2>
      </ScrollReveal>

      <div className="mt-10 space-y-3">
        {FAQS.map((faq, i) => (
          <ScrollReveal key={faq.q} delay={i * 60}>
            <details className="group rounded-2xl border border-neutral-200 bg-white open:border-brand-red/40 open:shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-heading text-sm font-bold text-neutral-900 sm:text-base [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span className="shrink-0 text-brand-red transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="px-6 pb-5 text-sm leading-relaxed text-neutral-600">{faq.a}</p>
            </details>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
