import { generateText, Output } from "ai";
import { z } from "zod";

import { getAiMaxTokens, isAiConfigured } from "@/lib/ai/config";
import { getCustomerVehiclePrice } from "@/lib/ai/customer-tools";
import {
  normalizeSearchText,
  searchVehicles,
  type VehicleSearchResult,
} from "@/lib/vehicle-search";
import { getAllBrands, type VehicleBodyType } from "@/lib/vehicle-data";

export type VehicleMatchCandidate = {
  brand: string;
  model: string;
  displayModel: string;
  bodyType: VehicleBodyType;
  priceTier: number;
  source: "deterministic" | "llm";
  year?: string;
};

export type VehicleMatchResult =
  | { status: "matched"; candidate: VehicleMatchCandidate }
  | {
      status: "needs_disambiguation";
      candidates: VehicleMatchCandidate[];
    }
  | { status: "no_match"; message?: string };

const NO_MATCH_MESSAGE =
  "Aracınızı eşleştiremedik. Marka ve modeli ayrı yazarak deneyin.";
const YEAR_PATTERN = /\b(19|20)\d{2}\b/;

const parsedVehicleSchema = z.object({
  brand: z.string().trim().max(50).optional(),
  model: z.string().trim().max(80).optional(),
  year: z.string().regex(/^(19|20)\d{2}$/).optional(),
  trim: z.string().trim().max(80).optional(),
});

function extractYear(query: string): string | undefined {
  return query.match(YEAR_PATTERN)?.[0];
}

function withoutYear(query: string): string {
  return query.replace(YEAR_PATTERN, " ").replace(/\s+/g, " ").trim();
}

function toCandidate(
  vehicle: VehicleSearchResult,
  source: VehicleMatchCandidate["source"],
  year?: string
): VehicleMatchCandidate {
  return {
    brand: vehicle.brand,
    model: vehicle.model,
    displayModel: vehicle.displayModel,
    bodyType: vehicle.bodyType,
    priceTier: getCustomerVehiclePrice(vehicle.brand, vehicle.model),
    source,
    ...(year ? { year } : {}),
  };
}

function resolveCatalogResults(
  vehicles: VehicleSearchResult[],
  source: VehicleMatchCandidate["source"],
  query: string,
  year?: string
): VehicleMatchResult | null {
  // A unique result or one exact brand+model/model label is high confidence.
  // Other multi-result queries always require explicit user choice.
  const normalizedQuery = normalizeSearchText(withoutYear(query));
  const exactResults = vehicles.filter((vehicle) => {
    const normalizedModel = normalizeSearchText(vehicle.model);
    const normalizedLabel = normalizeSearchText(
      `${vehicle.brand} ${vehicle.model}`
    );
    return (
      normalizedQuery === normalizedModel || normalizedQuery === normalizedLabel
    );
  });
  const matchedVehicle =
    vehicles.length === 1
      ? vehicles[0]
      : exactResults.length === 1
        ? exactResults[0]
        : null;

  if (matchedVehicle) {
    return {
      status: "matched",
      candidate: toCandidate(matchedVehicle, source, year),
    };
  }

  if (vehicles.length > 1) {
    return {
      status: "needs_disambiguation",
      candidates: vehicles.map((vehicle) =>
        toCandidate(vehicle, source, year)
      ),
    };
  }

  return null;
}

async function resolveWithLanguageModel(
  query: string
): Promise<VehicleMatchResult | null> {
  if (!isAiConfigured()) return null;

  const { getLanguageModel } = await import("@/lib/ai/anthropic-client");
  const model = getLanguageModel("vehicle-match");
  if (!model) return null;

  try {
    const result = await generateText({
      model,
      system: [
        "Kullanıcının Türkçe araç tarifinden yalnızca marka, model, yıl ve paket bilgilerini çıkar.",
        "Fiyat üretme. Açıklama veya serbest metin ekleme.",
        `Geçerli katalog markaları: ${getAllBrands().join(", ")}.`,
      ].join(" "),
      prompt: query,
      maxOutputTokens: getAiMaxTokens("vehicle-match"),
      output: Output.object({ schema: parsedVehicleSchema }),
    });

    const parsed = result.output;
    const searchQuery = [parsed.brand, parsed.model, parsed.trim]
      .filter((value): value is string => Boolean(value))
      .join(" ");
    if (!normalizeSearchText(searchQuery)) return null;

    return resolveCatalogResults(
      searchVehicles(searchQuery),
      "llm",
      searchQuery,
      parsed.year ?? extractYear(query)
    );
  } catch (error) {
    console.error(
      "Araç eşleştirme modeli yanıt veremedi:",
      error instanceof Error ? error.message : "Bilinmeyen hata"
    );
    return null;
  }
}

export async function runVehicleMatch(
  query: string,
  limit = 8
): Promise<VehicleMatchResult> {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return { status: "no_match", message: NO_MATCH_MESSAGE };
  }

  const year = extractYear(query);
  const initialResults = searchVehicles(query, limit);
  const withoutYearResults =
    initialResults.length === 0 && year
      ? searchVehicles(withoutYear(query), limit)
      : initialResults;
  const deterministic = resolveCatalogResults(
    withoutYearResults,
    "deterministic",
    query,
    year
  );
  if (deterministic) return deterministic;

  const llmResult = await resolveWithLanguageModel(query);
  return llmResult ?? { status: "no_match", message: NO_MATCH_MESSAGE };
}
