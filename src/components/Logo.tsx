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
        quality={90}
        priority={priority}
        sizes={`${logoSize.pixels}px`}
        className="object-contain"
      />
    </span>
  );

  const content =
    variant === "header" ? (
      <span className="group inline-flex items-center gap-3 sm:gap-4 lg:gap-5">
        <span className="relative inline-flex h-12 w-12 aspect-square shrink-0 overflow-hidden rounded-full border border-white/10 bg-black shadow-[0_12px_24px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.05] sm:h-16 sm:w-16 lg:h-20 lg:w-20 transition-transform duration-500 group-hover:scale-105">
          <Image
            src="/media/logo-circle-high-res.png"
            alt=""
            fill
            quality={95}
            priority={priority}
            sizes="(min-width: 1024px) 80px, (min-width: 640px) 64px, 48px"
            className="object-contain"
          />
        </span>
        <span className="flex flex-col items-start leading-none">
          <span className="block whitespace-nowrap font-heading text-[1.25rem] font-bold tracking-[0.06em] text-white transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] sm:text-[1.5rem] lg:text-[1.8rem]">
            OTO POLİK
          </span>
          <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.35em] text-brand-red sm:mt-1.5 sm:text-[9px] lg:text-[10px]">
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
