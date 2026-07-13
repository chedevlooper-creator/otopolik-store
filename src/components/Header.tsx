"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
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

  // Rota değişince menü render sırasında kapanır (effect'te setState yerine).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          ? "border-b border-border bg-background/95 shadow-sm backdrop-blur-md"
          : "border-b border-border bg-background"
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
              className="rounded-full ring-1 ring-border"
              priority
            />
            <span className="hidden font-heading text-2xl font-bold uppercase tracking-wide text-white sm:block">
              OTO<span className="text-brand-red">POLİK</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-colors ${
                  pathname === link.href
                    ? "text-sand after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[2px] after:bg-sand"
                    : "text-muted hover:text-white"
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
              className="spec-value hidden items-center gap-1.5 px-2 py-2 text-sm font-medium text-muted transition-colors hover:text-sand lg:flex"
            >
              <PhoneIcon className="h-4 w-4" aria-hidden="true" />
              <span className="hidden xl:inline">{siteConfig.phoneDisplay}</span>
            </a>
            <button
              type="button"
              onClick={openDrawer}
              aria-label={totalItems > 0 ? `Sepetim, ${totalItems} ürün` : "Sepetim"}
              className="btn-press relative flex h-11 w-11 items-center justify-center text-foreground transition-colors hover:text-sand sm:w-auto sm:gap-2 sm:border sm:border-border sm:bg-surface sm:px-4 sm:text-sm sm:font-bold sm:uppercase sm:tracking-wider sm:text-white sm:hover:border-sand sm:hover:text-white"
            >
              <ShoppingCartIcon className="h-5 w-5 sm:h-4 sm:w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Sepet</span>
              {totalItems > 0 && (
                <span
                  aria-hidden="true"
                  className="spec-value absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center bg-sand px-1 text-[10px] font-semibold text-background sm:static"
                >
                  {totalItems}
                </span>
              )}
            </button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center text-foreground hover:text-sand md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? (
                <XIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <MenuIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen ? (
        <div className="overflow-hidden border-t border-border bg-surface md:hidden">
          <nav id="mobile-navigation" aria-label="Mobil menü" className="mx-auto max-w-7xl px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 border-b border-border/50 px-2 py-4 text-base font-semibold uppercase tracking-wider transition-colors ${
                  pathname === link.href
                    ? "text-sand"
                    : "text-foreground hover:text-sand"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${siteConfig.phoneDisplay.replace(/\s/g, "")}`}
              className="flex items-center gap-3 px-2 py-4 text-base font-medium text-muted"
            >
              <PhoneIcon className="h-5 w-5 text-sand" aria-hidden="true" />
              {siteConfig.phoneDisplay}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
