import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sepetim",
  description: "OTO POLİK sepetinizdeki araca özel EVA paspas ürünlerini inceleyin.",
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
