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
import { ShieldCheckIcon, TruckIcon } from "lucide-react";

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
  address?: string;
  legal?: string;
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
  if (!city.trim()) return "Şehir zorunludur";
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
  const { items, totalPrice, clearCart, isHydrated } = useCart();
  const settings = useStoreSettings();
  const router = useRouter();
  const createOrder = useMutation(api.orders.create);
  const convexReady = isConvexConfiguredClient();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    note: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<"kapida" | "whatsapp">("whatsapp");
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
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
      validateField(field, value);
    }
  };

  if (!isHydrated) {
    return (
      <div
        className="mx-auto max-w-5xl px-4 py-10 sm:py-14"
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
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-heading text-3xl font-bold text-white">
          {content.emptyTitle ?? "Sepetiniz boş"}
        </h1>
        <p className="mt-2 text-muted">
          {content.emptyBody ??
            "Ödeme adımına geçmeden önce sepetinize ürün ekleyin."}
        </p>
        <Link
          href="/urunler"
          className="btn-press mt-6 inline-flex bg-brand-red px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-red-dark"
        >
          {content.ctaLabel ?? "Ürünleri İncele"}
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
      address: validateAddress(form.address),
    };

    const filteredErrors: FormErrors = {};
    for (const [key, value] of Object.entries(allErrors)) {
      if (value) filteredErrors[key as keyof FormErrors] = value;
    }
    setErrors(filteredErrors);

    if (Object.keys(filteredErrors).length > 0) {
      const firstInvalidField = Object.keys(filteredErrors)[0];
      requestAnimationFrame(() => {
        document.getElementById(`checkout-${firstInvalidField}`)?.focus();
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

    const lines = [
      "🛒 *Yeni Sipariş Talebi*",
      "",
      `Ad Soyad: ${form.fullName}`,
      `Telefon: ${form.phone}`,
      `Şehir: ${form.city}`,
      `Adres: ${form.address}`,
      form.note ? `Not: ${form.note}` : null,
      `Sipariş Tercihi: ${paymentMethod === "kapida" ? "Kapıda Ödeme (ek ücret yok)" : "WhatsApp üzerinden onay"}`,
      "",
      "*Ürünler:*",
      ...items.map((item) => {
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
        return `- ${item.name} (${item.color})${configLine} x${item.quantity} — ${formatPrice(item.price * item.quantity)}`;
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
      if (!convexReady) {
        setSubmitError(
          "Sipariş kaydı şu an kullanılamıyor. WhatsApp penceresindeki özeti göndererek devam edebilirsiniz; sepetiniz korunuyor."
        );
        return;
      }

      await createOrder({
        customerName: form.fullName,
        customerPhone: form.phone,
        customerEmail: undefined,
        city: form.city,
        address: form.address,
        items: items.map((item) => ({
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

      clearCart();
      router.push("/tesekkurler");
    } catch (err) {
      console.error("Failed to save order to Convex:", err);
      setSubmitError(
        "Sipariş kaydı şu anda oluşturulamadı. WhatsApp penceresindeki özeti göndererek devam edebilirsiniz; sepetiniz korunuyor."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
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
                className={`mt-1.5 w-full rounded-xl border bg-surface px-4 py-3 font-normal focus:outline-none ${
                  errors.fullName ? "border-brand-red focus:border-brand-red" : "border-border focus:border-sand"
                }`}
              />
              {errors.fullName && (
                <p id="checkout-fullName-error" role="alert" className="mt-1 text-xs text-brand-red">
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
                className={`mt-1.5 w-full rounded-xl border bg-surface px-4 py-3 font-normal focus:outline-none ${
                  errors.phone ? "border-brand-red focus:border-brand-red" : "border-border focus:border-sand"
                }`}
              />
              {errors.phone && (
                <p id="checkout-phone-error" role="alert" className="mt-1 text-xs text-brand-red">
                  {errors.phone}
                </p>
              )}
            </label>
          </div>

          <label htmlFor="checkout-city" className="block text-sm font-semibold text-foreground">
            Şehir
            <input
              id="checkout-city"
              name="address-level2"
              required
              type="text"
              autoComplete="address-level2"
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
              onBlur={(e) => validateField("city", e.target.value)}
              aria-invalid={Boolean(errors.city)}
              aria-describedby={errors.city ? "checkout-city-error" : undefined}
              className={`mt-1.5 w-full rounded-xl border bg-surface px-4 py-3 font-normal focus:outline-none ${
                errors.city ? "border-brand-red focus:border-brand-red" : "border-border focus:border-sand"
              }`}
            />
            {errors.city && (
              <p id="checkout-city-error" role="alert" className="mt-1 text-xs text-brand-red">
                {errors.city}
              </p>
            )}
          </label>

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
              className={`mt-1.5 w-full rounded-xl border bg-surface px-4 py-3 font-normal focus:outline-none ${
                errors.address ? "border-brand-red focus:border-brand-red" : "border-border focus:border-sand"
              }`}
            />
            {errors.address && (
              <p id="checkout-address-error" role="alert" className="mt-1 text-xs text-brand-red">
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
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-3 font-normal focus:border-sand focus:outline-none"
            />
          </label>

          <fieldset>
            <legend className="spec-value mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              Ödeme Şekli
            </legend>
            <div className="space-y-2">
              <label className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3.5 transition-colors has-[:checked]:border-sand has-[:checked]:bg-surface-hover">
                <input
                  type="radio"
                  name="payment"
                  value="whatsapp"
                  checked={paymentMethod === "whatsapp"}
                  onChange={() => setPaymentMethod("whatsapp")}
                  className="accent-sand"
                />
                <span className="text-sm font-medium text-foreground">
                  WhatsApp üzerinden sipariş onayı
                </span>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3.5 transition-colors has-[:checked]:border-sand has-[:checked]:bg-surface-hover">
                <input
                  type="radio"
                  name="payment"
                  value="kapida"
                  checked={paymentMethod === "kapida"}
                  onChange={() => setPaymentMethod("kapida")}
                  className="accent-sand"
                />
                <span className="text-sm font-medium text-foreground">Kapıda Ödeme</span>
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
              className="mt-1 accent-sand"
              aria-invalid={Boolean(errors.legal)}
            />
            <span className="text-sm leading-6 text-foreground/85">
             {" "}
              <Link href="/bilgiler/on-bilgilendirme" className="font-semibold text-sand hover:underline">
                Ön bilgilendirme
              </Link>
              {" "}ve{" "}
              <Link href="/bilgiler/mesafeli-satis" className="font-semibold text-sand hover:underline">
                mesafeli satış sözleşmesi
              </Link>
              {" "}metinlerini okudum, kabul ediyorum.
            </span>
          </label>
          {errors.legal ? (
            <p role="alert" className="text-xs text-brand-red">
              {errors.legal}
            </p>
          ) : null}
        </div>

        <aside className="premium-card h-fit rounded-[1.5rem] p-6 shadow-[0_28px_70px_rgba(0,0,0,.25)]">
          <h2 className="font-heading text-xl font-bold text-white">Sipariş Özeti</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {items.map((item) => (
              <li key={`${item.slug}-${item.color}`} className="flex justify-between gap-2">
                <span className="line-clamp-1">
                  {item.name} ({item.color}) × {item.quantity}
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
            <span className="spec-value text-xl font-semibold text-sand">
              {formatPrice(orderTotal)}
            </span>
          </div>
          {submitError ? (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-brand-red bg-brand-red/10 px-3 py-2 text-xs font-medium text-brand-red"
            >
              {submitError}
            </p>
          ) : null}
          <p className="mt-4 rounded-xl border border-dashed border-border bg-background px-3 py-2 text-xs leading-5 text-muted">
            WhatsApp penceresinde hazırlanan özeti göndermeden sipariş
            kesinleşmez. Ekibimiz mesajınızın ardından uyumluluğu teyit eder.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-press mt-6 flex w-full items-center justify-center rounded-xl bg-brand-red px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-brand-red/20 hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Gönderiliyor..." : "Sipariş Talebini Gönder"}
          </button>

          <ul className="mt-5 space-y-2 border-t border-border pt-5 text-[11px] text-muted">
            <li className="flex items-center gap-2">
              <ShieldCheckIcon className="h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden="true" />
              <span>Uyumluluk siparişten önce teyit edilir</span>
            </li>
            <li className="flex items-center gap-2">
              <TruckIcon className="h-3.5 w-3.5 shrink-0 text-sand" aria-hidden="true" />
              <span>{settings.estimatedDispatch} içinde kargoda</span>
            </li>
          </ul>
        </aside>
      </form>
    </div>
  );
}
