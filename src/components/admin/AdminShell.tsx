"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className={`min-w-0 ${isLogin ? "" : "lg:pl-60"}`}>
        <div
          className={`mx-auto w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8 ${
            isLogin ? "max-w-xl" : "max-w-7xl"
          }`}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
