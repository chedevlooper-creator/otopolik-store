"use client";

import { useState, useCallback, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppOrderLink } from "@/lib/site-config";
import { getShippingCost } from "@/lib/shipping";
import { supabase } from "@/lib/supabase";

interface FormErrors {
  fullName?: string;
  phone?: string;
  city?: string;
  address?: string;
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

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    note: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<"kapida" | "whatsapp">("whatsapp");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shippingCost = getShippingCost(totalPrice);
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
    if (field in { fullName: 1, phone: 1, city: 1, address: 1 }) {
      validateField(field as keyof FormErrors, value);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-extrabold text-white">Sepetiniz boş</h1>
        <p className="mt-2 text-neutral-400">Ödeme adımına geçmeden önce sepetinize ürün ekleyin.</p>
        <Link
          href="/urunler"
          className="mt-6 inline-flex rounded-full bg-brand-red px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-red-dark"
        >
          Ürünleri İncele
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

    if (Object.keys(filteredErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      // Supabase'e siparişi kaydet (Eğer env.local yapılandırılmamışsa veya hata verirse try/catch korur)
      const { error } = await supabase.from("orders").insert([
        {
          full_name: form.fullName,
          phone: form.phone,
          city: form.city,
          address: form.address,
          note: form.note || null,
          payment_method: paymentMethod,
          total_price: totalPrice,
          shipping_cost: shippingCost,
          order_total: orderTotal,
          items: items.map(item => ({
            slug: item.slug,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            color: item.color,
            image: item.image,
          })),
          status: "pending",
        }
      ]);

      if (error) {
        console.error("Supabase order save error:", error);
      }
    } catch (err) {
      console.error("Failed to connect or save to Supabase:", err);
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
      ...items.map(
        (item) => `- ${item.name} (${item.color}) x${item.quantity} — ${formatPrice(item.price * item.quantity)}`
      ),
      "",
      `Ara Toplam: ${formatPrice(totalPrice)}`,
      `Kargo: ${shippingCost === 0 ? "Ücretsiz" : formatPrice(shippingCost)}`,
      `Genel Toplam: ${formatPrice(orderTotal)}`,
    ].filter(Boolean);

    const href = buildWhatsAppOrderLink(lines.join("\n"));
    clearCart();
    setIsSubmitting(false);
    window.open(href, "_blank", "noopener,noreferrer");
    router.push("/tesekkurler");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <h1 className="font-heading text-3xl font-extrabold text-white">Sipariş Talebi</h1>
      <p className="mt-2 text-neutral-400">
        Sipariş bilgilerinizi iletin; WhatsApp üzerinden siparişinizi onaylayalım.
        Kapıda ödeme seçeneğinde ek hizmet bedeli uygulanmaz.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-neutral-200">
              Ad Soyad
              <input
                required
                type="text"
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                onBlur={(e) => validateField("fullName", e.target.value)}
                className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 font-normal focus:outline-none ${
                  errors.fullName ? "border-red-400 focus:border-red-500" : "border-neutral-600 focus:border-brand-red"
                }`}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
              )}
            </label>
            <label className="block text-sm font-semibold text-neutral-200">
              Telefon
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={(e) => validateField("phone", e.target.value)}
                placeholder="05XX XXX XX XX"
                className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 font-normal focus:outline-none ${
                  errors.phone ? "border-red-400 focus:border-red-500" : "border-neutral-600 focus:border-brand-red"
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
              )}
            </label>
          </div>

          <label className="block text-sm font-semibold text-neutral-200">
            Şehir
            <input
              required
              type="text"
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
              onBlur={(e) => validateField("city", e.target.value)}
              className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 font-normal focus:outline-none ${
                errors.city ? "border-red-400 focus:border-red-500" : "border-neutral-600 focus:border-brand-red"
              }`}
            />
            {errors.city && (
              <p className="mt-1 text-xs text-red-500">{errors.city}</p>
            )}
          </label>

          <label className="block text-sm font-semibold text-neutral-200">
            Adres
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              onBlur={(e) => validateField("address", e.target.value)}
              className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 font-normal focus:outline-none ${
                errors.address ? "border-red-400 focus:border-red-500" : "border-neutral-600 focus:border-brand-red"
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-500">{errors.address}</p>
            )}
          </label>

          <label className="block text-sm font-semibold text-neutral-200">
            Sipariş Notu (opsiyonel)
            <textarea
              rows={2}
              value={form.note}
              onChange={(e) => handleChange("note", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-neutral-600 px-4 py-2.5 font-normal focus:border-brand-red focus:outline-none"
            />
          </label>

          <div>
            <p className="mb-2 text-sm font-semibold text-neutral-200">Ödeme Şekli</p>
            <div className="space-y-2">
              <label className="flex items-center gap-3 rounded-xl border border-neutral-600 px-4 py-3 has-[:checked]:border-brand-red has-[:checked]:bg-neutral-800">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "whatsapp"}
                  onChange={() => setPaymentMethod("whatsapp")}
                  className="accent-brand-red"
                />
                <span className="text-sm font-medium text-neutral-200">
                  WhatsApp üzerinden sipariş onayı
                </span>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-neutral-600 px-4 py-3 has-[:checked]:border-brand-red has-[:checked]:bg-neutral-800">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "kapida"}
                  onChange={() => setPaymentMethod("kapida")}
                  className="accent-brand-red"
                />
                <span className="text-sm font-medium text-neutral-200">Kapıda Ödeme</span>
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-neutral-600 px-4 py-3 opacity-60">
                <input type="radio" disabled />
                <span className="text-sm font-medium text-neutral-500">
                  Kredi kartı ile ödeme — yakında aktif olacak
                </span>
              </div>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-neutral-700 p-6">
          <h2 className="font-heading text-lg font-bold text-white">Sipariş Özeti</h2>
          <ul className="mt-4 space-y-2 text-sm text-neutral-400">
            {items.map((item) => (
              <li key={`${item.slug}-${item.color}`} className="flex justify-between gap-2">
                <span className="line-clamp-1">
                  {item.name} ({item.color}) × {item.quantity}
                </span>
                <span className="shrink-0 font-semibold text-white">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-neutral-700 pt-4">
            <span className="text-sm text-neutral-400">Kargo</span>
            <span className="text-sm font-semibold text-white">{shippingCost === 0 ? "Ücretsiz" : formatPrice(shippingCost)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-heading font-bold text-white">Toplam</span>
            <span className="font-heading text-xl font-extrabold text-brand-red">
              {formatPrice(orderTotal)}
            </span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || hasErrors}
            className="mt-6 flex w-full items-center justify-center rounded-full bg-brand-red px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-red-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Gönderiliyor..." : "Sipariş Talebini Gönder"}
          </button>
        </aside>
      </form>
    </div>
  );
}
