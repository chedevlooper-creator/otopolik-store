"use client";

import type { MouseEvent } from "react";
import { usePathname } from "next/navigation";
import CartDrawer from "@/components/CartDrawer";
import CookieConsent from "@/components/CookieConsent";
import ConsentAnalytics from "@/components/ConsentAnalytics";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import SmoothScroll from "@/components/SmoothScroll";
import WhatsappFloat from "@/components/WhatsappFloat";
import { CartProvider } from "@/context/cart-context";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  const focusMainContent = (event: MouseEvent<HTMLAnchorElement>) => {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    event.preventDefault();
    mainContent.focus();
    mainContent.scrollIntoView({ block: "start" });
  };

  if (isAdminRoute) {
    return children;
  }

  return (
    <CartProvider>
      <SmoothScroll />
      <div className="premium-site flex min-h-screen flex-col">
        <a
          href="#main-content"
          onClick={focusMainContent}
          className="fixed left-4 top-4 z-[200] inline-flex min-h-11 -translate-y-24 items-center rounded-lg bg-sand px-4 py-2 text-sm font-bold text-background opacity-0 shadow-2xl transition focus:translate-y-0 focus:opacity-100"
        >
          Ana içeriğe geç
        </a>
        <Header />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 scroll-mt-32"
        >
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <WhatsappFloat />
        <ScrollToTop />
        <CookieConsent />
        <ConsentAnalytics />
      </div>
    </CartProvider>
  );
}
