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

const NAV_LINKS = [
  { href: "/urunler", label: "Ürünler" },
  { href: "/olusturucu", label: "Tasarla" },
  { href: "/galeri", label: "Galeri" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

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
    if (!menuOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const menuButton = menuButtonRef.current;
    const frame = requestAnimationFrame(() => {
      menuDialogRef.current
        ?.querySelector<HTMLElement>("button, a[href]")
        ?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || !menuDialogRef.current) return;
      const focusable = Array.from(
        menuDialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      if (previouslyFocused === menuButton) {
        menuButton?.focus();
      }
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-400 ${
        scrolled
          ? "border-white/[0.06] bg-background/90 shadow-[0_24px_60px_rgba(0,0,0,.4)] backdrop-blur-2xl saturate-150"
          : "border-white/[0.04] bg-background/70 backdrop-blur-xl"
      }`}
    >
      <div className="border-b border-white/[0.03] bg-white/[0.015]">
        <div className="mx-auto flex h-7 max-w-7xl items-center justify-center gap-2 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55 sm:justify-between">
          <span className="inline-flex items-center gap-1.5 text-sand/80">
            <BadgeCheckIcon className="h-3 w-3" aria-hidden="true" />
            {cms.header?.title ?? "6.000+ araç modeli için özel kalıp"}
          </span>
          <span className="hidden sm:inline">
            {cms.header?.body ??
              `${settings.freeShippingThreshold.toLocaleString("tr-TR")}₺ üzeri ücretsiz kargo · ${settings.estimatedDispatch} içinde kargo`}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-[88px] items-center justify-between gap-3 sm:h-[92px] lg:h-[96px]">
          <Logo variant="header" />

          <nav className="hidden items-center gap-0.5 rounded-full border border-white/[0.06] bg-white/[0.02] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,.015)] md:flex" aria-label="Ana menü">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative inline-flex min-h-10 items-center rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 ${
                    active
                      ? "bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.06)]"
                      : "text-white/50 hover:bg-white/[0.04] hover:text-white/90"
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
              aria-label="Ürün arama"
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-transparent text-white/65 transition-all hover:border-white/10 hover:bg-white/[0.05] hover:text-white sm:inline-flex"
            >
              <SearchIcon className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
            <a
              href={`tel:${settings.phoneDisplay.replace(/\s/g, "")}`}
              className="spec-value hidden min-h-11 items-center gap-2 rounded-full px-3 py-2 text-xs font-medium text-white/62 transition-colors hover:text-sand lg:flex"
            >
              <PhoneIcon className="h-4 w-4" aria-hidden="true" />
              <span className="hidden xl:inline">{settings.phoneDisplay}</span>
            </a>
            <button
              type="button"
              onClick={openDrawer}
              aria-label={totalItems > 0 ? `Sepetim, ${totalItems} ürün` : "Sepetim"}
              className="btn-press btn-light-rich relative flex h-11 items-center justify-center gap-2 rounded-full px-3 text-[11px] font-bold uppercase tracking-[0.1em] text-background sm:px-4"
            >
              <ShoppingBagIcon className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Sepet</span>
              {totalItems > 0 && (
                <span className="spec-value flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/[0.06] md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? <XIcon className="h-5 w-5" aria-hidden="true" /> : <MenuIcon className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen ? (
        <div
          ref={menuDialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobil menü"
          className="absolute inset-x-0 top-full border-t border-white/[0.04] bg-background/96 px-4 py-4 shadow-2xl backdrop-blur-2xl md:hidden"
        >
          <nav id="mobile-navigation" className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/[0.06] bg-surface p-2">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-white hover:bg-white/[0.05]"
            >
              <SearchIcon className="h-4 w-4 text-sand" aria-hidden="true" />
              Ürün ara
            </button>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors ${
                  pathname === link.href ? "bg-white/[0.06] text-sand" : "text-white/75 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${settings.phoneDisplay.replace(/\s/g, "")}`}
              className="mt-1 flex items-center gap-3 border-t border-white/8 px-4 py-3.5 text-sm text-white/60"
            >
              <PhoneIcon className="h-4 w-4 text-sand" aria-hidden="true" />
              {settings.phoneDisplay}
            </a>
          </nav>
        </div>
      ) : null}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
