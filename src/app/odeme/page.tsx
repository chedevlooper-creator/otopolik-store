"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppOrderLink } from "@/lib/site-config";
import { getShippingCost } from "@/lib/shipping";

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
  const [paymentMethod, setPaymentMethod] = useState<"kapida" | "whatsapp">("whatsapp");
  const shippingCost = getShippingCost(totalPrice);
  const orderTotal = totalPrice + shippingCost;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-extrabold text-neutral-900">Sepetiniz boş</h1>
        <p className="mt-2 text-neutral-600">Ödeme adımına geçmeden önce sepetinize ürün ekleyin.</p>
        <Link
          href="/urunler"
          className="mt-6 inline-flex rounded-full bg-brand-red px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-red-700"
        >
          Ürünleri İncele
        </Link>
      </div>
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

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
    window.open(href, "_blank", "noopener,noreferrer");
    router.push("/tesekkurler");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <h1 className="font-heading text-3xl font-extrabold text-neutral-900">Sipariş Talebi</h1>
      <p className="mt-2 text-neutral-600">
        Sipariş bilgilerinizi iletin; WhatsApp üzerinden siparişinizi onaylayalım.
        Kapıda ödeme seçeneğinde ek hizmet bedeli uygulanmaz.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-neutral-800">
              Ad Soyad
              <input
                required
                type="text"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-neutral-300 px-4 py-2.5 font-normal focus:border-brand-red focus:outline-none"
              />
            </label>
            <label className="block text-sm font-semibold text-neutral-800">
              Telefon
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="05XX XXX XX XX"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 px-4 py-2.5 font-normal focus:border-brand-red focus:outline-none"
              />
            </label>
          </div>

          <label className="block text-sm font-semibold text-neutral-800">
            Şehir
            <input
              required
              type="text"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-neutral-300 px-4 py-2.5 font-normal focus:border-brand-red focus:outline-none"
            />
          </label>

          <label className="block text-sm font-semibold text-neutral-800">
            Adres
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-neutral-300 px-4 py-2.5 font-normal focus:border-brand-red focus:outline-none"
            />
          </label>

          <label className="block text-sm font-semibold text-neutral-800">
            Sipariş Notu (opsiyonel)
            <textarea
              rows={2}
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-neutral-300 px-4 py-2.5 font-normal focus:border-brand-red focus:outline-none"
            />
          </label>

          <div>
            <p className="mb-2 text-sm font-semibold text-neutral-800">Ödeme Şekli</p>
            <div className="space-y-2">
              <label className="flex items-center gap-3 rounded-xl border border-neutral-300 px-4 py-3 has-[:checked]:border-brand-red has-[:checked]:bg-red-50">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "whatsapp"}
                  onChange={() => setPaymentMethod("whatsapp")}
                  className="accent-brand-red"
                />
                <span className="text-sm font-medium text-neutral-800">
                  WhatsApp üzerinden sipariş onayı
                </span>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-neutral-300 px-4 py-3 has-[:checked]:border-brand-red has-[:checked]:bg-red-50">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "kapida"}
                  onChange={() => setPaymentMethod("kapida")}
                  className="accent-brand-red"
                />
                <span className="text-sm font-medium text-neutral-800">Kapıda Ödeme</span>
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-neutral-300 px-4 py-3 opacity-60">
                <input type="radio" disabled />
                <span className="text-sm font-medium text-neutral-500">
                  Kredi kartı ile ödeme — yakında aktif olacak
                </span>
              </div>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-neutral-200 p-6">
          <h2 className="font-heading text-lg font-bold text-neutral-900">Sipariş Özeti</h2>
          <ul className="mt-4 space-y-2 text-sm text-neutral-600">
            {items.map((item) => (
              <li key={`${item.slug}-${item.color}`} className="flex justify-between gap-2">
                <span className="line-clamp-1">
                  {item.name} ({item.color}) × {item.quantity}
                </span>
                <span className="shrink-0 font-semibold text-neutral-900">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
            <span className="text-sm text-neutral-600">Kargo</span>
            <span className="text-sm font-semibold text-neutral-900">{shippingCost === 0 ? "Ücretsiz" : formatPrice(shippingCost)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-heading font-bold text-neutral-900">Toplam</span>
            <span className="font-heading text-xl font-extrabold text-brand-red">
              {formatPrice(orderTotal)}
            </span>
          </div>
          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center rounded-full bg-brand-red px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-red-700"
          >
            Sipariş Talebini Gönder
          </button>
        </aside>
      </form>
    </div>
  );
}
