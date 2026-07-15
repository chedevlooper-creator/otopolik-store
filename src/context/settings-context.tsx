"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { SiteSettings } from "@/lib/site-settings";
import { siteConfig } from "@/lib/site-config";

const FALLBACK: SiteSettings = {
  phoneDisplay: siteConfig.phoneDisplay,
  whatsappNumber: siteConfig.whatsappNumber,
  email: siteConfig.email,
  address: siteConfig.address,
  instagram: siteConfig.instagram,
  freeShippingThreshold: siteConfig.freeShippingThreshold,
  shippingFee: siteConfig.shippingFee,
  estimatedDispatch: siteConfig.estimatedDispatch,
  businessHours: siteConfig.businessHours,
  matBasePrice: siteConfig.matBasePrice,
  matHeelPadPrice: siteConfig.matHeelPadPrice,
  matTrunkPrice: siteConfig.matTrunkPrice,
};

const SettingsContext = createContext<SiteSettings>(FALLBACK);

export function SettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: ReactNode;
}) {
  const value = useMemo(() => settings, [settings]);
  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useStoreSettings(): SiteSettings {
  return useContext(SettingsContext);
}

export { buildWhatsAppLink } from "@/lib/whatsapp";
