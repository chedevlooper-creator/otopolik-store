import type { Metadata } from "next";
import { getContentPage } from "@/lib/cms";
import CartPageClient from "./CartPageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getContentPage("sepet");
  return {
    title: page?.metaTitle ?? "Sepetim",
    description:
      page?.metaDescription ??
      "OTO POLİK sepetinizdeki araca özel EVA paspas ürünlerini inceleyin.",
  };
}

export default async function CartPage() {
  const { page, sections } = await getContentPage("sepet");
  const empty = sections.find((s) => s.sectionKey === "empty");

  return (
    <CartPageClient
      content={{
        title: page?.title ?? "Sepetim",
        description: page?.description ?? "",
        emptyTitle: empty?.title ?? "Sepetiniz boş",
        emptyBody:
          empty?.body ??
          "Aracınıza özel EVA paspas setini keşfetmek için ürünlere göz atın.",
        ctaLabel: empty?.ctaLabel ?? "Ürünleri İncele",
      }}
    />
  );
}
