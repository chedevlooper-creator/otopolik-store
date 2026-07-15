import type { Metadata } from "next";
import MatConfigurator from "@/components/configurator/MatConfigurator";
import { getContentPage } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getContentPage("olusturucu");
  return {
    title: page?.metaTitle ?? "Online Paspas Oluşturucu",
    description: page?.metaDescription,
  };
}

export default async function ConfiguratorPage({
  searchParams,
}: {
  searchParams: Promise<{ marka?: string; model?: string; yil?: string }>;
}) {
  const { marka = "", model = "" } = await searchParams;
  const { page, sections } = await getContentPage("olusturucu");
  const kicker = sections.find((s) => s.sectionKey === "kicker");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <div className="premium-grid mb-10 max-w-4xl rounded-[1.7rem] border border-white/8 bg-surface/45 p-6 sm:p-9">
        <span className="spec-label">{kicker?.title ?? "Online Paspas Oluşturucu"}</span>
        <h1 className="mt-4 font-heading text-4xl font-bold text-white sm:text-6xl">
          {page?.title ?? "Kendi Paspasını Tasarla"}
        </h1>
        <p className="mt-3 text-muted">
          {page?.description ??
            "Aracınızı seçin, taban ve kenar rengini belirleyin, topuk pedi ve bagaj paspası ekleyin."}
        </p>
      </div>
      <MatConfigurator initialBrand={marka} initialModel={model} />
    </div>
  );
}
