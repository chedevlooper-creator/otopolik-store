"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Image from "next/image";
import { ColorSwatch } from "./ColorPicker";

interface FlatMatPreviewProps {
  floor: ColorSwatch;
  edge: ColorSwatch;
  heelPad: boolean;
}

export default function FlatMatPreview({ floor, edge, heelPad }: FlatMatPreviewProps) {
  const [floorLoaded, setFloorLoaded] = useState(false);
  const [edgeLoaded, setEdgeLoaded] = useState(false);

  const floorSlug = floor.slug || "gece-siyahi";
  const edgeSlug = edge.slug || "gece-siyahi";

  const floorUrl = `https://paspasburada.com.tr/previews/taban/${floorSlug}.webp`;
  const edgeUrl = `https://paspasburada.com.tr/previews/kenarlik/${edgeSlug}.webp`;
  const heelpadUrl = "https://paspasburada.com.tr/overlays/topukluk-yeni.png";

  const allLoaded = floorLoaded && edgeLoaded;

  return (
    <div className="relative flex aspect-[4/4.3] w-full items-center justify-center bg-transparent p-2">
      {/* Premium Ambient Radial Glow mapped to floor color */}
      <div
        className="absolute inset-16 rounded-full opacity-25 blur-[100px] pointer-events-none transition-all duration-700"
        style={{ backgroundColor: floor.hex }}
      />

      {/* Loading Shimmer Overlay */}
      <AnimatePresence>
        {!allLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-[#0a0a0a]/40 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-brand-red" />
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/50">
                Görsel Yükleniyor...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Three overlapping transparent layers forming the realistic 3D paspas preview */}
      <div className="relative h-full w-full select-none">
        {/* Layer 1: Taban (Floor Mat Body) */}
        <Image
          src={floorUrl}
          alt=""
          fill
          onLoad={() => setFloorLoaded(true)}
          className="object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
        />

        {/* Layer 2: Metal Topukluk (Driver's Heelpad - sandwiched between floor and border) */}
        {heelPad && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 pointer-events-none"
          >
            <Image src={heelpadUrl} alt="" fill className="object-contain" />
          </motion.div>
        )}

        {/* Layer 3: Kenarlık (Edge stitched border - rendered on top of heelpad) */}
        <Image
          src={edgeUrl}
          alt=""
          fill
          onLoad={() => setEdgeLoaded(true)}
          className="z-15 object-contain pointer-events-none"
        />
      </div>
    </div>
  );
}
