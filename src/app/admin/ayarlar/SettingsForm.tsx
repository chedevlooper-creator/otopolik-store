"use client";

import { useState, useTransition } from "react";
import {
  SaveIcon,
  PhoneIcon,
  MapPinIcon,
  TruckIcon,
  GlobeIcon,
  MessageCircleIcon,
  ClockIcon,
  MailIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  LoaderIcon,
  ShieldCheckIcon,
} from "lucide-react";
import type { SiteSettings } from "@/lib/site-settings";
import { formatPrice } from "@/lib/format";
import { MAT_PRICING } from "@/lib/mat-pricing";
import { updateSettings } from "./actions";

type FormState = SiteSettings;

type Props = {
  initial: FormState;
  dataSource: "convex" | "fallback";
};

const inputClass =
  "mt-1.5 w-full border border-border bg-background px-4 py-2.5 text-sm font-normal text-foreground focus:border-white focus:outline-none focus:ring-2 focus:ring-brand-red/15";

const CANONICAL_PRICE_CARDS = [
  { label: "Paspas seti taban fiyatı", value: MAT_PRICING.basePrice },
  { label: "Topuk pedi", value: MAT_PRICING.heelPadPrice },
  { label: "Bagaj paspası", value: MAT_PRICING.trunkMatPrice },
] as const;

