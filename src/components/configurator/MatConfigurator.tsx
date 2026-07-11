"use client";

import { useMemo, useState } from "react";
import MatPreview from "./MatPreview";
import VehicleSelector from "./VehicleSelector";
import ColorPicker from "./ColorPicker";
import ExtrasSelector from "./ExtrasSelector";
import ConfigSummary from "./ConfigSummary";
import { useCart } from "@/context/cart-context";
import { getVehiclePrice } from "@/lib/vehicle-data";
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

// TODO: Gerçek fiyatlarınızla güncelleyin.
const DEFAULT_BASE_PRICE = 1149;
const HEEL_PAD_PRICE = 149;
const TRUNK_MAT_PRICE = 349;

const OTHER_VEHICLE = "diger";

export default function MatConfigurator() {
  const { addItem } = useCart();

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

  const canAdd = Boolean(vehicleLabel);

  function handleAddToCart() {
    if (!canAdd) return;
    addItem({
      slug: `ozel-tasarim-${slug}-${floor.name}-${edge.name}${heelPad ? "-topuk" : ""}${trunkMat ? "-bagaj" : ""}`.toLocaleLowerCase("tr-TR"),
      name: `Özel Tasarım EVA Paspas — ${vehicleLabel}`,
      image: "/media/eva-driver-black.png",
      price: totalPrice,
      color: configSummary,
      quantity: 1,
    });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
      {/* Canlı önizleme */}
      <div className="lg:sticky lg:top-32 lg:self-start">
        <div className="bg-dots-dark relative overflow-hidden rounded-3xl bg-brand-black p-8 sm:p-10">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-red/20 blur-[100px]" />
          <div className="relative flex items-center justify-center">
            <MatPreview floorColor={floor.hex} edgeColor={edge.hex} heelPad={heelPad} brand={brand} model={slug || undefined} />
          </div>
          <p className="relative mt-6 text-center text-xs text-neutral-400">
            5 parçalı set önizlemesi temsilidir; üretim aracınızın orijinal kalıbına göre yapılır.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-neutral-500">
          <span className="inline-flex items-center gap-1">
            <PaletteIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {FLOOR_COLORS.length * EDGE_COLORS.length} renk kombinasyonu
          </span>
          <span className="inline-flex items-center gap-1">
            <RulerIcon className="h-3.5 w-3.5" aria-hidden="true" />
            3D lazer ölçümlü kalıp
          </span>
          <span className="inline-flex items-center gap-1">
            <TruckIcon className="h-3.5 w-3.5" aria-hidden="true" />
            1-3 iş gününde kargoda
          </span>
        </div>
      </div>

      {/* Seçenekler */}
      <div className="space-y-8">
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
          onHeelPadChange={setHeelPad}
          onTrunkMatChange={setTrunkMat}
        />

        <ConfigSummary
          vehicleLabel={vehicleLabel}
          configSummary={configSummary}
          totalPrice={totalPrice}
          onAddToCart={handleAddToCart}
          canAdd={canAdd}
        />
      </div>
    </div>
  );
}
