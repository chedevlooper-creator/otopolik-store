"use client";

import { usePathname } from "next/navigation";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
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
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsappFloat />
    </CartProvider>
  );
}
