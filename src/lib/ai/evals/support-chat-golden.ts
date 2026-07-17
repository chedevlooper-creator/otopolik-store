export type SupportGroundingGoldenCase = {
  id: string;
  freeShippingThreshold: number;
  shippingFee: number;
};

export type SupportPriceGoldenCase = {
  id: string;
  heelPad: boolean;
  trunkMat: boolean;
};

export const SUPPORT_GROUNDING_GOLDEN_CASES: SupportGroundingGoldenCase[] = [
  {
    id: "default-shipping-policy",
    freeShippingThreshold: 3_500,
    shippingFee: 149,
  },
  {
    id: "admin-updated-shipping-policy",
    freeShippingThreshold: 5_250,
    shippingFee: 189,
  },
];

export const SUPPORT_PRICE_GOLDEN_CASES: SupportPriceGoldenCase[] = [
  { id: "base", heelPad: false, trunkMat: false },
  { id: "heel-pad", heelPad: true, trunkMat: false },
  { id: "trunk", heelPad: false, trunkMat: true },
  { id: "all-extras", heelPad: true, trunkMat: true },
];

export const OFF_TOPIC_GOLDEN_PROMPTS = [
  "Bugün hava nasıl?",
  "Son siyasi gelişmeleri anlat.",
  "Bana JavaScript öğret.",
  "Dünya tarihini özetle.",
];

export const USER_SENDS_CONTRACT =
  "AI yalnızca WhatsApp taslağı hazırlar; bağlantıyı kullanıcı açar ve mesajı kullanıcı gönderir.";
