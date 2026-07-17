"use client";

import { motion } from "framer-motion";

interface ColorOption {
  name: string;
  hex: string;
}

interface FlatMatPreviewProps {
  floor: ColorOption;
  edge: ColorOption;
  heelPad: boolean;
}

export default function FlatMatPreview({ floor, edge, heelPad }: FlatMatPreviewProps) {
  // Symmetrical vector coordinates for the 5-piece mat set
  // viewBox="0 0 400 420"
  
  const driverMatPath = "M 50,55 C 70,55 90,45 125,45 C 135,45 145,60 145,80 L 145,210 C 145,220 135,230 125,230 L 50,230 C 40,230 30,220 30,210 L 30,95 C 30,75 40,55 50,55 Z";
  const passengerMatPath = "M 275,45 C 310,45 330,45 350,45 C 360,45 370,55 370,65 L 370,210 C 370,220 360,230 350,230 L 275,230 C 265,230 255,220 255,210 L 255,65 C 255,55 265,45 275,45 Z";
  
  const rearLeftMatPath = "M 45,270 C 45,260 55,250 65,250 L 145,250 C 155,250 165,260 165,270 L 165,370 C 165,380 155,390 145,390 L 65,390 C 55,390 45,380 45,370 Z";
  const rearRightMatPath = "M 235,270 C 235,260 245,250 255,250 L 335,250 C 345,250 355,260 355,270 L 355,370 C 355,380 345,390 335,390 L 255,390 C 245,390 235,380 235,370 Z";
  const shaftMatPath = "M 175,270 C 175,265 180,260 185,260 L 215,260 C 220,260 225,265 225,270 L 225,370 C 225,375 220,380 215,380 L 185,380 C 180,380 175,375 175,370 Z";

  return (
    <div className="relative flex aspect-[4/4.3] w-full items-center justify-center p-4 sm:p-6">
      {/* Dynamic Ambient Blur Glow behind the mats */}
      <div 
        className="absolute inset-12 rounded-full opacity-20 blur-[80px] pointer-events-none transition-all duration-700" 
        style={{ backgroundColor: floor.hex }}
      />

      <svg
        viewBox="0 0 400 430"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full drop-shadow-[0_20px_45px_rgba(0,0,0,0.8)] filter brightness-105"
      >
        <defs>
          {/* Diamond texture representing the EVA cells */}
          <pattern id="eva-cells" width="10" height="10" patternUnits="userSpaceOnUse">
            <path
              d="M 5 0 L 10 5 L 5 10 L 0 5 Z"
              fill="none"
              stroke="rgba(255, 255, 255, 0.16)"
              strokeWidth="0.8"
            />
            {/* Inner cell shading for 3D realism */}
            <circle cx="5" cy="5" r="1.5" fill="rgba(0, 0, 0, 0.25)" />
          </pattern>
          
          {/* Subtle drop shadow filter for 3D mat elevation */}
          <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000" floodOpacity="0.4" />
          </filter>
        </defs>

        <g filter="url(#shadow)">
          {/* 1. Driver's Mat */}
          <g>
            {/* Base Color Fill */}
            <path d={driverMatPath} fill={floor.hex} />
            {/* EVA Texture Overlay */}
            <path d={driverMatPath} fill="url(#eva-cells)" />
            {/* Outer Border (Stitch) */}
            <path d={driverMatPath} stroke={edge.hex} strokeWidth="7" strokeLinejoin="round" />
            {/* Double Stitching Thread Detail */}
            <path d={driverMatPath} stroke="rgba(0, 0, 0, 0.3)" strokeWidth="1" strokeDasharray="3,3" strokeLinejoin="round" />

            {/* Optional Metal Heelpad */}
            {heelPad && (
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Plate base */}
                <rect x="52" y="125" width="46" height="70" rx="6" fill="#1b1c1e" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                {/* Metallic shine grid */}
                <rect x="55" y="128" width="40" height="64" rx="4" fill="url(#metal-pattern)" fillOpacity="0.85" />
                <rect x="55" y="128" width="40" height="64" rx="4" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" fill="none" />
                {/* Rubber anti-slip ridges */}
                <rect x="61" y="134" width="6" height="52" rx="1.5" fill="#08090a" />
                <rect x="72" y="134" width="6" height="52" rx="1.5" fill="#08090a" />
                <rect x="83" y="134" width="6" height="52" rx="1.5" fill="#08090a" />
              </motion.g>
            )}
          </g>

          {/* 2. Passenger's Mat */}
          <g>
            <path d={passengerMatPath} fill={floor.hex} />
            <path d={passengerMatPath} fill="url(#eva-cells)" />
            <path d={passengerMatPath} stroke={edge.hex} strokeWidth="7" strokeLinejoin="round" />
            <path d={passengerMatPath} stroke="rgba(0, 0, 0, 0.3)" strokeWidth="1" strokeDasharray="3,3" strokeLinejoin="round" />
          </g>

          {/* 3. Rear Left Mat */}
          <g>
            <path d={rearLeftMatPath} fill={floor.hex} />
            <path d={rearLeftMatPath} fill="url(#eva-cells)" />
            <path d={rearLeftMatPath} stroke={edge.hex} strokeWidth="7" strokeLinejoin="round" />
            <path d={rearLeftMatPath} stroke="rgba(0, 0, 0, 0.3)" strokeWidth="1" strokeDasharray="3,3" strokeLinejoin="round" />
          </g>

          {/* 4. Rear Right Mat */}
          <g>
            <path d={rearRightMatPath} fill={floor.hex} />
            <path d={rearRightMatPath} fill="url(#eva-cells)" />
            <path d={rearRightMatPath} stroke={edge.hex} strokeWidth="7" strokeLinejoin="round" />
            <path d={rearRightMatPath} stroke="rgba(0, 0, 0, 0.3)" strokeWidth="1" strokeDasharray="3,3" strokeLinejoin="round" />
          </g>

          {/* 5. Middle Bridge Shaft Mat */}
          <g>
            <path d={shaftMatPath} fill={floor.hex} />
            <path d={shaftMatPath} fill="url(#eva-cells)" />
            <path d={shaftMatPath} stroke={edge.hex} strokeWidth="7" strokeLinejoin="round" />
            <path d={shaftMatPath} stroke="rgba(0, 0, 0, 0.3)" strokeWidth="1" strokeDasharray="3,3" strokeLinejoin="round" />
          </g>
        </g>

        {/* Subcomponent pattern definitions */}
        <defs>
          <pattern id="metal-pattern" width="8" height="8" patternUnits="userSpaceOnUse">
            {/* Metallic texture simulation */}
            <rect width="8" height="8" fill="#5a5d64" />
            <rect width="8" height="4" fill="#81858f" />
            <circle cx="4" cy="4" r="1" fill="#2d2f34" />
          </pattern>
        </defs>
      </svg>
    </div>
  );
}
