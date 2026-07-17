import { NextRequest, NextResponse } from "next/server";

import { getAdminConvexKey } from "@/lib/admin-convex-key";
import { isAuthenticated } from "@/lib/admin-auth";
import { isAiConfigured, isAiFeaturesEnabled } from "@/lib/ai/config";
import { generateContentDraft } from "@/lib/ai/content-generate";
import type { ContentGenerationKind } from "@/lib/ai/content-prompt";
import { checkAiRateLimit } from "@/lib/ai/rate-limit";
import {
  api,
  getConvexClient,
  isConvexConfigured,
} from "@/lib/convex-server";

export const runtime = "nodejs";

const CONTENT_KINDS: ContentGenerationKind[] = [
  "product_description",
  "product_seo",
  "faq",
];

type RequestBody = {
  kind?: unknown;
  targetSlug?: unknown;
  prompt?: unknown;
};

function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0];
  const ip = forwardedFor?.trim() || request.headers.get("x-real-ip") || "admin";
  return `admin-content:${ip}`;
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { error: "Oturumunuz sona ermiş. Yeniden giriş yapın." },
      { status: 401 }
    );
  }

  if (
    !isAiFeaturesEnabled() ||
    !isAiConfigured() ||
    !isConvexConfigured()
  ) {
    return NextResponse.json(
      { error: "AI içerik üreticisi şu anda kullanılamıyor." },
      { status: 503 }
    );
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json(
      { error: "Geçersiz istek gövdesi." },
      { status: 400 }
    );
  }

  if (
    typeof body.kind !== "string" ||
    !CONTENT_KINDS.includes(body.kind as ContentGenerationKind) ||
    typeof body.targetSlug !== "string" ||
    body.targetSlug.trim().length === 0 ||
    body.targetSlug.length > 120 ||
    (body.prompt !== undefined &&
      (typeof body.prompt !== "string" || body.prompt.length > 1_000))
  ) {
    return NextResponse.json(
      { error: "İçerik türü, ürün ve yönlendirme alanlarını kontrol edin." },
      { status: 400 }
    );
  }

  const rateLimit = checkAiRateLimit(getClientKey(request));
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Çok fazla istek gönderildi. Lütfen kısa süre sonra deneyin." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSec) },
      }
    );
  }

  const kind = body.kind as ContentGenerationKind;
  const targetSlug = body.targetSlug.trim();
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  const client = getConvexClient();
  if (!client) {
    return NextResponse.json(
      { error: "Taslak servisine bağlanılamıyor." },
      { status: 503 }
    );
  }

  const result = await generateContentDraft({ kind, targetSlug, prompt });
  if (!result.ok) {
    if (result.error === "ai_unavailable") {
      return NextResponse.json(
        { error: "AI içerik üreticisi şu anda kullanılamıyor." },
        { status: 503 }
      );
    }
    if (result.error === "product_not_found") {
      return NextResponse.json(
        { error: "Seçilen ürün katalogda bulunamadı." },
        { status: 400 }
      );
    }

    await client.mutation(api.contentGenerations.upsertDraft, {
      adminKey: getAdminConvexKey(),
      kind,
      targetSlug,
      prompt,
      status: "failed",
      failureReason: "İçerik üretimi tamamlanamadı.",
    });
    return NextResponse.json(
      { error: "Taslak üretilemedi. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }

  const generationId = await client.mutation(
    api.contentGenerations.upsertDraft,
    {
      adminKey: getAdminConvexKey(),
      kind,
      targetSlug,
      prompt,
      draft: result.draft,
      status: "ready",
    }
  );

  return NextResponse.json({
    generationId,
    draft: result.draft,
    status: "ready",
  });
}
