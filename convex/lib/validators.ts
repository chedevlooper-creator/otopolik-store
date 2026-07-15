import { v } from "convex/values";

export const productColorValidator = v.object({
  name: v.string(),
  hex: v.string(),
  image: v.optional(v.string()),
});

export const productCompatibilityValidator = v.object({
  yearRange: v.string(),
  bodyOrChassis: v.string(),
  note: v.string(),
});

export const productCategoryValidator = v.union(
  v.literal("eva-3d"),
  v.literal("eva-havuzlu"),
  v.literal("hali-paspas"),
  v.literal("bagaj"),
  v.literal("bagaj-havuzu"),
  v.literal("bagaj-cantasi"),
  v.literal("direksiyon-kilifi"),
  v.literal("minder-seti"),
  v.literal("ekran-koruyucu")
);

export const productDocValidator = v.object({
  _id: v.id("products"),
  _creationTime: v.number(),
  slug: v.string(),
  name: v.string(),
  brand: v.string(),
  model: v.string(),
  category: productCategoryValidator,
  price: v.number(),
  oldPrice: v.optional(v.number()),
  image: v.string(),
  gallery: v.array(v.string()),
  colors: v.array(productColorValidator),
  description: v.string(),
  features: v.array(v.string()),
  compatibility: productCompatibilityValidator,
  setContents: v.array(v.string()),
  optionalExtras: v.array(v.string()),
  dispatchEstimate: v.string(),
  badge: v.optional(v.string()),
  metaTitle: v.optional(v.string()),
  metaDescription: v.optional(v.string()),
  inStock: v.boolean(),
  isActive: v.boolean(),
  createdAt: v.number(),
  updatedAt: v.number(),
});

export const paymentMethodValidator = v.union(
  v.literal("whatsapp"),
  v.literal("kapida")
);

export const orderStatusValidator = v.union(
  v.literal("pending"),
  v.literal("confirmed"),
  v.literal("production"),
  v.literal("shipped"),
  v.literal("delivered"),
  v.literal("cancelled"),
  v.literal("whatsapp_pending")
);

export const orderItemValidator = v.object({
  slug: v.string(),
  name: v.string(),
  price: v.number(),
  quantity: v.number(),
  color: v.optional(v.string()),
  image: v.optional(v.string()),
  configuration: v.optional(
    v.object({
      vehicle: v.optional(v.string()),
      baseColor: v.optional(v.string()),
      edgeColor: v.optional(v.string()),
      heelPad: v.optional(v.boolean()),
      trunkMat: v.optional(v.boolean()),
    })
  ),
});

export const orderDocValidator = v.object({
  _id: v.id("orders"),
  _creationTime: v.number(),
  customerName: v.string(),
  customerPhone: v.string(),
  customerEmail: v.optional(v.string()),
  city: v.optional(v.string()),
  address: v.optional(v.string()),
  items: v.array(orderItemValidator),
  subtotal: v.number(),
  shippingFee: v.number(),
  total: v.number(),
  paymentMethod: v.optional(paymentMethodValidator),
  status: orderStatusValidator,
  notes: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

export const siteSettingsDocValidator = v.object({
  _id: v.id("siteSettings"),
  _creationTime: v.number(),
  singleton: v.literal("site"),
  phoneDisplay: v.string(),
  whatsappNumber: v.string(),
  email: v.string(),
  address: v.string(),
  instagram: v.string(),
  freeShippingThreshold: v.number(),
  shippingFee: v.number(),
  estimatedDispatch: v.string(),
  businessHours: v.string(),
  matBasePrice: v.number(),
  matHeelPadPrice: v.number(),
  matTrunkPrice: v.number(),
  updatedAt: v.number(),
});

export const siteSeoDocValidator = v.object({
  _id: v.id("siteSeo"),
  _creationTime: v.number(),
  singleton: v.literal("seo"),
  siteName: v.string(),
  tagline: v.string(),
  defaultDescription: v.string(),
  siteUrl: v.string(),
  defaultOgImage: v.string(),
  locale: v.string(),
  titleTemplate: v.string(),
  ogImageAlt: v.string(),
  updatedAt: v.number(),
});

export const pageTypeValidator = v.union(
  v.literal("marketing"),
  v.literal("legal"),
  v.literal("utility")
);

export const contentPageDocValidator = v.object({
  _id: v.id("contentPages"),
  _creationTime: v.number(),
  slug: v.string(),
  path: v.string(),
  pageType: pageTypeValidator,
  metaTitle: v.string(),
  metaDescription: v.string(),
  title: v.string(),
  description: v.string(),
  isPublished: v.boolean(),
  sortOrder: v.number(),
  updatedAt: v.number(),
});

export const contentSectionDocValidator = v.object({
  _id: v.id("contentSections"),
  _creationTime: v.number(),
  pageSlug: v.string(),
  sectionKey: v.string(),
  sortOrder: v.number(),
  eyebrow: v.optional(v.string()),
  title: v.optional(v.string()),
  subtitle: v.optional(v.string()),
  body: v.string(),
  ctaLabel: v.optional(v.string()),
  ctaHref: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  imageAlt: v.optional(v.string()),
  iconKey: v.optional(v.string()),
  isPublished: v.boolean(),
  updatedAt: v.number(),
});

export const faqItemDocValidator = v.object({
  _id: v.id("faqItems"),
  _creationTime: v.number(),
  sortOrder: v.number(),
  question: v.string(),
  answer: v.string(),
  isPublished: v.boolean(),
  updatedAt: v.number(),
});

export const promoKindValidator = v.union(
  v.literal("marquee"),
  v.literal("trust"),
  v.literal("header_badge"),
  v.literal("footer_cta")
);

export const promoItemDocValidator = v.object({
  _id: v.id("promoItems"),
  _creationTime: v.number(),
  kind: promoKindValidator,
  sortOrder: v.number(),
  label: v.string(),
  detail: v.optional(v.string()),
  href: v.optional(v.string()),
  iconKey: v.optional(v.string()),
  isPublished: v.boolean(),
  updatedAt: v.number(),
});

export const testimonialDocValidator = v.object({
  _id: v.id("testimonials"),
  _creationTime: v.number(),
  sortOrder: v.number(),
  name: v.string(),
  location: v.string(),
  rating: v.number(),
  text: v.string(),
  isPublished: v.boolean(),
  updatedAt: v.number(),
});
