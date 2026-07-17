import { calculateMatPrice } from "@/lib/mat-pricing";
import type { MatColor } from "@/lib/mat-colors";
import type { CartItem } from "@/lib/types";
import {
  formatVehicleLabel,
  isVehicleDetailsComplete,
  vehicleDetailsKey,
  type VehicleDetails,
} from "@/lib/vehicle-compatibility";

export const MAT_PREVIEW_IMAGES: Record<
  string,
  { src: string; kind: "real" | "digital" }
> = {
  "Gece Siyahı|Gece Siyahı": {
    src: "/media/configurator/siyah-siyah.png",
    kind: "digital",
  },
  "Gece Siyahı|Şehrin Grisi": {
    src: "/media/configurator/siyah-gri.png",
    kind: "digital",
  },
  "Gece Siyahı|Kum Işığı": {
    src: "/media/configurator/siyah-bej.png",
    kind: "digital",
  },
  "Gece Siyahı|Alev Kırmızı": {
    src: "/media/scraped/evaotopaspas/paspas-seti/03-gallery-1.jpg",
    kind: "real",
  },
  "Gece Siyahı|Saks Mavisi": {
    src: "/media/configurator/siyah-mavi.png",
    kind: "digital",
  },
  "Gece Siyahı|Turuncu": {
    src: "/media/configurator/siyah-turuncu.png",
    kind: "digital",
  },
  "Gece Siyahı|Mint Yeşili": {
    src: "/media/configurator/siyah-yesil.png",
    kind: "digital",
  },
  "Gece Siyahı|Lavanta Moru": {
    src: "/media/configurator/siyah-mor.png",
    kind: "digital",
  },
  "Saks Mavisi|Turuncu": {
    src: "/media/configurator/lacivert-turuncu.png",
    kind: "digital",
  },
};

type ConfiguredMatCartInput = {
  vehicle: VehicleDetails;
  floor: MatColor;
  edge: MatColor;
  heelPad: boolean;
  trunkMat: boolean;
};

export function getMatPreview(floor: MatColor, edge: MatColor) {
  const key = `${floor.name}|${edge.name}`;
  return (
    MAT_PREVIEW_IMAGES[key] ??
    MAT_PREVIEW_IMAGES["Gece Siyahı|Gece Siyahı"]
  );
}

export function buildConfiguredMatCartItem({
  vehicle,
  floor,
  edge,
  heelPad,
  trunkMat,
}: ConfiguredMatCartInput): CartItem | null {
  if (!isVehicleDetailsComplete(vehicle)) return null;

  const vehicleLabel = formatVehicleLabel(vehicle);
  const summary = [
    `${floor.name} taban`,
    `${edge.name} kenar`,
    heelPad ? "Topuk pedi" : null,
    trunkMat ? "Bagaj paspası" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    slug: `ozel-tasarim-${vehicleDetailsKey(vehicle)}-${floor.name}-${edge.name}${heelPad ? "-topuk" : ""}${trunkMat ? "-bagaj" : ""}`.toLocaleLowerCase(
      "tr-TR"
    ),
    name: `Özel Tasarım EVA Paspas — ${vehicleLabel}`,
    image: getMatPreview(floor, edge).src,
    price: calculateMatPrice({ heelPad, trunkMat }),
    color: summary,
    quantity: 1,
    configuration: {
      vehicle: vehicleLabel,
      baseColor: floor.name,
      edgeColor: edge.name,
      heelPad,
      trunkMat,
    },
  };
}
