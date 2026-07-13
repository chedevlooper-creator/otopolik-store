import type { Metadata } from "next";
import MatConfigurator from "@/components/configurator/MatConfigurator";

export const metadata: Metadata = {
  title: "Online Paspas Oluşturucu",
  description:
    "Aracınıza özel EVA paspasınızı online tasarlayın: taban rengi, kenar rengi ve topuk pedini seçin, ekranda anında görün.",
};

export default function ConfiguratorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <div className="mb-10 max-w-2xl">
        <span className="spec-label">Online Paspas Oluşturucu</span>
        <h1 className="mt-4 font-heading text-4xl font-bold text-white sm:text-5xl">
          Kendi Paspasını Tasarla
        </h1>
        <p className="mt-3 text-muted">
          Aracınızı seçin, taban ve kenar rengini belirleyin, topuk pedi ve
          bagaj paspası ekleyin. Renk seçiminiz ekranda örnek kombinasyon
          olarak canlanır, dakikalar içinde siparişinizi oluşturabilirsiniz.
        </p>
      </div>
      <MatConfigurator />
    </div>
  );
}
