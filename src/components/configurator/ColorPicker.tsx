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
        <span className="spec-value ml-1 inline-flex items-center gap-2 text-sm font-normal normal-case tracking-normal text-sand">
          <span
            aria-hidden="true"
            className="inline-block h-3 w-3 border border-sand/40"
            style={{ backgroundColor: selected.hex }}
          />
          {selected.name}
          <span className="text-muted">·</span>
          <span className="text-muted">{selected.hex.toUpperCase()}</span>
        </span>
      </h2>
      <div className="mt-4 flex flex-wrap gap-3" role="radiogroup" aria-label={label}>
        {colors.map((c) => {
          const isActive = selected.name === c.name;
          return (
            <button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={`${c.name} (${c.hex.toUpperCase()})`}
              onClick={() => onSelect(c)}
              title={`${c.name} · ${c.hex.toUpperCase()}`}
              className={`group/color relative h-12 w-12 border-2 transition-all duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand ${
                isActive
                  ? "scale-110 border-sand shadow-[3px_3px_0_0_var(--brand-red)]"
                  : "border-border hover:scale-105 hover:border-muted"
              }`}
              style={{ backgroundColor: c.hex }}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.14em] text-sand"
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
