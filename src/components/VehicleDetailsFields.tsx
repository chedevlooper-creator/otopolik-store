"use client";

import { useState } from "react";
import {
  OTHER_VEHICLE_BRAND,
  type VehicleDetails,
} from "@/lib/vehicle-compatibility";
import { ChevronDown } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import BrandSelectorModal from "@/components/configurator/BrandSelectorModal";
import ModelSelectorModal from "@/components/configurator/ModelSelectorModal";

type Props = {
  value: VehicleDetails;
  onChange: (next: VehicleDetails) => void;
  idPrefix: string;
  showError?: boolean;
  className?: string;
};

const fieldClass =
  "input-rich mt-1.5 min-h-12 w-full rounded-xl border border-white/10 bg-black/40 backdrop-blur-md px-4 py-3 text-sm font-medium transition-all focus:border-[var(--brand-red)] focus:shadow-[0_0_15px_rgba(237,27,36,0.3)] focus:outline-none";

export default function VehicleDetailsFields({
  value,
  onChange,
  idPrefix,
  showError = false,
  className = "",
}: Props) {
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);

  const update = (patch: Partial<VehicleDetails>) => {
    onChange({ ...value, ...patch });
  };

  return (
    <div className={className}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="block text-xs font-semibold text-foreground">
          <label htmlFor={`${idPrefix}-brand`}>Marka</label>
          <button
            type="button"
            id={`${idPrefix}-brand`}
            onClick={() => setIsBrandOpen(true)}
            className={`${fieldClass} flex items-center justify-between text-left cursor-pointer w-full text-white/90`}
          >
            {value.brand ? (
              <span className="flex items-center gap-2.5">
                <BrandLogo brand={value.brand} className="h-5 w-5 text-white/70" />
                <span>{value.brand}</span>
              </span>
            ) : (
              <span className="text-white/40">Marka seçin</span>
            )}
            <ChevronDown className="h-4 w-4 text-white/40 shrink-0" />
          </button>

          <BrandSelectorModal
            isOpen={isBrandOpen}
            onClose={() => setIsBrandOpen(false)}
            onSelect={(brand) => update({ brand, model: "" })}
            selectedBrand={value.brand}
          />
        </div>

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
          <div className="block text-xs font-semibold text-foreground">
            <label htmlFor={`${idPrefix}-model`}>Model</label>
            <button
              type="button"
              id={`${idPrefix}-model`}
              disabled={!value.brand}
              onClick={() => setIsModelOpen(true)}
              className={`${fieldClass} flex items-center justify-between text-left cursor-pointer w-full text-white/90 disabled:opacity-20 disabled:cursor-not-allowed`}
            >
              {value.model ? (
                <span className="flex items-center gap-2.5">
                  <BrandLogo brand={value.brand} className="h-5 w-5 text-white/70" />
                  <span>{value.model}</span>
                </span>
              ) : (
                <span className="text-white/40">
                  {value.brand ? "Model seçin" : "Önce marka seçin"}
                </span>
              )}
              <ChevronDown className="h-4 w-4 text-white/40 shrink-0" />
            </button>

            <ModelSelectorModal
              isOpen={isModelOpen}
              onClose={() => setIsModelOpen(false)}
              onSelect={(model, bodyType) =>
                update({ model, bodyOrChassis: `${bodyType} /` })
              }
              selectedModel={value.model}
              brand={value.brand}
            />
          </div>    )}

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
