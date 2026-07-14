import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  variant?: "badge" | "header";
  className?: string;
  priority?: boolean;
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
      <span className="group inline-flex min-w-0 items-center gap-2.5 sm:gap-3">
        <span className="relative inline-flex size-[58px] aspect-square shrink-0 overflow-hidden rounded-full border border-white/16 bg-black shadow-[0_12px_36px_rgba(0,0,0,.62)] ring-1 ring-white/[0.05] transition-[border-color,box-shadow] duration-300 group-hover:border-white/30 group-hover:shadow-[0_14px_42px_rgba(227,25,55,.18)] sm:size-[66px] lg:size-[72px]">
          <Image
            src="/media/otopolik-logo-3d.png"
            alt=""
            fill
            quality={90}
            sizes="(min-width: 1024px) 72px, (min-width: 640px) 66px, 58px"
            className="object-contain scale-x-[1.035]"
          />
        </span>
        <span className="min-w-0 leading-none">
          <span className="block whitespace-nowrap font-heading text-[1.55rem] font-extrabold tracking-[-0.035em] text-white sm:text-[1.8rem] lg:text-[2rem]">
            OTO <span className="text-brand-red">POLİK</span>
          </span>
          <span className="mt-1 hidden whitespace-nowrap font-mono text-[8px] font-medium uppercase tracking-[0.21em] text-white/48 sm:block lg:text-[9px]">
            Aracına özel EVA
          </span>
        </span>
      </span>
    ) : (
      badge
    );

  if (!href) {
    return <span className={className}>{content}</span>;
  }

  return (
    <Link
      href={href}
      className={`inline-flex shrink-0 items-center rounded-full ${className}`}
      aria-label="OTO POLİK ana sayfa"
    >
      {content}
    </Link>
  );
}
