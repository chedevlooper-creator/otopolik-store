import {
  getContentPage,
  getFaqs,
  getPromos,
  getSiteSeo,
  getTestimonials,
  type ContentPage,
  type ContentSection,
  type FaqItem,
  type PromoItem,
  type SiteSeo,
  type TestimonialItem,
} from "@/lib/cms";
import {
  DEFAULT_PAGES,
  DEFAULT_SECTIONS,
} from "@/lib/cms-defaults";
import { getProducts } from "@/lib/catalog";
import { isAiConfigured } from "@/lib/ai/config";
import { isConvexConfigured } from "@/lib/convex-server";
import ContentManager from "./ContentManager";

export const dynamic = "force-dynamic";

async function loadAdminBundle() {
  const [
    { seo, source: seoSource },
    faqs,
    marquee,
    trust,
    testimonials,
    products,
  ] =
    await Promise.all([
      getSiteSeo(),
      getFaqs(),
      getPromos("marquee"),
      getPromos("trust"),
      getTestimonials(),
      getProducts(),
    ]);

  const pages: ContentPage[] = [];
  const sectionsByPage: Record<string, ContentSection[]> = {};

  for (const def of DEFAULT_PAGES) {
    const { page, sections } = await getContentPage(def.slug);
    pages.push(page ?? { ...def, isPublished: true });
    sectionsByPage[def.slug] =
      sections.length > 0
        ? sections
        : DEFAULT_SECTIONS.filter((s) => s.pageSlug === def.slug);
  }

  return {
    seo,
    seoSource,
    pages,
    sectionsByPage,
    faqs: faqs.items as FaqItem[],
    marquee: marquee.items as PromoItem[],
    trust: trust.items as PromoItem[],
    testimonials: testimonials.items as TestimonialItem[],
    products: products.map(({ slug, name }) => ({ slug, name })),
  };
}

export default async function AdminIcerikPage() {
  const data = await loadAdminBundle();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">
          İçerik Yönetimi
        </h1>
        <p className="mt-1 text-sm text-muted">
          Vitrin metinleri, SEO, yasal sayfalar, FAQ ve müşteri yorumlarını
          buradan güncelleyin. Ürün fiyatları için Ürünler sayfasını kullanın.
        </p>
      </div>

      <ContentManager
        aiAvailable={isAiConfigured() && isConvexConfigured()}
        products={data.products}
        initialSeo={data.seo as SiteSeo}
        seoSource={data.seoSource}
        pages={data.pages}
        sectionsByPage={data.sectionsByPage}
        faqs={data.faqs}
        marquee={data.marquee}
        trust={data.trust}
        testimonials={data.testimonials}
      />
    </div>
  );
}
