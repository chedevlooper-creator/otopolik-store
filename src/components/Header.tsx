"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useStoreSettings } from "@/context/settings-context";
import { useCmsChrome } from "@/context/cms-context";
import {
  BadgeCheckIcon,
  MenuIcon,
  XIcon,
  ShoppingBagIcon,
  PhoneIcon,
  SearchIcon,
} from "lucide-react";
import SearchModal from "@/components/SearchModal";
import Logo from "@/components/Logo";

/** Condensed Mac-pro nav — primary conversion path includes full configurator. */
const NAV_LINKS = [
  { href: "/olusturucu", label: "Tasarla" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/galeri", label: "Galeri" },
  { href: "/iletisim", label: "İletişim" },
];

function isNavLinkActive(pathname: string, href: string): boolean {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuDialogRef = useRef<HTMLDivElement>(null);
  const { totalItems, openDrawer } = useCart();
  const settings = useStoreSettings();
  const cms = useCmsChrome();
  const pathname = usePathname();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMenuOpen(false);
      setSearchOpen(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const closeMenuOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    desktopQuery.addEventListener("change", closeMenuOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeMenuOnDesktop);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const menuButton = menuButtonRef.current;
    const previousBodyOverflow = document.body.style.overflow;
    const frame = requestAnimationFrame(() => {
      menuDialogRef.current
        ?.querySelector<HTMLElement>("button, a[href]")
        ?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || !menuDialogRef.current) return;
      const dialog = menuDialogRef.current;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (!first || !last) return;

      if (
        event.shiftKey &&
        (activeElement === first || !dialog.contains(activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (activeElement === last || !dialog.contains(activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      if (previouslyFocused === menuButton) {
        menuButton?.focus();
      }
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`border-b transition-[background,border-color,box-shadow] duration-500 ${
          scrolled
            ? "bg-black/85 backdrop-blur-2xl border-white/[0.08]"
            : "bg-gradient-to-b from-black/60 to-transparent border-transparent"
        }`}
      >
        <div className="border-b border-white/[0.06] bg-white/[0.02]">
          <div className="mx-auto flex h-7 max-w-screen-2xl 2xl:px-8 items-center justify-center gap-2 px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55 sm:justify-between">
            <span className="inline-flex items-center gap-1.5 text-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              <BadgeCheckIcon className="h-3 w-3 text-brand-red" aria-hidden="true" />
              {cms.header?.title ?? "6.000+ araç modeli için özel kalıp"}
            </span>
            <span className="hidden sm:inline text-white/60">
              {cms.header?.body ??
                `${settings.freeShippingThreshold.toLocaleString("tr-TR")}₺ üzeri ücretsiz kargo · ${settings.estimatedDispatch} içinde kargo`}
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-screen-2xl 2xl:px-8 px-4">
          <div className="flex h-16 items-center justify-between gap-3 sm:h-20 lg:h-20">
            <Logo variant="header" ariaLabel="OTO POLİK ana sayfa" />

            <nav
              className="hidden items-center gap-4 lg:flex xl:gap-8"
              aria-label="Ana menü"
            >
              {NAV_LINKS.map((link) => {
                const active = isNavLinkActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative inline-flex min-h-9 items-center text-[13.5px] font-medium tracking-[0.02em] transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-center after:transition-transform after:duration-300 ${
                      active
                        ? "text-white after:scale-x-100 after:bg-brand-red"
                        : "text-white/60 after:scale-x-0 after:bg-white/55 hover:text-white hover:after:scale-x-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Araç veya ürün ara"
                className="hidden h-10 w-10 items-center justify-center rounded-full border border-transparent text-white/65 transition-all hover:border-white/10 hover:bg-white/[0.06] hover:text-white sm:inline-flex"
              >
                <SearchIcon className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
              <a
                href={`tel:${settings.phoneDisplay.replace(/\s/g, "")}`}
                className="spec-value hidden min-h-10 items-center gap-2 rounded-full px-3 py-2 text-xs font-medium text-white/70 transition-colors hover:text-white lg:flex"
              >
                <PhoneIcon className="h-4 w-4" aria-hidden="true" />
                <span className="hidden xl:inline">{settings.phoneDisplay}</span>
              </a>
              <button
                type="button"
                onClick={openDrawer}
                aria-label={totalItems > 0 ? `Sepetim, ${totalItems} ürün` : "Sepetim"}
                className="btn-press btn-light-rich relative flex h-10 items-center justify-center gap-2 rounded-full px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-background sm:px-4"
              >
                <ShoppingBagIcon className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Sepet</span>
                {totalItems > 0 && (
                  <span className="spec-value flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1.5 text-[10px] font-bold text-white shadow-[0_0_12px_rgba(237,27,36,0.5)]">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                ref={menuButtonRef}
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/[0.06] lg:hidden"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation-dialog"
                aria-haspopup="dialog"
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
      </div>

      {menuOpen ? (
        <div
          id="mobile-navigation-dialog"
          ref={menuDialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
          className="absolute inset-x-0 top-full border-t border-white/[0.06] bg-background/96 px-4 py-4 shadow-2xl backdrop-blur-2xl lg:hidden"
        >
          <div className="mac-glass mx-auto max-h-[calc(100vh-8rem)] max-w-screen-2xl 2xl:px-8 overflow-y-auto overscroll-contain rounded-2xl border border-white/[0.08] bg-[#0b0b0b]/95 p-2">
            <div className="flex min-h-12 items-center justify-between border-b border-white/[0.06] px-3">
              <h2
                id="mobile-menu-title"
                className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-white"
              >
                Menü
              </h2>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Mobil menüyü kapat"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white/70 hover:bg-white/[0.06] hover:text-white"
              >
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              className="flex min-h-12 w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/[0.05]"
            >
              <SearchIcon className="h-4 w-4 text-white/80" aria-hidden="true" />
              Araç veya ürün ara
            </button>
            <nav id="mobile-navigation" aria-label="Mobil ana menü">
              {NAV_LINKS.map((link) => {
                const active = isNavLinkActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-12 items-center rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-white/[0.08] text-white"
                        : "text-white/75 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <a
              href={`tel:${settings.phoneDisplay.replace(/\s/g, "")}`}
              className="mt-1 flex min-h-12 items-center gap-3 border-t border-white/8 px-4 py-3 text-sm text-white/60"
            >
              <PhoneIcon className="h-4 w-4 text-white/80" aria-hidden="true" />
              {settings.phoneDisplay}
            </a>
          </div>
        </div>
      ) : null}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
