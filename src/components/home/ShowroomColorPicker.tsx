"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FLOOR_COLORS, EDGE_COLORS, type MatColor } from "@/lib/mat-colors";
import { getMatPreview } from "@/lib/configurator-cart-item";

export default function ShowroomColorPicker() {
  // Cast arrays to standard readonly MatColor[] to satisfy TypeScript type inference
  const allFloors = FLOOR_COLORS as readonly MatColor[];
  const allEdges = EDGE_COLORS as readonly MatColor[];

  // Resolve curated floor colors
  const curatedFloors = useMemo(() => {
    const slugs = ["gece-siyahi", "saks-mavisi"];
    return slugs
      .map((slug) => allFloors.find((c) => c.slug === slug))
      .filter((c): c is MatColor => !!c);
  }, [allFloors]);

  // Resolve curated edge colors
  const curatedEdges = useMemo(() => {
    const slugs = [
      "gece-siyahi",
      "sehrin-grisi",
      "kum-isigi",
      "alev-kirmizi",
      "saks-mavisi",
      "turuncu",
      "mint-yesili",
      "lavanta-moru",
    ];
    return slugs
      .map((slug) => allEdges.find((c) => c.slug === slug))
      .filter((c): c is MatColor => !!c);
  }, [allEdges]);

  const [selectedFloor, setSelectedFloor] = useState<MatColor>(curatedFloors[0] || allFloors[0]);
  const [selectedEdge, setSelectedEdge] = useState<MatColor>(curatedEdges[3] || allEdges[10]); // Default to red edge

  // Get preview using configurator's native mapping
  const preview = useMemo(() => {
    return getMatPreview(selectedFloor, selectedEdge);
  }, [selectedFloor, selectedEdge]);

  return (
    <section className="blk" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="colorpick">
          {/* Left Column: Image Preview Stage */}
          <div className="cp-stage rev relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/5 bg-black/40 shadow-xl">
            <span className="mono chip absolute left-4 top-4 z-10" id="cp-chip">
              {(selectedFloor.name || "").toUpperCase()} TABAN · {(selectedEdge.name || "").toUpperCase()} KENAR
            </span>
            
            <div className="relative w-full h-full">
              <Image
                src={preview.src}
                alt={`${selectedFloor.name} tabanlı ve ${selectedEdge.name} kenarlı EVA paspas kombinasyonu`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-opacity duration-300 ease-in-out"
                priority
              />
            </div>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-5 pb-5 pt-12">
              <p className="text-xs font-semibold text-white/90">
                {preview.kind === "real" ? "Gerçek araç içi görünüm" : "Renk kombinasyonu simülasyonu"}
              </p>
            </div>
          </div>

          {/* Right Column: Interaction panel */}
          <div className="rev flex flex-col justify-center">
            <span className="mono" style={{ color: "var(--red-hot)" }}>RENK SİMÜLATÖRÜ</span>
            <h2 style={{ marginTop: "12px", fontSize: "clamp(2rem, 3.2vw, 2.9rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.1 }}>
              Tarzını Yansıt.<br />Aracınla Bütünleş.
            </h2>

            {/* Floor (Base) Selection */}
            <div className="mt-8">
              <div className="mb-2.5 flex items-center justify-between text-xs font-mono tracking-wider">
                <span className="text-white/40 uppercase">1. Taban Rengi</span>
                <span className="text-white font-bold">{selectedFloor.name}</span>
              </div>
              <div className="flex flex-wrap gap-4">
                {curatedFloors.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => {
                      setSelectedFloor(c);
                      // If floor is navy blue, auto-select orange edge as the only real match, otherwise default to black/red
                      if (c.slug === "saks-mavisi") {
                        setSelectedEdge(curatedEdges.find((e) => e.slug === "turuncu") || curatedEdges[5]);
                      }
                    }}
                    className={`sw ${selectedFloor.slug === c.slug ? "on" : ""}`}
                    style={{ "--c": c.hex } as React.CSSProperties}
                    aria-label={`${c.name} taban rengi`}
                  />
                ))}
              </div>
            </div>

            {/* Edge (Stitching) Selection */}
            <div className="mt-8">
              <div className="mb-2.5 flex items-center justify-between text-xs font-mono tracking-wider">
                <span className="text-white/40 uppercase">2. Kenar Overlok Rengi</span>
                <span className="text-white font-bold">{selectedEdge.name}</span>
              </div>
              <div className="flex flex-wrap gap-4">
                {curatedEdges.map((c) => {
                  // If floor is navy blue, disable all edge colors except orange/black to prevent unmapped options
                  const isDisabled = selectedFloor.slug === "saks-mavisi" && c.slug !== "turuncu" && c.slug !== "gece-siyahi";
                  
                  return (
                    <button
                      key={c.slug}
                      onClick={() => !isDisabled && setSelectedEdge(c)}
                      disabled={isDisabled}
                      className={`sw ${selectedEdge.slug === c.slug ? "on" : ""} ${isDisabled ? "opacity-20 cursor-not-allowed scale-90" : ""}`}
                      style={{ "--c": c.hex } as React.CSSProperties}
                      aria-label={`${c.name} kenar rengi`}
                    />
                  );
                })}
              </div>
            </div>

            <p className="cp-note mt-8 text-xs text-white/50 leading-relaxed">
              *Seçtiğiniz renk kombinasyonu, aracınızın zemin ölçülerine göre birebir uyumlu olarak üretilecektir.
            </p>

            <Link
              className="btn-press btn-red-rich mt-6 inline-flex h-14 items-center justify-center gap-2.5 rounded-full px-8 text-sm font-bold uppercase tracking-[0.09em] text-white"
              href={`/olusturucu?taban=${selectedFloor.slug}&kenar=${selectedEdge.slug}`}
            >
              Kombinasyonla Tasarla →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
