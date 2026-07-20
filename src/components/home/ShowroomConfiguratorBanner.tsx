"use client";

import { useState } from "react";
import Link from "next/link";
import FlatMatPreview from "@/components/configurator/FlatMatPreview";
import { FLOOR_COLORS, EDGE_COLORS, type MatColor } from "@/lib/mat-colors";

export default function ShowroomConfiguratorBanner() {
  const [selectedFloor, setSelectedFloor] = useState<MatColor>(FLOOR_COLORS[0]);
  const [selectedEdge, setSelectedEdge] = useState<MatColor>(EDGE_COLORS[0]);

  // A small clean subset for the homepage mini-preview
  const miniFloors = [
    FLOOR_COLORS.find(c => c.slug === "gece-siyahi")!,
    FLOOR_COLORS.find(c => c.slug === "sehrin-grisi")!,
    FLOOR_COLORS.find(c => c.slug === "kum-isigi")!,
    FLOOR_COLORS.find(c => c.slug === "asil-bordo")!,
  ].filter(Boolean);

  const miniEdges = [
    EDGE_COLORS.find(c => c.slug === "gece-siyahi")!,
    EDGE_COLORS.find(c => c.slug === "alev-kirmizi")!,
    EDGE_COLORS.find(c => c.slug === "saks-mavisi")!,
    EDGE_COLORS.find(c => c.slug === "turuncu")!,
    EDGE_COLORS.find(c => c.slug === "canli-sari")!,
  ].filter(Boolean);

  return (
    <section className="blk" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="config rev overflow-hidden relative rounded-[28px] border border-white/5">
          <div className="bg"></div>
          <div className="shade z-1"></div>
          
          <div className="relative z-10 w-full grid lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 md:p-16">
            {/* Left column: Info */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left">
              <span className="mono font-bold" style={{ color: "var(--red-hot)", letterSpacing: "0.2em" }}>TASARLA</span>
              <h2 className="mt-3 text-4xl sm:text-5xl font-bold leading-tight text-white">Kendi setini <em>60 saniyede</em> tasarla.</h2>
              <p className="mt-4 text-white/70 max-w-md">Aracını seç, taban ve kenar rengini belirle, canlı önizlemeyle sipariş ver.</p>
              
              <div className="w-full max-w-sm mt-6 mb-6">
                {/* Visual Progress Steps */}
                <div className="relative flex items-center justify-between">
                  <div className="absolute left-0 right-0 top-[14px] h-0.5 -translate-y-1/2 bg-white/10 z-0" />
                  <div className="absolute left-0 right-1/2 top-[14px] h-0.5 -translate-y-1/2 bg-[var(--brand-red)] z-0 transition-all duration-500" />
                  
                  {/* Step 1 */}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--brand-red)] text-[10px] font-bold text-white shadow-[0_0_10px_rgba(237,27,36,0.5)]">
                      01
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white">Araç</span>
                  </div>

                  {/* Step 2 */}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--brand-red)] text-[10px] font-bold text-white shadow-[0_0_10px_rgba(237,27,36,0.5)]">
                      02
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white">Renk</span>
                  </div>

                  {/* Step 3 */}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black text-[10px] font-bold text-white/65">
                      03
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Sipariş</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link
                  className="btn-press btn-red-rich inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-4 text-[13px] font-bold uppercase tracking-[0.09em] text-white shadow-[0_4px_15px_rgba(237,27,36,0.4)]"
                  href="/olusturucu"
                >
                  Tasarlamaya Başla →
                </Link>
              </div>
            </div>

            {/* Right column: Interactive Mini Preview Customizer */}
            <div className="lg:col-span-5 flex flex-col items-center bg-black/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
              <span className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest mb-4">
                İNTERAKTİF ÖNİZLEME (CANLI)
              </span>
              
              <div className="w-full max-w-[200px] aspect-[4/4.3] relative z-10">
                <FlatMatPreview floor={selectedFloor} edge={selectedEdge} heelPad={true} />
              </div>

              {/* Swatch Controls */}
              <div className="w-full mt-6 space-y-4 relative z-10 text-left">
                {/* Floor Color Picker */}
                <div>
                  <span className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-wider mb-2">
                    Taban Rengi: <span className="text-white">{selectedFloor.name}</span>
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {miniFloors.map((c) => (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => setSelectedFloor(c)}
                        className={`h-7 w-7 rounded-full border transition-all ${
                          selectedFloor.slug === c.slug
                            ? "border-[var(--brand-red)] scale-110 shadow-[0_0_10px_rgba(237,27,36,0.4)]"
                            : "border-white/10 opacity-70 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Edge Color Picker */}
                <div>
                  <span className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-wider mb-2">
                    Kenar Rengi: <span className="text-white">{selectedEdge.name}</span>
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {miniEdges.map((c) => (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => setSelectedEdge(c)}
                        className={`h-7 w-7 rounded-full border transition-all ${
                          selectedEdge.slug === c.slug
                            ? "border-[var(--brand-red)] scale-110 shadow-[0_0_10px_rgba(237,27,36,0.4)]"
                            : "border-white/10 opacity-70 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
