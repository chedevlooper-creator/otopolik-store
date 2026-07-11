"use client";

export type ColorSwatch = {
  name: string;
  hex: string;
};

type Props = {
  label: string;
  colors: ColorSwatch[];
  selected: ColorSwatch;
  onSelect: (color: ColorSwatch) => void;
  step: number;
};

export default function ColorPicker({
  label,
  colors,
  selected,
  onSelect,
  step,
}: Props) {
  return (
    <section>
      <h2 className="font-heading flex items-center gap-2.5 text-lg font-extrabold text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-red text-sm font-bold text-white">{step}</span>
        {label}
        <span className="ml-1 text-sm font-normal text-neutral-500">— {selected.name}</span>
      </h2>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {colors.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => onSelect(c)}
            aria-label={`${label}: ${c.name}`}
            title={c.name}
            className={`h-11 w-11 rounded-full border-2 shadow-sm transition-transform ${
              selected.name === c.name
                ? "scale-110 border-brand-red ring-2 ring-brand-red/25"
                : "border-neutral-700 hover:scale-105 hover:border-neutral-400"
            }`}
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>
    </section>
  );
}
