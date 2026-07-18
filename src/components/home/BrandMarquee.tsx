export default function BrandMarquee() {
  // A select subset of popular brands to keep it clean and fast
  const popularBrands = [
    "Alfa Romeo", "Audi", "BMW", "BYD", "Chery", "Citroen", "Cupra", 
    "Dacia", "Fiat", "Ford", "Honda", "Hyundai", "Jeep", "Kia", 
    "Land Rover", "Lexus", "MG", "MINI", "Mercedes-Benz", "Nissan", 
    "Opel", "Peugeot", "Porsche", "Renault", "Seat", "Skoda", 
    "Tesla", "Togg", "Toyota", "Volkswagen", "Volvo"
  ];

  return (
    <div className="border-t border-b border-white/5 bg-black/40 py-5 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 text-center mb-3">
        <span className="font-mono text-[9px] font-bold tracking-[0.25em] text-white/50 uppercase">
          70+ Marka İçin Birebir Uyum Garantili Lazer Ölçümlü Kalıplar
        </span>
      </div>
      <div className="marquee py-2">
        <div className="track flex items-center gap-14 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
          {[1, 2].map((i) => (
            <span key={i} className="flex whitespace-nowrap items-center gap-14">
              {popularBrands.map((brand) => (
                <span key={brand} className="flex items-center gap-14">
                  <span className="text-white/60 hover:text-white transition-colors duration-200 cursor-default">
                    {brand}
                  </span>
                  <i className="text-[var(--brand-red)] not-italic">✦</i>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
