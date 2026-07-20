"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import VehicleSelector from "./VehicleSelector";
import ColorPicker from "./ColorPicker";
import ExtrasSelector from "./ExtrasSelector";
import ConfigSummary from "./ConfigSummary";
import { useCart } from "@/context/cart-context";
import { MAT_PRICING } from "@/lib/mat-pricing";
import { EDGE_COLORS, FLOOR_COLORS } from "@/lib/mat-colors";
import {
  getMatPreview,
  MAT_PREVIEW_IMAGES,
} from "@/lib/configurator-cart-item";
import { PaletteIcon, RulerIcon, TruckIcon, PlayIcon } from "lucide-react";
import { GALLERY_ITEMS } from "@/lib/gallery-media";
import GalleryLightbox from "@/components/GalleryLightbox";
import { formatPrice } from "@/lib/format";
import FlatMatPreview from "./FlatMatPreview";
import { useConfiguratorAssistant } from "./ConfiguratorAssistantProvider";

// Select a stable mix of 12 items for the configurator sidebar to show real applications
const CONFIGURATOR_GALLERY_ITEMS = GALLERY_ITEMS.slice(10, 22);

type Props = {
  aiEnabled?: boolean;
};

export default function MatConfigurator({
  aiEnabled = false,
}: Props) {
  const { addItem, closeDrawer } = useCart();
  const {
    vehicle,
    setVehicle,
    floor,
    edge,
    heelPad,
    setHeelPad,
    trunkMat,
    setTrunkMat,
    quality,
    setQuality,
    logoCount,
    setLogoCount,
    bagSize,
    setBagSize,
    vehicleComplete,
    vehicleLabel,
    totalPrice,
    currentStep,
    selectFloor,
    selectEdge,
    buildCartItem,
  } = useConfiguratorAssistant();
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState<"flat" | "cabin">("flat");
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const previewKey = `${floor.name}|${edge.name}`;
  const preview = getMatPreview(floor, edge);
  const hasExactPreview = previewKey in MAT_PREVIEW_IMAGES;

  const configSummary = [
    quality === "yerli" ? "Yerli Premium" : "İthal Kalite",
    `${floor.name} taban`,
    `${edge.name} kenar`,
    heelPad ? "Topuk pedi" : null,
    trunkMat ? "Bagaj paspası" : null,
    logoCount > 0 ? `${logoCount} Adet Logo` : null,
    bagSize !== "none" ? `${bagSize} Çanta` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const canAdd = vehicleComplete;
  const steps = [
    { label: "Araç", index: 0 },
    { label: "Renkler", index: 1 },
    { label: "Ekstralar", index: 2 },
  ];

  function handleAddToCart() {
    if (!vehicleComplete) {
      setShowValidationErrors(true);
      const brandBtn = document.getElementById("configurator-vehicle-brand");
      if (brandBtn) {
        brandBtn.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    const item = buildCartItem();
    if (item) addItem(item);
  }

  function handleCheckout() {
    handleAddToCart();
    closeDrawer();
  }

  return (
    <div className="pb-28 lg:pb-0">
      {/* Spacer where progress bar used to be */}
      <div className="mb-8 hidden lg:block" />

      <div className="grid min-w-0 max-w-full gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
      {/* Gerçek ürün görünümü */}
      <div className="min-w-0 max-w-full lg:sticky lg:top-32 lg:self-start">
        <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 premium-card backdrop-blur-md">
          {/* View Mode Toggle Switcher */}
          <div className="absolute right-4 top-4 z-30 flex rounded-full border border-white/5 bg-black/60 p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setPreviewMode("cabin")}
              className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                previewMode === "cabin"
                  ? "bg-[var(--brand-red)] text-white shadow-[0_0_15px_rgba(237,27,36,0.5)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Kabin Görünümü
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode("flat")}
              className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                previewMode === "flat"
                  ? "bg-[var(--brand-red)] text-white shadow-[0_0_15px_rgba(237,27,36,0.5)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Paspas Tasarımı
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${previewMode}-${previewKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {previewMode === "cabin" ? (
                <Image
                  src={preview.src}
                  alt={
                    hasExactPreview
                      ? `${floor.name} taban ve ${edge.name} kenarlı EVA paspas seti önizlemesi`
                      : "EVA paspas seti için temsili ürün önizlemesi"
                  }
                  width={640}
                  height={853}
                  className="h-auto w-full object-cover"
                  priority
                />
              ) : (
                <FlatMatPreview floor={floor} edge={edge} heelPad={heelPad} />
              )}
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-5 pb-5 pt-16">
            <p className="text-sm font-semibold text-white">
              {hasExactPreview
                ? preview.kind === "digital"
                  ? "Dijital renk önizlemesi"
                  : "Gerçek araç içi uygulama"
                : "Temsili ürün görünümü"}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/70">
              {hasExactPreview
                ? `${floor.name} taban · ${edge.name} kenar`
                : `Seçiminiz: ${floor.name} taban · ${edge.name} kenar. Bu kombinasyon üretilebilir; görsel temsilidir.`}
            </p>
          </div>
        </div>
        <div className="spec-value mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <PaletteIcon className="h-3.5 w-3.5 text-white" aria-hidden="true" />
            {FLOOR_COLORS.length * EDGE_COLORS.length} üretilebilir kombinasyon
          </span>
          <span className="inline-flex items-center gap-1.5">
            <RulerIcon className="h-3.5 w-3.5 text-white" aria-hidden="true" />
            3D lazer ölçümlü kalıp
          </span>
          <span className="inline-flex items-center gap-1.5">
            <TruckIcon className="h-3.5 w-3.5 text-white" aria-hidden="true" />
            1-3 iş gününde kargoda
          </span>
        </div>

        {/* Gerçek Müşteri Fotoğrafları / Videoları */}
        <div className="mt-8 border-t border-white/5 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Müşterilerimizin Paspas Tasarımları
            </h3>
          </div>
          <div className="flex max-w-full gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-white/10">
            {CONFIGURATOR_GALLERY_ITEMS.map((item, idx) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setSelectedGalleryIndex(idx)}
                aria-label={`Müşteri uygulamasını büyüt, görsel ${idx + 1}`}
                className="relative h-20 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border border-white/5 bg-surface transition-all duration-300 hover:border-white/20 active:scale-95"
              >
                {item.type === "photo" ? (
                  <Image
                    src={item.src}
                    alt="Müşteri Paspası"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="relative h-full w-full bg-black">
                    <video
                      src={item.src}
                      muted
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover opacity-70"
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-white/80">
                      <PlayIcon className="h-4 w-4 fill-white/50" />
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Seçenekler */}
      <div className="min-w-0 max-w-full space-y-7">
        <VehicleSelector
          value={vehicle}
          onChange={setVehicle}
          aiEnabled={aiEnabled}
          showError={showValidationErrors}
        />

        {/* Kalite Seçimi */}
        <section className="space-y-4">
          <h2 className="flex items-baseline gap-3 font-heading text-2xl font-bold text-white">
            <span className="spec-value text-base font-medium text-white">02</span>
            Kalite Seçimi
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setQuality("ithal")}
              className={`flex flex-col p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group ${
                quality === "ithal"
                  ? "bg-[var(--brand-red)]/10 border-[var(--brand-red)] text-white shadow-[0_0_20px_rgba(237,27,36,0.15)]"
                  : "bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.05] hover:border-white/12"
              }`}
            >
              <div className="absolute top-0 right-0 p-2.5 text-[8px] font-mono font-bold tracking-widest text-[var(--brand-red)] bg-white/5 rounded-bl-xl uppercase">İthal Sınıfı</div>
              <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">İTHAL KALİTE</span>
              <span className="text-2xl font-extrabold mt-2.5 tracking-tight">3.500 ₺</span>
              <span className="text-[11px] text-white/50 mt-2.5 leading-relaxed">
                İthal kalın EVA malzeme, derin 3D petek kilit havuzu ve maksimum aşınma direnci.
              </span>
            </button>
            <button
              type="button"
              onClick={() => setQuality("yerli")}
              className={`flex flex-col p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group ${
                quality === "yerli"
                  ? "bg-[var(--brand-red)]/10 border-[var(--brand-red)] text-white shadow-[0_0_20px_rgba(237,27,36,0.15)]"
                  : "bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.05] hover:border-white/12"
              }`}
            >
              <div className="absolute top-0 right-0 p-2.5 text-[8px] font-mono font-bold tracking-widest text-white/30 bg-white/5 rounded-bl-xl uppercase">Premium Yerli</div>
              <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">YERLİ KALİTE</span>
              <span className="text-2xl font-extrabold mt-2.5 tracking-tight">2.350 ₺</span>
              <span className="text-[11px] text-white/50 mt-2.5 leading-relaxed">
                Yüksek kaliteli yerli üretim, şık kenar biyeleri ve dayanıklı yapısı.
              </span>
            </button>
          </div>
        </section>

        {/* Merged Color Section (Taban + Kenar) */}
        <section className="space-y-4">
          <h2 className="flex items-baseline gap-3 font-heading text-2xl font-bold text-white">
            <span className="spec-value text-base font-medium text-white">03</span>
            Renkler
          </h2>
          <div className="space-y-6 py-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="spec-label">Taban Rengi</span>
                <span className="spec-value inline-flex items-center gap-2 text-xs font-normal normal-case tracking-normal text-white/80">
                  <span
                    aria-hidden="true"
                    className="inline-block h-3 w-3 border border-white/40"
                    style={{ backgroundColor: floor.hex }}
                  />
                  {floor.name}
                </span>
              </div>
              <ColorPicker
                label="Taban Rengi"
                colors={FLOOR_COLORS}
                selected={floor}
                onSelect={selectFloor}
                showHeading={false}
              />
            </div>
            <div className="border-t border-white/5 pt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="spec-label">Kenar (Overlok) Rengi</span>
                <span className="spec-value inline-flex items-center gap-2 text-xs font-normal normal-case tracking-normal text-white/80">
                  <span
                    aria-hidden="true"
                    className="inline-block h-3 w-3 border border-white/40"
                    style={{ backgroundColor: edge.hex }}
                  />
                  {edge.name}
                </span>
              </div>
              <ColorPicker
                label="Kenar (Overlok) Rengi"
                colors={EDGE_COLORS}
                selected={edge}
                onSelect={selectEdge}
                showHeading={false}
              />
            </div>
          </div>
        </section>

        {/* Collapsed Extras Accordion */}
        <section className="py-2">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between p-5 font-heading text-2xl font-bold text-white [&::-webkit-details-marker]:hidden">
              <span className="flex items-baseline gap-3">
                <span className="spec-value text-base font-medium text-white">04</span>
                <span>Ekstralar ve Çantalar</span>
                <span className="spec-value ml-2 text-xs font-normal normal-case tracking-normal text-muted group-open:hidden">
                  (Topukluk, logo, bagaj paspası, bagaj çantası)
                </span>
              </span>
              <span className="spec-value text-base font-medium text-[var(--red-hot)] transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="px-5 pb-5 border-t border-white/5 pt-5">
              <ExtrasSelector
                heelPad={heelPad}
                trunkMat={trunkMat}
                heelPadPrice={MAT_PRICING.heelPadPrice}
                trunkMatPrice={quality === "yerli" ? MAT_PRICING.yerliTrunkMatPrice : MAT_PRICING.trunkMatPrice}
                onHeelPadChange={setHeelPad}
                onTrunkMatChange={setTrunkMat}
                logoCount={logoCount}
                logoPrice={MAT_PRICING.logoPrice}
                onLogoCountChange={setLogoCount}
                bagSize={bagSize}
                onBagSizeChange={setBagSize}
                quality={quality}
              />
            </div>
          </details>
        </section>

        {/* Material Tech Highlight */}
        <section className="relative overflow-hidden pt-4">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--brand-red)] opacity-10 blur-3xl pointer-events-none" />
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10">
              <Image
                src="/media/real-eva-cargo-detail.jpg"
                alt="3D Hücre Yapısı"
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div>
              <h3 className="flex items-center gap-2 font-heading text-sm font-bold tracking-wider text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-red)]" />
                3D Sıvı Kilit Haznesi
              </h3>
              <p className="mt-1.5 text-[11px] leading-relaxed text-white/70">
                10mm derinliğindeki özel baklava hücreler; dökülen çamur, su ve tozları yüzey gerilimiyle hapsederek aracınızın zeminine akmasını tamamen önler.
              </p>
            </div>
          </div>
        </section>

        <ConfigSummary
          vehicleLabel={vehicleLabel}
          configSummary={configSummary}
          totalPrice={totalPrice}
          onAddToCart={handleAddToCart}
          onCheckout={handleCheckout}
          canAdd={canAdd}
        />
      </div>
      </div>

      {selectedGalleryIndex !== null && (
        <GalleryLightbox
          items={CONFIGURATOR_GALLERY_ITEMS}
          initialIndex={selectedGalleryIndex}
          onClose={() => setSelectedGalleryIndex(null)}
        />
      )}

      {/* Mobile Sticky Bottom Price/CTA Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-black/80 backdrop-blur-lg p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] lg:hidden">
        <div className="flex items-center justify-between gap-4 max-w-xl mx-auto">
          <div>
            <span className="spec-label text-[10px] text-muted block mb-0.5">Toplam</span>
            <span className="spec-value text-xl font-bold text-white">
              {canAdd ? formatPrice(totalPrice) : "—"}
            </span>
            {!canAdd && (
              <span className="text-[10px] text-muted block mt-0.5">Araç seçin</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="btn-press btn-red-rich flex-1 min-h-12 rounded-full text-xs font-bold uppercase tracking-wider text-white"
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
}
