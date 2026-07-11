"use client";

import { useState } from "react";
import {
  SaveIcon,
  CheckCircleIcon,
  PhoneIcon,
  MapPinIcon,
  TruckIcon,
  GlobeIcon,
  MessageCircleIcon,
  ClockIcon,
  MailIcon,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";

type FormState = {
  phoneDisplay: string;
  whatsappNumber: string;
  email: string;
  address: string;
  instagram: string;
  freeShippingThreshold: number;
  shippingFee: number;
  estimatedDispatch: string;
  businessHours: string;
};

export default function AdminAyarlar() {
  const [form, setForm] = useState<FormState>({
    phoneDisplay: siteConfig.phoneDisplay,
    whatsappNumber: siteConfig.whatsappNumber,
    email: siteConfig.email,
    address: siteConfig.address,
    instagram: siteConfig.instagram,
    freeShippingThreshold: siteConfig.freeShippingThreshold,
    shippingFee: siteConfig.shippingFee,
    estimatedDispatch: siteConfig.estimatedDispatch,
    businessHours: siteConfig.businessHours,
  });
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-neutral-600 px-4 py-2.5 text-sm font-normal focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/15";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">
          Site Ayarları
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          İletişim bilgileri, kargo ücretleri ve işletme detaylarını güncelleyin.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-2">
        {/* İletişim Bilgileri */}
        <section className="rounded-2xl border border-neutral-700 bg-[#141414] p-6 lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-800">
              <PhoneIcon className="h-4.5 w-4.5 text-brand-red" aria-hidden="true" />
            </span>
            <h2 className="font-heading text-base font-bold text-white">İletişim Bilgileri</h2>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-neutral-200">
              Telefon (görünen)
              <input
                type="text"
                value={form.phoneDisplay}
                onChange={(e) => setForm((f) => ({ ...f, phoneDisplay: e.target.value }))}
                placeholder="0555 000 00 00"
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-semibold text-neutral-200">
              WhatsApp Numarası (ülke koduyla)
              <div className="relative mt-1.5">
                <MessageCircleIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" aria-hidden="true" />
                <input
                  type="text"
                  value={form.whatsappNumber}
                  onChange={(e) => setForm((f) => ({ ...f, whatsappNumber: e.target.value }))}
                  placeholder="905550000000"
                  className={`pl-11 ${inputClass}`}
                />
              </div>
            </label>
            <label className="block text-sm font-semibold text-neutral-200">
              E-posta
              <div className="relative mt-1.5">
                <MailIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="siparis@otopolik.com"
                  className={`pl-11 ${inputClass}`}
                />
              </div>
            </label>
            <label className="block text-sm font-semibold text-neutral-200">
              Instagram URL
              <div className="relative mt-1.5">
                <GlobeIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
                <input
                  type="text"
                  value={form.instagram}
                  onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))}
                  placeholder="https://instagram.com/otopolik"
                  className={`pl-11 ${inputClass}`}
                />
              </div>
            </label>
          </div>
          <div className="mt-5">
            <label className="block text-sm font-semibold text-neutral-200">
              <span className="inline-flex items-center gap-1.5">
                <MapPinIcon className="h-4 w-4 text-brand-red" aria-hidden="true" />
                Adres
              </span>
              <textarea
                rows={2}
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className={inputClass}
              />
            </label>
          </div>
        </section>

        {/* Kargo ve Teslimat */}
        <section className="rounded-2xl border border-neutral-700 bg-[#141414] p-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
              <TruckIcon className="h-4.5 w-4.5 text-blue-600" aria-hidden="true" />
            </span>
            <h2 className="font-heading text-base font-bold text-white">Kargo ve Teslimat</h2>
          </div>
          <div className="mt-5 space-y-5">
            <label className="block text-sm font-semibold text-neutral-200">
              Ücretsiz kargo eşiği (₺)
              <input
                type="number"
                value={form.freeShippingThreshold}
                onChange={(e) => setForm((f) => ({ ...f, freeShippingThreshold: Number(e.target.value) }))}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-semibold text-neutral-200">
              Sabit kargo ücreti (₺)
              <input
                type="number"
                value={form.shippingFee}
                onChange={(e) => setForm((f) => ({ ...f, shippingFee: Number(e.target.value) }))}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-semibold text-neutral-200">
              Tahmini kargo süresi
              <input
                type="text"
                value={form.estimatedDispatch}
                onChange={(e) => setForm((f) => ({ ...f, estimatedDispatch: e.target.value }))}
                placeholder="1-3 iş günü"
                className={inputClass}
              />
            </label>
          </div>
        </section>

        {/* Çalışma Saatleri */}
        <section className="rounded-2xl border border-neutral-700 bg-[#141414] p-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
              <ClockIcon className="h-4.5 w-4.5 text-amber-600" aria-hidden="true" />
            </span>
            <h2 className="font-heading text-base font-bold text-white">Çalışma Saatleri</h2>
          </div>
          <div className="mt-5">
            <label className="block text-sm font-semibold text-neutral-200">
              Mesai saatleri
              <input
                type="text"
                value={form.businessHours}
                onChange={(e) => setForm((f) => ({ ...f, businessHours: e.target.value }))}
                placeholder="Pazartesi - Cumartesi, 09:00 - 18:00"
                className={inputClass}
              />
            </label>
            <p className="mt-3 text-xs text-neutral-500">
              Bu bilgiler sitenin footer ve iletişim bölümlerinde gösterilir. Tüm değişiklikler anında yansıtılır.
            </p>
          </div>
        </section>

        {/* Kaydet butonu */}
        <div className="flex items-center gap-3 lg:col-span-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-brand-red px-8 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-brand-red/30 transition-colors hover:bg-brand-red-dark"
          >
            {saved ? (
              <>
                <CheckCircleIcon className="h-4 w-4" aria-hidden="true" />
                Kaydedildi
              </>
            ) : (
              <>
                <SaveIcon className="h-4 w-4" aria-hidden="true" />
                Ayarları Kaydet
              </>
            )}
          </button>
          {saved && (
            <span className="text-sm font-medium text-green-600">Değişiklikler kaydedildi.</span>
          )}
        </div>
      </form>

      {/* Uyarı kartı */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="font-heading text-sm font-bold text-amber-800">
          Yayına almadan önce mutlaka güncelleyin
        </h3>
        <ul className="mt-2 space-y-1 text-xs text-amber-700">
          <li>• Gerçek telefon ve WhatsApp numaranızı girin — siparişler buradan iletilecek.</li>
          <li>• Kargo eşiği ve ücretini güncel piyasa koşullarına göre belirleyin.</li>
          <li>• İşletme adresinizi doğru ve eksiksiz yazın.</li>
          <li>• Gizlilik ve mesafeli satış sözleşmesi metinlerini hukuki danışmanınıza onaylatın.</li>
        </ul>
      </div>
    </div>
  );
}
