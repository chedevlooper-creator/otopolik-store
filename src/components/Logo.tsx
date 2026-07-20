import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  variant?: "badge" | "header";
  className?: string;
  priority?: boolean;
  ariaLabel?: string;
};

const LOGO_SIZE = {
  sm: { className: "size-[58px]" },
  md: { className: "size-[86px]" },
  lg: { className: "size-[152px]" },
} as const;

export default function Logo({
  href = "/",
  size = "md",
  variant = "badge",
  className = "",
  priority = false,
  ariaLabel,
}: LogoProps) {
  const logoSize = LOGO_SIZE[size];
  const badge = (
    <span
      className={`relative inline-flex aspect-square shrink-0 overflow-hidden rounded-full border border-white/10 bg-gradient-to-b from-neutral-900 to-black shadow-[0_16px_36px_rgba(0,0,0,0.65)] ring-1 ring-white/[0.04] group transition-all duration-500 hover:border-[var(--brand-red)]/50 hover:shadow-[0_0_25px_rgba(237,27,36,0.25)] ${logoSize.className}`}
    >
      {/* Carbon fiber grid pattern simulation */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: '4px 4px'
        }}
      />
      {/* Outer tachometer/wheel glowing ring */}
      <div className="absolute inset-0.5 rounded-full border border-dashed border-white/10 group-hover:border-[var(--brand-red)]/35 group-hover:rotate-45 transition-transform duration-700" />
      {/* Light sheen overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
      
      <Image
        src="/media/logo-circle-high-res.png"
        alt=""
        fill
        quality={100}
        unoptimized
        priority={priority}
        className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
      />
    </span>
  );

  const content =
    variant === "header" ? (
      <span className="group inline-flex items-center gap-3 sm:gap-4 lg:gap-5">
        <span className="relative inline-flex h-10 w-10 aspect-square shrink-0 overflow-hidden rounded-full border border-white/10 bg-gradient-to-b from-neutral-900 to-black shadow-[0_12px_24px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.05] sm:h-12 sm:w-12 lg:h-14 lg:w-14 transition-all duration-500 group-hover:border-[var(--brand-red)]/50 group-hover:shadow-[0_0_20px_rgba(237,27,36,0.2)]">
          {/* Carbon fiber grid pattern simulation */}
          <div 
            className="absolute inset-0 opacity-[0.04] pointer-events-none" 
            style={{
              backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
              backgroundSize: '3px 3px'
            }}
          />
          {/* Outer tachometer/wheel glowing ring */}
          <div className="absolute inset-0.5 rounded-full border border-dashed border-white/10 group-hover:border-[var(--brand-red)]/35 group-hover:rotate-45 transition-transform duration-700" />
          {/* Light sheen overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
          <Image
            src="/media/logo-circle-high-res.png"
            alt=""
            fill
            quality={100}
            unoptimized
            priority={priority}
            className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-105"
          />
        </span>
        <span className="flex flex-col items-start leading-none">
          <span className="block whitespace-nowrap font-heading text-[1rem] font-bold tracking-[0.06em] text-white transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] sm:text-[1.15rem] lg:text-[1.25rem]">
            OTO POLİK
          </span>
          <span className="mt-0.5 text-[7px] font-bold uppercase tracking-[0.3em] text-brand-red sm:text-[7.5px] lg:text-[8px]">
            EVA PREMIUM
          </span>
        </span>
      </span>
    ) : (
      badge
    );

  if (!href) {
    return <span className={className}>{content}</span>;
  }

  const defaultAriaLabel =
    href === "/admin" ? "OTO POLİK yönetim paneli" : "OTO POLİK ana sayfa";

  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 min-w-11 shrink-0 items-center rounded-full ${className}`}
      aria-label={ariaLabel ?? defaultAriaLabel}
    >
      {content}
    </Link>
  );
}
