"use client";

import { usePathname } from "next/navigation";

/**
 * Route template — her gezinmede yeniden mount olur, böylece sayfa içeriği
 * her geçişte yumuşak bir doğuş animasyonuyla girer (.page-enter, globals.css).
 * Admin tarafı bilinçli olarak sade bırakılır.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return children;
  }

  return <div className="page-enter">{children}</div>;
}
