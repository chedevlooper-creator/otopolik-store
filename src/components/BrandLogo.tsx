"use client";

import vehicleImages from "@/lib/vehicle-images.json";

type Props = {
  brand: string;
  className?: string;
};

export default function BrandLogo({ brand, className = "h-6 w-6" }: Props) {
  const brandObj = vehicleImages.brands.find(
    (b) => b.name.toLowerCase() === brand.toLowerCase()
  );

  if (brandObj?.logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={brandObj.logoUrl}
        alt={`${brand} logosu`}
        className={`${className} object-contain`}
        loading="lazy"
      />
    );
  }

  const norm = brand.trim().toLowerCase();

  // Audi (Four rings)
  if (norm.includes("audi")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <circle cx="6" cy="12" r="3" />
        <circle cx="10" cy="12" r="3" />
        <circle cx="14" cy="12" r="3" />
        <circle cx="18" cy="12" r="3" />
      </svg>
    );
  }

  // BMW (Roundel quadrants)
  if (norm.includes("bmw")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <circle cx="12" cy="12" r="9.5" />
        <circle cx="12" cy="12" r="6" />
        <path d="M12 6 A6 6 0 0 1 18 12 L12 12 Z" fill="currentColor" className="opacity-40" />
        <path d="M6 12 A6 6 0 0 1 12 18 L12 12 Z" fill="currentColor" className="opacity-40" />
      </svg>
    );
  }

  // Mercedes (Three-pointed star)
  if (norm.includes("mercedes")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <circle cx="12" cy="12" r="9.5" />
        <path d="M12 12 L12 3" />
        <path d="M12 12 L4.2 16.5" />
        <path d="M12 12 L19.8 16.5" />
      </svg>
    );
  }

  // Volkswagen (V and W in circle)
  if (norm.includes("volkswagen")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <circle cx="12" cy="12" r="9.5" />
        <path d="M6.5 8 L10 16 L12 12.5 L14 16 L17.5 8" />
        <path d="M8 8 L12 17 L16 8" />
      </svg>
    );
  }

  // Toyota (Overlapping horizontal and vertical ellipses)
  if (norm.includes("toyota")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <ellipse cx="12" cy="12" rx="9" ry="5.5" />
        <ellipse cx="12" cy="10" rx="5" ry="3" />
        <ellipse cx="12" cy="12" rx="2" ry="5" />
      </svg>
    );
  }

  // Renault (Diamond)
  if (norm.includes("renault")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <path d="M12 3 L20 12 L12 21 L4 12 Z" />
        <path d="M12 7 L16.5 12 L12 17 L7.5 12 Z" fill="currentColor" className="opacity-20" />
      </svg>
    );
  }

  // Tesla (Sleek T)
  if (norm.includes("tesla")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3 4c4 1.2 9 1.2 13 0-.3.8-1 2-2.5 2.8-3.2.8-7 .8-10.2 0C4.8 6 4.1 4.8 3 4z" />
        <path d="M12 8.5c.8-.5 1.5-1 2.2-1.5 1.5.5 3 1.2 4.3 2.1-.8 1-1.5 2.2-2 3.4-1.2-1.2-2.7-2.3-4.5-2.8v8.3h-1.5V9.7c-1.8.5-3.3 1.6-4.5 2.8-.5-1.2-1.2-2.4-2-3.4 1.3-.9 2.8-1.6 4.3-2.1.7.5 1.4 1 2.2 1.5z" />
      </svg>
    );
  }

  // Togg (Double diamond arrows)
  if (norm.includes("togg")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M8 6l5 6-5 6h3.5l5-6-5-6H8z" />
        <path d="M16 6l-5 6 5 6h-3.5l-5-6 5-6H16z" className="opacity-40" />
      </svg>
    );
  }

  // Fiat (Sleek rect letters)
  if (norm.includes("fiat")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M6.5 9.5h3v2h-3v3m0-5v5M11.5 9.5v5M14.5 9.5h3v2.5h-3v2.5h3" />
      </svg>
    );
  }

  // Ford (Sleek script outline)
  if (norm.includes("ford")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <ellipse cx="12" cy="12" rx="9.5" ry="5.5" />
        <path d="M8 10h4.5M8 12.5h3.5" />
      </svg>
    );
  }

  // Citroen (Two chevrons)
  if (norm.includes("citroen")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M7 11 l5 -5 l5 5" />
        <path d="M7 17 l5 -5 l5 5" />
      </svg>
    );
  }

  // Dacia (Sturdy D)
  if (norm.includes("dacia")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M8 6h5a5 5 0 0 1 5 5v2a5 5 0 0 1-5 5H8V6z" />
      </svg>
    );
  }

  // Default fallback (sleek circle with brand initial)
  return (
    <div className={`flex items-center justify-center rounded-full bg-white/5 border border-white/10 ${className}`}>
      <span className="text-[10px] font-bold text-white">{brand[0]?.toUpperCase() || "A"}</span>
    </div>
  );
}
