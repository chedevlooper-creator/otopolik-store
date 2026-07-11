import Hero from "@/components/home/Hero";
import VehicleFinder from "@/components/home/VehicleFinder";
import FeatureStrip from "@/components/home/FeatureStrip";
import Marquee from "@/components/home/Marquee";
import HowItWorks from "@/components/home/HowItWorks";
import Stats from "@/components/home/Stats";
import DesignerCta from "@/components/home/DesignerCta";
import Showcase from "@/components/home/Showcase";
import InstagramGallery from "@/components/home/InstagramGallery";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Testimonials from "@/components/home/Testimonials";
import Faq, { FAQS } from "@/components/home/Faq";
import CtaBanner from "@/components/home/CtaBanner";
import { faqPageSchema, renderJsonLd } from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      <Hero />
      <VehicleFinder />
      <FeatureStrip />
      <Marquee />
      <HowItWorks />
      <Stats />
      <DesignerCta />
      <Showcase />
      <InstagramGallery />
      <FeaturedProducts />
      <Testimonials />
      <Faq />
      <CtaBanner />
      {renderJsonLd(faqPageSchema(FAQS))}
    </>
  );
}
