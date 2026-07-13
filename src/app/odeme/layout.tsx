import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sipariş Talebi",
  description: "OTO POLİK sipariş teslimat ve ödeme tercihlerinizi güvenle iletin.",
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
