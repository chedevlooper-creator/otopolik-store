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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Premium Red Glow Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-[50%] top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--red-hot)]/10 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-24 sm:py-32">
        <div className="reveal mb-4 inline-flex items-center rounded-full border border-[var(--red-hot)]/25 bg-[var(--red-hot)]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--red-hot)]">
          Bilgilendirme
        </div>
        <h1 className="reveal mt-2 font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {page.title}
        </h1>
        <p className="reveal mt-6 text-lg leading-8 text-white/60">
          {interpolateCmsText(page.description, tokens)}
        </p>

        <div className="reveal-stagger mt-16 space-y-12">
          {bodySections.map((section) => (
            <section key={section.sectionKey} className="reveal group rounded-[var(--r-card)] border border-white/5 bg-white/[0.02] p-8 transition-colors duration-300 hover:border-[var(--red-hot)]/25 hover:bg-white/[0.04]">
              <h2 className="font-heading text-xl font-bold tracking-tight text-white sm:text-2xl">
                {section.title}
              </h2>
              <div className="mt-4 h-px w-12 bg-[var(--red-hot)]/50 transition-all duration-300 group-hover:w-24 group-hover:bg-[var(--red-hot)]" />
              <p className="mt-6 text-base leading-7 text-white/60">
                {interpolateCmsText(section.body, tokens)}
              </p>
            </section>
          ))}
        </div>

        <div className="reveal mt-16 rounded-[var(--r-card)] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
          <p className="text-sm text-white/60">
            Daha fazla sorunuz mu var?{" "}
            <Link href="/destek" className="font-semibold text-white transition-colors hover:text-[var(--red-hot)]">
              Destek ekibimizle iletişime geçin.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
