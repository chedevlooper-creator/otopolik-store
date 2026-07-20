"use client";

import BrandLogo from "@/components/BrandLogo";

export default function BrandMarquee() {
  // Top popular brands to render in the trust grid
  const popularBrands = [
    "Audi", "BMW", "Chery", "Citroen", "Cupra", 
    "Dacia", "Fiat", "Ford", "Hyundai", "Mercedes-Benz", 
    "Renault", "Tesla", "Togg", "Toyota", "Volkswagen", "Volvo"
  ];

  return (
    <div className="border-t border-b border-white/5 bg-black/40 py-10 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 text-center mb-8">
        <span className="font-mono text-[9px] font-bold tracking-[0.25em] text-[var(--brand-red)] uppercase block mb-2">
          HASSAS UYUMLULUK KAPSAMI
        </span>
        <h2 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
          70+ Marka İçin Birebir Uyum Garantili Paspas Kalıpları
        </h2>
        <p className="text-xs sm:text-sm text-white/50 mt-2 max-w-md mx-auto">
          Aracınızın zemin ölçülerine milimetrik uyum sağlayan özel lazer kesim kalıplarımız mevcuttur.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
          {popularBrands.map((brand) => (
            <div
              key={brand}
              className="flex flex-col items-center justify-center p-4 rounded-2xl border border-white/[0.03] bg-white/[0.01] transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05] group"
            >
              <BrandLogo brand={brand} className="h-7 w-7 text-white/50 group-hover:text-white transition-colors duration-300" />
              <span className="text-[10px] font-bold text-white/40 group-hover:text-white/80 mt-2 transition-colors duration-300 tracking-wider">
                {brand.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
