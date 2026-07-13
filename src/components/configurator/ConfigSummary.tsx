"use client";

import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppOrderLink } from "@/lib/site-config";
import { ArrowRightIcon } from "lucide-react";

type Props = {
  vehicleLabel: string;
  configSummary: string;
  totalPrice: number;
  onAddToCart: () => void;
  onCheckout: () => void;
  canAdd: boolean;
};

export default function ConfigSummary({
  vehicleLabel,
  configSummary,
  totalPrice,
  onAddToCart,
  onCheckout,
  canAdd,
}: Props) {
  const router = useRouter();

  const whatsappHref = buildWhatsAppOrderLink(
    `Merhaba, özel tasarım paspas istiyorum.\nAraç: ${vehicleLabel || "(belirtilecek)"}\nTasarım: ${configSummary}\nTahmini fiyat: ${formatPrice(totalPrice)}`
  );

  return (
    <section
      aria-label="Sipariş özeti"
      className="sticky bottom-0 z-20 border-t border-sand/35 bg-surface/95 p-4 shadow-[0_-8px_32px] shadow-black/40 backdrop-blur lg:bottom-4 lg:border lg:p-6"
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
          <p className="spec-value text-2xl font-semibold text-sand sm:text-3xl">
            {formatPrice(totalPrice)}
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-3 sm:mt-5">
        <button
          type="button"
          disabled={!canAdd}
          onClick={onAddToCart}
          className="btn-press min-h-11 flex-1 bg-brand-red px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-red-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand disabled:cursor-not-allowed disabled:bg-surface-hover disabled:text-muted sm:py-3.5"
        >
          Sepete Ekle
        </button>
        <button
          type="button"
          disabled={!canAdd}
          onClick={() => {
            onCheckout();
            router.push("/odeme");
          }}
          className="btn-press hidden min-h-11 flex-1 border border-border px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-foreground hover:border-sand hover:text-sand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand disabled:cursor-not-allowed disabled:text-muted sm:block"
        >
          Hemen Sipariş Ver
        </button>
      </div>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 hidden min-h-11 w-full items-center justify-center gap-1 text-sm font-semibold text-muted hover:text-sand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand sm:inline-flex"
      >
        Kararsız mısınız? Tasarımı WhatsApp&apos;tan danışın
        <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
      </a>
      {!canAdd && (
        <p className="mt-3 border border-dashed border-border bg-background px-3 py-2 text-center text-xs text-muted">
          Sepete eklemek için önce marka ve modelinizi seçin.
        </p>
      )}
    </section>
  );
}
