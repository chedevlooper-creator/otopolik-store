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
  sm: { pixels: 58, className: "size-[58px]" },
  md: { pixels: 86, className: "size-[86px]" },
  lg: { pixels: 152, className: "size-[152px]" },
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
      className={`relative inline-flex aspect-square shrink-0 overflow-hidden rounded-full border border-white/15 bg-black shadow-[0_12px_32px_rgba(0,0,0,.55)] ring-1 ring-white/[0.04] ${logoSize.className}`}
    >
      <Image
        src="/media/logo-circle-high-res.png"
        alt=""
        fill
        quality={100}
        unoptimized
        priority={priority}
        className="object-contain"
      />
    </span>
  );

  const content =
    variant === "header" ? (
      <span className="group inline-flex items-center gap-3 sm:gap-4 lg:gap-5">
        <span className="relative inline-flex h-10 w-10 aspect-square shrink-0 overflow-hidden rounded-full border border-white/10 bg-black shadow-[0_12px_24px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.05] sm:h-12 sm:w-12 lg:h-14 lg:w-14 transition-transform duration-500 group-hover:scale-105">
          <Image
            src="/media/logo-circle-high-res.png"
            alt=""
            fill
            quality={100}
            unoptimized
            priority={priority}
            className="object-contain"
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
