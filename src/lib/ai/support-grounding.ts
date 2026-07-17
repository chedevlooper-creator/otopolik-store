import { interpolateCmsText } from "@/lib/cms-defaults";
import type {
  ContentPage,
  ContentSection,
  FaqItem,
} from "@/lib/cms-defaults";
import type { SiteSettings } from "@/lib/site-settings";

export type SupportGroundingDependencies = {
  getFaqs: () => Promise<{
    items: FaqItem[];
    source: "convex" | "fallback";
  }>;
  getContentPage: (slug: string) => Promise<{
    page: ContentPage | null;
    sections: ContentSection[];
    source: "convex" | "fallback";
  }>;
  getStoreSettings: () => Promise<SiteSettings>;
};

export type SupportGroundingFacts = {
  sources: {
    faqs: "convex" | "fallback";
    shipping: "convex" | "fallback";
  };
  faqs: Array<Pick<FaqItem, "question" | "answer">>;
  shippingSections: Array<
    Pick<
      ContentSection,
      "sectionKey" | "eyebrow" | "title" | "subtitle" | "body"
    >
  >;
  settings: Pick<
    SiteSettings,
    | "phoneDisplay"
    | "whatsappNumber"
    | "freeShippingThreshold"
    | "shippingFee"
    | "estimatedDispatch"
    | "businessHours"
  >;
};

async function getDefaultDependencies(): Promise<SupportGroundingDependencies> {
  const [cms, siteSettings] = await Promise.all([
    import("@/lib/cms"),
    import("@/lib/site-settings"),
  ]);
  return {
    getFaqs: cms.getFaqs,
    getContentPage: cms.getContentPage,
    getStoreSettings: siteSettings.getStoreSettings,
  };
}

export async function buildSupportGroundingFacts(
  providedDependencies?: SupportGroundingDependencies
): Promise<SupportGroundingFacts> {
  const dependencies =
    providedDependencies ?? (await getDefaultDependencies());
  const [faqResult, shippingResult, settings] = await Promise.all([
    dependencies.getFaqs(),
    dependencies.getContentPage("kargo"),
    dependencies.getStoreSettings(),
  ]);
  const tokens = {
    freeShippingThreshold: settings.freeShippingThreshold,
    shippingFee: settings.shippingFee,
    estimatedDispatch: settings.estimatedDispatch,
    phoneDisplay: settings.phoneDisplay,
  };

  return {
    sources: {
      faqs: faqResult.source,
      shipping: shippingResult.source,
    },
    faqs: faqResult.items.map(({ question, answer }) => ({
      question: interpolateCmsText(question, tokens),
      answer: interpolateCmsText(answer, tokens),
    })),
    shippingSections: shippingResult.sections.map(
      ({ sectionKey, eyebrow, title, subtitle, body }) => ({
        sectionKey,
        eyebrow: eyebrow ? interpolateCmsText(eyebrow, tokens) : undefined,
        title: title ? interpolateCmsText(title, tokens) : undefined,
        subtitle: subtitle
          ? interpolateCmsText(subtitle, tokens)
          : undefined,
        body: interpolateCmsText(body, tokens),
      })
    ),
    settings: {
      phoneDisplay: settings.phoneDisplay,
      whatsappNumber: settings.whatsappNumber,
      freeShippingThreshold: settings.freeShippingThreshold,
      shippingFee: settings.shippingFee,
      estimatedDispatch: settings.estimatedDispatch,
      businessHours: settings.businessHours,
    },
  };
}
