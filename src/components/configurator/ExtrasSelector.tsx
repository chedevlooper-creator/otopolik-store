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
    <div className="grid gap-3 sm:grid-cols-2">
        <label
          className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 bg-gradient-to-b from-white/[0.04] to-transparent px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,.05)] transition-all ${
            heelPad
              ? "border-[var(--brand-red)] bg-black/40 shadow-[0_0_20px_rgba(237,27,36,0.15)]"
              : "border-white/10 bg-black/40 hover:border-white/30"
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
              className="h-5 w-5 accent-[var(--brand-red)]"
            />
          </span>
        </label>
        <label
          className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 bg-gradient-to-b from-white/[0.04] to-transparent px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,.05)] transition-all ${
            trunkMat
              ? "border-[var(--brand-red)] bg-black/40 shadow-[0_0_20px_rgba(237,27,36,0.15)]"
              : "border-white/10 bg-black/40 hover:border-white/30"
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
              className="h-5 w-5 accent-[var(--brand-red)]"
            />
          </span>
        </label>
      </div>
  );
}
