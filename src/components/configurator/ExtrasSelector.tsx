"use client";

import { formatPrice } from "@/lib/format";

const HEEL_PAD_PRICE = 149;
const TRUNK_MAT_PRICE = 349;

type Props = {
  heelPad: boolean;
  trunkMat: boolean;
  onHeelPadChange: (value: boolean) => void;
  onTrunkMatChange: (value: boolean) => void;
};

export default function ExtrasSelector({
  heelPad,
  trunkMat,
  onHeelPadChange,
  onTrunkMatChange,
}: Props) {
  return (
    <section>
      <h2 className="font-heading flex items-center gap-2.5 text-lg font-extrabold text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-red text-sm font-bold text-white">4</span>
        Ekstralar
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label
          className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 px-5 py-4 transition-colors ${
            heelPad
              ? "border-brand-red bg-neutral-800/60"
              : "border-neutral-700 hover:border-neutral-600"
          }`}
        >
          <span>
            <span className="block text-sm font-bold text-white">Topuk Pedi</span>
            <span className="text-xs text-neutral-500">Sürücü tarafına metal görünümlü koruma</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="text-sm font-bold text-brand-red">+{formatPrice(HEEL_PAD_PRICE)}</span>
            <input
              type="checkbox"
              checked={heelPad}
              onChange={(e) => onHeelPadChange(e.target.checked)}
              className="h-5 w-5 accent-brand-red"
            />
          </span>
        </label>
        <label
          className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 px-5 py-4 transition-colors ${
            trunkMat
              ? "border-brand-red bg-neutral-800/60"
              : "border-neutral-700 hover:border-neutral-600"
          }`}
        >
          <span>
            <span className="block text-sm font-bold text-white">Bagaj Paspası</span>
            <span className="text-xs text-neutral-500">Aynı renk kombinasyonuyla bagaj koruması</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="text-sm font-bold text-brand-red">+{formatPrice(TRUNK_MAT_PRICE)}</span>
            <input
              type="checkbox"
              checked={trunkMat}
              onChange={(e) => onTrunkMatChange(e.target.checked)}
              className="h-5 w-5 accent-brand-red"
            />
          </span>
        </label>
      </div>
    </section>
  );
}
