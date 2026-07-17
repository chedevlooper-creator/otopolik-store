import { generateText } from "ai";

import { getLanguageModel } from "@/lib/ai/anthropic-client";
import { getAiMaxTokens } from "@/lib/ai/config";
import {
  buildContentGroundingFacts,
  type ContentGroundingResult,
} from "@/lib/ai/content-grounding";
import {
  buildContentSystemPrompt,
  type ContentGenerationKind,
} from "@/lib/ai/content-prompt";

export type ContentGenerationResult =
  | { ok: true; draft: string }
  | {
      ok: false;
      error: "ai_unavailable" | "product_not_found" | "generation_failed";
      message?: string;
    };

function buildUserPrompt(
  grounding: Extract<ContentGroundingResult, { ok: true }>,
  note?: string
): string {
  return `
GROUNDING_FACTS
${grounding.serialized}

ADMIN_NOTE
${note?.trim() || "Ek yönlendirme yok."}

Yukarıdaki gerçeklere ve sistem sözleşmesine uygun nihai taslağı üret.
  `.trim();
}

export async function generateContentDraft({
  kind,
  targetSlug,
  prompt,
}: {
  kind: ContentGenerationKind;
  targetSlug: string;
  prompt?: string;
}): Promise<ContentGenerationResult> {
  const model = getLanguageModel("content-generator");
  if (!model) return { ok: false, error: "ai_unavailable" };

  const grounding = buildContentGroundingFacts({ kind, targetSlug });
  if (!grounding.ok) {
    return { ok: false, error: grounding.error };
  }

  try {
    const result = await generateText({
      model,
      system: buildContentSystemPrompt(kind),
      prompt: buildUserPrompt(grounding, prompt),
      maxOutputTokens: getAiMaxTokens("content-generator"),
      temperature: 0.35,
    });
    const draft = result.text.trim();
    if (!draft) {
      return {
        ok: false,
        error: "generation_failed",
        message: "Model boş bir taslak döndürdü.",
      };
    }
    return { ok: true, draft };
  } catch (error) {
    return {
      ok: false,
      error: "generation_failed",
      message:
        error instanceof Error ? error.message : "İçerik üretimi başarısız oldu.",
    };
  }
}
