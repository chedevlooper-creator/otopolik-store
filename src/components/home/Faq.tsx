import { PlusIcon, MessageCircleIcon, ArrowRightIcon, CheckIcon } from "lucide-react";
import type { ContentSection } from "@/lib/cms-defaults";

type FaqPair = { q: string; a: string };

type Props = {
  header?: ContentSection | null;
  sidebar?: ContentSection | null;
  items: FaqPair[];
  whatsappHref: string;
};

export default function Faq({ header, sidebar, items, whatsappHref }: Props) {
  const bullets = (sidebar?.subtitle ?? "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section className="home-section faq-section relative overflow-hidden border-t border-white/[0.04] bg-[#07080c]">
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div>
          <span className="section-kicker">{header?.eyebrow ?? "Sık sorulanlar"}</span>
          <h2 className="section-title mt-5 max-w-xl">
            {header?.title ?? "Karar vermeden önce bilmeniz gerekenler"}
          </h2>
          <div className="faq-list mt-10">
            {items.map((faq) => (
              <details key={faq.q} name="home-faq" className="faq-item group">
                <summary className="faq-item__summary">
                  <span className="faq-item__q">{faq.q}</span>
                  <span className="faq-item__icon" aria-hidden="true">
                    <PlusIcon className="h-4 w-4" />
                  </span>
                </summary>
                <div className="faq-item__body">
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        <aside className="lg:pt-4">
          <div className="faq-aside">
            <div className="faq-aside__glow" aria-hidden="true" />
            <div className="faq-aside__icon">
              <MessageCircleIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="faq-aside__title">
              {sidebar?.title ?? "Aracınız listede yok mu?"}
            </h3>
            <p className="faq-aside__body">
              {sidebar?.body ??
                "Marka, model, yıl ve kasa bilginizi gönderin. Doğru kalıbı birlikte teyit edip size uygun seti belirleyelim."}
            </p>
            <ul className="faq-aside__list">
              {(bullets.length
                ? bullets
                : [
                    "Ücretsiz uyumluluk kontrolü",
                    "Sipariş öncesi kalıp teyidi",
                    "Renk ve set önerisi",
                  ]
              ).map((item) => (
                <li key={item}>
                  <span className="faq-aside__check" aria-hidden="true">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press faq-aside__cta"
            >
              {sidebar?.ctaLabel ?? "WhatsApp'tan sor"}
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
