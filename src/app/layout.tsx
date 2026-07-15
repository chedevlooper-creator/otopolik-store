import type { Metadata } from "next";
import { Barlow_Condensed, Barlow, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { SettingsProvider } from "@/context/settings-context";
import { CmsProvider } from "@/context/cms-context";
import { getStoreSettings } from "@/lib/site-settings";
import { getProducts } from "@/lib/catalog";
import {
  getHomeChromeContent,
  getPromos,
  getSiteSeo,
  interpolateCmsText,
} from "@/lib/cms";
import { CatalogProvider } from "@/context/catalog-context";
import {
  organizationSchema,
  localBusinessSchema,
  renderJsonLd,
} from "@/lib/structured-data";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const barlow = Barlow({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-spec",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteSeo();
  return {
    metadataBase: new URL(seo.siteUrl),
    title: {
      default: `${seo.siteName} | ${seo.tagline}`,
      template: seo.titleTemplate,
    },
    description: seo.defaultDescription,
    openGraph: {
      type: "website",
      locale: seo.locale,
      siteName: seo.siteName,
      title: `${seo.siteName} | ${seo.tagline}`,
      description: seo.defaultDescription,
      images: [
        {
          url: seo.defaultOgImage,
          width: 1200,
          height: 630,
          alt: seo.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${seo.siteName} | ${seo.tagline}`,
      description: seo.defaultDescription,
      images: [seo.defaultOgImage],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getStoreSettings();
  const products = await getProducts();
  const [{ seo }, chrome, marquee, trust] = await Promise.all([
    getSiteSeo(),
    getHomeChromeContent(),
    getPromos("marquee"),
    getPromos("trust"),
  ]);

  const tokens = {
    siteName: seo.siteName,
    freeShippingThreshold: settings.freeShippingThreshold,
    shippingFee: settings.shippingFee,
    estimatedDispatch: settings.estimatedDispatch,
    phoneDisplay: settings.phoneDisplay,
    email: settings.email,
    address: settings.address,
  };

  const header = chrome.header
    ? {
        ...chrome.header,
        title: chrome.header.title
          ? interpolateCmsText(chrome.header.title, tokens)
          : chrome.header.title,
        body: interpolateCmsText(chrome.header.body, tokens),
      }
    : null;

  const footer = chrome.footer
    ? {
        ...chrome.footer,
        title: chrome.footer.title
          ? interpolateCmsText(chrome.footer.title, tokens)
          : chrome.footer.title,
        body: interpolateCmsText(chrome.footer.body, tokens),
        subtitle: chrome.footer.subtitle
          ? interpolateCmsText(chrome.footer.subtitle, tokens)
          : chrome.footer.subtitle,
      }
    : null;

  return (
    <html
      lang="tr"
      className={`${barlowCondensed.variable} ${barlow.variable} ${plexMono.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <ConvexClientProvider>
          <SettingsProvider settings={settings}>
            <CmsProvider
              value={{
                seo,
                header,
                footer,
                marquee: marquee.items.map((item) => ({
                  ...item,
                  label: interpolateCmsText(item.label, tokens),
                })),
                trust: trust.items,
              }}
            >
              <CatalogProvider products={products}>
                <SiteChrome>{children}</SiteChrome>
              </CatalogProvider>
            </CmsProvider>
          </SettingsProvider>
        </ConvexClientProvider>
        {renderJsonLd(
          organizationSchema({
            name: seo.siteName,
            url: seo.siteUrl,
            description: seo.defaultDescription,
            address: settings.address,
            phoneDisplay: settings.phoneDisplay,
            email: settings.email,
            instagram: settings.instagram,
          }),
          localBusinessSchema({
            name: seo.siteName,
            url: seo.siteUrl,
            description: seo.defaultDescription,
            address: settings.address,
            phoneDisplay: settings.phoneDisplay,
            email: settings.email,
            instagram: settings.instagram,
          })
        )}
      </body>
    </html>
  );
}
