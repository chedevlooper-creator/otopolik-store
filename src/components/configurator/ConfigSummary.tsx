"use client";

import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/cart-context";
import { buildWhatsAppOrderLink } from "@/lib/site-config";

type Props = {
  vehicleLabel: string;
  configSummary: string;
  totalPrice: number;
  onAddToCart: () => void;
  canAdd: boolean;
};

export default function ConfigSummary({
  vehicleLabel,
  configSummary,
  totalPrice,
  onAddToCart,
  canAdd,
}: Props) {
  const router = useRouter();

  const whatsappHref = buildWhatsAppOrderLink(
    `Merhaba, özel tasarım paspas istiyorum.\nAraç: ${vehicleLabel || "(belirtilecek)"}\nTasarım: ${configSummary}\nTahmini fiyat: ${formatPrice(totalPrice)}`
  );

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-lg shadow-black/5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">Tasarımınız</p>
          <p className="mt-1 text-sm font-semibold text-neutral-900">
            {vehicleLabel || "Araç seçilmedi"}
          </p>
          <p className="text-xs text-neutral-500">{configSummary}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">Toplam</p>
          <p className="font-heading text-3xl font-extrabold text-brand-red">
            {formatPrice(totalPrice)}
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={!canAdd}
          onClick={onAddToCart}
          className="btn-press flex-1 rounded-full bg-brand-red px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-brand-red/30 hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:shadow-none"
        >
          Sepete Ekle
        </button>
        <button
          type="button"
          disabled={!canAdd}
          onClick={() => {
            onAddToCart();
            router.push("/odeme");
          }}
          className="btn-press flex-1 rounded-full border border-brand-black px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-neutral-900 hover:border-brand-red hover:text-brand-red disabled:cursor-not-allowed disabled:border-neutral-300 disabled:text-neutral-400"
        >
          Hemen Sipariş Ver
        </button>
      </div>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block text-center text-sm font-semibold text-neutral-500 hover:text-brand-red"
      >
        Kararsız mısınız? Tasarımı WhatsApp&apos;tan danışın →
      </a>
      {!canAdd && (
        <p className="mt-3 rounded-lg bg-neutral-50 px-3 py-2 text-center text-xs text-neutral-500">
          Sepete eklemek için önce aracınızı seçin.
        </p>
      )}
    </section>
  );
}
