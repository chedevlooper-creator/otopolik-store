"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppLink, useStoreSettings } from "@/context/settings-context";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

type Props = {
  vehicleLabel: string;
  configSummary: string;
  totalPrice: number;
  onAddToCart: () => void;
  onCheckout: () => void;
  canAdd: boolean;
};

const priceFormatter = (n: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(n);

export default function ConfigSummary({
  vehicleLabel,
  configSummary,
  totalPrice,
  onAddToCart,
  onCheckout,
  canAdd,
}: Props) {
  const router = useRouter();
  const settings = useStoreSettings();
  const [showAdded, setShowAdded] = useState(false);

  const animatedPrice = useAnimatedNumber(totalPrice, priceFormatter, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  });

  const whatsappHref = buildWhatsAppLink(
    settings.whatsappNumber,
    `Merhaba, özel tasarım paspas istiyorum.\nAraç: ${vehicleLabel || "(belirtilecek)"}\nTasarım: ${configSummary}\nTahmini fiyat: ${canAdd ? formatPrice(totalPrice) : "(araç seçilince belirlenir)"}`
  );

  const handleAddToCart = useCallback(() => {
    onAddToCart();
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 1500);
  }, [onAddToCart]);

  return (
    <section
      aria-label="Sipariş özeti"
      className="border-t border-white/35 bg-surface/95 p-4 shadow-[0_-8px_32px] shadow-black/40 backdrop-blur lg:rounded-2xl lg:border lg:border-white/10 lg:bg-white/[0.03] lg:p-6 lg:shadow-none lg:backdrop-blur-none"
    >
      <div className="flex items-center justify-between gap-3 sm:items-start">
        <div className="min-w-0">
          <p className="spec-value hidden text-[11px] font-medium uppercase tracking-[0.18em] text-muted sm:block">Tasarımınız</p>
          <p className="truncate text-sm font-semibold text-white sm:mt-1">
            {vehicleLabel || "Araç seçilmedi"}
          </p>
          <p className="truncate text-xs text-muted">{configSummary}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="spec-value hidden text-[11px] font-medium uppercase tracking-[0.18em] text-muted sm:block">Toplam</p>
          <p className="spec-value text-2xl font-semibold text-white sm:text-3xl">
            {canAdd ? animatedPrice : "—"}
          </p>
        </div>
      </div>
      <div className="relative mt-3 flex gap-3 sm:mt-5">
        <motion.button
          type="button"
          disabled={!canAdd}
          onClick={handleAddToCart}
          whileTap={{ scale: 0.95 }}
          className="btn-press btn-red-rich relative min-h-11 flex-1 overflow-hidden rounded-full px-6 py-3 text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:text-muted sm:py-3.5"
        >
          <AnimatePresence mode="wait">
            {showAdded ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="flex items-center justify-center gap-1.5"
              >
                <CheckIcon className="h-4 w-4" />
                Eklendi
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                Sepete Ekle
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Floating "Eklendi ✓" badge */}
        <AnimatePresence>
          {showAdded && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.8 }}
              animate={{ opacity: 1, y: -40, scale: 1 }}
              exit={{ opacity: 0, y: -60 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="pointer-events-none absolute left-1/4 top-0 z-30 rounded-full bg-[#25D366]/90 px-3 py-1 text-xs font-bold text-white shadow-lg backdrop-blur"
            >
              Eklendi ✓
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          disabled={!canAdd}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            onCheckout();
            router.push("/odeme");
          }}
          className="btn-press hidden min-h-11 flex-1 rounded-full border border-white/12 px-6 py-3.5 text-sm font-semibold text-foreground hover:border-white/24 hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:text-muted sm:block"
        >
          Hemen Sipariş Ver
        </motion.button>
      </div>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 hidden min-h-11 w-full items-center justify-center gap-1 text-sm font-semibold text-muted hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex"
      >
        Kararsız mısınız? Tasarımı WhatsApp&apos;tan danışın
        <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
      </a>
      {!canAdd && (
        <p className="mt-3 rounded-xl border border-dashed border-border bg-background px-3 py-2 text-center text-xs text-muted">
          Sepete eklemek için önce marka ve modelinizi seçin.
        </p>
      )}
    </section>
  );
}
