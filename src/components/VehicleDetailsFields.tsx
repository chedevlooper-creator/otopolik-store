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

const getFieldClass = (isInvalid: boolean, showError: boolean) => {
  return `input-rich mt-1.5 min-h-12 w-full rounded-xl border px-4 py-3 text-sm font-medium transition-all focus:outline-none ${
    isInvalid && showError
      ? "border-red-500/85 bg-red-950/10 shadow-[0_0_15px_rgba(239,68,68,0.35)] animate-pulse"
      : "border-border bg-black/40 backdrop-blur-md focus:border-[var(--brand-red)] focus:shadow-[0_0_15px_rgba(237,27,36,0.3)]"
  }`;
};

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

  const isBrandInvalid = !value.brand.trim();
  const isModelInvalid = !value.model.trim();
  const isYearInvalid = !/^\d{4}$/.test(value.year.trim());
  const isBodyInvalid = value.bodyOrChassis.trim().length < 2;

  const errorStyle = {
    borderColor: "rgba(239, 68, 68, 0.85)",
    boxShadow: "0 0 15px rgba(239, 68, 68, 0.35)",
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
            style={showError && isBrandInvalid ? errorStyle : undefined}
            className={`${getFieldClass(isBrandInvalid, showError)} flex items-center justify-between text-left cursor-pointer w-full text-white/90`}
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
              aria-invalid={showError && isModelInvalid}
              style={showError && isModelInvalid ? errorStyle : undefined}
              className={getFieldClass(isModelInvalid, showError)}
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
              style={showError && isModelInvalid ? errorStyle : undefined}
              className={`${getFieldClass(isModelInvalid, showError)} flex items-center justify-between text-left cursor-pointer w-full text-white/90 disabled:opacity-20 disabled:cursor-not-allowed`}
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
          </div>
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
            disabled={!value.model}
            onChange={(event) =>
              update({ year: event.target.value.replace(/\D/g, "").slice(0, 4) })
            }
            placeholder={value.model ? "Örn. 2021" : "Önce model seçin"}
            aria-invalid={showError && isYearInvalid}
            style={showError && isYearInvalid ? errorStyle : undefined}
            className={`${getFieldClass(isYearInvalid, showError)} disabled:opacity-20 disabled:cursor-not-allowed`}
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
            disabled={!value.model}
            onChange={(event) => update({ bodyOrChassis: event.target.value })}
            placeholder={value.model ? "Örn. W205 Sedan / Sport" : "Önce model seçin"}
            aria-invalid={showError && isBodyInvalid}
            style={showError && isBodyInvalid ? errorStyle : undefined}
            className={`${getFieldClass(isBodyInvalid, showError)} disabled:opacity-20 disabled:cursor-not-allowed`}
          />
        </label>
      </div>

      {showError ? (
        <p role="alert" className="mt-3 text-xs font-semibold text-red-400">
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
