import {
  tool,
  type InferUITools,
  type UIDataTypes,
  type UIMessage,
} from "ai";
import { z } from "zod";

import { getCustomerMatPrice } from "@/lib/ai/customer-tools";
import {
  buildSupportGroundingFacts,
  type SupportGroundingFacts,
} from "@/lib/ai/support-grounding";

export const supportMatPriceInputSchema = z.object({
  heelPad: z.boolean().default(false),
  trunkMat: z.boolean().default(false),
});

export const orderSummaryInputSchema = z.object({
  vehicleBrand: z.string().trim().min(1).max(50),
  vehicleModel: z.string().trim().min(1).max(80),
  vehicleYear: z.string().trim().max(20).optional(),
  floorColor: z.string().trim().min(1).max(50),
  edgeColor: z.string().trim().min(1).max(50),
  heelPad: z.boolean().default(false),
  trunkMat: z.boolean().default(false),
  notes: z.string().trim().max(500).optional(),
});

export const supportWhatsAppInputSchema = z.object({
  message: z.string().trim().min(1).max(1200),
});

type SupportMatPriceInput = z.infer<typeof supportMatPriceInputSchema>;
type OrderSummaryInput = z.infer<typeof orderSummaryInputSchema>;
type SupportWhatsAppInput = z.infer<typeof supportWhatsAppInputSchema>;

export async function executeSupportGrounding(): Promise<SupportGroundingFacts>;
export async function executeSupportGrounding<T>(
  builder: () => Promise<T>
): Promise<T>;
export async function executeSupportGrounding(
  builder: () => Promise<unknown> = buildSupportGroundingFacts
): Promise<unknown> {
  return await builder();
}

export function getSupportMatPrice(options: SupportMatPriceInput) {
  return {
    price: getCustomerMatPrice(options),
    currency: "TRY" as const,
  };
}

export function draftOrderSummary(input: OrderSummaryInput) {
  const price = getCustomerMatPrice({
    heelPad: input.heelPad,
    trunkMat: input.trunkMat,
  });
  const vehicle = [
    input.vehicleBrand,
    input.vehicleModel,
    input.vehicleYear,
  ]
    .filter(Boolean)
    .join(" ");
  const extras = [
    input.heelPad ? "Topuk pedi" : null,
    input.trunkMat ? "Bagaj paspası" : null,
  ].filter(Boolean);
  const draft = [
    "Merhaba OTO POLİK, aşağıdaki paspas taslağı için destek rica ediyorum:",
    `Araç: ${vehicle}`,
    `Taban rengi: ${input.floorColor}`,
    `Kenar rengi: ${input.edgeColor}`,
    `Ekstralar: ${extras.length > 0 ? extras.join(", ") : "Yok"}`,
    `Hesaplanan toplam: ${price.toLocaleString("tr-TR")} TL`,
    input.notes ? `Not: ${input.notes}` : null,
    "Bu bir sipariş değildir; taslağı kullanıcı inceleyip kendisi gönderir.",
  ]
    .filter(Boolean)
    .join("\n");

  return { draft, price, currency: "TRY" as const };
}

export function prepareWhatsAppHandoff(input: SupportWhatsAppInput) {
  return { prepared: true as const, message: input.message };
}

export const supportTools = {
  get_support_grounding: tool({
    description:
      "Canlı SSS, kargo içeriği ve mağaza ayarlarını yanıt anında getirir.",
    inputSchema: z.object({}),
    execute: async () => await executeSupportGrounding(),
  }),
  get_mat_price: tool({
    description:
      "Seçilen ekstralara göre merkezi fiyatlandırmadan güncel paspas fiyatını döndürür.",
    inputSchema: supportMatPriceInputSchema,
    execute: async (input) => getSupportMatPrice(input),
  }),
  draft_order_summary: tool({
    description:
      "Fiyatı merkezi hesaplayarak kullanıcının inceleyip göndereceği Türkçe sipariş taslağını hazırlar; sipariş oluşturmaz.",
    inputSchema: orderSummaryInputSchema,
    execute: async (input) => draftOrderSummary(input),
  }),
  prepare_whatsapp_handoff: tool({
    description:
      "İnsan desteği için kullanıcının kendisinin göndereceği WhatsApp mesajını hazırlar.",
    inputSchema: supportWhatsAppInputSchema,
    outputSchema: z.object({
      prepared: z.boolean(),
      message: z.string(),
    }),
  }),
};

export type SupportChatTools = InferUITools<typeof supportTools>;
export type SupportChatMessage = UIMessage<
  never,
  UIDataTypes,
  SupportChatTools
>;
