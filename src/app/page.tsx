import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HowItWorks from "@/components/home/HowItWorks";
import Showcase from "@/components/home/Showcase";
import InstagramGallery from "@/components/home/InstagramGallery";
import Faq, { FAQS } from "@/components/home/Faq";
import { faqPageSchema, renderJsonLd } from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedProducts />
      <HowItWorks />
      <Showcase />
      <InstagramGallery />
      <Faq />
      {renderJsonLd(faqPageSchema(FAQS))}
    </>
  );
}
