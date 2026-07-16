"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRightIcon, CheckIcon, ShoppingBagIcon } from "lucide-react";
import type { SimpleIcon } from "simple-icons";
import {
  siAudi,
  siBmw,
  siFord,
  siHonda,
  siHyundai,
  siJeep,
  siToyota,
} from "simple-icons/icons";
import { useCart } from "@/context/cart-context";
import { useStoreSettings } from "@/context/settings-context";
import { getModelsByBrand } from "@/lib/vehicle-data";

const BRANDS = [
  { name: "Mercedes-Benz", icon: null },
  { name: "BMW", icon: siBmw },
  { name: "Audi", icon: siAudi },
  { name: "Toyota", icon: siToyota },
  { name: "Honda", icon: siHonda },
  { name: "Jeep", icon: siJeep },
  { name: "Ford", icon: siFord },
  { name: "Hyundai", icon: siHyundai },
] as const;

const YEARS = ["2020 - 2024", "2015 - 2019", "2010 - 2014", "2005 - 2009"];
const COLORS = ["Beyaz", "Siyah", "Gri", "Bej", "Kahve"];

function BrandMark({ icon, active }: { icon: SimpleIcon | null; active: boolean }) {
  if (!icon) {
    return (
      <svg
        viewBox="0 0 48 48"
        role="img"
        aria-hidden="true"
        className={`h-11 w-11 transition duration-300 group-hover:scale-105 ${active ? "text-sand" : "text-[#dedede]"}`}
      >
        <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M24 5.5 20.6 27 24 24.8 27.4 27 24 5.5Z" fill="currentColor" />
        <path d="m6.7 34.2 20.7-7.1-3.4-2.3-.1-4-17.2 13.4Z" fill="currentColor" />
        <path d="m41.3 34.2-17.2-13.4-.1 4-3.4 2.3 20.7 7.1Z" fill="currentColor" />
      </svg>
    );
  }

  const color = icon.hex === "000000" ? (active ? "#d4d4cf" : "#dedede") : `#${icon.hex}`;

  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
      className="h-10 w-10 transition duration-300 group-hover:scale-105 sm:h-11 sm:w-11"
      style={{ color }}
    >
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

export default function HomeVehicleStudio() {
  const { addItem } = useCart();
  const settings = useStoreSettings();
  const [brand, setBrand] = useState("Mercedes-Benz");
  const [model, setModel] = useState("E Serisi Sedan");
  const [year, setYear] = useState(YEARS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [added, setAdded] = useState(false);

  const models = useMemo(() => getModelsByBrand(brand), [brand]);

  function selectBrand(nextBrand: string) {
    const nextModels = getModelsByBrand(nextBrand);
    setBrand(nextBrand);
    setModel(nextModels[0]?.name ?? "");
  }

  function addConfiguredSet() {
    addItem({
      slug: `ana-sayfa-ozel-set-${brand}-${model}-${color}`.toLocaleLowerCase("tr-TR"),
      name: `Araca Özel Premium EVA Paspas — ${brand} ${model}`,
      image: "/media/eva-complete-beige.png",
      price: settings.matBasePrice,
      color,
      quantity: 1,
      configuration: {
        vehicle: `${brand} ${model} · ${year}`,
        baseColor: color,
        edgeColor: color,
        heelPad: true,
        trunkMat: false,
      },
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  const fieldClass =
    "h-10 w-full rounded-md border border-white/10 bg-black/25 px-3 text-xs text-white outline-none transition hover:border-sand/30 focus:border-sand/60";

  return (
    <section id="arac-sec" className="border-b border-white/[0.07] bg-[#030303] py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:items-end">
          <div>
            <span className="spec-value text-[9px] uppercase tracking-[0.16em] text-white/45">
              Aracını seç
            </span>
            <h2 className="mt-2 font-heading text-2xl font-medium leading-[1.02] text-white sm:text-3xl">
              Her Araca Özel<br />Üretim
            </h2>
            <p className="mt-3 max-w-xs text-xs leading-5 text-white/48">
              Marka, model ve yılı seçerek aracınıza özel paspasları görüntüleyin.
            </p>
          </div>

          <div className="grid auto-cols-[116px] grid-flow-col gap-2 overflow-x-auto pb-2 sm:auto-cols-[126px]">
            {BRANDS.map((item) => {
              const active = item.name === brand;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => selectBrand(item.name)}
                  aria-pressed={active}
                  className={`group relative flex h-[116px] flex-col items-center justify-center overflow-hidden rounded-md border px-2 transition-all duration-300 ${
                    active
                      ? "border-sand/70 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,.05),transparent_65%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,.04),0_10px_35px_rgba(0,0,0,.35)]"
                      : "border-white/[0.07] bg-[#0c0c0a] hover:border-white/15 hover:bg-sand/[0.035]"
                  }`}
                >
                  <span className="relative flex h-12 w-full items-center justify-center">
                    <BrandMark icon={item.icon} active={active} />
                  </span>
                  <span className="mt-2 text-[9px] font-medium uppercase tracking-[0.08em] text-white/65">
                    {item.name.replace("-Benz", "")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid overflow-hidden rounded-lg border border-sand/10 bg-[#10100d] lg:grid-cols-[1.15fr_.46fr_.78fr]">
          <div className="relative min-h-[300px] overflow-hidden border-b border-sand/10 lg:min-h-[360px] lg:border-b-0 lg:border-r">
            <Image
              src="/media/galeri/musteri/photo_5949742393730993947_y.webp"
              alt="Mercedes iç mekânında beyaz EVA paspasın gerçek uygulaması"
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              quality={90}
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5" />
            <div className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] text-white/70 backdrop-blur-md">
              Gerçek araç içi önizleme
            </div>
          </div>

          <div className="border-b border-sand/10 p-5 lg:border-b-0 lg:border-r lg:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-sand">
              Paspasını kişiselleştir
            </p>
            <div className="mt-5 space-y-3">
              <label className="block text-[8px] uppercase tracking-[0.12em] text-white/40">
                Marka
                <select value={brand} onChange={(event) => selectBrand(event.target.value)} className={`${fieldClass} mt-1`}>
                  {BRANDS.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                </select>
              </label>
              <label className="block text-[8px] uppercase tracking-[0.12em] text-white/40">
                Model
                <select value={model} onChange={(event) => setModel(event.target.value)} className={`${fieldClass} mt-1`}>
                  {models.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                </select>
              </label>
              <label className="block text-[8px] uppercase tracking-[0.12em] text-white/40">
                Yıl
                <select value={year} onChange={(event) => setYear(event.target.value)} className={`${fieldClass} mt-1`}>
                  {YEARS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="block text-[8px] uppercase tracking-[0.12em] text-white/40">
                Renk
                <select value={color} onChange={(event) => setColor(event.target.value)} className={`${fieldClass} mt-1`}>
                  {COLORS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>
            <button
              type="button"
              onClick={addConfiguredSet}
              className="btn-press btn-red-rich mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-md text-[10px] font-bold uppercase tracking-[0.08em]"
            >
              {added ? <CheckIcon className="h-4 w-4" aria-hidden="true" /> : <ShoppingBagIcon className="h-4 w-4" aria-hidden="true" />}
              {added ? "Sepete Eklendi" : "Sepete Ekle"}
            </button>
          </div>

          <div className="premium-grid relative min-h-[300px] overflow-hidden bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,.04),transparent_62%)] lg:min-h-[360px]">
            <Image
              src="/media/scraped/evaotopaspas/paspas-seti/02-siyah-urun-tam.png"
              alt="Araca özel EVA paspas seti"
              fill
              sizes="(min-width: 1024px) 30vw, 100vw"
              className="object-contain p-7 transition-transform duration-700 hover:scale-[1.03]"
            />
            <Link
              href="/olusturucu"
              className="absolute bottom-4 right-4 inline-flex h-10 items-center gap-2 rounded-full border border-sand/30 bg-black/55 px-4 text-[9px] font-semibold uppercase tracking-[0.1em] text-sand backdrop-blur-md hover:border-sand/60"
            >
              Tüm seçenekler
              <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
