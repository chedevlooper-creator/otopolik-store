import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/site-config";

const pages = {
  kargo: {
    title: "Kargo ve Teslimat",
    description: "Siparişlerinizin hazırlanma ve teslimat sürecine ilişkin bilgiler.",
    sections: [
      ["Hazırlık süresi", `Siparişler, stok ve araç uyumluluğu teyidinin ardından ${siteConfig.estimatedDispatch} içinde kargoya teslim edilir.`],
      ["Kargo ücreti", `${siteConfig.freeShippingThreshold.toLocaleString("tr-TR")}₺ ve üzerindeki siparişlerde kargo ücretsizdir. Bu tutarın altındaki siparişlerde sabit kargo ücreti ${siteConfig.shippingFee}₺ olarak sipariş özetinde gösterilir.`],
      ["Teslimat", "Teslimat süresi kargo firmasına ve teslimat adresine göre değişir. Sipariş onayı sırasında güncel tahmini teslimat bilgisi paylaşılır."],
    ],
  },
  iade: {
    title: "İade ve Değişim",
    description: "İade veya değişim talebi oluşturmadan önce bu koşulları inceleyin.",
    sections: [
      ["Başvuru", "İade veya değişim talebinizi sipariş numaranız ve ürün fotoğraflarıyla WhatsApp üzerinden iletebilirsiniz."],
      ["Özel üretim", "Araç uyumluluğuna göre hazırlanan ürünlerde değerlendirme; ürünün durumu, uyumluluk teyidi ve tüketici mevzuatındaki istisnalar dikkate alınarak yapılır."],
      ["İnceleme", "Talebiniz incelenmeden ürünü göndermeyin. Onay sonrası gönderim adresi ve süreç bilgisi paylaşılır."],
    ],
  },
  "ozel-uretim": {
    title: "Özel Üretim Bilgilendirmesi",
    description: "Araca özel EVA paspas sipariş sürecinin nasıl ilerlediğini öğrenin.",
    sections: [
      ["Uyumluluk teyidi", "Marka, model, yıl ve kasa/versiyon bilgisi siparişten önce teyit edilir."],
      ["Set kapsamı", "Standart set kapsamı ürün sayfasında gösterilir. Bagaj paspası gibi opsiyonlar ayrıca teyit edilir."],
      ["Değişiklik", "Araç bilgisinde farklılık varsa üretime geçmeden önce WhatsApp üzerinden bildirin."],
    ],
  },
  gizlilik: {
    title: "Gizlilik ve Ön Bilgilendirme",
    description: "Sipariş talebi sırasında paylaşılan kişisel bilgilerin kullanımına ilişkin bilgilendirme.",
    sections: [
      ["Toplanan bilgiler", "Sipariş talebi için ad, telefon, şehir, teslimat adresi ve sipariş notu alınır."],
      ["Kullanım amacı", "Bu bilgiler yalnızca siparişi teyit etmek, teslimatı yürütmek ve gerektiğinde sizinle iletişime geçmek amacıyla kullanılır."],
      ["Resmî metinler", "Yayına almadan önce işletmenize ait güncel gizlilik, mesafeli satış ve ön bilgilendirme metinlerini hukukî danışmanınızla tamamlayın."],
    ],
  },
} as const;

type Slug = keyof typeof pages;

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = pages[slug as Slug];
  return page ? { title: page.title, description: page.description } : {};
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug as Slug];
  if (!page) notFound();
  return <main className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
    <Link href="/" className="text-sm font-semibold text-brand-red hover:underline">← Ana sayfa</Link>
    <h1 className="font-heading mt-5 text-3xl font-extrabold text-white">{page.title}</h1>
    <p className="mt-3 text-neutral-400">{page.description}</p>
    <div className="mt-10 space-y-5">
      {page.sections.map(([heading, text]) => <section key={heading} className="rounded-2xl border border-neutral-700 p-6"><h2 className="font-heading text-lg font-bold text-white">{heading}</h2><p className="mt-2 text-sm leading-relaxed text-neutral-400">{text}</p></section>)}
    </div>
  </main>;
}
