import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  validateUIMessages,
  type UIMessage,
} from "ai";
import { NextRequest, NextResponse } from "next/server";

import { getLanguageModel } from "@/lib/ai/anthropic-client";
import {
  getAiMaxTokens,
  isAiConfigured,
  isAiFeaturesEnabled,
} from "@/lib/ai/config";
import { checkAiRateLimit } from "@/lib/ai/rate-limit";
import { SUPPORT_SYSTEM_PROMPT } from "@/lib/ai/support-prompt";
import { supportTools } from "@/lib/ai/support-tools";

export const runtime = "nodejs";

const MAX_MESSAGES = 20;
const MAX_USER_MESSAGE_CHARS = 2_000;

function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0];
  const clientIp =
    forwardedFor?.trim() || request.headers.get("x-real-ip") || "unknown";
  const session = request.headers.get("x-ai-session")?.trim().slice(0, 80);
  return session ? `${clientIp}:${session}` : clientIp;
}

function userTextLength(message: UIMessage): number {
  if (message.role !== "user") return 0;
  return message.parts.reduce(
    (length, part) =>
      part.type === "text" ? length + part.text.length : length,
    0
  );
}

export async function POST(request: NextRequest) {
  if (!isAiFeaturesEnabled() || !isAiConfigured()) {
    return NextResponse.json({ error: "ai_unavailable" }, { status: 503 });
  }

  const model = getLanguageModel("support-chat");
  if (!model) {
    return NextResponse.json({ error: "ai_unavailable" }, { status: 503 });
  }

  let rawMessages: unknown;
  try {
    const body = (await request.json()) as { messages?: unknown };
    rawMessages = body.messages;
  } catch {
    return NextResponse.json({ error: "gecersiz_istek" }, { status: 400 });
  }

  let messages: UIMessage[];
  try {
    messages = await validateUIMessages({
      messages: rawMessages,
    });
  } catch {
    return NextResponse.json({ error: "gecersiz_mesajlar" }, { status: 400 });
  }

  if (
    messages.length === 0 ||
    messages.some(
      (message) => userTextLength(message) > MAX_USER_MESSAGE_CHARS
    )
  ) {
    return NextResponse.json({ error: "mesaj_cok_uzun" }, { status: 400 });
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
    const boundedMessages = messages.slice(-MAX_MESSAGES);
    const result = streamText({
      model,
      system: SUPPORT_SYSTEM_PROMPT,
      messages: await convertToModelMessages(boundedMessages, {
        tools: supportTools,
        ignoreIncompleteToolCalls: true,
      }),
      tools: supportTools,
      maxOutputTokens: getAiMaxTokens("support-chat"),
      stopWhen: stepCountIs(8),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(
      "Destek sohbeti başlatılamadı:",
      error instanceof Error ? error.message : "Bilinmeyen hata"
    );
    return NextResponse.json(
      { error: "sohbet_baslatilamadi" },
      { status: 500 }
    );
  }
}
