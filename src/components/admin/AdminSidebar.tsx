"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboardIcon,
  ShoppingBagIcon,
  PackageIcon,
  SettingsIcon,
  MenuIcon,
  XIcon,
  ChevronLeftIcon,
  LogOutIcon,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/admin/siparisler", label: "Siparişler", icon: ShoppingBagIcon },
  { href: "/admin/urunler", label: "Ürünler", icon: PackageIcon },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: SettingsIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobil tetikleyici */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-black text-white shadow-lg lg:hidden"
        aria-label="Menü"
      >
        {collapsed ? <MenuIcon className="h-5 w-5" /> : <XIcon className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-brand-black text-white transition-all duration-300 ${
          collapsed ? "-translate-x-full" : "translate-x-0"
        } w-64 lg:translate-x-0 lg:w-60`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <span className="font-heading text-xl font-extrabold tracking-tight">
            OTO <span className="text-brand-red">POLİK</span>
          </span>
          <span className="ml-auto rounded-full bg-brand-red px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
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
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-red text-white shadow-lg shadow-brand-red/20"
                    : "text-neutral-400 hover:bg-[#141414]/5 hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Alt kısım */}
        <div className="border-t border-white/10 px-3 py-4">
          <button
            type="button"
            className="hidden h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-[#141414]/5 hover:text-white lg:flex"
            onClick={() => setCollapsed((c) => !c)}
            aria-label="Daralt"
          >
            <ChevronLeftIcon className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-400 transition-colors hover:bg-[#141414]/5 hover:text-white"
          >
            <LogOutIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            Siteye Dön
          </Link>
        </div>
      </aside>
    </>
  );
}
