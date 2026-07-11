"use client";

import { useMemo } from "react";
import { getAllBrands, getModelsByBrand } from "@/lib/vehicle-data";

const OTHER_VEHICLE = "diger";

type Props = {
  brand: string;
  slug: string;
  onBrandChange: (brand: string) => void;
  onSlugChange: (slug: string) => void;
};

const selectClass =
  "w-full rounded-xl border border-neutral-700 bg-neutral-900/60 px-4 py-3 text-sm font-medium transition-colors focus:border-brand-red focus:bg-[#141414] focus:outline-none focus:ring-2 focus:ring-brand-red/15";

export default function VehicleSelector({
  brand,
  slug,
  onBrandChange,
  onSlugChange,
}: Props) {
  const brandList = useMemo(() => getAllBrands(), []);
  const vehicleModels = useMemo(
    () => (brand && brand !== OTHER_VEHICLE ? getModelsByBrand(brand) : []),
    [brand]
  );

  return (
    <section>
      <h2 className="font-heading flex items-center gap-2.5 text-lg font-extrabold text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-red text-sm font-bold text-white">1</span>
        Aracınızı Seçin
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <select
          aria-label="Marka"
          value={brand}
          onChange={(e) => {
            onBrandChange(e.target.value);
            onSlugChange("");
          }}
          className={selectClass}
        >
          <option value="">Marka seçin</option>
          {brandList.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
          <option value={OTHER_VEHICLE}>Diğer / Listede yok</option>
        </select>
        {brand === OTHER_VEHICLE ? (
          <div className="flex items-center rounded-xl bg-neutral-800 px-4 py-3 text-xs leading-snug text-brand-red">
            Sorun değil! Siparişten sonra WhatsApp&apos;tan araç bilginizi alıp kalıbı teyit ediyoruz.
          </div>
        ) : (
          <select
            aria-label="Model"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            disabled={!brand}
            className={`${selectClass} disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-400`}
          >
            <option value="">{brand ? "Model seçin" : "Önce marka seçin"}</option>
            {vehicleModels.map((vm) => (
              <option key={vm.name} value={vm.name}>{vm.name}</option>
            ))}
          </select>
        )}
      </div>
      {brand === OTHER_VEHICLE && slug !== OTHER_VEHICLE && (
        <button
          type="button"
          onClick={() => onSlugChange(OTHER_VEHICLE)}
          className="mt-3 text-sm font-bold text-brand-red hover:underline"
        >
          Diğer araçla devam et →
        </button>
      )}
    </section>
  );
}
