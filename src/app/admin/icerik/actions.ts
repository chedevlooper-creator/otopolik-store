"use server";

import { isAuthenticated } from "@/lib/admin-auth";
import {
  getFaqs,
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

type SeoDraft = {
  title: string;
  description: string;
};

type FaqDraft = {
  question: string;
  answer: string;
};

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

function parseJsonDraft<T extends Record<string, string>>(
  draft: string,
  fields: (keyof T)[]
): T | null {
  try {
    const parsed = JSON.parse(draft) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const record = parsed as Record<string, unknown>;
    if (
      fields.some(
        (field) =>
          typeof record[String(field)] !== "string" ||
          !(record[String(field)] as string).trim()
      )
    ) {
      return null;
    }
    return record as T;
  } catch {
    return null;
  }
}

export async function publishContentGenerationAction({
  generationId,
}: {
  generationId: string;
}): Promise<SaveResult> {
  const auth = await guard();
  if (auth) return auth;

  const client = getConvexClient();
  if (!isConvexConfigured() || !client) {
    return { ok: false, message: "Convex bağlı değil." };
  }

  try {
    const adminKey = getAdminConvexKey();
    const generation = await client.query(api.contentGenerations.getById, {
      adminKey,
      id: generationId as never,
    });
    if (!generation) {
      return { ok: false, message: "Taslak bulunamadı." };
    }
    if (generation.status !== "ready" || !generation.draft?.trim()) {
      return {
        ok: false,
        message: "Yalnızca incelemeye hazır, dolu taslaklar yayımlanabilir.",
      };
    }

    let publishResult: SaveResult;
    if (generation.kind === "product_description") {
      const product = await client.query(api.products.getBySlug, {
        slug: generation.targetSlug,
      });
      if (!product) {
        return { ok: false, message: "Hedef ürün bulunamadı." };
      }
      await client.mutation(api.products.update, {
        adminKey,
        id: product._id,
        description: generation.draft.trim(),
      });
      publishResult = { ok: true };
    } else if (generation.kind === "product_seo") {
      const seo = parseJsonDraft<SeoDraft>(generation.draft, [
        "title",
        "description",
      ]);
      if (!seo) {
        return {
          ok: false,
          message: "SEO taslağı title ve description alanlarını içeren JSON olmalıdır.",
        };
      }
      const product = await client.query(api.products.getBySlug, {
        slug: generation.targetSlug,
      });
      if (!product) {
        return { ok: false, message: "Hedef ürün bulunamadı." };
      }
      await client.mutation(api.products.update, {
        adminKey,
        id: product._id,
        metaTitle: seo.title.trim(),
        metaDescription: seo.description.trim(),
      });
      publishResult = { ok: true };
    } else {
      const faq = parseJsonDraft<FaqDraft>(generation.draft, [
        "question",
        "answer",
      ]);
      if (!faq) {
        return {
          ok: false,
          message: "SSS taslağı question ve answer alanlarını içeren JSON olmalıdır.",
        };
      }
      const existingFaqs = await getFaqs();
      const sortOrder =
        Math.max(0, ...existingFaqs.items.map((item) => item.sortOrder)) + 1;
      publishResult = await saveFaqItem({
        sortOrder,
        question: faq.question.trim(),
        answer: faq.answer.trim(),
        isPublished: true,
      });
    }

    if (!publishResult.ok) return publishResult;

    await client.mutation(api.contentGenerations.markStatus, {
      adminKey,
      id: generation._id,
      status: "approved",
    });
    revalidateSite();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Taslak yayımlanamadı.",
    };
  }
}
