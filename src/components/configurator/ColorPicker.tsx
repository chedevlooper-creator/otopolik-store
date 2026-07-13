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
      <h2 className="flex items-baseline gap-3 font-heading text-2xl font-bold text-white">
        <span className="spec-value text-base font-medium text-sand">0{step}</span>
        {label}
        <span className="spec-value ml-1 text-sm font-normal normal-case tracking-normal text-sand">— {selected.name}</span>
      </h2>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {colors.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => onSelect(c)}
            aria-label={`${label}: ${c.name}`}
            aria-pressed={selected.name === c.name}
            title={c.name}
            className={`h-11 w-11 border-2 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand ${
              selected.name === c.name
                ? "scale-110 border-sand"
                : "border-border hover:scale-105 hover:border-muted"
            }`}
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>
    </section>
  );
}
