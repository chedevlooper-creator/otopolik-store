"use server";

import { saveSiteSettings, type SiteSettings } from "@/lib/site-settings";
import { isAuthenticated } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";

export type SaveResult =
  | { ok: true }
  | { ok: false; message: string };

export async function updateSettings(
  payload: Partial<SiteSettings>
): Promise<SaveResult> {
  // Proxy yalnızca erken yönlendirme katmanıdır; mutasyon kendi yetkisini de doğrular.
  if (!(await isAuthenticated())) {
    return {
      ok: false,
      message: "Oturumunuz sona ermiş. Yeniden giriş yapıp tekrar deneyin.",
    };
  }

  // Basit doğrulama
  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return { ok: false, message: "Geçersiz e-posta adresi." };
  }
  if (payload.whatsappNumber && !/^[0-9+\s]{10,16}$/.test(payload.whatsappNumber)) {
    return { ok: false, message: "WhatsApp numarası geçersiz (örn: 905551234567)." };
  }
  if (
    payload.shippingFee !== undefined &&
    (payload.shippingFee < 0 || !Number.isFinite(payload.shippingFee))
  ) {
    return { ok: false, message: "Kargo ücreti negatif olamaz." };
  }
  if (
    payload.freeShippingThreshold !== undefined &&
    (payload.freeShippingThreshold < 0 || !Number.isFinite(payload.freeShippingThreshold))
  ) {
    return { ok: false, message: "Ücretsiz kargo eşiği negatif olamaz." };
  }

  const result = await saveSiteSettings(payload);

  if (result.ok) {
    // Tüm sayfaları invalidate et ki yeni değerler anında yansısın
    revalidatePath("/", "layout");
  }

  return result;
}
