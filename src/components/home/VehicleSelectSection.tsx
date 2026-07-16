"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAllBrands, getModelsByBrand } from "@/lib/vehicle-data";
import { FEATURED_BRANDS, getBrandLogoSrc } from "@/lib/brand-logos";
import ColorPreview from "@/components/home/ColorPreview";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingCartIcon,
  TruckIcon,
  BadgeCheckIcon,
  ShieldCheckIcon,
  RotateCcwIcon,
} from "lucide-react";

const YEAR_OPTIONS = [
  "2020 - 2024",
  "2015 - 2019",
  "2010 - 2014",
  "2005 - 2009",
  "2000 - 2004",
] as const;

const COLOR_NAMES = ["Siyah", "Gri", "Bej", "Kırmızı", "Mavi", "Beyaz"] as const;

const BRAND_SCENE: Record<string, string> = {
  BMW: "/media/galeri/paspas-seti/10-siyah-surucu.jpg",
  Audi: "/media/galeri/paspas-seti/11-siyah-on-yolcu-suv.jpg",
  Volkswagen: "/media/galeri/paspas-seti/08-siyah-arka-sira.jpg",
  "Mercedes-Benz": "/media/galeri/paspas-seti/18-bej-surucu.jpg",
  Jeep: "/media/galeri/paspas-seti/11-siyah-on-yolcu-suv.jpg",
  Ford: "/media/galeri/paspas-seti/15-gri-surucu.jpg",
  Toyota: "/media/galeri/paspas-seti/03-taba-surucu.jpg",
  Honda: "/media/galeri/paspas-seti/04-taba-on-yolcu.jpg",
};

const TRUST = [
  { label: "Ücretsiz kargo", Icon: TruckIcon },
  { label: "Memnuniyet", Icon: BadgeCheckIcon },
  { label: "Güvenli ödeme", Icon: ShieldCheckIcon },
  { label: "Kolay iade", Icon: RotateCcwIcon },
] as const;

function orderedBrands(): string[] {
  const all = getAllBrands();
  const featuredSet = new Set<string>(
    FEATURED_BRANDS.filter((b) => all.includes(b))
  );
  const featured = FEATURED_BRANDS.filter((b) => featuredSet.has(b));
  const rest = all.filter((b) => !featuredSet.has(b));
  return [...featured, ...rest];
}

export default function VehicleSelectSection() {
  const router = useRouter();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const brands = useMemo(() => orderedBrands(), []);

  const [brand, setBrand] = useState(brands[0] ?? "");
  const [model, setModel] = useState("");
  const [year, setYear] = useState<string>(YEAR_OPTIONS[0]);
  const [color, setColor] = useState<string>(COLOR_NAMES[0]);

  const models = useMemo(() => (brand ? getModelsByBrand(brand) : []), [brand]);

  function selectBrand(next: string) {
    setBrand(next);
    setModel("");
  }

  function scrollBrands(dir: -1 | 1) {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = new URLSearchParams();
    if (brand) query.set("marka", brand);
    if (model) query.set("model", model);
    if (year) query.set("yil", year);
    if (color) query.set("renk", color);
    router.push(query.size ? `/olusturucu?${query.toString()}` : "/olusturucu");
  }

  return (
    <>
      <section id="arac-sec" className="vehicle-select home-section border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="section-kicker">Marka</p>
              <h2 className="section-title mt-5">Markanı seç</h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/55">
                Markayı seçin; model ve yıl adımında aracınıza özel kalıbı eşleştirelim.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="brand-picker__nav"
                onClick={() => scrollBrands(-1)}
                aria-label="Önceki markalar"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="brand-picker__nav"
                onClick={() => scrollBrands(1)}
                aria-label="Sonraki markalar"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            ref={scrollerRef}
            className="brand-picker__track mt-8"
            role="listbox"
            aria-label="Araç markaları"
          >
            {brands.map((name) => {
              const logo = getBrandLogoSrc(name);
              const scene = BRAND_SCENE[name] ?? "/media/galeri/paspas-seti/10-siyah-surucu.jpg";
              const selected = brand === name;
              return (
                <button
                  key={name}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`brand-card ${selected ? "is-selected" : ""}`}
                  onClick={() => selectBrand(name)}
                >
                  <span className="brand-card__logo-wrap">
                    {logo ? (
                      <Image
                        src={logo}
                        alt=""
                        width={80}
                        height={36}
                        className="brand-card__logo"
                      />
                    ) : (
                      <span className="brand-card__fallback">{name.slice(0, 2)}</span>
                    )}
                  </span>
                  <span className="brand-card__scene">
                    <Image
                      src={scene}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="180px"
                    />
                  </span>
                  <span className="brand-card__name">{name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <ColorPreview color={color} onColorChange={setColor} />

      <section className="personalize-band home-section border-t border-white/[0.04]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <form className="personalize-glass" onSubmit={handleSubmit}>
            <p className="product-config__eyebrow">Paspasını kişiselleştir</p>
            <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-white sm:text-3xl">
              Aracına özel seti oluştur
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <label className="product-config__field">
                <span>Marka</span>
                <select
                  className="product-config__select"
                  value={brand}
                  onChange={(e) => selectBrand(e.target.value)}
                >
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>

              <label className="product-config__field">
                <span>Model</span>
                <select
                  className="product-config__select"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={!brand}
                >
                  <option value="">Model seçin</option>
                  {models.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="product-config__field">
                <span>Yıl</span>
                <select
                  className="product-config__select"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>

              <label className="product-config__field">
                <span>Renk</span>
                <select
                  className="product-config__select"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  {COLOR_NAMES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button type="submit" className="btn-press btn-sand-rich product-config__submit mt-5">
              <ShoppingCartIcon className="h-4 w-4" aria-hidden="true" />
              Sepete ekle
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          <div className="personalize-visual">
            <Image
              src="/media/galeri/paspas-seti/11-siyah-on-yolcu-suv.jpg"
              alt="SUV araç içi EVA paspas uygulaması"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="personalize-visual__trust">
              {TRUST.map(({ label, Icon }) => (
                <div key={label} className="flex items-center gap-2 text-white/80">
                  <Icon className="h-3.5 w-3.5 text-sand" aria-hidden="true" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.1em]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
