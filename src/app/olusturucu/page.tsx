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
  searchParams: Promise<{
    marka?: string;
    model?: string;
    yil?: string;
    kasa?: string;
  }>;
}) {
  const { marka = "", model = "", yil = "", kasa = "" } = await searchParams;
  const { page, sections } = await getContentPage("olusturucu");
  const kicker = sections.find((s) => s.sectionKey === "kicker");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <div className="mb-10 max-w-3xl border border-white/[0.04] bg-transparent p-6 sm:p-9">
        <span className="section-kicker">{kicker?.title ?? "Online paspas oluşturucu"}</span>
        <h1 className="mt-5 font-heading text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
          {page?.title ?? "Kendi paspasını tasarla"}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">
          {page?.description ??
            "Aracınızı seçin, taban ve kenar rengini belirleyin, topuk pedi ve bagaj paspası ekleyin."}
        </p>
      </div>
      <MatConfigurator
        initialBrand={marka}
        initialModel={model}
        initialYear={yil}
        initialBodyOrChassis={kasa}
      />
    </div>
  );
}
