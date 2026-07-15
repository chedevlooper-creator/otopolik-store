"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { ContentSection, PromoItem, SiteSeo } from "@/lib/cms-defaults";
import { DEFAULT_SITE_SEO, getDefaultPromos, getDefaultSection } from "@/lib/cms-defaults";

export type CmsChrome = {
  seo: SiteSeo;
  header: ContentSection | null;
  footer: ContentSection | null;
  marquee: PromoItem[];
  trust: PromoItem[];
};

const DEFAULT_CHROME: CmsChrome = {
  seo: DEFAULT_SITE_SEO,
  header: getDefaultSection("home", "chrome-header"),
  footer: getDefaultSection("home", "chrome-footer"),
  marquee: getDefaultPromos("marquee"),
  trust: getDefaultPromos("trust"),
};

const CmsContext = createContext<CmsChrome>(DEFAULT_CHROME);

export function CmsProvider({
  value,
  children,
}: {
  value: CmsChrome;
  children: ReactNode;
}) {
  const memo = useMemo(() => value, [value]);
  return <CmsContext.Provider value={memo}>{children}</CmsContext.Provider>;
}

export function useCmsChrome(): CmsChrome {
  return useContext(CmsContext);
}
