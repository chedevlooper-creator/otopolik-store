import { CONTENT_STYLE_GUIDE } from "@/lib/ai/content-style-guide";

export type ContentGenerationKind =
  | "product_description"
  | "product_seo"
  | "faq";

const KIND_INSTRUCTIONS: Record<ContentGenerationKind, string> = {
  product_description: `
120-220 kelimelik ürün açıklaması yaz. İlk paragrafta ürünün temel değerini,
sonraki paragraflarda yalnızca verilen özellikleri ve uyumluluk bilgisini anlat.
Markdown başlığı, fiyat tekrarı veya çağrı düğmesi metni ekleme.
  `.trim(),
  product_seo: `
Yalnızca geçerli JSON üret: {"title":"...","description":"..."}.
title en fazla 60, description en fazla 155 karakter olmalı. Her iki alan da Türkçe,
özgün ve yalnızca verilen ürün gerçeklerine dayanmalı.
  `.trim(),
  faq: `
Yalnızca geçerli JSON üret: {"question":"...","answer":"..."}.
Tek bir gerçek müşteri sorusu ve 2-4 cümlelik açık yanıt yaz. Cevapta yalnızca
verilen ürün/araç gerçeklerini kullan.
  `.trim(),
};

export function buildContentSystemPrompt(kind: ContentGenerationKind): string {
  return `
${CONTENT_STYLE_GUIDE}

GÖREV SÖZLEŞMESİ
${KIND_INSTRUCTIONS[kind]}

ZORUNLU GÜVENLİK KURALI
Tek bilgi kaynağın kullanıcı mesajındaki GROUNDING_FACTS bloğudur. Bu blokta bulunmayan
fiyat, teknik özellik, araç uyumluluğu, ölçü veya kampanya bilgisi üretme. Bilgi yetersizse
uydurmak yerine kısa biçimde "Bu bilgi ürün verilerinde yer almıyor." de.
  `.trim();
}

export const CONTENT_SYSTEM_PROMPT = buildContentSystemPrompt(
  "product_description"
);
