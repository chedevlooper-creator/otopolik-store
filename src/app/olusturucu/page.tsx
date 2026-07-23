import type { Metadata } from "next";
import MatConfigurator from "@/components/configurator/MatConfigurator";
import { ConfiguratorAssistantProvider } from "@/components/configurator/ConfiguratorAssistantProvider";
import { getContentPage } from "@/lib/cms";
import { isCustomerAiUiEnabled } from "@/lib/storefront-flags";

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
    taban?: string;
    kenar?: string;
  }>;
}) {
  const { marka = "", model = "", yil = "", kasa = "", taban = "", kenar = "" } = await searchParams;
  const { page, sections } = await getContentPage("olusturucu");
  const kicker = sections.find((s) => s.sectionKey === "kicker");
  const aiEnabled = isCustomerAiUiEnabled();
  const ConfiguratorChat = aiEnabled
    ? (await import("@/components/configurator/ConfiguratorChat")).default
    : null;

  return (
    <div className="relative min-h-screen bg-black">
      {/* 8K Premium EVA Background */}
      <div
        className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity grayscale"
        style={{
          backgroundImage: "url('/media/configurator-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />
      {/* Gradient Overlays for HUD feel */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:py-20">
        <div className="mb-16 flex flex-col items-center text-center">
          <span className="section-kicker mb-4">{kicker?.title ?? "Online paspas oluşturucu"}</span>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-gradient-white sm:text-5xl lg:text-6xl mb-4">
            {page?.title ?? "Kendi paspasını tasarla"}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
            {page?.description ??
              "Aracınızı seçin, taban ve kenar rengini belirleyin, topuk pedi ve bagaj paspası ekleyin."}
          </p>
        </div>
      <ConfiguratorAssistantProvider
        initialConfiguration={{
          brand: marka,
          model,
          year: yil,
          bodyOrChassis: kasa,
        }}
        initialFloor={taban}
        initialEdge={kenar}
      >
        {ConfiguratorChat ? <ConfiguratorChat /> : null}
        <MatConfigurator aiEnabled={aiEnabled} />
      </ConfiguratorAssistantProvider>
    </div>
    </div>
  );
}
