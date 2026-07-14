import { siteConfig, buildWhatsAppOrderLink } from "@/lib/site-config";
import { PlusIcon, MessageCircleIcon, ArrowRightIcon, CheckIcon } from "lucide-react";

export const FAQS = [
  {
    q: "EVA paspas her araca uyar mı?",
    a: "Her set, seçtiğiniz marka ve modelin taban kalıbına göre üretilir; boşluk bırakmadan tam oturur. Listede aracınızı bulamazsanız WhatsApp'tan yazın.",
  },
  {
    q: "Nasıl temizlenir?",
    a: "Paspası araçtan çıkarın ve üzerine su tutun. Hücreli yapıdaki kirler kolayca akıp gider; günlük temizlik için özel bir ürüne ihtiyaç duymazsınız.",
  },
  {
    q: "Kargo ne kadar sürer?",
    a: `${siteConfig.estimatedDispatch} içinde kargoya verilir. ${siteConfig.freeShippingThreshold.toLocaleString("tr-TR")}₺ üzeri siparişlerde kargo ücretsizdir.`,
  },
  {
    q: "Siparişten önce uyumluluk kontrol ediliyor mu?",
    a: "Evet. Marka, model, yıl ve kasa bilgilerinizi sipariş öncesinde teyit ederek doğru kalıbın üretime alınmasını sağlıyoruz.",
  },
];

export default function Faq() {
  const whatsappHref = buildWhatsAppOrderLink("Merhaba, aracıma özel EVA paspas siparişi hakkında bilgi almak istiyorum.");

  return (
    <section className="home-section relative overflow-hidden border-t border-white/8">
      <div className="pointer-events-none absolute bottom-[-14rem] right-[-8rem] h-[30rem] w-[30rem] rounded-full bg-brand-red/[0.045] blur-[130px]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
        <div>
          <span className="section-kicker">Sık sorulanlar</span>
          <h2 className="section-title mt-5">Karar vermeden önce bilmeniz gerekenler</h2>
          <div className="mt-9 space-y-3">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group overflow-hidden rounded-2xl border border-white/9 bg-white/[0.025] open:border-white/15 open:bg-white/[0.045]">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-white transition-colors hover:text-sand sm:px-6 [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.035]">
                    <PlusIcon className="h-4 w-4 text-sand transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
                  </span>
                </summary>
                <p className="border-t border-white/7 px-5 py-5 text-sm leading-7 text-white/66 sm:px-6">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="lg:pt-8">
          <div className="premium-card premium-grid sticky top-32 overflow-hidden rounded-[1.5rem] p-6 sm:p-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#25D366]/28 bg-[#25D366]/12 text-[#68e99a]">
              <MessageCircleIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="mt-7 font-heading text-4xl font-bold text-white">Aracınız listede yok mu?</h3>
            <p className="mt-4 text-sm leading-7 text-white/66">
              Marka, model, yıl ve kasa bilginizi gönderin. Doğru kalıbı birlikte teyit edip size uygun seti belirleyelim.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/68">
              {["Ücretsiz uyumluluk kontrolü", "Sipariş öncesi kalıp teyidi", "Renk ve set önerisi"].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sand/10 text-sand">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-press inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#25D366]/35 bg-[#25D366]/10 px-5 text-sm font-bold text-[#7bf0a7] hover:border-[#25D366]/55 hover:bg-[#25D366]/16">
                WhatsApp&apos;tan sor
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
