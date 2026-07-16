"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useRef } from "react";
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronRightIcon,
  ShoppingBagIcon,
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  TimerIcon,
  Maximize2Icon,
  Rotate3dIcon,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useStoreSettings } from "@/context/settings-context";
import { formatPrice } from "@/lib/format";
import { calculateMatPrice } from "@/lib/mat-pricing";
import { getAllBrands, getModelsByBrand, getVehiclePrice } from "@/lib/vehicle-data";
import {
  formatVehicleLabel,
  vehicleDetailsKey,
} from "@/lib/vehicle-compatibility";

// Stüdyo kalitesinde araç fotoğrafı bulunan 6 marka (public/media/cars/)
const QUICK_BRANDS = [
  {
    name: "Mercedes-Benz",
    short: "MERCEDES",
    customerPhoto: "/media/cars/mercedes.jpg",
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="2" x2="12" y2="12" />
        <line x1="12" y1="12" x2="3.3" y2="17" />
        <line x1="12" y1="12" x2="20.7" y2="17" />
      </svg>
    ),
  },
  {
    name: "BMW",
    short: "BMW",
    customerPhoto: "/media/cars/bmw.jpg",
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="7.5" strokeDasharray="2 2" />
        <path d="M12 4.5v15M4.5 12h15" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    name: "Audi",
    short: "AUDI",
    customerPhoto: "/media/cars/audi.jpg",
    logo: (
      <svg viewBox="0 0 50 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-10 w-10 mt-1">
        <circle cx="13" cy="12" r="6" />
        <circle cx="21" cy="12" r="6" />
        <circle cx="29" cy="12" r="6" />
        <circle cx="37" cy="12" r="6" />
      </svg>
    ),
  },
  {
    name: "Toyota",
    short: "TOYOTA",
    customerPhoto: "/media/cars/toyota.jpg",
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <ellipse cx="12" cy="12" rx="10" ry="6" />
        <ellipse cx="12" cy="12" rx="3.5" ry="6" />
        <ellipse cx="12" cy="9.5" rx="8" ry="2.5" />
      </svg>
    ),
  },
  {
    name: "Jeep",
    short: "JEEP",
    customerPhoto: "/media/cars/jeep.jpg",
    logo: (
      <span className="font-heading font-black tracking-tighter text-xs uppercase mt-1">Jeep</span>
    ),
  },
  {
    name: "Ford",
    short: "FORD",
    customerPhoto: "/media/cars/ford.jpg",
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <ellipse cx="12" cy="12" rx="10" ry="5.5" />
        <ellipse cx="12" cy="12" rx="8.5" ry="4" strokeDasharray="1 1" />
        <text x="12" y="14.5" fontFamily="Georgia, serif" fontSize="7" fontWeight="bold" fontStyle="italic" textAnchor="middle" fill="currentColor">Ford</text>
      </svg>
    ),
  },
] as const;

// Colors defined in the color picker of the mockup
const COLOR_OPTIONS = [
  { name: "Siyah", hex: "#111111", glow: "rgba(255,255,255,0.06)", image: "/media/configurator/siyah-siyah.png" },
  { name: "Gri", hex: "#5b5b5b", glow: "rgba(120,120,120,0.15)", image: "/media/configurator/siyah-gri.png" },
  { name: "Bej", hex: "#c9b38d", glow: "rgba(201,179,141,0.18)", image: "/media/configurator/siyah-bej.png" },
  { name: "Turuncu", hex: "#d7682f", glow: "rgba(215,104,47,0.18)", image: "/media/configurator/siyah-turuncu.png" },
  { name: "Mavi", hex: "#234d8f", glow: "rgba(35,77,143,0.18)", image: "/media/configurator/siyah-mavi.png" },
  { name: "Mor", hex: "#65468b", glow: "rgba(101,70,139,0.18)", image: "/media/configurator/siyah-mor.png" },
  { name: "Yeşil", hex: "#356b4c", glow: "rgba(53,107,76,0.18)", image: "/media/configurator/siyah-yesil.png" },
] as const;

const YEARS = Array.from({ length: 38 }, (_, index) => String(2027 - index));

