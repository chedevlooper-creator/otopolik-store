"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import VehicleSelector from "./VehicleSelector";
import ColorPicker from "./ColorPicker";
import ExtrasSelector from "./ExtrasSelector";
import ConfigSummary from "./ConfigSummary";
import { useCart } from "@/context/cart-context";
import { getVehiclePrice } from "@/lib/vehicle-data";
import { siteConfig } from "@/lib/site-config";
import { PaletteIcon, RulerIcon, TruckIcon } from "lucide-react";

const FLOOR_COLORS = [
  { name: "Siyah", hex: "#16161a" },
  { name: "Antrasit", hex: "#3a3d42" },
  { name: "Gri", hex: "#8a8f96" },
  { name: "Açık Gri", hex: "#b9bec5" },
  { name: "Bej", hex: "#c9b79c" },
  { name: "Kahve", hex: "#6b4a2f" },
  { name: "Lacivert", hex: "#1e3a5f" },
  { name: "Bordo", hex: "#5e1a22" },
];

const EDGE_COLORS = [
  { name: "Siyah", hex: "#141414" },
  { name: "Gri", hex: "#8a8f96" },
  { name: "Bej", hex: "#c9b79c" },
  { name: "Kırmızı", hex: "#e31c23" },
  { name: "Mavi", hex: "#2456a6" },
  { name: "Turuncu", hex: "#e07a20" },
  { name: "Yeşil", hex: "#2e7d4f" },
  { name: "Mor", hex: "#6b3fa0" },
];

// Fiyatlar siteConfig'ten gelir; .env ile override edilebilir.
const DEFAULT_BASE_PRICE = siteConfig.matBasePrice;
const HEEL_PAD_PRICE = siteConfig.matHeelPadPrice;
const TRUNK_MAT_PRICE = siteConfig.matTrunkPrice;

const OTHER_VEHICLE = "diger";

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

export default function MatConfigurator() {
  const { addItem, closeDrawer } = useCart();

  const [brand, setBrand] = useState("");
  const [slug, setSlug] = useState("");
  const [floor, setFloor] = useState(FLOOR_COLORS[0]);
  const [edge, setEdge] = useState(EDGE_COLORS[3]);
  const [heelPad, setHeelPad] = useState(true);
  const [trunkMat, setTrunkMat] = useState(false);

  const basePrice = useMemo(() => {
    if (!brand || !slug || brand === OTHER_VEHICLE) return DEFAULT_BASE_PRICE;
    return getVehiclePrice(brand, slug);
  }, [brand, slug]);

  const totalPrice =
    basePrice + (heelPad ? HEEL_PAD_PRICE : 0) + (trunkMat ? TRUNK_MAT_PRICE : 0);

  const previewKey = `${floor.name}|${edge.name}`;
  const preview = PREVIEW_IMAGES[previewKey] ?? PREVIEW_IMAGES["Siyah|Kırmızı"];
  const hasExactPreview = previewKey in PREVIEW_IMAGES;

  const vehicleLabel = brand
    ? brand === OTHER_VEHICLE
      ? "Diğer Araç (uyumluluk teyidiyle)"
      : slug
        ? `${brand} ${slug}`
        : `${brand} (model seçin)`
    : "";

  const configSummary = [
    `${floor.name} taban`,
    `${edge.name} kenar`,
    heelPad ? "Topuk pedi" : null,
    trunkMat ? "Bagaj paspası" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  // Listelenen araçlarda marka ve model birlikte zorunludur. "Diğer" akışı
  // WhatsApp ile uyumluluk teyidi gerektirdiği için ayrıca açıkça onaylanır.
  const canAdd = Boolean(
    brand && (brand === OTHER_VEHICLE ? slug === OTHER_VEHICLE : slug)
  );

  const currentStep = !canAdd ? 0 : 3;
  const steps = [
    { label: "Aracınız", index: 0 },
    { label: "Taban", index: 1 },
    { label: "Kenar", index: 2 },
    { label: "Ekstralar", index: 3 },
  ];

  function handleAddToCart() {
    if (!canAdd) return;
    addItem({
      slug: `ozel-tasarim-${slug}-${floor.name}-${edge.name}${heelPad ? "-topuk" : ""}${trunkMat ? "-bagaj" : ""}`.toLocaleLowerCase("tr-TR"),
      name: `Özel Tasarım EVA Paspas — ${vehicleLabel}`,
      image: "/media/scraped/evaotopaspas/paspas-seti/01-siyah-urun.png",
      price: totalPrice,
      color: configSummary,
      quantity: 1,
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
                    ? "bg-brand-red text-white"
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

      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
      {/* Gerçek ürün görünümü */}
      <div className="lg:sticky lg:top-32 lg:self-start">
        <div className="relative overflow-hidden border border-border bg-surface">
          <Image
            key={preview.src}
            src={preview.src}
            alt={`${floor.name} taban ve ${edge.name} kenarlı EVA paspas seti araç içi görünümü`}
            width={640}
            height={853}
            className="h-auto w-full object-cover"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-5 pb-5 pt-16">
            <p className="text-sm font-semibold text-white">
              {preview.kind === "digital" ? "Dijital renk önizlemesi" : "Gerçek araç içi uygulama"}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/70">
              {hasExactPreview
                ? `${floor.name} taban · ${edge.name} kenar`
                : `Seçiminiz: ${floor.name} taban · ${edge.name} kenar — bu kombinasyonun görseli hazırlanıyor.`}
            </p>
          </div>
        </div>
        <div className="spec-value mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <PaletteIcon className="h-3.5 w-3.5 text-sand" aria-hidden="true" />
            {FLOOR_COLORS.length * EDGE_COLORS.length} renk kombinasyonu
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
      </div>

      {/* Seçenekler */}
      <div className="space-y-7">
        <VehicleSelector
          brand={brand}
          slug={slug}
          onBrandChange={setBrand}
          onSlugChange={setSlug}
        />

        <ColorPicker
          label="Taban Rengi"
          colors={FLOOR_COLORS}
          selected={floor}
          onSelect={setFloor}
          step={2}
        />

        <ColorPicker
          label="Kenar (Overlok) Rengi"
          colors={EDGE_COLORS}
          selected={edge}
          onSelect={setEdge}
          step={3}
        />

        <ExtrasSelector
          heelPad={heelPad}
          trunkMat={trunkMat}
          heelPadPrice={HEEL_PAD_PRICE}
          trunkMatPrice={TRUNK_MAT_PRICE}
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
    </div>
  );
}
