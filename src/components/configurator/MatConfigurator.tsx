"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import VehicleSelector from "./VehicleSelector";
import ColorPicker from "./ColorPicker";
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

// Select a stable mix of 12 items for the configurator sidebar to show real applications
const CONFIGURATOR_GALLERY_ITEMS = GALLERY_ITEMS.slice(10, 22);

const FLOOR_COLORS = [
  { name: "Siyah", hex: "#0f1012" },
  { name: "Antrasit", hex: "#25282d" },
  { name: "Gri", hex: "#585d64" },
  { name: "Açık Gri", hex: "#9ba0a9" },
  { name: "Bej", hex: "#bfa985" },
  { name: "Kahve", hex: "#4e331f" },
  { name: "Lacivert", hex: "#111f32" },
  { name: "Bordo", hex: "#401216" },
];

const EDGE_COLORS = [
  { name: "Siyah", hex: "#0f1012" },
  { name: "Gri", hex: "#585d64" },
  { name: "Bej", hex: "#bfa985" },
  { name: "Kırmızı", hex: "#8c1626" },
  { name: "Mavi", hex: "#1b3152" },
  { name: "Turuncu", hex: "#ad5b23" },
  { name: "Yeşil", hex: "#1b3c26" },
  { name: "Mor", hex: "#3d214a" },
];

const PREVIEW_IMAGES: Record<string, { src: string; kind: "real" | "digital" }> = {
  "Siyah|Siyah": { src: "/media/configurator/siyah-siyah.png", kind: "digital" },
  "Siyah|Gri": { src: "/media/configurator/siyah-gri.png", kind: "digital" },
  "Siyah|Bej": { src: "/media/configurator/siyah-bej.png", kind: "digital" },
  "Siyah|Kırmızı": {
    src: "/media/scraped/evaotopaspas/paspas-seti/03-gallery-1.jpg",
    kind: "real",
  },
  "Siyah|Mavi": { src: "/media/configurator/siyah-mavi.png", kind: "digital" },
  "Siyah|Turuncu": { src: "/media/configurator/siyah-turuncu.png", kind: "digital" },
  "Siyah|Yeşil": { src: "/media/configurator/siyah-yesil.png", kind: "digital" },
  "Siyah|Mor": { src: "/media/configurator/siyah-mor.png", kind: "digital" },
  "Lacivert|Turuncu": {
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
};

export default function MatConfigurator({
  initialBrand = "",
  initialModel = "",
  initialYear = "",
  initialBodyOrChassis = "",
}: Props) {
  const { addItem, closeDrawer } = useCart();
  const [vehicle, setVehicle] = useState<VehicleDetails>({
    ...EMPTY_VEHICLE_DETAILS,
    brand: initialBrand,
    model: initialModel,
    year: initialYear,
    bodyOrChassis: initialBodyOrChassis,
  });
  const [floor, setFloor] = useState(FLOOR_COLORS[0]);
  const [edge, setEdge] = useState(EDGE_COLORS[3]);
  const [heelPad, setHeelPad] = useState(false);
  const [trunkMat, setTrunkMat] = useState(false);
  const [floorTouched, setFloorTouched] = useState(false);
  const [edgeTouched, setEdgeTouched] = useState(false);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);

  const totalPrice = calculateMatPrice({ heelPad, trunkMat });

  const previewKey = `${floor.name}|${edge.name}`;
  const preview = PREVIEW_IMAGES[previewKey] ?? PREVIEW_IMAGES["Siyah|Siyah"];
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
      <ol
        aria-label="Tasarım adımları"
        className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {steps.map((step) => {
          const isDone = step.index < currentStep;
          const isActive = step.index === currentStep;
          return (
            <li
              key={step.label}
              aria-current={isActive ? "step" : undefined}
              className={`flex items-center gap-2.5 border px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                isActive
                  ? "border-sand bg-surface text-white"
                  : isDone
                    ? "border-border bg-surface text-sand"
                    : "border-border bg-background text-muted"
              }`}
            >
              <span
                className={`spec-value flex h-6 w-6 items-center justify-center text-[11px] font-bold ${
                  isActive
                    ? "icon-badge-rich text-white"
                    : isDone
                      ? "bg-sand/20 text-sand"
                      : "bg-border text-muted"
                }`}
              >
                {isDone ? "✓" : `0${step.index + 1}`}
              </span>
              {step.label}
            </li>
          );
        })}
      </ol>

      <div className="grid min-w-0 max-w-full gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
      {/* Gerçek ürün görünümü */}
      <div className="min-w-0 max-w-full lg:sticky lg:top-32 lg:self-start">
        <div className="relative overflow-hidden border border-border bg-surface">
          <Image
            key={preview.src}
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
            <PaletteIcon className="h-3.5 w-3.5 text-sand" aria-hidden="true" />
            {FLOOR_COLORS.length * EDGE_COLORS.length} üretilebilir kombinasyon
          </span>
          <span className="inline-flex items-center gap-1.5">
            <RulerIcon className="h-3.5 w-3.5 text-sand" aria-hidden="true" />
            3D lazer ölçümlü kalıp
          </span>
          <span className="inline-flex items-center gap-1.5">
            <TruckIcon className="h-3.5 w-3.5 text-sand" aria-hidden="true" />
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
              className="text-xs text-sand hover:underline hover:text-white transition-colors"
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
      <div className="min-w-0 max-w-full space-y-7">
        <VehicleSelector value={vehicle} onChange={setVehicle} />

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
      </div>
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
