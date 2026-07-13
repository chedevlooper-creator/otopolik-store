"use client";

import Image from "next/image";

type Props = {
  floorColor: string;
  edgeColor: string;
  floorColorName?: string;
  edgeColorName?: string;
  heelPad: boolean;
  brand?: string;
  model?: string;
};

const REAL_PREVIEWS = {
  blackRed: {
    src: "/media/scraped/evaotopaspas/paspas-seti/03-gallery-1.jpg",
    alt: "Araç içinde siyah taban ve kırmızı kenarlı EVA paspas gerçek uygulama fotoğrafı",
    label: "Siyah + kırmızı",
  },
  beige: {
    src: "/media/scraped/evaotopaspas/paspas-seti/04-gallery-2.jpg",
    alt: "Araç içinde bej EVA paspas gerçek uygulama fotoğrafı",
    label: "Bej uygulama",
  },
  black: {
    src: "/media/scraped/evaotopaspas/paspas-seti/01-siyah-urun.png",
    alt: "Araç içinde siyah EVA sürücü paspası gerçek uygulama fotoğrafı",
    label: "Siyah uygulama",
  },
};

function getPreview(floorColorName?: string, edgeColorName?: string) {
  if (floorColorName === "Bej") return REAL_PREVIEWS.beige;
  if (floorColorName === "Siyah" && edgeColorName === "Siyah") {
    return REAL_PREVIEWS.black;
  }
  return REAL_PREVIEWS.blackRed;
}

export default function MatPreview({
  floorColor,
  edgeColor,
  floorColorName,
  edgeColorName,
  heelPad,
  brand,
  model,
}: Props) {
  const preview = getPreview(floorColorName, edgeColorName);
  const vehicle = brand
    ? model
      ? `${brand} ${model}`
      : brand
    : "Araca özel";
  const floor = floorColorName || "Seçili taban";
  const edge = edgeColorName || "Seçili kenar";

  return (
    <figure
      className="relative aspect-[4/3] w-full max-w-2xl overflow-hidden border border-border bg-background shadow-2xl shadow-black/35"
      data-floor-color={floorColor}
      data-edge-color={edgeColor}
    >
      <Image
        src={preview.src}
        alt={preview.alt}
        fill
        sizes="(min-width: 1024px) 48vw, 100vw"
        quality={92}
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/88 via-background/10 to-background/15" />

      <div className="absolute left-4 top-4 border border-white/10 bg-background/85 px-3 py-2 backdrop-blur-sm">
        <p className="font-heading text-sm font-bold uppercase text-white">
          {vehicle}
        </p>
        <p className="spec-value text-[10px] font-medium uppercase tracking-[0.14em] text-sand">
          Gerçek ürün görseli
        </p>
      </div>

      <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center gap-2 border border-white/10 bg-background/85 p-2.5 backdrop-blur-sm sm:inset-x-4 sm:bottom-4">
        <span className="spec-value mr-auto text-[10px] font-medium uppercase tracking-[0.16em] text-sand">
          {preview.label}
        </span>
        <span className="flex items-center gap-2">
          <span
            className="h-5 w-5 border border-white/20"
            style={{ backgroundColor: floorColor }}
            aria-hidden="true"
          />
          <span className="spec-value text-xs text-muted">
            Taban: <strong className="text-foreground">{floor}</strong>
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span
            className="h-5 w-5 border border-white/20"
            style={{ backgroundColor: edgeColor }}
            aria-hidden="true"
          />
          <span className="spec-value text-xs text-muted">
            Kenar: <strong className="text-foreground">{edge}</strong>
          </span>
        </span>
        {heelPad && (
          <span className="spec-value border border-sand/30 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-sand">
            Topuk pedi
          </span>
        )}
      </div>
    </figure>
  );
}
