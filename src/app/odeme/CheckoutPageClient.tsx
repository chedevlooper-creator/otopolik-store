"use client";

import { useState, useCallback, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppLink, useStoreSettings } from "@/context/settings-context";
import { getShippingCost } from "@/lib/shipping";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { isConvexConfiguredClient } from "@/lib/convex-client";
import { ShieldCheckIcon, ShoppingCartIcon, TruckIcon, LockIcon } from "lucide-react";
import VehicleDetailsFields from "@/components/VehicleDetailsFields";
import {
  EMPTY_VEHICLE_DETAILS,
  cartItemRequiresVehicle,
  formatVehicleLabel,
  isVehicleDetailsComplete,
  type VehicleDetails,
} from "@/lib/vehicle-compatibility";
import { TURKEY_PROVINCES } from "@/lib/turkey-provinces";

type CheckoutContent = {
  title: string;
  description: string;
  emptyTitle?: string;
  emptyBody?: string;
  ctaLabel?: string;
};

interface FormErrors {
  fullName?: string;
  phone?: string;
  city?: string;
  district?: string;
  address?: string;
  legal?: string;
  vehicle?: string;
}

function validatePhone(phone: string): string | undefined {
  const cleaned = phone.replace(/[\s()-]/g, "");
  if (!cleaned) return "Telefon numarası zorunludur";
  if (!/^(05\d{2})\d{7}$/.test(cleaned) && !/^(\+?90)?5\d{9}$/.test(cleaned)) {
    return "Geçerli bir telefon numarası girin (örn: 05XX XXX XX XX)";
  }
  return undefined;
}

function validateName(name: string): string | undefined {
  if (!name.trim()) return "Ad soyad zorunludur";
  if (name.trim().length < 3) return "En az 3 karakter girin";
  return undefined;
}

function validateCity(city: string): string | undefined {
  if (!city.trim()) return "Şehir seçimi zorunludur";
  return undefined;
}

function validateDistrict(district: string): string | undefined {
  if (!district.trim()) return "İlçe zorunludur";
  if (district.trim().length < 2) return "En az 2 karakter girin";
  return undefined;
}

function validateAddress(address: string): string | undefined {
  if (!address.trim()) return "Adres zorunludur";
  if (address.trim().length < 10) return "Adres en az 10 karakter olmalıdır";
  return undefined;
}

