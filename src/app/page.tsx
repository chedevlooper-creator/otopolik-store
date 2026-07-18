import Hero from "@/components/home/Hero";
import ShowroomBento from "@/components/home/ShowroomBento";
import ShowroomColorPicker from "@/components/home/ShowroomColorPicker";
import ShowroomConfiguratorBanner from "@/components/home/ShowroomConfiguratorBanner";
import ShowroomProcess from "@/components/home/ShowroomProcess";
import ShowroomTestimonials from "@/components/home/ShowroomTestimonials";
import ShowroomFaq from "@/components/home/ShowroomFaq";
import ShowroomFinalCTA from "@/components/home/ShowroomFinalCTA";
import ShowroomTrustStrip from "@/components/home/ShowroomTrustStrip";
import ShowroomRevealInitializer from "@/components/home/ShowroomRevealInitializer";

import {
  getContentPage,
  getFaqs,
  getStoreSettingsCompat,
  interpolateCmsText,
} from "@/lib/cms-home";
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
    <div className="showroom-page">
      <Hero
        content={{
          hero: section("hero"),
          secondaryCta: section("hero-secondary-cta"),
        }}
      />
      <ShowroomBento />
      <ShowroomColorPicker />
      <ShowroomConfiguratorBanner />
      <ShowroomProcess />
      <ShowroomTestimonials />
      <ShowroomFaq items={faqItems} />
      <ShowroomFinalCTA />
      <ShowroomTrustStrip />
      <ShowroomRevealInitializer />
      {renderJsonLd(faqPageSchema(faqItems))}
    </div>
  );
}


