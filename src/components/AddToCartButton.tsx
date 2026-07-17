"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useStoreSettings } from "@/context/settings-context";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { getShippingCost } from "@/lib/shipping";
import VehicleDetailsFields from "@/components/VehicleDetailsFields";
import { useProductVariantGallery } from "@/components/ProductGallery";
import {
  EMPTY_VEHICLE_DETAILS,
  formatVehicleLabel,
  isVehicleDetailsComplete,
  productRequiresVehicle,
  type VehicleDetails,
} from "@/lib/vehicle-compatibility";
import { TruckIcon, MinusIcon, PlusIcon, CheckIcon, ShoppingCartIcon } from "lucide-react";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, closeDrawer } = useCart();
  const settings = useStoreSettings();
  const router = useRouter();
  const variantGallery = useProductVariantGallery();
  const [color, setColor] = useState(product.colors[0]?.name ?? "Standart");
  const [quantity, setQuantity] = useState(1);
  const [footerVisible, setFooterVisible] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const [vehicle, setVehicle] = useState<VehicleDetails>(EMPTY_VEHICLE_DETAILS);
  const [vehicleError, setVehicleError] = useState(false);
  const needsVehicle = productRequiresVehicle(product);
  const vehicleComplete = !needsVehicle || isVehicleDetailsComplete(vehicle);
  const subtotal = product.price * quantity;
  const shippingCost = getShippingCost(subtotal, settings);

  function ensureVehicle(): boolean {
    if (vehicleComplete) return true;
    setVehicleError(true);
    window.requestAnimationFrame(() => {
      document.getElementById("product-vehicle-brand")?.focus();
    });
    return false;
  }

  function handleAdd() {
    if (!ensureVehicle()) return;
    addItem(buildLine());
    setJustAdded(true);
    setAnimateCart(true);
    window.setTimeout(() => { setAnimateCart(false); }, 500);
    window.setTimeout(() => { setJustAdded(false); }, 2000);
  }

  function handleBuyNow() {
    if (!ensureVehicle()) return;
    addItem(buildLine());
    closeDrawer();
    router.push("/odeme");
  }

  function handleColorChange(name: string, image?: string) {
    setColor(name);
    variantGallery?.selectImage(image || product.image);
  }

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(([entry]) => {
      setFooterVisible(entry.isIntersecting);
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  function buildLine() {
    const selected = product.colors.find((c) => c.name === color);
    return {
      slug: product.slug,
      name: product.name,
      image: selected?.image ?? product.image,
      price: product.price,
      color,
      quantity,
      configuration: needsVehicle
        ? { vehicle: formatVehicleLabel(vehicle) }
        : undefined,
    };
  }

  return (
    <div className="space-y-5">
      {needsVehicle ? (
        <section
          aria-labelledby="product-vehicle-heading"
          className="rounded-2xl border border-white/10 bg-surface/55 p-4 sm:p-5"
        >
          <div className="mb-4">
            <p className="spec-value text-[10px] font-bold uppercase tracking-[0.16em] text-white">
              Araca özel üretim
            </p>
            <h2 id="product-vehicle-heading" className="mt-1 font-heading text-lg font-bold text-white">
              Aracınızı doğrulayın
            </h2>
          </div>
          <VehicleDetailsFields
            value={vehicle}
            onChange={(next) => {
              setVehicle(next);
              if (isVehicleDetailsComplete(next)) setVehicleError(false);
            }}
            idPrefix="product-vehicle"
            showError={vehicleError}
          />
        </section>
      ) : null}

      {product.colors.length > 1 ? <div>
        <p
          className="spec-value mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted"
          aria-live="polite"
          aria-atomic="true"
        >
          Renk — <span className="text-white">{color}</span>
        </p>
        <div className="flex gap-2">
          {product.colors.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => handleColorChange(c.name, c.image)}
              aria-label={`Renk: ${c.name}`}
              aria-pressed={color === c.name}
              className={`h-11 w-11 rounded-full border-2 transition-transform ${
                color === c.name ? "scale-110 border-white" : "border-border hover:border-muted"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div> : null}

      <div>
        <p className="spec-value mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">Adet</p>
        <div className="inline-flex items-center rounded-full border border-border bg-surface">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity === 1}
            aria-label="Adedi azalt"
            className="inline-flex h-11 w-11 items-center justify-center font-semibold text-muted hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <MinusIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="spec-value w-8 text-center font-medium" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(9, q + 1))}
            disabled={quantity === 9}
            aria-label="Adedi artır"
            className="inline-flex h-11 w-11 items-center justify-center font-semibold text-muted hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="hidden gap-3 sm:flex sm:flex-row">
        <button
          type="button"
          onClick={handleAdd}
          aria-describedby={vehicleError ? "product-vehicle-heading" : undefined}
          className={`btn-press btn-red-rich flex-1 rounded-full px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 ${
            justAdded
              ? "!bg-emerald-500 !hover:bg-emerald-600"
              : ""
          }`}
        >
          <span className={`inline-flex items-center gap-2 ${animateCart ? "animate-cart-pop" : ""}`}>
            {justAdded ? (
              <>
                <CheckIcon className="h-4 w-4 animate-check-spread" aria-hidden="true" />
                Eklendi
              </>
            ) : (
              <>
                <ShoppingCartIcon className="h-4 w-4" aria-hidden="true" />
                Sepete Ekle
              </>
            )}
          </span>
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="btn-press flex-1 rounded-full border border-white/12 px-6 py-3.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-white/24 hover:bg-white/[0.04] hover:translate-y-[-1px]"
        >
          Hemen Al
        </button>
      </div>

      <p className="flex items-center gap-1.5 border-t border-dashed border-border pt-4 text-xs text-muted">
        <TruckIcon className="h-3.5 w-3.5 text-white" aria-hidden="true" />
        {shippingCost === 0
          ? "Bu sipariş için kargo ücretsiz."
          : `Kargo: ${formatPrice(settings.shippingFee)} — ${settings.freeShippingThreshold.toLocaleString("tr-TR")}₺ üzeri ücretsiz.`}
      </p>

      <div
        role="region"
        aria-label="Hızlı satın alma"
        aria-hidden={footerVisible}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md transition-transform sm:hidden ${
          footerVisible ? "pointer-events-none translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="mx-auto flex max-w-screen-2xl 2xl:px-8 items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="spec-value block text-[10px] uppercase tracking-[0.14em] text-muted">
              {vehicleComplete ? `${quantity} adet · ${color}` : "Araç bilgisi gerekli"}
            </span>
            <strong className="spec-value block whitespace-nowrap text-lg font-semibold text-white">
              {formatPrice(subtotal)}
            </strong>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            tabIndex={footerVisible ? -1 : undefined}
            className={`btn-press btn-red-rich min-h-11 flex-1 rounded-full px-5 py-3 text-sm font-bold text-white transition-all duration-200 ${
              justAdded
                ? "!bg-emerald-500 !hover:bg-emerald-600"
                : ""
            }`}
          >
            <span className={`inline-flex items-center gap-2 ${animateCart ? "animate-cart-pop" : ""}`}>
              {justAdded ? (
                <>
                  <CheckIcon className="h-4 w-4 animate-check-spread" aria-hidden="true" />
                  Eklendi
                </>
              ) : (
                <>
                  <ShoppingCartIcon className="h-4 w-4" aria-hidden="true" />
                  {vehicleComplete ? "Ekle" : "Aracı tamamla"}
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
