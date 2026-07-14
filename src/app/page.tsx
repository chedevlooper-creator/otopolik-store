import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HowItWorks from "@/components/home/HowItWorks";
import Showcase from "@/components/home/Showcase";
import Faq, { FAQS } from "@/components/home/Faq";
import TrustStrip from "@/components/TrustStrip";
import { faqPageSchema, renderJsonLd } from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <FeaturedProducts />
      <HowItWorks />
      <Showcase />
      <Faq />
      {renderJsonLd(faqPageSchema(FAQS))}
    </>
  );
}
