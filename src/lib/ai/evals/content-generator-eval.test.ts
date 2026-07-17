import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  ADMIN_KEY_CONTRACT,
  CONTENT_GROUNDING_GOLDEN,
  CONTENT_STYLE_MARKERS,
  NO_LIVE_WRITE_CONTRACT,
} from "@/lib/ai/evals/content-generator-golden";
import { buildContentGroundingFacts } from "@/lib/ai/content-grounding";
import {
  buildContentSystemPrompt,
  CONTENT_SYSTEM_PROMPT,
} from "@/lib/ai/content-prompt";
import { CONTENT_STYLE_GUIDE } from "@/lib/ai/content-style-guide";
import { getProductBySlug } from "@/lib/products";

function source(path: string): string {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("content generator golden eval", () => {
  it("locks premium Turkish style and no-invention constraints", () => {
    for (const marker of CONTENT_STYLE_MARKERS) {
      expect(CONTENT_STYLE_GUIDE.toLocaleLowerCase("tr-TR")).toContain(
        marker.toLocaleLowerCase("tr-TR")
      );
    }
    expect(CONTENT_SYSTEM_PROMPT).toContain(CONTENT_STYLE_GUIDE);
    expect(buildContentSystemPrompt("product_seo")).toMatch(
      /yalnızca geçerli JSON/i
    );
    expect(buildContentSystemPrompt("faq")).toMatch(
      /question[\s\S]*answer/i
    );
    expect(CONTENT_SYSTEM_PROMPT).toMatch(
      /bulunmayan[\s\S]*(fiyat|teknik özellik|uyumluluk)/i
    );
  });

  it("copies catalog facts and refuses unknown products", () => {
    const product = getProductBySlug(CONTENT_GROUNDING_GOLDEN.knownSlug);
    const known = buildContentGroundingFacts({
      kind: "product_description",
      targetSlug: CONTENT_GROUNDING_GOLDEN.knownSlug,
    });
    const unknown = buildContentGroundingFacts({
      kind: "product_description",
      targetSlug: CONTENT_GROUNDING_GOLDEN.unknownSlug,
    });

    expect(product).toBeDefined();
    expect(known.ok).toBe(true);
    if (known.ok && product) {
      expect(known.facts.product.price).toBe(product.price);
      expect(known.facts.product.features[0]).toBe(product.features[0]);
      expect(known.serialized).toContain(product.name);
    }
    expect(unknown).toMatchObject({
      ok: false,
      error: "product_not_found",
      facts: null,
    });
    expect(unknown.serialized).not.toContain('"price"');
  });

  it("prevents generation sources from writing live content", () => {
    const generationSources = [
      source("src/lib/ai/content-generate.ts"),
      source("src/app/api/admin/ai/content/route.ts"),
    ];
    const forbidden =
      /saveFaqItem|saveSiteSeo|saveContentSection|saveContentPage|products\.update/;

    expect(NO_LIVE_WRITE_CONTRACT).toMatch(/yalnızca.*tasla/i);
    for (const generationSource of generationSources) {
      expect(generationSource).not.toMatch(forbidden);
    }

    const publishSource = source("src/app/admin/icerik/actions.ts");
    expect(publishSource).toContain("publishContentGenerationAction");
    expect(publishSource).toMatch(/saveFaqItem|products\.update/);
  });

  it("locks authentication, draft persistence, and both admin-key paths", () => {
    const route = source("src/app/api/admin/ai/content/route.ts");
    const actions = source("src/app/admin/icerik/actions.ts");
    const panel = source(
      "src/app/admin/icerik/ContentGeneratorPanel.tsx"
    );
    const manager = source("src/app/admin/icerik/ContentManager.tsx");

    expect(route).toContain("isAuthenticated");
    expect(route).toContain("contentGenerations.upsertDraft");
    expect(route).toContain(ADMIN_KEY_CONTRACT.server);
    expect(actions).toContain(ADMIN_KEY_CONTRACT.server);
    expect(panel).toContain(ADMIN_KEY_CONTRACT.browser);
    expect(manager).toContain("ContentGeneratorPanel");
  });

  it("exposes the deterministic package gate", () => {
    const packageJson = JSON.parse(source("package.json")) as {
      scripts?: Record<string, string>;
    };
    expect(packageJson.scripts?.["ai:eval:content-generator"]).toBe(
      "vitest run src/lib/ai/evals/content-generator-eval.test.ts"
    );
  });
});
