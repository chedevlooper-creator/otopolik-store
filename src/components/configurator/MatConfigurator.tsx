"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import VehicleSelector from "./VehicleSelector";
import ColorPicker, { type ColorSwatch } from "./ColorPicker";
import ExtrasSelector from "./ExtrasSelector";
import ConfigSummary from "./ConfigSummary";
import { useCart } from "@/context/cart-context";
import { calculateMatPrice, MAT_PRICING } from "@/lib/mat-pricing";
import {
  EMPTY_VEHICLE_DETAILS,
  formatVehicleLabel,
  isVehicleDetailsComplete,
  vehicleDetailsKey,
  type VehicleDetails,
} from "@/lib/vehicle-compatibility";
import { PaletteIcon, RulerIcon, TruckIcon, PlayIcon } from "lucide-react";
import { GALLERY_ITEMS } from "@/lib/gallery-media";
import GalleryLightbox from "@/components/GalleryLightbox";
import { StaggeredReveal } from "@/components/ui/StaggeredReveal";
import FlatMatPreview from "./FlatMatPreview";

// Select a stable mix of 12 items for the configurator sidebar to show real applications
const CONFIGURATOR_GALLERY_ITEMS = GALLERY_ITEMS.slice(10, 22);

const FLOOR_COLORS = [
  { name: "Gece Siyahı", hex: "#0b0a0a", slug: "gece-siyahi" },
  { name: "Koyu Kahve", hex: "#170700", slug: "koyu-kahve" },
  { name: "Espresso", hex: "#170700", slug: "espresso" },
  { name: "Toprak Kahve", hex: "#834f3a", slug: "toprak-kahve" },
  { name: "Tarçın Kahve", hex: "#dc7338", slug: "tarcin-kahve" },
  { name: "Asil Bordo", hex: "#bd5c5d", slug: "asil-bordo" },
  { name: "Sıcak Karamel", hex: "#5c1f00", slug: "sicak-karamel" },
  { name: "Kıyı Beji", hex: "#be8861", slug: "kiyi-beji" },
  { name: "Kum Işığı", hex: "#edd4b8", slug: "kum-isigi" },
  { name: "Gün Işığı", hex: "#f79000", slug: "gun-isigi" },
  { name: "Gece Mavisi", hex: "#313e5d", slug: "gece-mavisi" },
  { name: "Saks Mavisi", hex: "#313e5d", slug: "saks-mavisi" },
  { name: "Şehrin Grisi", hex: "#868485", slug: "sehrin-grisi" },
];

const EDGE_COLORS = [
  { name: "Gece Siyahı", hex: "#2e292c", slug: "gece-siyahi" },
  { name: "Espresso", hex: "#56362e", slug: "espresso" },
  { name: "Toprak Kahve", hex: "#894c2c", slug: "toprak-kahve" },
  { name: "Haki Yeşil", hex: "#292a18", slug: "haki-yesil" },
  { name: "Şehrin Grisi", hex: "#544648", slug: "sehrin-grisi" },
  { name: "Kirli Beyaz", hex: "#aaa5a4", slug: "kirli-beyaz" },
  { name: "Kum Işığı", hex: "#b79688", slug: "kum-isigi" },
  { name: "Sıcak Karamel", hex: "#a2480b", slug: "sicak-karamel" },
  { name: "Turuncu", hex: "#ed6b22", slug: "turuncu" },
  { name: "Asil Bordo", hex: "#5d0007", slug: "asil-bordo" },
  { name: "Alev Kırmızı", hex: "#ec4e3d", slug: "alev-kirmizi" },
  { name: "Fuşya Pembesi", hex: "#ff97bb", slug: "fusya-pembesi" },
  { name: "Pudra Pembe", hex: "#f1acc6", slug: "pudra-pembe" },
  { name: "Lavanta Moru", hex: "#cd9ce0", slug: "lavanta-moru" },
  { name: "Duman Moru", hex: "#795d91", slug: "duman-moru" },
  { name: "Gece İndigosu", hex: "#39374c", slug: "gece-indigosu" },
  { name: "Saks Mavisi", hex: "#335eb3", slug: "saks-mavisi" },
  { name: "Kristal Mavisi", hex: "#30c3dd", slug: "kristal-mavisi" },
  { name: "Açık Mavi", hex: "#0bb2c6", slug: "acik-mavi" },
  { name: "Okyanus Yeşili", hex: "#002127", slug: "okyanus-yesili" },
  { name: "Mint Yeşili", hex: "#658e58", slug: "mint-yesili" },
  { name: "Limon Yeşili", hex: "#cfe877", slug: "limon-yesili" },
  { name: "Canlı Sarı", hex: "#eebe00", slug: "canli-sari" },
];