// Marka rozeti fotoğrafta net teyit edilemediği için başlıklar nötr tutulur
const REAL_APPLICATIONS = [
  { src: "/media/galeri/musteri/photo_5906683564177165681_w.webp", label: "Ön koltuk uygulaması" },
  { src: "/media/galeri/musteri/photo_5845771899898629465_w.webp", label: "Arka bagaj havuzu" },
  { src: "/media/galeri/musteri/photo_5845771899898629467_w.webp", label: "Ön torpido detayı" },
  { src: "/media/galeri/musteri/photo_6030412024262626515_w.webp", label: "Arka koltuk paspası" },
  { src: "/media/galeri/musteri/photo_5866003077058465479_w.webp", label: "Sürücü koltuğu detayı" },
];

export default function HomeConfiguratorShowcase() {
  const { addItem } = useCart();
  const settings = useStoreSettings();

  // Configuration States
  const [selectedBrand, setSelectedBrand] = useState<string>("Mercedes-Benz");
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    const initialModels = getModelsByBrand("Mercedes-Benz");
    return initialModels[0]?.name ?? "";
  });
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedBodyOrChassis, setSelectedBodyOrChassis] = useState("");
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);

  // Interaction States
  const [isZoomed, setIsZoomed] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [comparePosition, setComparePosition] = useState(50);
  const [added, setAdded] = useState(false);

  // DOM Refs
  const brandScrollRef = useRef<HTMLDivElement>(null);

  // Initialize and list models dynamically
  const allBrands = useMemo(() => getAllBrands(), []);
  const models = useMemo(() => getModelsByBrand(selectedBrand), [selectedBrand]);

  // Find active brand details
  const activeBrandDetails = useMemo(() => {
    return QUICK_BRANDS.find((b) => b.name === selectedBrand) ?? QUICK_BRANDS[0];
  }, [selectedBrand]);

  // Brand Scroll Handlers
  const scrollBrands = (direction: "left" | "right") => {
    if (brandScrollRef.current) {
      const scrollAmount = 240;
      brandScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleBrandSelect = (brandName: string) => {
    setSelectedBrand(brandName);
    setSelectedBodyOrChassis("");
    const nextModels = getModelsByBrand(brandName);
    if (nextModels.length > 0) {
      setSelectedModel(nextModels[0].name);
    }
  };

  const activeColor = COLOR_OPTIONS[selectedColorIdx];
  const vehicleDetails = {
    brand: selectedBrand,
    model: selectedModel,
    year: selectedYear,
    bodyOrChassis: selectedBodyOrChassis,
  };
  const canAddConfiguredSet = Boolean(
    selectedModel && /^\d{4}$/.test(selectedYear) && selectedBodyOrChassis.trim()
  );
  const configuredPrice = calculateMatPrice({
    basePrice: getVehiclePrice(selectedBrand, selectedModel),
    heelPad: false,
    trunkMat: false,
  });

  // Add to Cart
  const handleAddToCart = () => {
    if (!canAddConfiguredSet) return;
    const vehicleLabel = formatVehicleLabel(vehicleDetails);
    addItem({
      slug: `ozel-tasarim-${vehicleDetailsKey(vehicleDetails)}-siyah-${activeColor.name}`.toLocaleLowerCase("tr-TR"),
      name: `Araca Özel Premium EVA Paspas - ${vehicleLabel}`,
      image: activeColor.image,
      price: configuredPrice,
      color: `Siyah / ${activeColor.name}`,
      quantity: 1,
      configuration: {
        vehicle: vehicleLabel,
        baseColor: "Siyah",
        edgeColor: activeColor.name,
        heelPad: false,
        trunkMat: false,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section id="arac-sec" className="overflow-hidden border-y border-white/[0.07] bg-black py-14 text-white md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16">
          <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-end">
            <div>
              <h2 className="font-heading text-3xl font-medium tracking-tight text-white sm:text-4xl">
                Her araca özel üretim
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">
                Marka, model ve yılı seçerek aracınıza özel paspasları görüntüleyin.
              </p>
              <Link
                href="/olusturucu"
                className="btn-press btn-ghost-rich mt-4 inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold text-sand"
              >
                Tam oluşturucuya git
                <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            {/* Horizontal Brand Select Buttons Row */}
            <div className="relative group">
              <div
                ref={brandScrollRef}
                className="flex gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x snap-mandatory pr-10"
                style={{ scrollbarWidth: "none" }}
              >
                {QUICK_BRANDS.map((item) => {
                  const isActive = item.name === selectedBrand;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleBrandSelect(item.name)}
                      aria-pressed={isActive}
                      aria-label={`${item.name} markasını seç`}
                      className={`mac-glass flex h-[78px] w-[100px] shrink-0 flex-col items-center justify-center rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "border-sand/50 text-sand shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_16px_40px_rgba(0,0,0,.4)]"
                          : "text-white/55 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div className={`flex h-7 items-center justify-center transition-colors duration-300 ${
                        isActive ? "text-sand" : "text-white/40"
                      }`}>
                        {item.logo}
                      </div>
                      <span className="mt-1.5 text-[8.5px] font-bold uppercase tracking-wider block">
                        {item.short}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Scroll Right Trigger icon */}
              <button
                onClick={() => scrollBrands("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white backdrop-blur-sm transition hover:border-sand/40 hover:bg-black/95 active:scale-95"
                aria-label="Markaları Kaydır"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mac-glass grid items-stretch gap-4 overflow-hidden rounded-3xl p-4 sm:p-5 lg:grid-cols-[1.15fr_1fr_1.15fr]">
            <figure className="relative min-h-[260px] overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0a] sm:min-h-[320px]">
              <Image
                src={activeBrandDetails.customerPhoto}
                alt={`${selectedBrand} markasına ait örnek paspas uygulaması`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 text-[11px] font-medium tracking-wide text-white/70">
                {selectedBrand} örnek uygulama
              </figcaption>
            </figure>

            <div className="flex flex-col justify-between p-2">
              <div>
                <h3 className="mb-5 font-heading text-lg font-medium text-white">
                  Paspasını kişiselleştir
                </h3>

                <div className="space-y-4">
                  {/* Brand select */}
                  <div>
                    <label htmlFor="home-config-brand" className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/70">
                      Marka
                    </label>
                    <select
                      id="home-config-brand"
                      value={selectedBrand}
                      onChange={(e) => handleBrandSelect(e.target.value)}
                      className="input-rich h-10 w-full rounded-xl border border-white/10 px-3 text-xs text-white outline-none transition hover:border-white/25 focus:border-sand/60"
                    >
                      {allBrands.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="home-config-model" className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/70">
                      Model
                    </label>
                    <select
                      id="home-config-model"
                      value={selectedModel}
                      onChange={(e) => {
                        setSelectedModel(e.target.value);
                        setSelectedBodyOrChassis("");
                      }}
                      className="input-rich h-10 w-full rounded-xl border border-white/10 px-3 text-xs text-white outline-none transition hover:border-white/25 focus:border-sand/60"
                    >
                      {models.map((m) => (
                        <option key={m.name} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="home-config-year" className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/70">
                      Yıl
                    </label>
                    <select
                      id="home-config-year"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="input-rich h-10 w-full rounded-xl border border-white/10 px-3 text-xs text-white outline-none transition hover:border-white/25 focus:border-sand/60"
                    >
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="home-config-body" className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/70">
                      Kasa / versiyon
                    </label>
                    <input
                      id="home-config-body"
                      type="text"
                      value={selectedBodyOrChassis}
                      onChange={(e) => setSelectedBodyOrChassis(e.target.value)}
                      placeholder="Örn. W205 / Sport"
                      className="input-rich h-10 w-full rounded-xl border border-white/10 px-3 text-xs text-white outline-none transition placeholder:text-white/40 hover:border-white/25 focus:border-sand/60"
                    />
                  </div>

                  <div>
                    <label htmlFor="home-config-color" className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/70">
                      Kenar rengi
                    </label>
                    <select
                      id="home-config-color"
                      value={selectedColorIdx}
                      onChange={(e) => setSelectedColorIdx(Number(e.target.value))}
                      className="input-rich h-10 w-full rounded-xl border border-white/10 px-3 text-xs text-white outline-none transition hover:border-white/25 focus:border-sand/60"
                    >
                      {COLOR_OPTIONS.map((item, idx) => (
                        <option key={item.name} value={idx}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between border-t border-white/[0.07] pt-4">
                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45">
                  Paspas seti
                </span>
                <strong className="spec-value text-lg font-semibold text-sand">
                  {formatPrice(configuredPrice)}
                </strong>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!canAddConfiguredSet}
                className="btn-press btn-red-rich mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full text-[10.5px] font-bold uppercase tracking-wider disabled:opacity-50"
              >
                {added ? (
                  <>
                    <CheckIcon className="h-4 w-4 stroke-[3px]" />
                    Sepete eklendi
                  </>
                ) : (
                  <>
                    <ShoppingBagIcon className="h-4 w-4" />
                    {canAddConfiguredSet ? "Sepete ekle" : "Araç bilgisini tamamla"}
                  </>
                )}
              </button>
            </div>

            <div className="group/render relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#0c0c0c] to-[#050505] sm:min-h-[320px]">
              <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.07),transparent_68%)]" />
              <div className="relative z-10 h-[80%] w-[85%] transition-transform duration-500 group-hover/render:scale-105">
                <Image
                  src={activeColor.image}
                  alt={`${activeColor.name} kenarlı EVA paspas seti`}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 100vw, 400px"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                icon: TruckIcon,
                title: "Kargo avantajı",
                body: `${formatPrice(settings.freeShippingThreshold)} üzeri ücretsiz kargo`,
              },
              {
                icon: ShieldCheckIcon,
                title: "Araca özel kalıp",
                body: "Marka, model, yıl ve kasa bilgisine göre üretim",
              },
              {
                icon: CreditCardIcon,
                title: "Güvenli sipariş",
                body: "WhatsApp onayı ve kapıda ödeme seçeneği",
              },
              {
                icon: TimerIcon,
                title: "Şeffaf iade",
                body: "Standart ve özel üretim koşulları açıkça belirtilir",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="mac-glass flex flex-col items-center justify-center rounded-2xl px-4 py-5 text-center"
              >
                <span className="mb-2 text-sand">
                  <item.icon className="h-5 w-5 stroke-[1.5]" />
                </span>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">
                  {item.title}
                </h4>
                <p className="mt-1 text-[11px] leading-5 text-white/55">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================================
            SECTION 1.5: LUXURY INTERIOR SPLIT SHOWCASE
            ========================================================== */}
        <div className="mb-16 grid items-center gap-8 border-t border-white/[0.04] pt-14 lg:grid-cols-2 lg:gap-12">
          <div className="premium-card relative overflow-hidden rounded-2xl">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/media/hero-luxury-interior.png"
                alt="Premium EVA paspas ile döşenmiş lüks araç iç mekanı"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          <div>
            <span className="section-kicker text-xs font-semibold uppercase tracking-[0.2em] text-sand">
              Premium Deneyim
            </span>
            <h2 className="mt-3 font-heading text-3xl font-medium tracking-tight text-white sm:text-4xl">
              Paspas Değil, Tasarımın Devamı.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
              Aracınızın iç mekân tasarımını tamamlayan, milimetrik hassasiyetle kesilmiş şık ve premium bir dokunuş. Her detay, aracınızın orijinal hatlarına uyacak şekilde işlenir.
            </p>
            <Link
              href="/galeri"
              className="btn-press btn-ghost-rich mt-6 inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-xs font-semibold text-sand"
            >
              Galeriye git
              <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* ==========================================================
            SECTION 2: COLOR VISUALIZER & PEDESTAL PREVIEW (Mockup 1)
            ========================================================== */}
        <div id="ozellikler" className="mb-16 grid items-center gap-10 pt-8 lg:grid-cols-[240px_minmax(0,1fr)_88px]">
          <div className="flex flex-col">
            <h2 className="mb-2 font-heading text-2xl font-medium tracking-tight text-white">
              Tarzınıza uygun rengi seçin
            </h2>
            <p className="mb-6 text-sm text-white/50">
              Seçili kenar: <span className="text-sand">{activeColor.name}</span>
            </p>

            <div className="mt-1 grid grid-cols-3 gap-4 sm:flex sm:flex-wrap lg:grid lg:grid-cols-2">
              {COLOR_OPTIONS.map((item, idx) => {
                const isActive = idx === selectedColorIdx;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedColorIdx(idx)}
                    className="group flex flex-col items-center gap-2 text-[10px] tracking-wider text-white/50 transition hover:text-white"
                  >
                    <span
                      className={`relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        isActive
                          ? "scale-105 border-sand shadow-[0_0_0_4px_rgba(255,255,255,0.08)]"
                          : "border-white/10 group-hover:border-white/30"
                      }`}
                      style={{ backgroundColor: item.hex }}
                    >
                      {isActive && (
                        <CheckIcon
                          className={`h-4 w-4 drop-shadow-md ${item.name === "Bej" ? "text-black" : "text-white"}`}
                        />
                      )}
                    </span>
                    <span className={isActive ? "font-medium text-sand" : ""}>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mac-glass relative flex h-[340px] items-center justify-center overflow-hidden rounded-3xl md:h-[420px]">
            <div
              className="absolute inset-0 transition-all duration-700"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${activeColor.glow} 0%, transparent 65%)`,
              }}
            />
            <div className="absolute bottom-8 z-0 flex h-[35px] w-[80%] max-w-[450px] items-center justify-center rounded-[50%] border-t border-white/[0.08] bg-[#121212] shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
              <div className="h-[90%] w-[95%] rounded-[50%] bg-gradient-to-b from-[#1c1c1c] to-black opacity-80" />
            </div>
            <div className="absolute bottom-10 z-0 h-[15px] w-[70%] max-w-[400px] rounded-[50%] bg-white/10 blur-md" />
            <div
              className={`relative z-10 h-[80%] w-[85%] transition-all duration-500 ${
                isZoomed ? "scale-125 cursor-zoom-out" : "cursor-zoom-in"
              } ${isRotated ? "translate-y-[-10px] rotate-[-8deg]" : ""}`}
              onClick={() => setIsZoomed(!isZoomed)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsZoomed(!isZoomed);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={isZoomed ? "Önizlemeyi küçült" : "Önizlemeyi büyüt"}
            >
              <Image
                src="/media/eva_mat_pedestal.jpg"
                alt="OTO POLİK EVA paspas önizleme"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          </div>

          <div className="flex justify-center gap-4 lg:flex-col lg:items-center">
            <button
              type="button"
              onClick={() => setIsRotated(!isRotated)}
              className={`mac-glass flex h-[72px] w-[72px] flex-col items-center justify-center gap-2 rounded-2xl text-center transition duration-300 ${
                isRotated ? "border-sand/50 text-sand" : "text-white/50 hover:border-white/20 hover:text-white"
              }`}
            >
              <Rotate3dIcon className="h-5 w-5" />
              <span className="text-[9px] font-semibold uppercase tracking-wider">3D</span>
            </button>
            <button
              type="button"
              onClick={() => setIsZoomed(!isZoomed)}
              className={`mac-glass flex h-[72px] w-[72px] flex-col items-center justify-center gap-2 rounded-2xl text-center transition duration-300 ${
                isZoomed ? "border-sand/50 text-sand" : "text-white/50 hover:border-white/20 hover:text-white"
              }`}
            >
              <Maximize2Icon className="h-5 w-5" />
              <span className="text-[9px] font-semibold uppercase tracking-wider">Yakın</span>
            </button>
          </div>
        </div>

        {/* ==========================================================
            SECTION 3: COMPARISON SLIDER (Rubber vs EVA) (Mockup 1)
            ========================================================== */}
        <div className="mb-16 border-t border-white/[0.04] pt-14">
          <div className="mb-8 max-w-2xl">
            <h2 className="font-heading text-3xl font-medium tracking-tight text-white">
              Geleneksel paspas ve Premium EVA
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Hücresel EVA yapısı çamur, sıvı ve tozu haznelerinde tutar. Temizlik saniyeler sürer.
            </p>
          </div>

          <div className="grid items-center gap-6 md:grid-cols-[1fr_minmax(0,1.2fr)_1fr]">
            <div className="mac-glass rounded-2xl p-5">
              <p className="mb-4 border-b border-brand-red/20 pb-2 text-[11px] font-bold uppercase tracking-wider text-brand-red">
                Standart halı / kauçuk
              </p>
              <ul className="space-y-3.5 text-xs text-white/60">
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-red-500 font-bold">✕</span>
                  <span>Suyu ve çamuru emer, koku yapar.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-red-500 font-bold">✕</span>
                  <span>Temizlenmesi zordur, geç kurur.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-red-500 font-bold">✕</span>
                  <span>Zamanla yırtılır, aşınır ve formunu kaybeder.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-red-500 font-bold">✕</span>
                  <span>Alt zemine sıvı sızdırır, paslanma yapabilir.</span>
                </li>
              </ul>
            </div>

            <div className="relative h-[340px] overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0a0a] md:h-[400px]">
              <Image
                src="/media/galeri/musteri/photo_6030412024262626515_w.webp"
                alt="Temiz premium EVA paspas"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 500px"
              />
              <div
                className="absolute inset-0 z-10"
                style={{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }}
              >
                <Image
                  src="/media/scraped/evaotopaspas/paspas-seti/05-comparison.webp"
                  alt="Kirlenmiş standart kauçuk paspas"
                  fill
                  className="object-cover object-center grayscale-[0.25]"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
              <div
                className="absolute inset-y-0 z-20 w-px bg-white/80"
                style={{ left: `${comparePosition}%` }}
              >
                <span className="mac-glass absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-semibold text-white">
                  ↔
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={comparePosition}
                onChange={(e) => setComparePosition(Number(e.target.value))}
                aria-label="Standart paspas ile EVA paspas karşılaştırması"
                className="absolute inset-0 z-30 h-full w-full cursor-ew-resize opacity-0"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-between bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-10 text-[10px] font-semibold uppercase tracking-wider">
                <span className="text-white/55">Geleneksel</span>
                <span className="text-sand">EVA Premium</span>
              </div>
            </div>

            <div className="mac-glass rounded-2xl p-5">
              <p className="mb-4 border-b border-white/10 pb-2 text-[11px] font-bold uppercase tracking-wider text-sand">
                EVA Premium
              </p>
              <ul className="space-y-3.5 text-xs text-white/60">
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-sand font-bold">✓</span>
                  <span>Sıvı ve kiri tutar, koku yapmaz.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-sand font-bold">✓</span>
                  <span>Sadece suyla sallayarak saniyeler içinde temizlenir.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-sand font-bold">✓</span>
                  <span>Çift katmanlı yüksek mukavemetli elastik yapı.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-sand font-bold">✓</span>
                  <span>Birebir kalıbıyla kaymaz, alt zemini tamamen korur.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ==========================================================
            SECTION 4: REAL APPLICATION IMAGES (Mockup 1)
            ========================================================== */}
        <div className="mb-4 border-t border-white/[0.04] pt-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-medium tracking-tight text-white">
                Gerçek müşteri uygulamaları
              </h2>
              <p className="mt-2 text-sm text-white/50">Araç içi montajlardan seçilmiş kareler.</p>
            </div>
            <Link
              href="/galeri"
              className="btn-press btn-ghost-rich hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-sand transition hover:text-white sm:inline-flex"
            >
              Tüm galeri <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid auto-cols-[85%] grid-flow-col gap-4 overflow-x-auto pb-4 scrollbar-none sm:auto-cols-[45%] lg:grid-cols-5 lg:auto-cols-auto lg:overflow-visible">
            {REAL_APPLICATIONS.map((item) => (
              <figure
                key={item.src}
                className="group relative h-[260px] overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0a]"
              >
                <Image
                  src={item.src}
                  alt={`${item.label} — EVA paspas uygulama fotoğrafı`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 80vw, 250px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                <figcaption className="absolute bottom-0 left-0 p-4 text-[11px] font-medium tracking-wide text-white/70">
                  {item.label}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/galeri"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sand hover:text-white"
            >
              Daha fazla görsel <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
