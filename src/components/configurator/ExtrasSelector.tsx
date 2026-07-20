import { type BagSize, BAG_PRICES } from "@/lib/mat-pricing";
import { formatPrice } from "@/lib/format";

type Props = {
  heelPad: boolean;
  trunkMat: boolean;
  heelPadPrice: number;
  trunkMatPrice: number;
  onHeelPadChange: (value: boolean) => void;
  onTrunkMatChange: (value: boolean) => void;
  logoCount: number;
  logoPrice: number;
  onLogoCountChange: (value: number) => void;
  bagSize: BagSize;
  onBagSizeChange: (value: BagSize) => void;
  quality: "ithal" | "yerli";
};

export default function ExtrasSelector({
  heelPad,
  trunkMat,
  heelPadPrice,
  trunkMatPrice,
  onHeelPadChange,
  onTrunkMatChange,
  logoCount,
  logoPrice,
  onLogoCountChange,
  bagSize,
  onBagSizeChange,
  quality,
}: Props) {
  // Campaign calculations for visual display
  const getBagDisplayPrices = (size: Exclude<BagSize, "none">) => {
    const original = BAG_PRICES[size];
    let discount = 0;
    let campaignText = "";
    if (quality === "ithal" && trunkMat) {
      discount = 0.50; // 50% indirim
      campaignText = "%50 İthal Full İndirimi";
    } else if (quality === "yerli") {
      discount = 0.30; // 30% indirim
      campaignText = "%30 Yerli Kalite İndirimi";
    }
    const discounted = original * (1 - discount);
    return { original, discounted, discount, campaignText };
  };

  const selectedBagInfo = bagSize !== "none" ? getBagDisplayPrices(bagSize) : null;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {/* Topuk Pedi */}
        <label
          className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 bg-gradient-to-b from-white/[0.04] to-transparent px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,.05)] transition-all ${
            heelPad
              ? "border-[var(--red-hot)] bg-black/40 shadow-[0_0_20px_rgba(237,27,36,0.18)]"
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

        {/* Bagaj Paspası */}
        <label
          className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 bg-gradient-to-b from-white/[0.04] to-transparent px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,.05)] transition-all ${
            trunkMat
              ? "border-[var(--red-hot)] bg-black/40 shadow-[0_0_20px_rgba(237,27,36,0.18)]"
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

        {/* Marka Logosu */}
        <div
          className={`flex flex-col justify-between gap-3 rounded-2xl border-2 bg-gradient-to-b from-white/[0.04] to-transparent px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,.05)] transition-all ${
            logoCount > 0
              ? "border-[var(--red-hot)] bg-black/40 shadow-[0_0_20px_rgba(237,27,36,0.18)]"
              : "border-white/10 bg-black/40 hover:border-white/30"
          }`}
        >
          <div>
            <span className="block text-sm font-bold text-white">Marka Logosu</span>
            <span className="text-xs text-muted">Paspaslar için orijinal marka arması</span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
            <span className="spec-value text-sm font-medium text-white">
              {logoCount > 0 ? `+${formatPrice(logoPrice * logoCount)}` : "Eklenmedi"}
            </span>
            <select
              value={logoCount}
              onChange={(e) => onLogoCountChange(Number(e.target.value))}
              className="bg-black text-white border border-white/10 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[var(--brand-red)] cursor-pointer"
            >
              <option value={0}>İstemiyorum</option>
              <option value={1}>1 Adet (Sürücü) (+{formatPrice(logoPrice)})</option>
              <option value={2}>2 Adet (Ön İki) (+{formatPrice(logoPrice * 2)})</option>
            </select>
          </div>
        </div>

        {/* Bagaj Çantası */}
        <div
          className={`flex flex-col justify-between gap-3 rounded-2xl border-2 bg-gradient-to-b from-white/[0.04] to-transparent px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,.05)] transition-all ${
            bagSize !== "none"
              ? "border-[var(--red-hot)] bg-black/40 shadow-[0_0_20px_rgba(237,27,36,0.18)]"
              : "border-white/10 bg-black/40 hover:border-white/30"
          }`}
        >
          <div>
            <span className="block text-sm font-bold text-white flex items-center gap-1.5">
              Bagaj Çantası
              {selectedBagInfo && selectedBagInfo.discount > 0 && (
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">İndirimli</span>
              )}
            </span>
            <span className="text-xs text-muted">
              {selectedBagInfo && selectedBagInfo.discount > 0 
                ? `${selectedBagInfo.campaignText}`
                : "Özel cırtlı düzenleyici bagaj çantası"}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
            <span className="spec-value text-sm font-medium text-white flex items-baseline gap-1.5">
              {selectedBagInfo ? (
                <>
                  <span>+{formatPrice(selectedBagInfo.discounted)}</span>
                  {selectedBagInfo.discount > 0 && (
                    <span className="text-[10px] text-white/30 line-through">{formatPrice(selectedBagInfo.original)}</span>
                  )}
                </>
              ) : (
                "Eklenmedi"
              )}
            </span>
            <select
              value={bagSize}
              onChange={(e) => onBagSizeChange(e.target.value as BagSize)}
              className="bg-black text-white border border-white/10 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[var(--brand-red)] cursor-pointer"
            >
              <option value="none">İstemiyorum</option>
              <option value="40cm">40 cm (1.850 ₺)</option>
              <option value="50cm">50 cm (2.000 ₺)</option>
              <option value="70cm">70 cm (2.250 ₺)</option>
              <option value="90cm">90 cm (2.500 ₺)</option>
            </select>
          </div>
        </div>
      </div>
  );
}
