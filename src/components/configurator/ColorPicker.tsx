"use client";

import { motion } from "framer-motion";

export type ColorSwatch = {
  name: string;
  hex: string;
  slug?: string;
};

type Props = {
  label: string;
  colors: readonly ColorSwatch[];
  selected: ColorSwatch;
  onSelect: (color: ColorSwatch) => void;
  step?: number;
  showHeading?: boolean;
};

export default function ColorPicker({
  label,
  colors,
  selected,
  onSelect,
  step = 2,
  showHeading = true,
}: Props) {
  return (
    <section>
      {showHeading && (
        <h2 className="flex items-center gap-3 font-heading text-2xl font-bold text-white mb-4">
          <span className="spec-value flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-red)] text-sm font-bold text-white shadow-[0_0_15px_rgba(237,27,36,0.5)]">0{step}</span>
          {label}
          <span className="spec-value ml-1 inline-flex items-center gap-2 text-sm font-normal normal-case tracking-normal text-white">
            <span
              aria-hidden="true"
              className="inline-block h-3 w-3 border border-white/40"
              style={{ backgroundColor: selected.hex }}
            />
            {selected.name}
            <span className="text-muted">·</span>
            <span className="text-muted">{selected.hex.toUpperCase()}</span>
          </span>
        </h2>
      )}
      <div className={`${showHeading ? "mt-4" : ""} flex flex-wrap gap-3`} role="radiogroup" aria-label={label}>
        {colors.map((c) => {
          const isActive = selected.name === c.name;
          return (
            <motion.button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={`${c.name} (${c.hex.toUpperCase()})`}
              onClick={() => onSelect(c)}
              title={`${c.name} · ${c.hex.toUpperCase()}`}
              whileHover={{ scale: 1.15, boxShadow: "0 0 20px rgba(255,255,255,0.25)" }}
              whileTap={{ scale: 0.92 }}
              className={`group/color relative h-12 w-12 rounded-full border-2 transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                isActive
                  ? "border-white shadow-[0_0_16px_rgba(255,255,255,0.25)]"
                  : "border-white/10 hover:border-white/30"
              }`}
              style={{ backgroundColor: c.hex }}
            >
              {isActive && (
                <motion.span
                  initial={{ scale: 0, opacity: 0, rotate: -90 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  aria-hidden="true"
                  className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${
                    ["Siyah", "Lacivert", "Bordo", "Kahve", "Antrasit"].includes(c.name) ? "text-white" : "text-black"
                  }`}
                >
                  ✓
                </motion.span>
              )}
              {/* Animated outer glow ring */}
              {isActive && (
                <motion.div
                  layoutId={`${label}-active-glow`}
                  className="absolute -inset-1.5 rounded-full border border-white/20 pointer-events-none"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              {isActive && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -inset-2.5 rounded-full pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${c.hex}33 0%, transparent 70%)` }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
