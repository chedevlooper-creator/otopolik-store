"use server";

import { isAuthenticated } from "@/lib/admin-auth";
import {
  saveContentPage,
  saveContentSection,
  saveFaqItem,
  savePromoItem,
  saveSiteSeo,
  saveTestimonialItem,
  type ContentPage,
  type ContentSection,
  type FaqItem,
  type PromoItem,
  type SiteSeo,
  type TestimonialItem,
} from "@/lib/cms";
import { getAdminConvexKey } from "@/lib/admin-convex-key";
import { getConvexClient, isConvexConfigured, api } from "@/lib/convex-server";
import { revalidatePath } from "next/cache";

export type SaveResult =
  | { ok: true }
  | { ok: false; message: string };

async function guard(): Promise<SaveResult | null> {
  if (!(await isAuthenticated())) {
    return {
      ok: false,
      message: "Oturumunuz sona ermiş. Yeniden giriş yapıp tekrar deneyin.",
    };
  }
  return null;
}

function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/bilgiler", "layout");
  revalidatePath("/hakkimizda");
  revalidatePath("/iletisim");
  revalidatePath("/urunler");
  revalidatePath("/olusturucu");
  revalidatePath("/sepet");
  revalidatePath("/odeme");
  revalidatePath("/tesekkurler");
}

export async function updateSeoAction(payload: SiteSeo): Promise<SaveResult> {
  const auth = await guard();
  if (auth) return auth;
  if (!payload.siteName.trim()) {
    return { ok: false, message: "Site adı zorunludur." };
  }
  const result = await saveSiteSeo(payload);
  if (result.ok) revalidateSite();
  return result;
}

export async function updatePageAction(payload: ContentPage): Promise<SaveResult> {
  const auth = await guard();
  if (auth) return auth;
  if (!payload.slug.trim() || !payload.title.trim()) {
    return { ok: false, message: "Slug ve başlık zorunludur." };
  }
  const result = await saveContentPage(payload);
  if (result.ok) revalidateSite();
  return result;
}

export async function updateSectionAction(
  payload: ContentSection
): Promise<SaveResult> {
  const auth = await guard();
  if (auth) return auth;
  const result = await saveContentSection(payload);
  if (result.ok) revalidateSite();
  return result;
}

export async function updateFaqAction(payload: FaqItem): Promise<SaveResult> {
  const auth = await guard();
  if (auth) return auth;
  if (!payload.question.trim() || !payload.answer.trim()) {
    return { ok: false, message: "Soru ve cevap zorunludur." };
  }
  const result = await saveFaqItem(payload);
  if (result.ok) revalidateSite();
  return result;
}

export async function deleteFaqAction(id: string): Promise<SaveResult> {
  const auth = await guard();
  if (auth) return auth;
  const client = getConvexClient();
  if (!isConvexConfigured() || !client) {
    return { ok: false, message: "Convex bağlı değil." };
  }
  try {
    await client.mutation(api.cms.removeFaq, {
      adminKey: getAdminConvexKey(),
      id: id as never,
    });
    revalidateSite();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Silinemedi.",
    };
  }
}

export async function updatePromoAction(payload: PromoItem): Promise<SaveResult> {
  const auth = await guard();
  if (auth) return auth;
  if (!payload.label.trim()) {
    return { ok: false, message: "Etiket zorunludur." };
  }
  const result = await savePromoItem(payload);
  if (result.ok) revalidateSite();
  return result;
}

export async function updateTestimonialAction(
  payload: TestimonialItem
): Promise<SaveResult> {
  const auth = await guard();
  if (auth) return auth;
  if (!payload.name.trim() || !payload.text.trim()) {
    return { ok: false, message: "İsim ve yorum zorunludur." };
  }
  if (payload.rating < 1 || payload.rating > 5) {
    return { ok: false, message: "Puan 1–5 arasında olmalıdır." };
  }
  const result = await saveTestimonialItem(payload);
  if (result.ok) revalidateSite();
  return result;
}

export async function seedCmsAction(): Promise<SaveResult> {
  const auth = await guard();
  if (auth) return auth;
  const client = getConvexClient();
  if (!isConvexConfigured() || !client) {
    return { ok: false, message: "Convex bağlı değil." };
  }
  try {
    await client.mutation(api.cms.seedCms, {
      adminKey: getAdminConvexKey(),
    });
    revalidateSite();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Seed başarısız.",
    };
  }
}
