"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { siteConfig } from "@/lib/site-config";
import { MenuIcon, XIcon, ShoppingCartIcon, PhoneIcon } from "lucide-react";

const NAV_LINKS = [
  { href: "/urunler", label: "Ürünler" },
  { href: "/olusturucu", label: "Tasarla" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, openDrawer } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-neutral-700 bg-[#0c0c0c]/95 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-[#141414]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/media/logo.jpg"
              alt={siteConfig.name}
              width={38}
              height={38}
              quality={95}
              className="rounded-full ring-1 ring-neutral-200/80"
              priority
            />
            <span className="font-heading text-lg font-extrabold tracking-tight text-white">
              OTO<span className="text-brand-red">POLİK</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-brand-red"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${siteConfig.phoneDisplay.replace(/\s/g, "")}`}
              className="hidden items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-neutral-400 transition-colors hover:text-brand-red lg:flex"
            >
              <PhoneIcon className="h-4 w-4" aria-hidden="true" />
              <span className="hidden xl:inline">{siteConfig.phoneDisplay}</span>
            </a>
            <button
              type="button"
              onClick={openDrawer}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-300 transition-colors hover:bg-neutral-700 sm:w-auto sm:gap-2 sm:rounded-full sm:bg-neutral-900 sm:px-4 sm:text-sm sm:font-semibold sm:text-white sm:hover:bg-brand-red"
            >
              <ShoppingCartIcon className="h-5 w-5 sm:h-4 sm:w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Sepet</span>
              {totalItems > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white ring-2 ring-[#141414] sm:static sm:ring-0">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-300 hover:bg-neutral-700 md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Menü"
            >
              {menuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="border-t border-neutral-800 bg-[#141414]">
          <div className="mx-auto max-w-7xl px-4 py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-brand-red"
                    : "text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${siteConfig.phoneDisplay.replace(/\s/g, "")}`}
              className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-neutral-500"
            >
              <PhoneIcon className="h-4 w-4" aria-hidden="true" />
              {siteConfig.phoneDisplay}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
