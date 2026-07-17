import { NextRequest, NextResponse } from "next/server";

import {
  isAiConfigured,
  isAiFeaturesEnabled,
} from "@/lib/ai/config";
import { checkAiRateLimit } from "@/lib/ai/rate-limit";
import { runVehicleMatch } from "@/lib/ai/vehicle-match";

export const runtime = "nodejs";

const MAX_QUERY_LENGTH = 200;

type VehicleMatchRequest = {
  query?: unknown;
};

function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0];
  const clientIp =
    forwardedFor?.trim() || request.headers.get("x-real-ip") || "unknown";
  const session = request.headers.get("x-ai-session")?.trim().slice(0, 80);
  return session ? `${clientIp}:${session}` : clientIp;
}

export async function POST(request: NextRequest) {
  if (!isAiFeaturesEnabled()) {
    return NextResponse.json(
      { error: "ai_unavailable" },
      { status: 503 }
    );
  }

  let body: VehicleMatchRequest;
  try {
    body = (await request.json()) as VehicleMatchRequest;
  } catch {
    return NextResponse.json(
      { error: "gecersiz_istek" },
      { status: 400 }
    );
  }

  if (typeof body.query !== "string" || body.query.trim().length === 0) {
    return NextResponse.json(
      { error: "arac_metni_gerekli" },
      { status: 400 }
    );
  }

  const query = body.query.trim();
  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json(
      { error: "arac_metni_cok_uzun" },
      { status: 400 }
    );
  }

  const rateLimit = checkAiRateLimit(getClientKey(request));
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "cok_fazla_istek" },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSec) },
      }
    );
  }

  try {
    const result = await runVehicleMatch(query);
    return NextResponse.json({
      configured: isAiConfigured(),
      ...result,
    });
  } catch (error) {
    console.error(
      "Araç eşleştirme isteği işlenemedi:",
      error instanceof Error ? error.message : "Bilinmeyen hata"
    );
    return NextResponse.json(
      { error: "eslestirme_basarisiz" },
      { status: 500 }
    );
  }
}
