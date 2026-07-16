"use client";

import { useMemo } from "react";
import { getAllBrands, getModelsByBrand } from "@/lib/vehicle-data";
import {
  OTHER_VEHICLE_BRAND,
  type VehicleDetails,
} from "@/lib/vehicle-compatibility";

type Props = {
  value: VehicleDetails;
  onChange: (next: VehicleDetails) => void;
  idPrefix: string;
  showError?: boolean;
  className?: string;
};

const fieldClass =
  "input-rich mt-1.5 min-h-12 w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-medium focus:border-sand focus:outline-none";

export default function VehicleDetailsFields({
  value,
  onChange,
  idPrefix,
  showError = false,
  className = "",
}: Props) {
  const brands = useMemo(() => getAllBrands(), []);
  const models = useMemo(
    () =>
      value.brand && value.brand !== OTHER_VEHICLE_BRAND
        ? getModelsByBrand(value.brand)
        : [],
    [value.brand]
  );

  const update = (patch: Partial<VehicleDetails>) => {
    onChange({ ...value, ...patch });
  };

  return (
    <div className={className}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label
          htmlFor={`${idPrefix}-brand`}
          className="block text-xs font-semibold text-foreground"
        >
          Marka
          <select
            id={`${idPrefix}-brand`}
            value={value.brand}
            onChange={(event) =>
              update({ brand: event.target.value, model: "" })
            }
            aria-invalid={showError && !value.brand}
            className={fieldClass}
          >
            <option value="">Marka seçin</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
            <option value={OTHER_VEHICLE_BRAND}>Diğer / Listede yok</option>
          </select>
        </label>

        {value.brand === OTHER_VEHICLE_BRAND ? (
          <label
            htmlFor={`${idPrefix}-model`}
            className="block text-xs font-semibold text-foreground"
          >
            Marka ve model
            <input
              id={`${idPrefix}-model`}
              type="text"
              value={value.model}
              onChange={(event) => update({ model: event.target.value })}
              placeholder="Örn. Saab 9-3 Sedan"
              aria-invalid={showError && !value.model.trim()}
              className={fieldClass}
            />
          </label>
        ) : (
          <label
            htmlFor={`${idPrefix}-model`}
            className="block text-xs font-semibold text-foreground"
          >
            Model
            <select
              id={`${idPrefix}-model`}
              value={value.model}
              onChange={(event) => update({ model: event.target.value })}
              disabled={!value.brand}
              aria-invalid={showError && !value.model}
              className={`${fieldClass} disabled:cursor-not-allowed disabled:text-muted`}
            >
              <option value="">
                {value.brand ? "Model seçin" : "Önce marka seçin"}
              </option>
              {models.map((model) => (
                <option key={model.name} value={model.name}>
                  {model.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <label
          htmlFor={`${idPrefix}-year`}
          className="block text-xs font-semibold text-foreground"
        >
          Model yılı
          <input
            id={`${idPrefix}-year`}
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={value.year}
            onChange={(event) =>
              update({ year: event.target.value.replace(/\D/g, "").slice(0, 4) })
            }
            placeholder="Örn. 2021"
            aria-invalid={showError && !/^\d{4}$/.test(value.year)}
            className={fieldClass}
          />
        </label>

        <label
          htmlFor={`${idPrefix}-body`}
          className="block text-xs font-semibold text-foreground"
        >
          Kasa / versiyon
          <input
            id={`${idPrefix}-body`}
            type="text"
            value={value.bodyOrChassis}
            onChange={(event) => update({ bodyOrChassis: event.target.value })}
            placeholder="Örn. W205 Sedan / Sport"
            aria-invalid={showError && value.bodyOrChassis.trim().length < 2}
            className={fieldClass}
          />
        </label>
      </div>

      {showError ? (
        <p role="alert" className="mt-3 text-xs font-semibold text-red-300">
          Doğru kalıbı hazırlayabilmemiz için marka, model, 4 haneli yıl ve kasa/versiyon bilgisini tamamlayın.
        </p>
      ) : (
        <p className="mt-3 text-xs leading-5 text-muted">
          Bu bilgiler üretimden önce doğru kalıbı eşleştirmek için kullanılır.
        </p>
      )}
    </div>
  );
}