export default function SettingsForm({ initial, dataSource }: Props) {
  const [form, setForm] = useState<FormState>(initial);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<
    { type: "success" | "error"; text: string } | null
  >(null);

  const isConvex = dataSource === "convex";

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await updateSettings(form);
      if (result.ok) {
        setMessage({
          type: "success",
          text: "Ayarlar başarıyla kaydedildi.",
        });
      } else {
        setMessage({ type: "error", text: result.message });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
      {/* Veri kaynağı uyarısı */}
      {!isConvex ? (
        <div
          role="status"
          className="flex items-start gap-3 border border-white/30 bg-white/10 px-4 py-3 text-sm text-foreground lg:col-span-2"
        >
          <AlertCircleIcon className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
          <p>
            Veriler şu an varsayılan (env/.env.local) değerlerden okunuyor.
            Convex bağlandığında bu formdaki değişiklikler kalıcı olarak kaydedilecek.
          </p>
        </div>
      ) : null}

      {/* İletişim Bilgileri */}
      <section className="border border-border bg-surface p-6 lg:col-span-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center bg-surface-hover">
            <PhoneIcon className="h-4 w-4 text-brand-red" aria-hidden="true" />
          </span>
          <h2 className="font-heading text-base font-bold text-white">
            İletişim Bilgileri
          </h2>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label
            htmlFor="admin-phone-display"
            className="block text-sm font-semibold text-foreground"
          >
            Telefon (görünen)
            <input
              id="admin-phone-display"
              name="phoneDisplay"
              type="text"
              autoComplete="tel"
              inputMode="tel"
              value={form.phoneDisplay}
              onChange={(e) => update("phoneDisplay", e.target.value)}
              placeholder="0555 000 00 00"
              className={inputClass}
            />
          </label>
          <label
            htmlFor="admin-whatsapp-number"
            className="block text-sm font-semibold text-foreground"
          >
            WhatsApp Numarası (ülke koduyla)
            <div className="relative mt-1.5">
              <MessageCircleIcon
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500"
                aria-hidden="true"
              />
              <input
                id="admin-whatsapp-number"
                name="whatsappNumber"
                type="text"
                autoComplete="tel"
                inputMode="numeric"
                pattern="[0-9+ ]{10,16}"
                value={form.whatsappNumber}
                onChange={(e) => update("whatsappNumber", e.target.value)}
                placeholder="905550000000"
                className={`pl-11 ${inputClass}`}
              />
            </div>
          </label>
          <label
            htmlFor="admin-email"
            className="block text-sm font-semibold text-foreground"
          >
            E-posta
            <div className="relative mt-1.5">
              <MailIcon
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="siparis@otopolik.com"
                className={`pl-11 ${inputClass}`}
              />
            </div>
          </label>
          <label
            htmlFor="admin-instagram"
            className="block text-sm font-semibold text-foreground"
          >
            Instagram URL
            <div className="relative mt-1.5">
              <GlobeIcon
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                id="admin-instagram"
                name="instagram"
                type="url"
                autoComplete="url"
                value={form.instagram}
                onChange={(e) => update("instagram", e.target.value)}
                placeholder="https://instagram.com/otopolik"
                className={`pl-11 ${inputClass}`}
              />
            </div>
          </label>
        </div>
        <div className="mt-5">
          <label
            htmlFor="admin-address"
            className="block text-sm font-semibold text-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <MapPinIcon className="h-4 w-4 text-brand-red" aria-hidden="true" />
              Adres
            </span>
            <textarea
              id="admin-address"
              name="address"
              rows={2}
              autoComplete="street-address"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className={inputClass}
            />
          </label>
        </div>
      </section>

      {/* Kargo ve Teslimat */}
      <section className="border border-border bg-surface p-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center bg-blue-500/10">
            <TruckIcon
              className="h-4 w-4 text-blue-600"
              aria-hidden="true"
            />
          </span>
          <h2 className="font-heading text-base font-bold text-white">
            Kargo ve Teslimat
          </h2>
        </div>
        <div className="mt-5 space-y-5">
          <label
            htmlFor="admin-free-shipping-threshold"
            className="block text-sm font-semibold text-foreground"
          >
            Ücretsiz kargo eşiği (₺)
            <input
              id="admin-free-shipping-threshold"
              name="freeShippingThreshold"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              value={form.freeShippingThreshold}
              onChange={(e) =>
                update("freeShippingThreshold", Number(e.target.value))
              }
              className={inputClass}
            />
          </label>
          <label
            htmlFor="admin-shipping-fee"
            className="block text-sm font-semibold text-foreground"
          >
            Sabit kargo ücreti (₺)
            <input
              id="admin-shipping-fee"
              name="shippingFee"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              value={form.shippingFee}
              onChange={(e) => update("shippingFee", Number(e.target.value))}
              className={inputClass}
            />
          </label>
          <label
            htmlFor="admin-estimated-dispatch"
            className="block text-sm font-semibold text-foreground"
          >
            Tahmini kargo süresi
            <input
              id="admin-estimated-dispatch"
              name="estimatedDispatch"
              type="text"
              value={form.estimatedDispatch}
              onChange={(e) => update("estimatedDispatch", e.target.value)}
              placeholder="1-3 iş günü"
              className={inputClass}
            />
          </label>
        </div>
      </section>

      {/* Çalışma Saatleri */}
      <section className="border border-border bg-surface p-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center bg-amber-500/10">
            <ClockIcon
              className="h-4 w-4 text-amber-600"
              aria-hidden="true"
            />
          </span>
          <h2 className="font-heading text-base font-bold text-white">
            Çalışma Saatleri
          </h2>
        </div>
        <div className="mt-5">
          <label
            htmlFor="admin-business-hours"
            className="block text-sm font-semibold text-foreground"
          >
            Mesai saatleri
            <input
              id="admin-business-hours"
              name="businessHours"
              type="text"
              value={form.businessHours}
              onChange={(e) => update("businessHours", e.target.value)}
              placeholder="Pazartesi - Cumartesi, 09:00 - 18:00"
              className={inputClass}
            />
          </label>
          <p className="mt-3 text-xs text-muted">
            Bu bilgiler sitenin footer ve iletişim bölümlerinde gösterilir.
          </p>
        </div>
      </section>

      {/* Merkezi paspas fiyatlandırması — salt okunur */}
      <section className="border border-border bg-surface p-6 lg:col-span-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center bg-green-500/10">
            <ShieldCheckIcon
              className="h-4 w-4 text-green-600"
              aria-hidden="true"
            />
          </span>
          <div>
            <h2 className="font-heading text-base font-bold text-white">
              Merkezi Paspas Fiyatlandırması
            </h2>
            <p className="text-xs text-muted">
              Katalog, ana sayfa ve oluşturucu aynı sabit fiyat kaynağını kullanır.
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {CANONICAL_PRICE_CARDS.map(({ label, value }) => (
            <div
              key={label}
              className="border border-border bg-background/55 px-4 py-3.5"
            >
              <span className="block text-xs font-semibold text-muted">
                {label}
              </span>
              <strong className="mt-1 block text-lg font-bold text-white">
                {formatPrice(value)}
              </strong>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          Bu alanlar sipariş tutarı tutarlılığı için salt okunurdur ve bu
          form kaydedildiğinde değiştirilmez.
        </p>
      </section>

      {/* Kaydet butonu + sonuç mesajı */}
      <div className="flex flex-col gap-3 lg:col-span-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 bg-brand-red px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <LoaderIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
              Kaydediliyor
            </>
          ) : (
            <>
              <SaveIcon className="h-4 w-4" aria-hidden="true" />
              Ayarları Kaydet
            </>
          )}
        </button>
        {message ? (
          <p
            role={message.type === "error" ? "alert" : "status"}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
              message.type === "success" ? "text-green-400" : "text-brand-red"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2Icon className="h-4 w-4" aria-hidden="true" />
            ) : (
              <AlertCircleIcon className="h-4 w-4" aria-hidden="true" />
            )}
            {message.text}
          </p>
        ) : null}
      </div>
    </form>
  );
}