export default function CheckoutPageClient({
  content,
}: {
  content: CheckoutContent;
}) {
  const { items, totalPrice, isHydrated, clearCart } = useCart();
  const settings = useStoreSettings();
  const router = useRouter();
  const createOrder = useMutation(api.orders.create);
  const convexReady = isConvexConfiguredClient();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    district: "",
    address: "",
    note: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<"kapida" | "whatsapp">("whatsapp");
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fallbackVehicle, setFallbackVehicle] = useState<VehicleDetails>(
    EMPTY_VEHICLE_DETAILS
  );
  const missingVehicleItems = items.filter(
    (item) =>
      cartItemRequiresVehicle(item.slug) && !item.configuration?.vehicle?.trim()
  );
  const shippingCost = getShippingCost(totalPrice, settings);
  const orderTotal = totalPrice + shippingCost;

  const validateField = useCallback((field: keyof FormErrors, value: string) => {
    let error: string | undefined;
    switch (field) {
      case "fullName":
        error = validateName(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "city":
        error = validateCity(value);
        break;
      case "district":
        error = validateDistrict(value);
        break;
      case "address":
        error = validateAddress(value);
        break;
    }
    setErrors((prev) => {
      const next = { ...prev };
      if (error) {
        next[field] = error;
      } else {
        delete next[field];
      }
      return next;
    });
  }, []);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (field !== "note" && errors[field]) {
      validateField(field as keyof FormErrors, value);
    }
  };

  if (!isHydrated) {
    return (
      <div
        className="mx-auto max-w-5xl px-4 pt-32 pb-10 sm:pt-40 sm:pb-14"
        role="status"
        aria-live="polite"
        aria-label="Sipariş formu yükleniyor"
      >
        <div className="h-4 w-20 animate-pulse bg-surface motion-reduce:animate-none" />
        <div className="mt-3 h-10 w-64 animate-pulse bg-surface motion-reduce:animate-none" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            {["w-full", "w-full", "w-2/3", "w-full"].map((width, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 w-24 animate-pulse bg-surface motion-reduce:animate-none" />
                <div className={`h-11 ${width} animate-pulse bg-surface motion-reduce:animate-none`} />
              </div>
            ))}
          </div>
          <div className="h-72 animate-pulse border border-border bg-surface motion-reduce:animate-none" />
        </div>
        <span className="sr-only">Sipariş formunuz yükleniyor.</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 pt-32 pb-20 text-center sm:pt-40">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--red-hot)]/25 bg-[var(--red-hot)]/[0.06] shadow-[0_0_40px_rgba(237,27,36,0.1)]">
          <ShoppingCartIcon className="h-7 w-7 text-[var(--red-hot)]" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-heading text-3xl font-bold text-white">
          {content.emptyTitle ?? "Sepetiniz boş"}
        </h1>
        <p className="mt-2 text-muted">
          {content.emptyBody ??
            "Ödeme adımına geçmeden önce sepetinize ürün ekleyin."}
        </p>
        <Link
          href="/olusturucu"
          className="btn-press btn-red-rich mt-6 inline-flex rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white"
        >
          {content.ctaLabel ?? "Hemen Tasarla"}
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const allErrors: FormErrors = {
      fullName: validateName(form.fullName),
      phone: validatePhone(form.phone),
      city: validateCity(form.city),
      district: validateDistrict(form.district),
      address: validateAddress(form.address),
      vehicle:
        missingVehicleItems.length > 0 &&
        !isVehicleDetailsComplete(fallbackVehicle)
          ? "Araç marka, model, yıl ve kasa/versiyon bilgisini tamamlayın."
          : undefined,
    };

    const filteredErrors: FormErrors = {};
    for (const [key, value] of Object.entries(allErrors)) {
      if (value) filteredErrors[key as keyof FormErrors] = value;
    }
    setErrors(filteredErrors);

    if (Object.keys(filteredErrors).length > 0) {
      const firstInvalidField = Object.keys(filteredErrors)[0];
      requestAnimationFrame(() => {
        const targetId =
          firstInvalidField === "vehicle"
            ? "checkout-vehicle-brand"
            : `checkout-${firstInvalidField}`;
        document.getElementById(targetId)?.focus();
      });
      return;
    }

    if (!legalAccepted) {
      setErrors((prev) => ({
        ...prev,
        legal: "Devam etmek için mesafeli satış ve ön bilgilendirme sözleşmelerini onaylayın.",
      }));
      return;
    }

    const fallbackVehicleLabel = isVehicleDetailsComplete(fallbackVehicle)
      ? formatVehicleLabel(fallbackVehicle)
      : "";
    const itemsForOrder = items.map((item) =>
      cartItemRequiresVehicle(item.slug) && !item.configuration?.vehicle?.trim()
        ? {
            ...item,
            configuration: {
              ...item.configuration,
              vehicle: fallbackVehicleLabel,
            },
          }
        : item
    );

    const lines = [
      "🛒 *Yeni Sipariş Talebi*",
      "",
      `Ad Soyad: ${form.fullName}`,
      `Telefon: ${form.phone}`,
      `Şehir: ${form.city} / ${form.district}`,
      `Adres: ${form.address}`,
      form.note ? `Not: ${form.note}` : null,
      `Sipariş Tercihi: ${paymentMethod === "kapida" ? "Kapıda Ödeme (ek ücret yok)" : "WhatsApp üzerinden onay"}`,
      "",
      "*Ürünler:*",
      ...itemsForOrder.map((item) => {
        const configLine = item.configuration
          ? ` [${[
              item.configuration.vehicle,
              item.configuration.baseColor
                ? `taban:${item.configuration.baseColor}`
                : null,
              item.configuration.edgeColor
                ? `kenar:${item.configuration.edgeColor}`
                : null,
              item.configuration.heelPad ? "topuk" : null,
              item.configuration.trunkMat ? "bagaj" : null,
            ]
              .filter(Boolean)
              .join(" · ")}]`
          : "";
        return `- ${item.name} (${item.color})${configLine} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`;
      }),
      "",
      `Ara Toplam: ${formatPrice(totalPrice)}`,
      `Kargo: ${shippingCost === 0 ? "Ücretsiz" : formatPrice(shippingCost)}`,
      `Genel Toplam: ${formatPrice(orderTotal)}`,
    ].filter(Boolean);

    const href = buildWhatsAppLink(settings.whatsappNumber, lines.join("\n"));
    setSubmitError(null);

    // Pencereyi kullanıcı etkileşimi sırasında aç; async kayıt sonrasında
    // açmaya çalışmak tarayıcının popup engeline takılabilir.
    const whatsappWindow = window.open("", "_blank");
    if (!whatsappWindow) {
      setSubmitError(
        "WhatsApp penceresi açılamadı. Tarayıcınızda açılır pencerelere izin verip tekrar deneyin."
      );
      return;
    }
    whatsappWindow.opener = null;
    whatsappWindow.location.replace(href);

    setIsSubmitting(true);

    try {
      if (convexReady) {
        await createOrder({
          customerName: form.fullName,
          customerPhone: form.phone,
          customerEmail: undefined,
          city: form.city,
          address: form.address,
          items: itemsForOrder.map((item) => ({
            slug: item.slug,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            color: item.color,
            image: item.image,
            configuration: item.configuration,
          })),
          paymentMethod,
          notes: form.note || undefined,
        });
      }
    } catch (err) {
      // Best-effort Convex write — WhatsApp already opened; never block thank-you.
      console.error("Failed to save order to Convex:", err);
    } finally {
      clearCart();
      setIsSubmitting(false);
      router.push("/tesekkurler");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pt-32 pb-10 sm:pt-40 sm:pb-14">
      <span className="spec-label">Sipariş</span>
      <h1 className="mt-3 font-heading text-4xl font-bold text-white">
        {content.title}
      </h1>
      <p id="checkout-description" className="mt-2 text-muted">
        {content.description}
      </p>

      <form
        name="checkout"
        noValidate
        aria-describedby="checkout-description"
        onSubmit={handleSubmit}
        className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]"
      >
        <div className="space-y-5">
          {missingVehicleItems.length > 0 ? (
            <section
              aria-labelledby="checkout-vehicle-title"
              className="rounded-2xl border border-white/15 bg-surface/60 p-5"
            >
              <p className="spec-value text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                Üretim bilgisi gerekli
              </p>
              <h2
                id="checkout-vehicle-title"
                className="mt-1 font-heading text-xl font-bold text-white"
              >
                Aracınızı tamamlayın
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Sepetinizde araç bilgisi eksik {missingVehicleItems.length} ürün var.
                Aşağıdaki bilgiler bu ürünlerin doğru kalıpla hazırlanması için kullanılacak.
              </p>
              <VehicleDetailsFields
                value={fallbackVehicle}
                onChange={(next) => {
                  setFallbackVehicle(next);
                  if (isVehicleDetailsComplete(next)) {
                    setErrors((current) => {
                      const copy = { ...current };
                      delete copy.vehicle;
                      return copy;
                    });
                  }
                }}
                idPrefix="checkout-vehicle"
                showError={Boolean(errors.vehicle)}
                className="mt-5"
              />
            </section>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <label htmlFor="checkout-fullName" className="block text-sm font-semibold text-foreground">
              Ad Soyad
              <input
                id="checkout-fullName"
                name="name"
                required
                type="text"
                autoComplete="name"
                minLength={3}
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                onBlur={(e) => validateField("fullName", e.target.value)}
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? "checkout-fullName-error" : undefined}
                className={`input-rich mt-1.5 w-full rounded-xl border px-4 py-3 font-normal focus:outline-none ${
                  errors.fullName ? "border-brand-red focus:border-brand-red" : "border-border focus:border-white"
                }`}
              />
              {errors.fullName && (
                <p id="checkout-fullName-error" role="alert" className="mt-1 text-xs font-medium text-red-300">
                  {errors.fullName}
                </p>
              )}
            </label>
            <label htmlFor="checkout-phone" className="block text-sm font-semibold text-foreground">
              Telefon
              <input
                id="checkout-phone"
                name="tel"
                required
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                pattern="[+0-9() -]{10,18}"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={(e) => validateField("phone", e.target.value)}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "checkout-phone-error" : undefined}
                placeholder="05XX XXX XX XX"
                className={`input-rich mt-1.5 w-full rounded-xl border px-4 py-3 font-normal focus:outline-none ${
                  errors.phone ? "border-brand-red focus:border-brand-red" : "border-border focus:border-white"
                }`}
              />
              {errors.phone && (
                <p id="checkout-phone-error" role="alert" className="mt-1 text-xs font-medium text-red-300">
                  {errors.phone}
                </p>
              )}
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label htmlFor="checkout-city" className="block text-sm font-semibold text-foreground">
              Şehir (İl)
              <div className="relative">
                <select
                  id="checkout-city"
                  name="address-level1"
                  required
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  onBlur={(e) => validateField("city", e.target.value)}
                  aria-invalid={Boolean(errors.city)}
                  aria-describedby={errors.city ? "checkout-city-error" : undefined}
                  className={`input-rich mt-1.5 w-full rounded-xl border px-4 py-3 font-normal focus:outline-none appearance-none ${
                    errors.city ? "border-brand-red focus:border-brand-red" : "border-border focus:border-white"
                  } ${!form.city ? "text-white/50" : "text-white"}`}
                >
                  <option value="" disabled hidden>İl seçin</option>
                  {TURKEY_PROVINCES.map(p => <option key={p} value={p} className="text-black">{p}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center pt-1.5 text-white/40">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.city && (
                <p id="checkout-city-error" role="alert" className="mt-1 text-xs font-medium text-red-300">
                  {errors.city}
                </p>
              )}
            </label>

            <label htmlFor="checkout-district" className="block text-sm font-semibold text-foreground">
              İlçe
              <input
                id="checkout-district"
                name="address-level2"
                required
                type="text"
                autoComplete="address-level2"
                value={form.district}
                onChange={(e) => handleChange("district", e.target.value)}
                onBlur={(e) => validateField("district", e.target.value)}
                aria-invalid={Boolean(errors.district)}
                aria-describedby={errors.district ? "checkout-district-error" : undefined}
                placeholder="Örn: Kadıköy"
                className={`input-rich mt-1.5 w-full rounded-xl border px-4 py-3 font-normal focus:outline-none ${
                  errors.district ? "border-brand-red focus:border-brand-red" : "border-border focus:border-white"
                }`}
              />
              {errors.district && (
                <p id="checkout-district-error" role="alert" className="mt-1 text-xs font-medium text-red-300">
                  {errors.district}
                </p>
              )}
            </label>
          </div>

          <label htmlFor="checkout-address" className="block text-sm font-semibold text-foreground">
            Adres
            <textarea
              id="checkout-address"
              name="street-address"
              required
              rows={3}
              autoComplete="street-address"
              minLength={10}
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              onBlur={(e) => validateField("address", e.target.value)}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? "checkout-address-error" : undefined}
              className={`input-rich mt-1.5 w-full rounded-xl border px-4 py-3 font-normal focus:outline-none ${
                errors.address ? "border-brand-red focus:border-brand-red" : "border-border focus:border-white"
              }`}
            />
            {errors.address && (
              <p id="checkout-address-error" role="alert" className="mt-1 text-xs font-medium text-red-300">
                {errors.address}
              </p>
            )}
          </label>

          <label htmlFor="checkout-note" className="block text-sm font-semibold text-foreground">
            Sipariş Notu (opsiyonel)
            <textarea
              id="checkout-note"
              name="note"
              rows={2}
              autoComplete="off"
              value={form.note}
              onChange={(e) => handleChange("note", e.target.value)}
              className="input-rich mt-1.5 w-full rounded-xl border border-border px-4 py-3 font-normal focus:border-white focus:outline-none"
            />
          </label>

          <fieldset>
            <legend className="spec-value mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              Sipariş ve ödeme tercihi
            </legend>
            <div className="space-y-2">
              <label className="flex items-center gap-3 rounded-xl border border-border bg-gradient-to-b from-white/[0.045] to-transparent bg-surface px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,.05)] transition-colors has-[:checked]:border-[var(--red-hot)] has-[:checked]:bg-surface-hover has-[:checked]:shadow-[0_0_18px_rgba(237,27,36,0.14)]">
                <input
                  type="radio"
                  name="payment"
                  value="whatsapp"
                  checked={paymentMethod === "whatsapp"}
                  onChange={() => setPaymentMethod("whatsapp")}
                  className="accent-[var(--brand-red)]"
                />
                <span className="text-sm font-medium text-foreground">
                  WhatsApp ile teklif ve sipariş onayı
                </span>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-border bg-gradient-to-b from-white/[0.045] to-transparent bg-surface px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,.05)] transition-colors has-[:checked]:border-[var(--red-hot)] has-[:checked]:bg-surface-hover has-[:checked]:shadow-[0_0_18px_rgba(237,27,36,0.14)]">
                <input
                  type="radio"
                  name="payment"
                  value="kapida"
                  checked={paymentMethod === "kapida"}
                  onChange={() => setPaymentMethod("kapida")}
                  className="accent-[var(--brand-red)]"
                />
                <span className="text-sm font-medium text-foreground">
                  WhatsApp onayından sonra kapıda ödeme
                </span>
              </label>
            </div>
          </fieldset>

          <label className="flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3.5">
            <input
              type="checkbox"
              checked={legalAccepted}
              onChange={(e) => {
                setLegalAccepted(e.target.checked);
                if (e.target.checked) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.legal;
                    return next;
                  });
                }
              }}
              className="mt-1 accent-[var(--brand-red)]"
              aria-invalid={Boolean(errors.legal)}
              aria-describedby={errors.legal ? "checkout-legal-error" : undefined}
            />
            <span className="text-sm leading-6 text-foreground/85">
             {" "}WhatsApp üzerinden sağlanacak ön bilgilendirme ve mesafeli satış koşullarını okudum, kabul ediyorum.
            </span>
          </label>
          {errors.legal ? (
            <p id="checkout-legal-error" role="alert" className="text-xs font-medium text-red-300">
              {errors.legal}
            </p>
          ) : null}
        </div>

        <aside className="premium-card h-fit rounded-[1.5rem] p-6 shadow-[0_28px_70px_rgba(0,0,0,.25)]">
          <h2 className="font-heading text-xl font-bold text-white">Sipariş Özeti</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {items.map((item) => (
              <li key={`${item.slug}-${item.color}`} className="flex items-start justify-between gap-2">
                <span className="min-w-0">
                  <span className="block line-clamp-1">
                    {item.name} ({item.color}) × {item.quantity}
                  </span>
                  {item.configuration?.vehicle ? (
                    <span className="mt-0.5 block line-clamp-2 text-[11px] leading-4 text-white/80">
                      {item.configuration.vehicle}
                    </span>
                  ) : null}
                </span>
                <span className="spec-value shrink-0 font-medium text-white">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm text-muted">Kargo</span>
            <span className="spec-value text-sm font-medium text-white">{shippingCost === 0 ? "Ücretsiz" : formatPrice(shippingCost)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-heading text-lg font-bold uppercase text-white">Toplam</span>
            <span className="spec-value text-xl font-semibold text-white">
              {formatPrice(orderTotal)}
            </span>
          </div>
          {submitError ? (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-400/45 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-200"
            >
              {submitError}
            </p>
          ) : null}
          <p className="mt-4 rounded-xl border border-dashed border-border bg-background px-3 py-2 text-xs leading-5 text-muted">
            WhatsApp penceresinde hazırlanan özeti göndermeden sipariş
            kesinleşmez. Özet açıldıktan sonra sepet temizlenir ve teşekkür
            sayfasına yönlendirilirsiniz.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-press btn-red-rich mt-6 flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Hazırlanıyor..." : "WhatsApp'ta Sipariş Özetini Aç"}
          </button>

          <ul className="mt-5 space-y-2 border-t border-border pt-5 text-[11px] text-muted">
            <li className="flex items-center gap-2">
              <ShieldCheckIcon className="h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden="true" />
              <span>Uyumluluk siparişten önce teyit edilir</span>
            </li>
            <li className="flex items-center gap-2">
              <TruckIcon className="h-3.5 w-3.5 shrink-0 text-white" aria-hidden="true" />
              <span>{settings.estimatedDispatch} içinde kargoda</span>
            </li>
          </ul>

          <div className="mt-5 flex items-center justify-center gap-8 rounded-xl bg-white/5 py-4">
            <div className="flex flex-col items-center gap-1.5 opacity-80">
              <ShieldCheckIcon className="h-6 w-6 text-emerald-400" strokeWidth={1.5} />
              <span className="text-[9px] font-bold tracking-widest text-emerald-400/80">256-BIT SSL</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 opacity-80">
              <LockIcon className="h-6 w-6 text-emerald-400" strokeWidth={1.5} />
              <span className="text-[9px] font-bold tracking-widest text-emerald-400/80">3D SECURE</span>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
