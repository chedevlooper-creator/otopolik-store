import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import Showcase from "@/components/home/Showcase";
import DesignerCta from "@/components/home/DesignerCta";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import InstagramGallery from "@/components/home/InstagramGallery";
import Faq, { FAQS } from "@/components/home/Faq";
import { faqPageSchema, renderJsonLd } from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedProducts />
      <Showcase />
      <DesignerCta />
      <HowItWorks />
      <InstagramGallery />
      <Faq />
      {renderJsonLd(faqPageSchema(FAQS))}
    </>
  );
}
