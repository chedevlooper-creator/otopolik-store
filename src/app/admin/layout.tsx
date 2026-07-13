import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin Panel",
  robots: "noindex, nofollow",
};

// Auth kontrolü src/middleware.ts üzerinden yapılıyor; burada yalnızca
// admin shell'i (sidebar + içerik) sarmalıyoruz. Login rotası
// AdminShell'in kendi içindeki pathname kontrolüyle sidebar'sız render olur.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
