"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { siteConfig } from "@/lib/site-config";

const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/olusturucu", label: "Paspas Tasarla", highlight: true },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, openDrawer } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "border-neutral-200 shadow-lg shadow-black/5" : "border-transparent"
      }`}
    >
      <div className="bg-brand-black text-white text-xs sm:text-sm">
        <div className="mx-auto max-w-7xl px-4 py-1.5 flex items-center justify-between gap-4">
          <span className="truncate">
            {siteConfig.freeShippingThreshold.toLocaleString("tr-TR")}₺ üzeri siparişlerde{" "}
            <strong className="text-brand-red">ücretsiz kargo</strong>
          </span>
          <a
            href={`tel:${siteConfig.phoneDisplay.replace(/\s/g, "")}`}
            className="hidden whitespace-nowrap transition-colors hover:text-brand-red sm:inline"
          >
            📞 {siteConfig.phoneDisplay}
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between py-3 gap-4">
          <Link href="/" className="group flex items-center gap-3 shrink-0">
            <Image
              src="/media/logo.jpg"
              alt={siteConfig.name}
              width={60}
              height={60}
              quality={95}
              className="rounded-full shadow-md shadow-black/20 ring-2 ring-neutral-200 transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <span className="font-heading font-extrabold text-xl leading-none tracking-tight sm:text-2xl">
              OTO <span className="text-brand-red">POLİK</span>
              <span className="mt-0.5 block text-[10px] font-sans font-normal tracking-[0.25em] text-neutral-500 sm:text-[11px]">
                OTO PASPASLARI
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                  pathname === link.href
                    ? "bg-red-50 text-brand-red"
                    : link.highlight
                      ? "font-bold text-brand-red hover:bg-red-50"
                      : "text-neutral-700 hover:bg-neutral-50 hover:text-brand-red"
                }`}
              >
                {link.highlight && <span className="mr-1" aria-hidden>🎨</span>}
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openDrawer}
              className="btn-press relative flex items-center gap-2 rounded-full bg-brand-black text-white px-5 py-2.5 text-sm font-semibold shadow-md shadow-black/10 hover:bg-brand-red hover:shadow-lg hover:shadow-brand-red/30"
            >
              <span aria-hidden>🛒</span>
              <span className="hidden sm:inline">Sepetim</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1 text-[11px] font-bold text-white ring-2 ring-white">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:bg-neutral-100"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Menüyü aç/kapat"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-neutral-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-3 py-2.5 font-medium ${
                  pathname === link.href
                    ? "bg-red-50 text-brand-red"
                    : "text-neutral-800 hover:bg-neutral-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