const PREVIEW_IMAGES: Record<string, { src: string; kind: "real" | "digital" }> = {
  "Gece Siyahı|Gece Siyahı": { src: "/media/configurator/siyah-siyah.png", kind: "digital" },
  "Gece Siyahı|Şehrin Grisi": { src: "/media/configurator/siyah-gri.png", kind: "digital" },
  "Gece Siyahı|Kum Işığı": { src: "/media/configurator/siyah-bej.png", kind: "digital" },
  "Gece Siyahı|Alev Kırmızı": {
    src: "/media/scraped/evaotopaspas/paspas-seti/03-gallery-1.jpg",
    kind: "real",
  },
  "Gece Siyahı|Saks Mavisi": { src: "/media/configurator/siyah-mavi.png", kind: "digital" },
  "Gece Siyahı|Turuncu": { src: "/media/configurator/siyah-turuncu.png", kind: "digital" },
  "Gece Siyahı|Mint Yeşili": { src: "/media/configurator/siyah-yesil.png", kind: "digital" },
  "Gece Siyahı|Lavanta Moru": { src: "/media/configurator/siyah-mor.png", kind: "digital" },
  "Saks Mavisi|Turuncu": {
    src: "/media/configurator/lacivert-turuncu.png",
    kind: "digital",
  },
};

type Props = {
  /** URL'den gelen ön seçim (ör. ana sayfa araç bulucudan) */
  initialBrand?: string;
  initialModel?: string;
  initialYear?: string;
  initialBodyOrChassis?: string;
  aiEnabled?: boolean;
};

export default function MatConfigurator({
  initialBrand = "",
  initialModel = "",
  initialYear = "",
  initialBodyOrChassis = "",
  aiEnabled = false,
}: Props) {
  const { addItem, closeDrawer } = useCart();
  const [vehicle, setVehicle] = useState<VehicleDetails>({
    ...EMPTY_VEHICLE_DETAILS,
    brand: initialBrand,
    model: initialModel,
    year: initialYear,
    bodyOrChassis: initialBodyOrChassis,
  });
  const [floor, setFloor] = useState<ColorSwatch>(FLOOR_COLORS[0]);
  const [edge, setEdge] = useState<ColorSwatch>(EDGE_COLORS[10]);
  const [heelPad, setHeelPad] = useState(false);
  const [trunkMat, setTrunkMat] = useState(false);
  const [floorTouched, setFloorTouched] = useState(false);
  const [edgeTouched, setEdgeTouched] = useState(false);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState<"cabin" | "flat">("cabin");

  const totalPrice = calculateMatPrice({ heelPad, trunkMat });

  const previewKey = `${floor.name}|${edge.name}`;
  const preview = PREVIEW_IMAGES[previewKey] ?? PREVIEW_IMAGES["Gece Siyahı|Gece Siyahı"];
  const hasExactPreview = previewKey in PREVIEW_IMAGES;

  const vehicleComplete = isVehicleDetailsComplete(vehicle);
  const vehicleLabel = vehicleComplete ? formatVehicleLabel(vehicle) : "";

  const configSummary = [
    `${floor.name} taban`,
    `${edge.name} kenar`,
    heelPad ? "Topuk pedi" : null,
    trunkMat ? "Bagaj paspası" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const canAdd = vehicleComplete;

  const currentStep = !vehicleComplete
    ? 0
    : !floorTouched
      ? 1
      : !edgeTouched
        ? 2
        : 3;
  const steps = [
    { label: "Aracınız", index: 0 },
    { label: "Taban", index: 1 },
    { label: "Kenar", index: 2 },
    { label: "Ekstralar", index: 3 },
  ];

  function handleAddToCart() {
    if (!canAdd) return;
    const vehicleKey = vehicleDetailsKey(vehicle);
    addItem({
      slug: `ozel-tasarim-${vehicleKey}-${floor.name}-${edge.name}${heelPad ? "-topuk" : ""}${trunkMat ? "-bagaj" : ""}`.toLocaleLowerCase("tr-TR"),
      name: `Özel Tasarım EVA Paspas — ${vehicleLabel}`,
      image: preview.src,
      price: totalPrice,
      color: configSummary,
      quantity: 1,
      configuration: {
        vehicle: vehicleLabel,
        baseColor: floor.name,
        edgeColor: edge.name,
        heelPad,
        trunkMat,
      },
    });
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
          onSelect={(color) => {
            setFloor(color);
            setFloorTouched(true);
          }}
          step={2}
        />

        <ColorPicker
          label="Kenar (Overlok) Rengi"
          colors={EDGE_COLORS}
          selected={edge}
          onSelect={(color) => {
            setEdge(color);
            setEdgeTouched(true);
          }}
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
