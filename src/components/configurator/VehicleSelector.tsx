"use client";

import VehicleDetailsFields from "@/components/VehicleDetailsFields";
import {
  isVehicleDetailsComplete,
  type VehicleDetails,
} from "@/lib/vehicle-compatibility";

type Props = {
  value: VehicleDetails;
  onChange: (next: VehicleDetails) => void;
};

export default function VehicleSelector({ value, onChange }: Props) {
  const complete = isVehicleDetailsComplete(value);

  return (
    <section aria-labelledby="configurator-vehicle-title">
      <h2
        id="configurator-vehicle-title"
        className="flex items-baseline gap-3 font-heading text-2xl font-bold text-white"
      >
        <span className="spec-value text-base font-medium text-sand">01</span>
        Aracınızı Seçin
      </h2>

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
