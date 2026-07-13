import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import HowItWorks from "@/components/home/HowItWorks";
import InstagramGallery from "@/components/home/InstagramGallery";
import Faq, { FAQS } from "@/components/home/Faq";
import { faqPageSchema, renderJsonLd } from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <HowItWorks />
      <InstagramGallery />
      <Faq />
      {renderJsonLd(faqPageSchema(FAQS))}
    </>
  );
}
