"use client";

import VehicleDetailsFields from "@/components/VehicleDetailsFields";
import {
  isVehicleDetailsComplete,
  type VehicleDetails,
} from "@/lib/vehicle-compatibility";
import VehicleMatchInput from "./VehicleMatchInput";

type Props = {
  value: VehicleDetails;
  onChange: (next: VehicleDetails) => void;
  aiEnabled: boolean;
};

export default function VehicleSelector({
  value,
  onChange,
  aiEnabled,
}: Props) {
  const complete = isVehicleDetailsComplete(value);

  return (
    <section aria-labelledby="configurator-vehicle-title">
      <h2
        id="configurator-vehicle-title"
        className="flex items-center gap-3 font-heading text-2xl font-bold text-white mb-6"
      >
        <span className="spec-value flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-red)] text-sm font-bold text-white shadow-[0_0_15px_rgba(255,0,50,0.5)]">01</span>
        Aracınızı Seçin
      </h2>

      {aiEnabled ? (
        <VehicleMatchInput
          onResolved={(candidate) =>
            onChange({
              ...value,
              brand: candidate.brand,
              model: candidate.model,
              year: candidate.year ?? "",
              bodyOrChassis: candidate.bodyType,
            })
          }
        />
      ) : null}

      <VehicleDetailsFields
        value={value}
        onChange={onChange}
        idPrefix="configurator-vehicle"
        className="mt-4"
      />

      <p aria-live="polite" className="mt-3 text-xs font-medium text-muted">
        {complete
          ? "Araç bilgileri tamamlandı. Şimdi taban ve kenar rengini belirleyin."
          : "Devam etmek için marka, model, model yılı ve kasa/versiyon bilgisini tamamlayın."}
      </p>
    </section>
  );
}
