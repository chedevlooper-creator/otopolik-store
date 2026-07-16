"use client";

import { usePathname } from "next/navigation";
import CartDrawer from "@/components/CartDrawer";
import CookieConsent from "@/components/CookieConsent";
import ConsentAnalytics from "@/components/ConsentAnalytics";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollStateRoot from "@/components/ScrollStateRoot";
import ScrollToTop from "@/components/ScrollToTop";
import WhatsappFloat from "@/components/WhatsappFloat";
import { CartProvider } from "@/context/cart-context";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return children;
  }

  return (
    <CartProvider>
      <div className="scroll-sentinel-top" aria-hidden="true" />
      <ScrollStateRoot />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <div className="scroll-sentinel-bottom" aria-hidden="true" />
      <CartDrawer />
      <WhatsappFloat />
      <ScrollToTop />
      <CookieConsent />
      <ConsentAnalytics />
    </CartProvider>
  );
}
