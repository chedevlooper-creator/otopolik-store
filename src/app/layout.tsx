import type { Metadata } from "next";
import { Barlow_Condensed, Barlow, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { siteConfig } from "@/lib/site-config";
import {
  organizationSchema,
  localBusinessSchema,
  renderJsonLd,
} from "@/lib/structured-data";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
});

const barlow = Barlow({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-spec",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: "/media/hero-poster.jpg", width: 1920, height: 1080 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/media/hero-poster.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${barlowCondensed.variable} ${barlow.variable} ${plexMono.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <ConvexClientProvider>
          <SiteChrome>{children}</SiteChrome>
        </ConvexClientProvider>
        {renderJsonLd(organizationSchema(), localBusinessSchema())}
      </body>
    </html>
  );
}
