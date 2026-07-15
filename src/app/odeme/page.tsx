import type { Metadata } from "next";
import { getContentPage } from "@/lib/cms";
import CheckoutPageClient from "./CheckoutPageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getContentPage("odeme");
  return {
    title: page?.metaTitle ?? "Sipariş",
    description:
      page?.metaDescription ??
      "OTO POLİK sipariş teslimat ve ödeme tercihlerinizi güvenle iletin.",
  };
}

export default async function CheckoutPage() {
  const { page, sections } = await getContentPage("odeme");
  const empty = sections.find((s) => s.sectionKey === "empty");

  return (
    <CheckoutPageClient
      content={{
        title: page?.title ?? "Siparişi Tamamla",
        description:
          page?.description ??
          "Bilgilerinizi girin. Siparişiniz WhatsApp üzerinden teyit edilecek; kapıda ödeme seçebilirsiniz.",
        emptyTitle: empty?.title ?? "Sepetiniz boş",
        emptyBody:
          empty?.body ??
          "Ödeme adımına geçmeden önce sepetinize ürün ekleyin.",
        ctaLabel: empty?.ctaLabel ?? "Ürünleri İncele",
      }}
    />
  );
}
