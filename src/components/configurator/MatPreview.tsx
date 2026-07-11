"use client";

type Props = {
  floorColor: string;
  edgeColor: string;
  heelPad: boolean;
  brand?: string;
  model?: string;
};

// 5 parçalı set silüetleri — üstten görünüm
const DRIVER =
  "M118 96 C118 74 132 64 152 64 L190 62 Q204 61 205 76 L209 152 Q210 168 224 168 Q238 168 239 152 L243 88 Q244 68 260 67 L382 72 Q408 74 410 100 L420 418 Q422 468 372 478 L152 502 Q114 506 110 460 Z";
const PASSENGER =
  "M520 80 Q522 62 548 62 L788 68 Q816 70 818 98 L830 418 Q832 466 782 476 L556 496 Q518 500 514 452 L506 106 Q505 82 520 80 Z";
const REAR_L =
  "M95 610 L296 600 Q318 599 319 620 L321 654 L356 652 Q376 651 377 672 L382 812 Q383 848 348 851 L116 858 Q84 860 82 824 L76 642 Q75 611 95 610 Z";
const REAR_R =
  "M604 600 L805 610 Q825 611 824 642 L818 824 Q816 860 784 858 L552 851 Q517 848 518 812 L523 672 Q524 651 544 652 L579 654 L581 620 Q582 599 604 600 Z";
const TUNNEL =
  "M362 574 Q362 556 382 555 L416 553 L420 592 Q421 608 437 608 L463 608 Q479 608 480 592 L484 553 L518 555 Q538 556 538 574 L542 682 Q543 708 516 710 L384 710 Q359 711 358 686 Z";

const PIECES = [DRIVER, PASSENGER, REAR_L, REAR_R, TUNNEL];

// Doku fotoğrafının ortalama gri seviyesi ~0.52 — çarpan bu değere göre normalize edilir.
const TEXTURE_MID_GRAY = 0.52;

function channelSlopes(hex: string) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255 / TEXTURE_MID_GRAY);
}

function shade(hex: string, factor: number) {
  const h = hex.replace("#", "");
  const channel = (i: number) =>
    Math.max(0, Math.min(255, Math.round(parseInt(h.slice(i, i + 2), 16) * factor)));
  return `rgb(${channel(0)},${channel(2)},${channel(4)})`;
}

function MatPiece({ path, edge }: { path: string; edge: string }) {
  return (
    <g filter="url(#pieceShadow)">
      <path d={path} fill="url(#evaTexture)" />
      <path d={path} fill="url(#vignette)" opacity="0.5" />
      <path d={path} fill="none" stroke={shade(edge, 0.55)} strokeWidth="14" strokeLinejoin="round" />
      <path d={path} fill="none" stroke={edge} strokeWidth="10.5" strokeLinejoin="round" />
      <path d={path} fill="none" stroke={shade(edge, 1.45)} strokeWidth="3.5" strokeLinejoin="round" opacity="0.5" />
    </g>
  );
}

/**
 * Gerçek EVA paspas fotoğrafından alınan dokuyla 5 parçalı set önizlemesi.
 * Taban rengi, gri doku fotoğrafına canlı renk matrisi uygulanarak;
 * kenar (overlok) rengi katmanlı kontur olarak güncellenir.
 */
export default function MatPreview({ floorColor, edgeColor, heelPad, brand, model }: Props) {
  const [sr, sg, sb] = channelSlopes(floorColor);

  return (
    <svg
      viewBox="0 0 900 900"
      className="h-auto w-full max-w-lg"
      role="img"
      aria-label="Paspas seti renk önizlemesi"
    >
      <defs>
        {/* Gri dokuyu seçilen taban rengine boyayan filtre */}
        <filter id="floorTint" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values={`${sr.toFixed(3)} 0 0 0 0  0 ${sg.toFixed(3)} 0 0 0  0 0 ${sb.toFixed(3)} 0 0  0 0 0 1 0`}
          />
        </filter>
        {/* Gerçek EVA fotoğraf dokusu — dikişsiz aynalı karo */}
        <pattern id="evaTexture" width="86" height="86" patternUnits="userSpaceOnUse">
          <image href="/media/eva-texture.jpg" width="86" height="86" filter="url(#floorTint)" />
        </pattern>
        <radialGradient id="vignette" cx="50%" cy="42%" r="75%">
          <stop offset="55%" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.36)" />
        </radialGradient>
        <filter id="pieceShadow" x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="0" dy="7" stdDeviation="9" floodColor="rgba(0,0,0,0.35)" />
        </filter>
        <linearGradient id="heelMetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d9dde2" />
          <stop offset="50%" stopColor="#a9afb7" />
          <stop offset="100%" stopColor="#cdd2d8" />
        </linearGradient>
        <linearGradient id="studioBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4f5f7" />
          <stop offset="100%" stopColor="#e2e4e8" />
        </linearGradient>
      </defs>

      <rect width="900" height="900" rx="24" fill="url(#studioBg)" />

      {/* Marka ve model etiketi */}
      <text x="678" y="545" textAnchor="middle" fontSize="26" fontWeight="800" fill="#3a3d42" fontFamily="var(--font-heading), system-ui, sans-serif" letterSpacing="1" opacity="0.55">
        {brand ? brand.toLocaleUpperCase("tr-TR") : "ARACA ÖZEL"}
      </text>
      <text x="678" y="572" textAnchor="middle" fontSize="15" fontWeight="600" fill="#3a3d42" fontFamily="var(--font-body), system-ui, sans-serif" letterSpacing="0.5" opacity="0.45">
        {model ? `${model} · 5 Parçalı Set` : "5 Parçalı Set"}
      </text>

      {PIECES.map((path) => (
        <MatPiece key={path.slice(0, 24)} path={path} edge={edgeColor} />
      ))}

      {heelPad && (
        <g filter="url(#pieceShadow)">
          <rect x="228" y="286" width="140" height="128" rx="12" fill="url(#heelMetal)" stroke="#7d838b" strokeWidth="2" />
          {Array.from({ length: 4 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
              <rect
                key={`${row}-${col}`}
                x={243 + col * 23}
                y={300 + row * 26}
                width="12"
                height="15"
                rx="5.5"
                fill="rgba(15,15,18,0.9)"
              />
            ))
          )}
        </g>
      )}
    </svg>
  );
}
