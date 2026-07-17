import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoreSettings } from "@/lib/site-settings";
import { getContentPage, getSiteSeo, interpolateCmsText } from "@/lib/cms";
import { DEFAULT_PAGES } from "@/lib/cms-defaults";

export const dynamic = "force-dynamic";

const LEGAL_SLUGS = DEFAULT_PAGES.filter((p) => p.pageType === "legal").map(
  (p) => p.slug
);

export function generateStaticParams() {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { page } = await getContentPage(slug);
  if (!page) return {};
  return { title: page.metaTitle, description: page.metaDescription };
}

export default async function InfoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!LEGAL_SLUGS.includes(slug)) notFound();

  const [{ page, sections }, settings, { seo }] = await Promise.all([
    getContentPage(slug),
    getStoreSettings(),
    getSiteSeo(),
  ]);

  if (!page) notFound();

  const tokens = {
    siteName: seo.siteName,
    freeShippingThreshold: settings.freeShippingThreshold,
    shippingFee: settings.shippingFee,
    estimatedDispatch: settings.estimatedDispatch,
    phoneDisplay: settings.phoneDisplay,
    email: settings.email,
    address: settings.address,
  };

  const bodySections = sections
    .filter((s) => s.sectionKey.startsWith("s"))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
      <span className="section-kicker">Bilgilendirme</span>
      <h1 className="mt-5 font-heading text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
        {page.title}
      </h1>
      <p className="section-copy mt-4">
        {interpolateCmsText(page.description, tokens)}
      </p>
      <div className="mt-10 space-y-8">
        {bodySections.map((section) => (
          <section key={section.sectionKey}>
            <h2 className="font-heading text-xl font-bold text-white">
              {section.title}
            </h2>
            <p className="mt-2 text-sm leading-7 text-foreground/80">
              {interpolateCmsText(section.body, tokens)}
            </p>
          </section>
        ))}
      </div>
      <p className="mt-12 text-sm text-muted">
        Sorularınız için{" "}
        <Link href="/iletisim" className="font-semibold text-white hover:underline">
          iletişim
        </Link>{" "}
        sayfasını kullanabilirsiniz.
      </p>
    </div>
  );
}
