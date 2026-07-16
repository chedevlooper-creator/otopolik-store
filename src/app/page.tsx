import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Faq from "@/components/home/Faq";
import HomeConfiguratorShowcase from "@/components/home/HomeConfiguratorShowcase";
import TrustStrip from "@/components/TrustStrip";
import {
  getContentPage,
  getFaqs,
  getStoreSettingsCompat,
  interpolateCmsText,
} from "@/lib/cms-home";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { faqPageSchema, renderJsonLd } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const settings = await getStoreSettingsCompat();
  const [{ sections }, { items: faqs }] = await Promise.all([
    getContentPage("home"),
    getFaqs(),
  ]);

  const tokens = {
    freeShippingThreshold: settings.freeShippingThreshold,
    estimatedDispatch: settings.estimatedDispatch,
  };

  const section = (key: string) =>
    sections.find((s) => s.sectionKey === key) ?? null;

  const faqItems = faqs.map((f) => ({
    q: f.question,
    a: interpolateCmsText(f.answer, tokens),
  }));

  return (
    <>
      <Hero
        content={{
          hero: section("hero"),
          secondaryCta: section("hero-secondary-cta"),
        }}
      />
      <HomeConfiguratorShowcase />
      <TrustStrip />
      <FeaturedProducts content={section("featured")} />
      <Faq
        header={section("faq")}
        sidebar={section("faq-sidebar")}
        items={faqItems}
        whatsappHref={buildWhatsAppLink(
          settings.whatsappNumber,
          "Merhaba, aracıma özel EVA paspas siparişi hakkında bilgi almak istiyorum."
        )}
      />
      {renderJsonLd(faqPageSchema(faqItems))}
    </>
  );
}
