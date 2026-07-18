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
  }>;
}) {
  const { marka = "", model = "", yil = "", kasa = "" } = await searchParams;
  const { page, sections } = await getContentPage("olusturucu");
  const kicker = sections.find((s) => s.sectionKey === "kicker");
  const aiEnabled = isCustomerAiUiEnabled();
  const ConfiguratorChat = aiEnabled
    ? (await import("@/components/configurator/ConfiguratorChat")).default
    : null;

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="mb-10 max-w-3xl border border-white/5 bg-black/40 p-6 sm:p-9 rounded-2xl backdrop-blur-md">
          <span className="section-kicker">{kicker?.title ?? "Online paspas oluşturucu"}</span>
          <h1 className="mt-5 font-heading text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
            {page?.title ?? "Kendi paspasını tasarla"}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">
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
      >
        {ConfiguratorChat ? <ConfiguratorChat /> : null}
        <MatConfigurator aiEnabled={aiEnabled} />
      </ConfiguratorAssistantProvider>
    </div>
    </div>
  );
}
