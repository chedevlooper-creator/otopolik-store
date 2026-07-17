import { NextResponse } from "next/server";

import { isAiConfigured } from "@/lib/ai/config";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({ configured: isAiConfigured() });
}
