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

// 8 brands defined in Mockup 2
const QUICK_BRANDS = [
  {
    name: "Mercedes-Benz",
    short: "MERCEDES",
    customerPhoto: "/media/galeri/musteri/photo_5906683564177165681_w.webp",
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
    customerPhoto: "/media/galeri/musteri/photo_6030412024262626515_w.webp",
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
    customerPhoto: "/media/galeri/musteri/photo_5866003077058465479_w.webp",
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
    customerPhoto: "/media/galeri/musteri/photo_5845771899898629465_w.webp",
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <ellipse cx="12" cy="12" rx="10" ry="6" />
        <ellipse cx="12" cy="12" rx="3.5" ry="6" />
        <ellipse cx="12" cy="9.5" rx="8" ry="2.5" />
      </svg>
    ),
  },
  {
    name: "Honda",
    short: "HONDA",
    customerPhoto: "/media/galeri/musteri/photo_5778211377137782172_w.webp",
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M7 6v12M17 6v12M7 12h10" />
      </svg>
    ),
  },
  {
    name: "Jeep",
    short: "JEEP",
    customerPhoto: "/media/galeri/musteri/photo_5845771899898629467_w.webp",
    logo: (
      <span className="font-heading font-black tracking-tighter text-xs uppercase mt-1">Jeep</span>
    ),
  },
  {
    name: "Ford",
    short: "FORD",
    customerPhoto: "/media/galeri/musteri/photo_5924942011318341280_w.webp",
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <ellipse cx="12" cy="12" rx="10" ry="5.5" />
        <ellipse cx="12" cy="12" rx="8.5" ry="4" strokeDasharray="1 1" />
        <text x="12" y="14.5" fontFamily="Georgia, serif" fontSize="7" fontWeight="bold" fontStyle="italic" textAnchor="middle" fill="currentColor">Ford</text>
      </svg>
    ),
  },
  {
    name: "Hyundai",
    short: "HYUNDAI",
    customerPhoto: "/media/galeri/musteri/photo_5445155157462161183_w.webp",
    logo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <ellipse cx="12" cy="12" rx="10" ry="6.5" />
        <path d="M8 8l2 8M16 8l-2 8M9.5 12h5" />
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

const REAL_APPLICATIONS = [
  { src: "/media/galeri/musteri/photo_5906683564177165681_w.webp", brand: "Mercedes-Benz" },
  { src: "/media/galeri/musteri/photo_5845771899898629465_w.webp", brand: "Peugeot" },
  { src: "/media/galeri/musteri/photo_5845771899898629467_w.webp", brand: "Jeep" },
  { src: "/media/galeri/musteri/photo_6030412024262626515_w.webp", brand: "BMW" },
  { src: "/media/galeri/musteri/photo_5866003077058465479_w.webp", brand: "Audi" },
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
      name: `Araca Özel Premium EVA Paspas — ${vehicleLabel}`,
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
    <section id="arac-sec" className="border-y border-white/[0.07] bg-[#000000] text-white overflow-hidden py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* ==========================================================
            SECTION 1: CONFIGURATOR BLOCK (Mockup 2)
            ========================================================== */}
        <div className="mb-16">
          <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-end mb-8">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sand/80 mb-1 block">
                ARACINI SEÇ
              </span>
              <h2 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl text-white">
                Her Araca Özel Üretim
              </h2>
              <p className="mt-2 text-xs text-white/40 leading-relaxed max-w-xs">
                Marka, model ve yılı seçerek aracınıza özel paspasları görüntüleyin.
              </p>
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
                      className={`flex h-[82px] w-[104px] shrink-0 flex-col items-center justify-center rounded-sm border transition-all duration-300 ${
                        isActive
                          ? "border-sand bg-[linear-gradient(145deg,rgba(177,155,110,.14),rgba(177,155,110,.025))] text-sand shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_18px_45px_rgba(0,0,0,.35)]"
                          : "border-white/[0.08] bg-[linear-gradient(145deg,#111111,#090909)] hover:border-sand/35 hover:bg-[#131313]"
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

          {/* 3-Column Configurator Panel */}
          <div className="premium-showroom grid gap-4 lg:grid-cols-[1.2fr_1fr_1.2fr] items-stretch overflow-hidden p-4 sm:p-5">
            
            {/* Column 1: Customer Photo (Live Preview) */}
            <div className="relative min-h-[260px] sm:min-h-[320px] rounded-xl overflow-hidden border border-white/[0.04] bg-[#0a0a0a]">
              <Image
                src={activeBrandDetails.customerPhoto}
                alt={`${selectedBrand} markasına ait örnek paspas uygulaması`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 border border-white/10 bg-black/60 px-3 py-1.5 rounded-full text-[9px] uppercase tracking-wider text-white/50 backdrop-blur-md">
                MARKAYA AİT ÖRNEK UYGULAMA
              </div>
            </div>

            {/* Column 2: Customize Form */}
            <div className="flex flex-col justify-between p-2">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-sand mb-1">
                  KİŞİSELLEŞTİR
                </p>
                <h3 className="font-heading text-lg font-medium text-white mb-5">
                  Paspasını Kişiselleştir
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
                      className="h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 text-xs text-white outline-none transition hover:border-sand/40 focus:border-sand/70"
                    >
                      {allBrands.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Model select */}
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
                      className="h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 text-xs text-white outline-none transition hover:border-sand/40 focus:border-sand/70"
                    >
                      {models.map((m) => (
                        <option key={m.name} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Year select */}
                  <div>
                    <label htmlFor="home-config-year" className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/70">
                      Yıl
                    </label>
                    <select
                      id="home-config-year"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 text-xs text-white outline-none transition hover:border-sand/40 focus:border-sand/70"
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
                      className="h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 text-xs text-white outline-none transition placeholder:text-white/45 hover:border-sand/40 focus:border-sand/70"
                    />
                  </div>

                  {/* Color select */}
                  <div>
                    <label htmlFor="home-config-color" className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/70">
                      Kenar rengi
                    </label>
                    <select
                      id="home-config-color"
                      value={selectedColorIdx}
                      onChange={(e) => setSelectedColorIdx(Number(e.target.value))}
                      className="h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 text-xs text-white outline-none transition hover:border-sand/40 focus:border-sand/70"
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
                className="btn-press mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#bfa985] to-[#9c845b] text-[10.5px] font-bold uppercase tracking-wider text-black transition hover:from-[#c9b38d] hover:to-[#a78f65] active:scale-[0.98] disabled:opacity-50"
              >
                {added ? (
                  <>
                    <CheckIcon className="h-4 w-4 stroke-[3px]" />
                    Sepete Eklendi
                  </>
                ) : (
                  <>
                    <ShoppingBagIcon className="h-4 w-4" />
                    {canAddConfiguredSet ? "SEPETE EKLE" : "ARAÇ BİLGİSİNİ TAMAMLA"}
                  </>
                )}
              </button>
            </div>

            {/* Column 3: 3D Product Digital Render */}
            <div className="relative min-h-[260px] sm:min-h-[320px] rounded-xl overflow-hidden border border-white/[0.04] bg-gradient-to-br from-[#0a0a0a] to-[#040403] flex items-center justify-center group/render">
              
              {/* Product render render background light */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(196,165,106,0.1),transparent_70%)] z-0" />

              {/* Mat render image */}
              <div className="relative w-[85%] h-[80%] z-10 transition-transform duration-500 group-hover/render:scale-105">
                <Image
                  src={activeColor.image}
                  alt={`${activeColor.name} kenarlı EVA paspas seti`}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 100vw, 400px"
                />
              </div>

              {/* 360 Badge */}
              <div className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/60 backdrop-blur-md">
                <span className="text-[8px] font-bold tracking-tighter text-sand">360°</span>
              </div>
            </div>

          </div>

          {/* Bottom Trust Indicators Strip */}
          <div className="grid grid-cols-2 gap-y-4 py-6 border-b border-white/[0.05] sm:grid-cols-4 sm:gap-0 divide-white/[0.06] sm:divide-x mt-6 text-center">
            {/* Item 1 */}
            <div className="flex flex-col items-center justify-center px-4">
              <span className="text-sand mb-2">
                <TruckIcon className="h-5 w-5 stroke-[1.5]" />
              </span>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">
                KARGO AVANTAJI
              </h4>
              <p className="mt-1 text-[11px] leading-5 text-white/60">
                {formatPrice(settings.freeShippingThreshold)} üzeri ücretsiz kargo
              </p>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col items-center justify-center px-4">
              <span className="text-sand mb-2">
                <ShieldCheckIcon className="h-5 w-5 stroke-[1.5]" />
              </span>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">
                ARACA ÖZEL KALIP
              </h4>
              <p className="mt-1 text-[11px] leading-5 text-white/60">
                Marka, model, yıl ve kasa bilgisine göre üretim
              </p>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col items-center justify-center px-4">
              <span className="text-sand mb-2">
                <CreditCardIcon className="h-5 w-5 stroke-[1.5]" />
              </span>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">
                GÜVENLİ SİPARİŞ
              </h4>
              <p className="mt-1 text-[11px] leading-5 text-white/60">
                WhatsApp onayı ve kapıda ödeme seçeneği
              </p>
            </div>

            {/* Item 4 */}
            <div className="flex flex-col items-center justify-center px-4">
              <span className="text-sand mb-2">
                <TimerIcon className="h-5 w-5 stroke-[1.5]" />
              </span>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">
                ŞEFFAF İADE
              </h4>
              <p className="mt-1 text-[11px] leading-5 text-white/60">
                Standart ve özel üretim koşulları açıkça belirtilir
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================================
            SECTION 2: COLOR VISUALIZER & PEDESTAL PREVIEW (Mockup 1)
            ========================================================== */}
        <div id="ozellikler" className="grid gap-10 lg:grid-cols-[250px_minmax(0,1fr)_100px] items-center mb-16 pt-6">
          {/* Left Panel: Color bubbles */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sand/80 mb-2">
              RENK SEÇENEKLERİ
            </span>
            <h2 className="font-heading text-2xl font-medium tracking-tight mb-4 text-white">
              Tarzınıza Uygun Rengi Seçin
            </h2>
            
            <div className="grid grid-cols-3 gap-4 sm:flex sm:flex-wrap lg:grid lg:grid-cols-2 mt-2">
              {COLOR_OPTIONS.map((item, idx) => {
                const isActive = idx === selectedColorIdx;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedColorIdx(idx)}
                    className="flex flex-col items-center gap-2 text-[10px] tracking-wider text-white/50 hover:text-white transition group"
                  >
                    <span
                      className={`relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        isActive
                          ? "scale-105 border-sand shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                          : "border-white/10 group-hover:border-white/30"
                      }`}
                      style={{ backgroundColor: item.hex }}
                    >
                      {isActive && (
                        <CheckIcon className={`h-4.5 w-4.5 drop-shadow-md ${item.name === "Bej" ? "text-black" : "text-white"}`} />
                      )}
                    </span>
                    <span className={isActive ? "text-sand font-medium" : ""}>
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center: Pedestal Preview */}
          <div className="relative flex justify-center items-center h-[340px] md:h-[420px] rounded-2xl border border-white/[0.04] bg-[#090909] overflow-hidden">
            {/* dynamic background radial glow matching active color */}
            <div
              className="absolute inset-0 transition-all duration-700"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${activeColor.glow} 0%, transparent 65%)`,
              }}
            />

            {/* Pedestal Platform */}
            <div className="absolute bottom-8 w-[80%] max-w-[450px] h-[35px] rounded-[50%] bg-[#121212] border-t border-white/[0.08] shadow-[0_15px_35px_rgba(0,0,0,0.8)] z-0 flex items-center justify-center">
              <div className="w-[95%] h-[90%] rounded-[50%] bg-gradient-to-b from-[#1c1c1c] to-black opacity-80" />
            </div>

            {/* Pedestal Bottom Glow */}
            <div className="absolute bottom-10 w-[70%] max-w-[400px] h-[15px] rounded-[50%] bg-sand/15 blur-md z-0" />

            {/* Interactive Mat Image */}
            <div className={`relative w-[85%] h-[80%] transition-all duration-500 z-10 ${
              isZoomed ? "scale-125 cursor-zoom-out" : "cursor-zoom-in"
            } ${isRotated ? "rotate-[-8deg] translate-y-[-10px]" : ""}`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <Image
                src="/media/eva_mat_pedestal.jpg"
                alt="EVA Premium mat önizleme"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>

            {/* Small active color label */}
            <div className="absolute bottom-4 left-4 border border-white/5 bg-black/60 px-3 py-1.5 rounded-full text-[9px] uppercase tracking-wider text-white/50 backdrop-blur-md">
              SEÇİLİ KENAR: <span className="text-sand font-medium">{activeColor.name}</span>
            </div>
          </div>

          {/* Right Panel: Feature Action Buttons */}
          <div className="flex justify-center gap-6 lg:flex-col lg:gap-4 lg:items-center">
            {/* 360 View */}
            <button
              onClick={() => setIsRotated(!isRotated)}
              className={`flex flex-col items-center justify-center gap-2 h-[75px] w-[75px] rounded-lg border text-center transition duration-300 ${
                isRotated
                  ? "border-sand text-sand bg-sand/[0.04]"
                  : "border-white/[0.06] text-white/50 hover:text-white hover:border-white/20"
              }`}
            >
              <Rotate3dIcon className="h-5 w-5" />
              <span className="text-[9px] font-semibold uppercase tracking-wider">3D BAKIŞ</span>
            </button>

            {/* Zoom */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className={`flex flex-col items-center justify-center gap-2 h-[75px] w-[75px] rounded-lg border text-center transition duration-300 ${
                isZoomed
                  ? "border-sand text-sand bg-sand/[0.04]"
                  : "border-white/[0.06] text-white/50 hover:text-white hover:border-white/20"
              }`}
            >
              <Maximize2Icon className="h-5 w-5" />
              <span className="text-[9px] font-semibold uppercase tracking-wider">YAKINLAŞTIR</span>
            </button>
          </div>
        </div>

        {/* ==========================================================
            SECTION 3: COMPARISON SLIDER (Rubber vs EVA) (Mockup 1)
            ========================================================== */}
        <div className="mb-16 border-t border-white/[0.04] pt-14">
          <div className="mb-8 grid gap-4 md:grid-cols-2 items-end">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sand/80">
                PASPAS KARŞILAŞTIRMASI
              </span>
              <h2 className="font-heading text-3xl font-normal text-white mt-1">
                Geleneksel vs. Premium EVA
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-white/40 max-w-md md:justify-self-end">
              Hücresel EVA yapısı, çamur, sıvı ve tozu haznelerinde tutarak zemine geçişini engeller. Temizliği son derece kolaydır.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr_minmax(0,1.2fr)_1fr] items-center">
            {/* Left Specs List: Standard Mat */}
            <div className="rounded-xl border border-white/[0.04] bg-[#090909] p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#e31937] mb-4 border-b border-[#e31937]/10 pb-2">
                STANDART HALI/KAUÇUK PASPAS
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

            {/* Interactive Image Split Slider */}
            <div className="relative h-[340px] md:h-[400px] overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a0a0a]">
              {/* Right Background (Clean Premium EVA Mat) */}
              <Image
                src="/media/galeri/musteri/photo_6030412024262626515_w.webp"
                alt="Temiz premium EVA paspas"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 500px"
              />

              {/* Left Foreground (Dirty Standard Rubber Mat) */}
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

              {/* Split Bar handle */}
              <div
                className="absolute inset-y-0 w-px bg-white/80 z-20"
                style={{ left: `${comparePosition}%` }}
              >
                <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-black/90 text-sm font-semibold text-white shadow-2xl">
                  ↔
                </span>
              </div>

              {/* Invisible Range Slider for dragging */}
              <input
                type="range"
                min="0"
                max="100"
                value={comparePosition}
                onChange={(e) => setComparePosition(Number(e.target.value))}
                aria-label="Standart paspas ile EVA paspas karşılaştırması"
                className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0 z-30"
              />

              {/* Labels overlay */}
              <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-between px-4 z-20">
                <span className="rounded-full border border-white/5 bg-black/60 px-2.5 py-1 text-[9px] uppercase tracking-wider text-white/50 backdrop-blur-md">
                  Geleneksel Paspas
                </span>
                <span className="rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[9px] uppercase tracking-wider text-sand backdrop-blur-md">
                  EVA Premium
                </span>
              </div>
            </div>

            {/* Right Specs List: Premium EVA */}
            <div className="rounded-xl border border-white/[0.04] bg-[#090909] p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-sand mb-4 border-b border-white/10 pb-2">
                EVA PREMIUM PASPAS
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
        <div className="mb-8 border-t border-white/[0.04] pt-14">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sand/80">
                PASPASIN ARAÇ İÇİ GÖRÜNÜMÜ
              </span>
              <h2 className="font-heading text-3xl font-normal text-white mt-1">
                Gerçek Müşteri Uygulamaları
              </h2>
            </div>
            <Link
              href="/galeri"
              className="hidden items-center gap-2 text-xs font-semibold text-sand hover:text-white transition sm:flex"
            >
              Tüm galeriyi gör <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          {/* Carousel rows */}
          <div className="grid auto-cols-[85%] grid-flow-col gap-4 overflow-x-auto pb-4 scrollbar-none sm:auto-cols-[45%] lg:grid-cols-5 lg:auto-cols-auto lg:overflow-visible">
            {REAL_APPLICATIONS.map((item, idx) => (
              <figure
                key={idx}
                className="group relative h-[260px] overflow-hidden rounded-xl border border-white/[0.04] bg-[#0a0a0a]"
              >
                <Image
                  src={item.src}
                  alt={`${item.brand} EVA paspas uygulama fotoğrafı`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 80vw, 250px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                <figcaption className="absolute bottom-0 left-0 p-4 text-[10px] font-semibold uppercase tracking-wider text-white/60">
                  {item.brand} Uygulaması
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/galeri"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sand hover:text-white"
            >
              DAHA FAZLA GÖRSEL <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
