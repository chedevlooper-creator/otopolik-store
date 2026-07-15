import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HowItWorks from "@/components/home/HowItWorks";
import Showcase from "@/components/home/Showcase";
import Faq from "@/components/home/Faq";
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
      <Marquee />
      <TrustStrip />
      <FeaturedProducts content={section("featured")} />
      <HowItWorks
        header={section("steps")}
        steps={[
          section("step-01"),
          section("step-02"),
          section("step-03"),
        ]}
      />
      <Showcase
        header={section("showcase")}
        gallery={[
          section("showcase-gallery-01"),
          section("showcase-gallery-02"),
          section("showcase-gallery-03"),
          section("showcase-gallery-04"),
        ]}
        features={[
          section("showcase-feature-01"),
          section("showcase-feature-02"),
          section("showcase-feature-03"),
          section("showcase-feature-04"),
        ]}
      />
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
