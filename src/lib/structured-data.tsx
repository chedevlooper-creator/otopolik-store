import { siteConfig } from "./site-config";
import { Product } from "./types";

type OrgInput = {
  name?: string;
  url?: string;
  description?: string;
  address?: string;
  phoneDisplay?: string;
  email?: string;
  instagram?: string;
};

function resolveOrg(input?: OrgInput) {
  return {
    name: input?.name ?? siteConfig.name,
    url: input?.url ?? siteConfig.url,
    description: input?.description ?? siteConfig.description,
    address: input?.address ?? siteConfig.address,
    phoneDisplay: input?.phoneDisplay ?? siteConfig.phoneDisplay,
    email: input?.email ?? siteConfig.email,
    instagram: input?.instagram ?? siteConfig.instagram,
  };
}

/** Organization schema — tüm sayfalarda kullanılır */
export function organizationSchema(input?: OrgInput) {
  const org = resolveOrg(input);
  const logoUrl = `${org.url}/media/otopolik-logo-3d.png`;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.name,
    url: org.url,
    logo: logoUrl,
    description: org.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: org.address,
      addressLocality: "İstanbul",
      addressCountry: "TR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: org.phoneDisplay,
      contactType: "customer service",
      availableLanguage: "Türkçe",
    },
    sameAs: [org.instagram],
  };
}

/** LocalBusiness schema — ana sayfada kullanılır */
export function localBusinessSchema(input?: OrgInput) {
  const org = resolveOrg(input);
  const logoUrl = `${org.url}/media/otopolik-logo-3d.png`;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: org.name,
    url: org.url,
    logo: logoUrl,
    image: logoUrl,
    description: org.description,
    telephone: org.phoneDisplay,
    email: org.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: org.address,
      addressLocality: "İstanbul",
      addressCountry: "TR",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: "₺₺",
  };
}

/** Product schema — ürün detay sayfasında kullanılır */
export function productSchema(product: Product, siteUrl = siteConfig.url) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    image: product.gallery.map((img) =>
      img.startsWith("http") ? img : `${siteUrl}${img}`
    ),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/urunler/${product.slug}`,
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "TR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY",
          },
        },
      },
    },
  };
}

/** BreadcrumbList schema — ürün detay sayfasında kullanılır */
export function breadcrumbListSchema(
  productName: string,
  siteUrl = siteConfig.url
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Ürünler",
        item: `${siteUrl}/urunler`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: productName,
      },
    ],
  };
}

/** FAQPage schema — ana sayfa SSS bölümünde kullanılır */
export function faqPageSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

/** Birden çok schema'yı birleştirip script tag'i için JSON string döndürür */
export function renderJsonLd(...schemas: Record<string, unknown>[]) {
  return schemas.map((schema) => (
    <script
      key={schema["@type"] as string}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  ));
}
