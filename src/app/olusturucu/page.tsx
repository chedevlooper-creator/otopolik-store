import type { Metadata } from "next";
import MatConfigurator from "@/components/configurator/MatConfigurator";

export const metadata: Metadata = {
  title: "Online Paspas Oluşturucu",
  description:
    "Aracınıza özel EVA paspasınızı online tasarlayın: taban rengi, kenar rengi ve topuk pedini seçin, ekranda anında görün.",
};

export default async function ConfiguratorPage({
  searchParams,
}: {
  searchParams: Promise<{ marka?: string; model?: string; yil?: string }>;
}) {
  const { marka = "", model = "" } = await searchParams;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <div className="premium-grid mb-10 max-w-4xl rounded-[1.7rem] border border-white/8 bg-surface/45 p-6 sm:p-9">
        <span className="spec-label">Online Paspas Oluşturucu</span>
        <h1 className="mt-4 font-heading text-4xl font-bold text-white sm:text-6xl">
          Kendi Paspasını Tasarla
        </h1>
        <p className="mt-3 text-muted">
          Aracınızı seçin, taban ve kenar rengini belirleyin, topuk pedi ve
          bagaj paspası ekleyin. Renk seçiminiz ekranda örnek kombinasyon
          olarak canlanır, dakikalar içinde siparişinizi oluşturabilirsiniz.
        </p>
      </div>
      <MatConfigurator initialBrand={marka} initialModel={model} />
    </div>
  );
}
