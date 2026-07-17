"use client";

import { formatPrice } from "@/lib/format";

type Props = {
  heelPad: boolean;
  trunkMat: boolean;
  heelPadPrice: number;
  trunkMatPrice: number;
  onHeelPadChange: (value: boolean) => void;
  onTrunkMatChange: (value: boolean) => void;
};

export default function ExtrasSelector({
  heelPad,
  trunkMat,
  heelPadPrice,
  trunkMatPrice,
  onHeelPadChange,
  onTrunkMatChange,
}: Props) {
  return (
    <section>
      <h2 className="flex items-baseline gap-3 font-heading text-2xl font-bold text-white">
        <span className="spec-value text-base font-medium text-white">04</span>
        Ekstralar
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label
          className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 bg-gradient-to-b from-white/[0.04] to-transparent px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,.05)] transition-all ${
            heelPad
              ? "border-white bg-surface-hover"
              : "border-border bg-surface hover:border-muted"
          }`}
        >
          <span>
            <span className="block text-sm font-bold text-white">Topuk Pedi</span>
            <span className="text-xs text-muted">Sürücü tarafına metal görünümlü koruma</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="spec-value text-sm font-medium text-white">+{formatPrice(heelPadPrice)}</span>
            <input
              type="checkbox"
              checked={heelPad}
              onChange={(e) => onHeelPadChange(e.target.checked)}
              className="h-5 w-5 accent-sand"
            />
          </span>
        </label>
        <label
          className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 bg-gradient-to-b from-white/[0.04] to-transparent px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,.05)] transition-all ${
            trunkMat
              ? "border-white bg-surface-hover"
              : "border-border bg-surface hover:border-muted"
          }`}
        >
          <span>
            <span className="block text-sm font-bold text-white">Bagaj Paspası</span>
            <span className="text-xs text-muted">Aynı renk kombinasyonuyla bagaj koruması</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="spec-value text-sm font-medium text-white">+{formatPrice(trunkMatPrice)}</span>
            <input
              type="checkbox"
              checked={trunkMat}
              onChange={(e) => onTrunkMatChange(e.target.checked)}
              className="h-5 w-5 accent-sand"
            />
          </span>
        </label>
      </div>
    </section>
  );
}
