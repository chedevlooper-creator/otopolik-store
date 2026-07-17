import {
  tool,
  type InferUITools,
  type UIDataTypes,
  type UIMessage,
} from "ai";
import { z } from "zod";

import {
  getCustomerMatPrice,
  getCustomerVehiclePrice,
} from "@/lib/ai/customer-tools";
import { runVehicleMatch } from "@/lib/ai/vehicle-match";
import { EDGE_COLOR_NAMES, FLOOR_COLOR_NAMES } from "@/lib/mat-colors";

const floorColorNames = FLOOR_COLOR_NAMES as [
  (typeof FLOOR_COLOR_NAMES)[number],
  ...(typeof FLOOR_COLOR_NAMES)[number][],
];
const edgeColorNames = EDGE_COLOR_NAMES as [
  (typeof EDGE_COLOR_NAMES)[number],
  ...(typeof EDGE_COLOR_NAMES)[number][],
];

export const matchVehicleInputSchema = z.object({
  query: z.string().trim().min(1).max(200),
});
export const getMatPriceInputSchema = z.object({
  heelPad: z.boolean().default(false),
  trunkMat: z.boolean().default(false),
});
export const getVehiclePriceInputSchema = z.object({
  brand: z.string().trim().min(1).max(50),
  model: z.string().trim().min(1).max(80),
});
export const setVehicleInputSchema = z.object({
  brand: z.string().trim().min(1).max(50),
  model: z.string().trim().min(1).max(80),
  year: z.string().trim().max(20).optional(),
  bodyOrChassis: z.string().trim().max(80).optional(),
});
export const setFloorColorInputSchema = z.object({
  color: z.enum(floorColorNames),
});
export const setEdgeColorInputSchema = z.object({
  color: z.enum(edgeColorNames),
});
export const setExtrasInputSchema = z.object({
  heelPad: z.boolean(),
  trunkMat: z.boolean(),
});
export const addToCartInputSchema = z.object({
  confirmation: z.literal(true),
});
export const prepareWhatsAppHandoffInputSchema = z.object({
  message: z.string().trim().min(1).max(1200),
});

export async function executeMatchVehicle(
  input: z.infer<typeof matchVehicleInputSchema>
) {
  return await runVehicleMatch(input.query);
}

export const configuratorTools = {
  match_vehicle: tool({
    description:
      "Türkçe araç tarifini katalogdaki marka ve modelle eşleştirir.",
    inputSchema: matchVehicleInputSchema,
    execute: executeMatchVehicle,
  }),
  get_mat_price: tool({
    description:
      "Seçilen ekstralara göre merkezi fiyatlandırmadan paspas fiyatını döndürür.",
    inputSchema: getMatPriceInputSchema,
    execute: async ({ heelPad, trunkMat }) => ({
      price: getCustomerMatPrice({ heelPad, trunkMat }),
      currency: "TRY" as const,
    }),
  }),
  get_vehicle_price: tool({
    description: "Katalogdaki araç modelinin merkezi fiyatını döndürür.",
    inputSchema: getVehiclePriceInputSchema,
    execute: async ({ brand, model }) => ({
      price: getCustomerVehiclePrice(brand, model),
      currency: "TRY" as const,
    }),
  }),
  set_vehicle: tool({
    description:
      "Kullanıcının onayladığı aracı gerçek konfigüratör durumuna uygular.",
    inputSchema: setVehicleInputSchema,
    outputSchema: z.object({ applied: z.boolean() }),
  }),
  set_floor_color: tool({
    description:
      "Kullanıcının seçtiği taban rengini gerçek konfigüratöre uygular.",
    inputSchema: setFloorColorInputSchema,
    outputSchema: z.object({ applied: z.boolean() }),
  }),
  set_edge_color: tool({
    description:
      "Kullanıcının seçtiği kenar rengini gerçek konfigüratöre uygular.",
    inputSchema: setEdgeColorInputSchema,
    outputSchema: z.object({ applied: z.boolean() }),
  }),
  set_extras: tool({
    description:
      "Topuk pedi ve bagaj paspası seçimlerini gerçek konfigüratöre uygular.",
    inputSchema: setExtrasInputSchema,
    outputSchema: z.object({ applied: z.boolean() }),
  }),
  add_to_cart: tool({
    description:
      "Onaydan sonra mevcut gerçek konfigürasyonu gerçek sepete ekleme niyeti oluşturur. Fiyat kabul etmez.",
    inputSchema: addToCartInputSchema,
    outputSchema: z.object({ added: z.boolean(), price: z.number() }),
  }),
  prepare_whatsapp_handoff: tool({
    description:
      "Kullanıcının kendisinin göndereceği WhatsApp taslağını hazırlar; sipariş vermez.",
    inputSchema: prepareWhatsAppHandoffInputSchema,
    outputSchema: z.object({ prepared: z.boolean() }),
  }),
};

export type ConfiguratorChatTools = InferUITools<typeof configuratorTools>;
export type ConfiguratorChatMessage = UIMessage<
  never,
  UIDataTypes,
  ConfiguratorChatTools
>;
