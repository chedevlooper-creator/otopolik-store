"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllBrands, getModelsByBrand } from "@/lib/vehicle-data";
import { ArrowRightIcon, InfoIcon, SparklesIcon } from "lucide-react";

export default function VehicleFinder() {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const brandList = useMemo(() => getAllBrands(), []);
  const models = useMemo(() => (brand ? getModelsByBrand(brand) : []), [brand]);
  const filledCount = [brand, model, year].filter(Boolean).length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = new URLSearchParams();
    if (brand) query.set("marka", brand);
    if (model) query.set("model", model);
    if (year) query.set("yil", year);
    router.push(query.size ? `/olusturucu?${query.toString()}` : "/olusturucu");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="vehicle-finder"
      aria-labelledby="vehicle-finder-title"
      data-progress={filledCount}
    >
      <div className="vehicle-finder__glow" aria-hidden="true" />
      <div className="vehicle-finder__texture bg-eva" aria-hidden="true" />

      <div className="vehicle-finder__head">
        <div>
          <p className="vehicle-finder__eyebrow">
            <SparklesIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Kalıp eşleştirme
          </p>
          <p id="vehicle-finder-title" className="vehicle-finder__title">
            Aracını seç
          </p>
          <p className="vehicle-finder__sub">
            Marka, model ve yıl — kalıbı saniyeler içinde bul.
          </p>
        </div>
        <div className="vehicle-finder__stats" aria-hidden="true">
          <div className="vehicle-finder__stat">
            <strong>40+</strong>
            <span>Marka</span>
          </div>
          <div className="vehicle-finder__stat">
            <strong>6000+</strong>
            <span>Model</span>
          </div>
        </div>
      </div>

      <div
        className="vehicle-finder__progress"
        role="progressbar"
        aria-valuenow={filledCount}
        aria-valuemin={0}
        aria-valuemax={3}
        aria-label="Form ilerleme"
      >
        <span data-active={filledCount >= 1 || undefined} />
        <span data-active={filledCount >= 2 || undefined} />
        <span data-active={filledCount >= 3 || undefined} />
      </div>

      <div className="vehicle-finder__grid">
        <div className={`vehicle-finder__field ${brand ? "is-filled" : ""}`}>
          <label htmlFor="finder-brand" className="vehicle-finder__label">
            <span className="vehicle-finder__step">1</span>
            Marka
          </label>
          <select
            id="finder-brand"
            name="marka"
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value);
              setModel("");
            }}
            className="brand-select"
          >
            <option value="">Marka seçin</option>
            {brandList.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className={`vehicle-finder__field ${model ? "is-filled" : ""}`}>
          <label htmlFor="finder-model" className="vehicle-finder__label">
            <span className="vehicle-finder__step">2</span>
            Model / Kasa
          </label>
          <select
            id="finder-model"
            name="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!brand}
            className="brand-select"
          >
            <option value="">{brand ? "Model seçin" : "Önce marka"}</option>
            {models.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className={`vehicle-finder__field ${year ? "is-filled" : ""}`}>
          <label htmlFor="finder-year" className="vehicle-finder__label">
            <span className="vehicle-finder__step">3</span>
            Model yılı
          </label>
          <input
            id="finder-year"
            name="yil"
            inputMode="numeric"
            enterKeyHint="go"
            value={year}
            onChange={(e) => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
            maxLength={4}
            pattern="[0-9]{4}"
            placeholder="2021"
            className="brand-input"
            autoComplete="off"
          />
        </div>

        <button type="submit" className="btn-press btn-sand-rich vehicle-finder__submit">
          Tasarıma geç
          <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {brand && model && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-xs text-white/62">
          <InfoIcon className="h-4 w-4 shrink-0 text-sand" aria-hidden="true" />
          <span>
            {brand} {model} paspas fiyatını ve özelliklerini mi merak ediyorsunuz?{' '}
            <Link
              href={`/arac/${brand.toLocaleLowerCase('tr-TR').replace(/ç/g,'c').replace(/ğ/g,'g').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ş/g,'s').replace(/ü/g,'u').replace(/[^a-z0-9]+/g,'-')}-${model.toLocaleLowerCase('tr-TR').replace(/ç/g,'c').replace(/ğ/g,'g').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ş/g,'s').replace(/ü/g,'u').replace(/[^a-z0-9]+/g,'-')}`}
              className="font-semibold text-sand hover:underline"
            >
              Araç sayfasına git →
            </Link>
          </span>
        </div>
      )}
    </form>
  );
}
