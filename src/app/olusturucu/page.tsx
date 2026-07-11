import type { Metadata } from "next";
import MatConfigurator from "@/components/configurator/MatConfigurator";

export const metadata: Metadata = {
  title: "Online Paspas Oluşturucu",
  description:
    "Aracınıza özel EVA paspasınızı online tasarlayın: taban rengi, kenar rengi ve topuk pedini seçin, canlı önizlemeyle anında görün.",
};

export default function ConfiguratorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <div className="mb-10 max-w-2xl">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
          Online Paspas Oluşturucu
        </span>
        <h1 className="font-heading mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Kendi Paspasını Tasarla
        </h1>
        <p className="mt-3 text-neutral-400">
          Aracınızı seçin, taban ve kenar rengini belirleyin, topuk pedi ve
          bagaj paspası ekleyin. Tasarımınızı canlı önizlemede anında görün,
          dakikalar içinde sipariş verin.
        </p>
      </div>
      <MatConfigurator />
    </div>
  );
}
