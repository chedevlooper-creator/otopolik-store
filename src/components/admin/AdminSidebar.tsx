"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboardIcon,
  ShoppingBagIcon,
  PackageIcon,
  SettingsIcon,
  MenuIcon,
  XIcon,
  ExternalLinkIcon,
  LogOutIcon,
} from "lucide-react";
import { logoutAction } from "@/app/admin/logout/action";
import Logo from "@/components/Logo";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon, badgeKey: null },
  { href: "/admin/siparisler", label: "Siparişler", icon: ShoppingBagIcon, badgeKey: "orders" },
  { href: "/admin/urunler", label: "Ürünler", icon: PackageIcon, badgeKey: "products" },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: SettingsIcon, badgeKey: null },
] as const;

// #region debug-point A:reporter
const DEBUG_SERVER_URL = "http://127.0.0.1:7777/event";
const DEBUG_SESSION_ID = "admin-sidebar-bug";
const DEBUG_RUN_ID = "post-fix";

function reportDebug(
  hypothesisId: string,
  location: string,
  msg: string,
  data: Record<string, unknown> = {},
) {
  fetch(DEBUG_SERVER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: DEBUG_SESSION_ID,
      runId: DEBUG_RUN_ID,
      hypothesisId,
      location,
      msg: `[DEBUG] ${msg}`,
      data,
      ts: Date.now(),
    }),
  }).catch(() => {});
}
// #endregion

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // #region debug-point A:pathname-collapsed
    reportDebug("A", "AdminSidebar.tsx:state-effect", "pathname/collapsed state observed", {
      pathname,
      mobileOpen,
      width: typeof window === "undefined" ? null : window.innerWidth,
    });
    // #endregion
  }, [mobileOpen, pathname]);

  // Login ekranında sidebar gizlenir; kullanıcı sadece formu görür.
  if (pathname === "/admin/login") {
    // #region debug-point A:login-hidden
    reportDebug("A", "AdminSidebar.tsx:login-guard", "sidebar hidden on login route", {
      pathname,
    });
    // #endregion
    return null;
  }

  return (
    <>
      {/* Mobil tetikleyici */}
      <button
        type="button"
        onClick={() => {
          // #region debug-point B:mobile-toggle
          reportDebug("B", "AdminSidebar.tsx:mobile-toggle", "mobile toggle requested", {
            mobileOpenBefore: mobileOpen,
            pathname,
            width: typeof window === "undefined" ? null : window.innerWidth,
          });
          // #endregion
          setMobileOpen((open) => !open);
        }}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center bg-brand-black text-white shadow-lg lg:hidden"
        aria-label="Menü"
      >
        {mobileOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-brand-black text-white transition-all duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 lg:translate-x-0 lg:w-60`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <Logo href="/admin" size="sm" />
          <span className="ml-auto bg-brand-red px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Admin
          </span>
        </div>

        {/* Navigasyon */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  // #region debug-point A:nav-click
                  reportDebug("A", "AdminSidebar.tsx:nav-link", "navigation item clicked", {
                    pathname,
                    targetHref: item.href,
                    active,
                    mobileOpenBefore: mobileOpen,
                  });
                  // #endregion
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-red text-white shadow-lg shadow-brand-red/20"
                    : "text-muted hover:bg-surface/5 hover:text-white"
                }`}
                role="menuitem"
              >
                <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="flex-1">{item.label}</span>
                {item.badgeKey && active && (
                  <span className="flex h-5 min-w-5 items-center justify-center bg-black/30 px-1.5 text-[10px] font-bold text-white">
                    ●
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Alt kısım */}
        <div className="border-t border-white/10 px-3 py-4">
          <Link
            href="/"
            onClick={() => {
              // #region debug-point D:site-link
              reportDebug("D", "AdminSidebar.tsx:site-link", "site return clicked", {
                pathname,
                mobileOpenBefore: mobileOpen,
              });
              // #endregion
              setMobileOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface/5 hover:text-white"
          >
            <ExternalLinkIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            Siteye Dön
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              onClick={() => {
                // #region debug-point D:logout-click
                reportDebug("D", "AdminSidebar.tsx:logout-button", "logout requested", {
                  pathname,
                  mobileOpenBefore: mobileOpen,
                });
                // #endregion
                setMobileOpen(false);
              }}
              className="mt-1 flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-muted transition-colors hover:bg-surface/5 hover:text-white"
              role="menuitem"
              aria-label="Oturumu Kapat"
            >
              <LogOutIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              Oturumu Kapat
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
