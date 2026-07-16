import type { Metadata } from "next";
import Image from "next/image";
import { getContentPage, getSiteSeo, interpolateCmsText } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getContentPage("hakkimizda");
  return {
    title: page?.metaTitle ?? "Hakkımızda",
    description: page?.metaDescription,
  };
}

export default async function AboutPage() {
  const [{ page, sections }, { seo }] = await Promise.all([
    getContentPage("hakkimizda"),
    getSiteSeo(),
  ]);
  const kicker = sections.find((s) => s.sectionKey === "kicker");
  const image = sections.find((s) => s.sectionKey === "image");
  const paragraphs = sections
    .filter((s) => s.sectionKey.startsWith("p"))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:py-20">
      <span className="section-kicker">{kicker?.title ?? "Hakkımızda"}</span>
      <h1 className="mt-5 font-heading text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
        {page?.title ?? "Aracınız için üstün koruma"}
      </h1>
      <div className="relative mt-8 aspect-[16/9] overflow-hidden border border-border">
        <Image
          src={image?.imageUrl ?? "/media/eva-rear-black.png"}
          alt={image?.imageAlt ?? "OTO POLİK EVA paspas"}
          fill
          className="object-cover"
        />
      </div>
      <div className="mt-8 max-w-none space-y-5 leading-relaxed text-foreground/80">
        {paragraphs.map((p) => (
          <p key={p.sectionKey}>
            {interpolateCmsText(p.body, { siteName: seo.siteName })}
          </p>
        ))}
      </div>
    </div>
  );
}
