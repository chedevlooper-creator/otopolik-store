"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useStoreSettings } from "@/context/settings-context";
import {
  MenuIcon,
  XIcon,
  ShoppingBagIcon,
  PhoneIcon,
  SearchIcon,
} from "lucide-react";
import SearchModal from "@/components/SearchModal";
import Logo from "@/components/Logo";

const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/#ozellikler", label: "Özellikler" },
  { href: "/#sss", label: "SSS" },
  { href: "/galeri", label: "Galeri" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuDialogRef = useRef<HTMLDialogElement>(null);
  const { totalItems, openDrawer } = useCart();
  const settings = useStoreSettings();
  const pathname = usePathname();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMenuOpen(false);
      setSearchOpen(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const dialog = menuDialogRef.current;
    if (!dialog) return;

    if (menuOpen) {
      if (!dialog.open) dialog.showModal();
      requestAnimationFrame(() => {
        dialog.querySelector<HTMLElement>("a[href], button")?.focus();
      });
    } else if (dialog.open) {
      dialog.close();
    }
  }, [menuOpen]);

  useEffect(() => {
    const dialog = menuDialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  return (
    <header
      className={`site-header sticky top-0 z-50 ${scrolled ? "is-scrolled" : ""}`}
    >
      <div className="site-header__bar mx-auto flex max-w-7xl items-center justify-between gap-4 px-4">
        <Logo variant="header" className="site-header__logo" />

        <nav className="site-header__nav hidden lg:flex" aria-label="Ana menü">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active && !link.href.includes("#") ? "page" : undefined}
                className={`site-header__link ${active ? "is-active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Ürün arama"
            className="site-header__icon-btn hidden sm:inline-flex"
          >
            <SearchIcon className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
          <a
            href={`tel:${settings.phoneDisplay.replace(/\s/g, "")}`}
            aria-label={`Ara: ${settings.phoneDisplay}`}
            className="site-header__icon-btn hidden md:inline-flex"
          >
            <PhoneIcon className="h-[17px] w-[17px]" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={openDrawer}
            aria-label={totalItems > 0 ? `Sepetim, ${totalItems} ürün` : "Sepetim"}
            className="site-header__icon-btn relative inline-flex"
          >
            <ShoppingBagIcon className="h-[18px] w-[18px]" aria-hidden="true" />
            {totalItems > 0 ? (
              <span className="site-header__cart-badge absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center px-0.5 font-mono text-[9px] font-bold text-white">
                {totalItems}
              </span>
            ) : null}
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            className="site-header__icon-btn inline-flex lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Menüyü aç"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <MenuIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <dialog
        ref={menuDialogRef}
        id="mobile-navigation"
        aria-label="Mobil menü"
        className="site-header__menu m-0 ml-auto h-full max-h-none w-[min(100%,20rem)] border-0 bg-transparent p-0"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className="site-header__menu-panel flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
            <span className="font-heading text-lg font-bold text-white">Menü</span>
            <button
              type="button"
              onClick={() => menuDialogRef.current?.close()}
              aria-label="Menüyü kapat"
              className="site-header__icon-btn inline-flex"
            >
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-0.5 p-3">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              className="site-header__menu-link flex items-center gap-3 px-3 py-3.5 text-left text-sm font-medium"
            >
              <SearchIcon className="h-4 w-4 text-sand" aria-hidden="true" />
              Ürün ara
            </button>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`site-header__menu-link px-3 py-3.5 text-sm font-medium ${
                  isActive(pathname, link.href) ? "is-active" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href={`tel:${settings.phoneDisplay.replace(/\s/g, "")}`}
            className="flex items-center gap-3 border-t border-white/10 px-5 py-4 text-sm text-white/65"
          >
            <PhoneIcon className="h-4 w-4 text-sand" aria-hidden="true" />
            {settings.phoneDisplay}
          </a>
        </div>
      </dialog>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
