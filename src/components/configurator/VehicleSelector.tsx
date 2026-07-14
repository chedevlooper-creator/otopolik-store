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
  "w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm font-medium transition-colors focus:border-sand focus:outline-none";

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
      <h2 className="flex items-baseline gap-3 font-heading text-2xl font-bold text-white">
        <span className="spec-value text-base font-medium text-sand">01</span>
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
          <div className="flex items-center rounded-xl border border-dashed border-sand-dim bg-surface px-4 py-3 text-xs leading-snug text-sand">
            Sorun değil! Siparişten sonra WhatsApp&apos;tan araç bilginizi alıp kalıbı teyit ediyoruz.
          </div>
        ) : (
          <select
            aria-label="Model"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            disabled={!brand}
            className={`${selectClass} disabled:cursor-not-allowed disabled:text-muted`}
          >
            <option value="">{brand ? "Model seçin" : "Önce marka seçin"}</option>
            {vehicleModels.map((vm) => (
              <option key={vm.name} value={vm.name}>{vm.name}</option>
            ))}
          </select>
        )}
      </div>
      <p aria-live="polite" className="mt-3 text-xs text-muted">
        {brand === OTHER_VEHICLE && slug === OTHER_VEHICLE
          ? "Araç bilgileriniz siparişten sonra WhatsApp üzerinden teyit edilecek."
          : slug
            ? "Araç seçimi tamamlandı. Şimdi renk ve ekstraları belirleyebilirsiniz."
            : "Devam etmek için marka ve modelinizi seçin."}
      </p>
      {brand === OTHER_VEHICLE && slug !== OTHER_VEHICLE && (
        <button
          type="button"
          onClick={() => onSlugChange(OTHER_VEHICLE)}
          className="mt-3 text-sm font-bold text-sand hover:underline"
        >
          Diğer araçla devam et →
        </button>
      )}
    </section>
  );
}
