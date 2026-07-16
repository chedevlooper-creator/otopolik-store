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
        src="/media/otopolik-logo-3d.png"
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
      <span className="group inline-flex items-center gap-2.5">
        <span
          className="relative inline-flex h-11 w-11 aspect-square shrink-0 overflow-hidden rounded-full border border-white/15 bg-black shadow-[0_4px_12px_rgba(0,0,0,.55)] ring-1 ring-white/[0.04]"
        >
          <Image
            src="/media/otopolik-logo-3d.png"
            alt="OTO POLİK Logo"
            fill
            quality={90}
            priority={priority}
            sizes="44px"
            className="object-contain"
          />
        </span>
        <span className="flex flex-col items-start leading-none">
          <span className="block whitespace-nowrap font-heading text-[1.15rem] font-bold tracking-[0.06em] text-white transition-colors duration-300 group-hover:text-sand sm:text-[1.25rem]">
            OTO POLİK
          </span>
          <span className="mt-1 text-[7px] font-semibold uppercase tracking-[0.32em] text-sand/75 sm:text-[8px]">
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
    href === "/admin"
      ? "OTO POLİK yönetim paneli"
      : variant === "header"
        ? "EVA Premium ana sayfa"
        : "OTO POLİK ana sayfa";

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
