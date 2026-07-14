import { siteConfig } from "./site-config";
import { Product } from "./types";

const url = siteConfig.url;
const logoUrl = `${url}/media/otopolik-logo-3d.png`;

/** Organization schema — tüm sayfalarda kullanılır */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url,
    logo: logoUrl,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: "İstanbul",
      addressCountry: "TR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phoneDisplay,
      contactType: "customer service",
      availableLanguage: "Türkçe",
    },
    sameAs: [siteConfig.instagram],
  };
}

/** LocalBusiness schema — ana sayfada kullanılır */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    url,
    logo: logoUrl,
    image: logoUrl,
    description: siteConfig.description,
    telephone: siteConfig.phoneDisplay,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: "İstanbul",
      addressCountry: "TR",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: "₺₺",
  };
}

/** Product schema — ürün detay sayfasında kullanılır */
export function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    image: product.gallery.map((img) => `${url}${img}`),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
      url: `${url}/urunler/${product.slug}`,
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
export function breadcrumbListSchema(productName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Ürünler",
        item: `${url}/urunler`,
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
export function faqPageSchema(
  faqs: { q: string; a: string }[]
) {
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
