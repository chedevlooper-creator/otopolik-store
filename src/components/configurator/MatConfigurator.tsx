"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
import { StaggeredReveal } from "@/components/ui/StaggeredReveal";
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
    vehicleComplete,
    vehicleLabel,
    totalPrice,
    currentStep,
    selectFloor,
    selectEdge,
    buildCartItem,
  } = useConfiguratorAssistant();
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState<"cabin" | "flat">("cabin");

  const previewKey = `${floor.name}|${edge.name}`;
  const preview = getMatPreview(floor, edge);
  const hasExactPreview = previewKey in MAT_PREVIEW_IMAGES;

  const configSummary = [
    `${floor.name} taban`,
    `${edge.name} kenar`,
    heelPad ? "Topuk pedi" : null,
    trunkMat ? "Bagaj paspası" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const canAdd = vehicleComplete;
  const steps = [
    { label: "Aracınız", index: 0 },
    { label: "Taban", index: 1 },
    { label: "Kenar", index: 2 },
    { label: "Ekstralar", index: 3 },
  ];

  function handleAddToCart() {
    const item = buildCartItem();
    if (item) addItem(item);
  }

  function handleCheckout() {
    handleAddToCart();
    closeDrawer();
  }

  return (
    <div>
      {/* ─── Glassmorphism Step Progress ─── */}
      <div className="mb-8">
        <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-1 backdrop-blur-xl">
          {/* Animated fill bar */}
          <motion.div
            className="absolute inset-y-1 left-1 rounded-[0.85rem] bg-gradient-to-r from-white/15 via-white/10 to-white/5"
            initial={false}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          />
          {/* Shine sweep */}
          <motion.div
            className="absolute inset-y-1 left-1 rounded-[0.85rem] bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={false}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 30, delay: 0.1 }}
          />
          <ol
            aria-label="Tasarım adımları"
            className="relative grid grid-cols-2 gap-1 sm:grid-cols-4"
          >
            {steps.map((step) => {
              const isDone = step.index < currentStep;
              const isActive = step.index === currentStep;
              return (
                <li
                  key={step.label}
                  aria-current={isActive ? "step" : undefined}
                  className={`relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? "text-white"
                      : isDone
                        ? "text-white/80"
                        : "text-white/30"
                  }`}
                >
                  <motion.span
                    layout
                    className={`spec-value flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors duration-300 ${
                      isActive
                        ? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                        : isDone
                          ? "bg-white/20 text-white"
                          : "bg-white/5 text-white/30"
                    }`}
                  >
                    {isDone ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        ✓
                      </motion.span>
                    ) : (
                      `0${step.index + 1}`
                    )}
                  </motion.span>
                  {step.label}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="grid min-w-0 max-w-full gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
      {/* Gerçek ürün görünümü */}
      <div className="min-w-0 max-w-full lg:sticky lg:top-32 lg:self-start">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface">
          {/* View Mode Toggle Switcher */}
          <div className="absolute right-4 top-4 z-30 flex rounded-full border border-white/10 bg-black/60 p-0.5 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setPreviewMode("cabin")}
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                previewMode === "cabin"
                  ? "bg-white text-black shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Kabin Görünümü
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode("flat")}
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                previewMode === "flat"
                  ? "bg-white text-black shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Paspas Tasarımı
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${previewMode}-${previewKey}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 25, duration: 0.4 }}
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
            <Link
              href="/galeri"
              className="text-xs text-white hover:underline hover:text-white transition-colors"
            >
              Tümünü Gör →
            </Link>
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
      <StaggeredReveal className="min-w-0 max-w-full space-y-7">
        <VehicleSelector
          value={vehicle}
          onChange={setVehicle}
          aiEnabled={aiEnabled}
        />

        <ColorPicker
          label="Taban Rengi"
          colors={FLOOR_COLORS}
          selected={floor}
          onSelect={selectFloor}
          step={2}
        />

        <ColorPicker
          label="Kenar (Overlok) Rengi"
          colors={EDGE_COLORS}
          selected={edge}
          onSelect={selectEdge}
          step={3}
        />

        <ExtrasSelector
          heelPad={heelPad}
          trunkMat={trunkMat}
          heelPadPrice={MAT_PRICING.heelPadPrice}
          trunkMatPrice={MAT_PRICING.trunkMatPrice}
          onHeelPadChange={setHeelPad}
          onTrunkMatChange={setTrunkMat}
        />

        <ConfigSummary
          vehicleLabel={vehicleLabel}
          configSummary={configSummary}
          totalPrice={totalPrice}
          onAddToCart={handleAddToCart}
          onCheckout={handleCheckout}
          canAdd={canAdd}
        />
      </StaggeredReveal>
      </div>

      {selectedGalleryIndex !== null && (
        <GalleryLightbox
          items={CONFIGURATOR_GALLERY_ITEMS}
          initialIndex={selectedGalleryIndex}
          onClose={() => setSelectedGalleryIndex(null)}
        />
      )}
    </div>
  );
}
