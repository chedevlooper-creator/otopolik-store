// =============================================================
// OTO POLİK — Site Ayarları Veri Katmanı (Convex)
// =============================================================
// Convex bağlıysa site_settings tablosundan okur/yazar.
// Bağlı değilse veya hata olursa siteConfig fallback kullanılır.
// =============================================================

import "server-only";
import { getConvexClient, isConvexConfigured, api } from "@/lib/convex-server";
import { getAdminConvexKey } from "@/lib/admin-convex-key";
import { siteConfig } from "@/lib/site-config";

export type SiteSettings = {
  phoneDisplay: string;
  whatsappNumber: string;
  email: string;
  address: string;
  instagram: string;
  freeShippingThreshold: number;
  shippingFee: number;
  estimatedDispatch: string;
  businessHours: string;
  matBasePrice: number;
  matHeelPadPrice: number;
  matTrunkPrice: number;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  phoneDisplay: siteConfig.phoneDisplay,
  whatsappNumber: siteConfig.whatsappNumber,
  email: siteConfig.email,
  address: siteConfig.address,
  instagram: siteConfig.instagram,
  freeShippingThreshold: siteConfig.freeShippingThreshold,
  shippingFee: siteConfig.shippingFee,
  estimatedDispatch: siteConfig.estimatedDispatch,
  businessHours: siteConfig.businessHours,
  matBasePrice: siteConfig.matBasePrice,
  matHeelPadPrice: siteConfig.matHeelPadPrice,
  matTrunkPrice: siteConfig.matTrunkPrice,
};

function mapRow(row: Partial<SiteSettings> | null | undefined): SiteSettings {
  if (!row) return DEFAULT_SETTINGS;
  return {
    phoneDisplay: row.phoneDisplay ?? DEFAULT_SETTINGS.phoneDisplay,
    whatsappNumber: row.whatsappNumber ?? DEFAULT_SETTINGS.whatsappNumber,
    email: row.email ?? DEFAULT_SETTINGS.email,
    address: row.address ?? DEFAULT_SETTINGS.address,
    instagram: row.instagram ?? DEFAULT_SETTINGS.instagram,
    freeShippingThreshold:
      row.freeShippingThreshold ?? DEFAULT_SETTINGS.freeShippingThreshold,
    shippingFee: row.shippingFee ?? DEFAULT_SETTINGS.shippingFee,
    estimatedDispatch:
      row.estimatedDispatch ?? DEFAULT_SETTINGS.estimatedDispatch,
    businessHours: row.businessHours ?? DEFAULT_SETTINGS.businessHours,
    matBasePrice: row.matBasePrice ?? DEFAULT_SETTINGS.matBasePrice,
    matHeelPadPrice: row.matHeelPadPrice ?? DEFAULT_SETTINGS.matHeelPadPrice,
    matTrunkPrice: row.matTrunkPrice ?? DEFAULT_SETTINGS.matTrunkPrice,
  };
}

export async function getSiteSettings(): Promise<{
  settings: SiteSettings;
  source: "convex" | "fallback";
}> {
  const client = getConvexClient();
  if (!isConvexConfigured() || !client) {
    return { settings: DEFAULT_SETTINGS, source: "fallback" };
  }
  try {
    const row = await client.query(api.siteSettings.getSettings, {});
    return { settings: mapRow(row), source: row ? "convex" : "fallback" };
  } catch (error) {
    console.error("site_settings fetch error:", error);
    return { settings: DEFAULT_SETTINGS, source: "fallback" };
  }
}

/** Vitrin için kısayol — Convex yoksa env/site-config fallback. */
export async function getStoreSettings(): Promise<SiteSettings> {
  const { settings } = await getSiteSettings();
  return settings;
}

export async function saveSiteSettings(
  input: Partial<SiteSettings>
): Promise<{ ok: true } | { ok: false; message: string }> {
  const client = getConvexClient();
  if (!isConvexConfigured() || !client) {
    return {
      ok: false,
      message:
        "Convex bağlı değil. npx convex dev çalıştırın ve NEXT_PUBLIC_CONVEX_URL env değişkenini ayarlayın.",
    };
  }

  try {
    await client.mutation(api.siteSettings.updateSettings, {
      adminKey: getAdminConvexKey(),
      phoneDisplay: input.phoneDisplay,
      whatsappNumber: input.whatsappNumber,
      email: input.email,
      address: input.address,
      instagram: input.instagram,
      freeShippingThreshold: input.freeShippingThreshold,
      shippingFee: input.shippingFee,
      estimatedDispatch: input.estimatedDispatch,
      businessHours: input.businessHours,
      matBasePrice: input.matBasePrice,
      matHeelPadPrice: input.matHeelPadPrice,
      matTrunkPrice: input.matTrunkPrice,
    });
    return { ok: true };
  } catch (error) {
    console.error("site_settings save error:", error);
    return {
      ok: false,
      message:
        error instanceof Error
          ? `Kayıt hatası: ${error.message}`
          : "Beklenmeyen bir hata oluştu.",
    };
  }
}
