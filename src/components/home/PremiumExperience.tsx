"use client";

import { useRef, useState } from "react";
import {
  Layers3Icon,
  PlayIcon,
  PauseIcon,
  RulerIcon,
  SparklesIcon,
  WrenchIcon,
} from "lucide-react";

const FEATURES = [
  {
    icon: RulerIcon,
    label: "%100 Araca Özel",
    detail: "3D tarama ile milimetrik kalıp",
  },
  {
    icon: Layers3Icon,
    label: "Yüksek Kenar Koruması",
    detail: "Havuzlu tasarım sıvıyı içeride tutar",
  },
  {
    icon: SparklesIcon,
    label: "Kokusuz EVA Malzeme",
    detail: "Sağlığa uygun, koku yapmayan doku",
  },
  {
    icon: WrenchIcon,
    label: "Klips Sistemi ile Sabitleme",
    detail: "Orijinal bağlantı noktalarına oturur",
  },
] as const;

/**
 * Referans "Premium Deneyim" bölümü: solda başlık + 2×2 özellik listesi,
 * sağda tıkla-oynat video kartı. Video kullanıcı etkileşimiyle başlar
 * (preload="none"), bu yüzden reduced-motion için ek koşul gerekmez.
 */
export default function PremiumExperience() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.muted = true;
      void video
        .play()
        .then(() => setPlaying(true))
        .catch(() => undefined);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <section
      id="premium-deneyim"
      className="ambient-glow border-t border-white/[0.04] bg-black py-8 text-white md:py-12"
    >
      <div className="relative z-10 mx-auto grid max-w-screen-2xl 2xl:px-8 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        <div>
          <span className="section-kicker">Premium Deneyim</span>
          <h2 className="mt-6 font-heading text-3xl font-medium tracking-tight text-white sm:text-4xl">
            Her Detayında
            <br />
            Farkı Hissedin
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
            3D tarama teknolojisi ile aracınızın zeminine milimetrik olarak
            uyum sağlar.
          </p>

          <ul className="mt-8 grid gap-x-4 gap-y-4 sm:grid-cols-2">
            {FEATURES.map((item) => (
              <li
                key={item.label}
                className="mac-glass group/feat flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-[#0c0c0c]/40 p-4.5 transition-all duration-400 hover:border-white/15 hover:bg-[#141414]/50 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white transition-all duration-400 group-hover/feat:scale-110 group-hover/feat:border-brand-red/30 group-hover/feat:text-brand-red group-hover/feat:shadow-[0_0_12px_rgba(237,27,36,0.15)]">
                  <item.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 group-hover/feat:text-white">
                    {item.label}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/50 group-hover/feat:text-white/70">
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mac-glass group relative overflow-hidden rounded-3xl">
          <div className="relative aspect-[4/3] w-full">
            <video
              ref={videoRef}
              src="/media/hero-video.mp4"
              poster="/media/water-drops-closeup.jpg"
              preload="none"
              muted
              loop
              playsInline
              tabIndex={-1}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Videoyu duraklat" : "Videoyu oynat"}
              className="absolute inset-0 z-10 flex items-center justify-center"
            >
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-sm transition-all duration-300 group-hover:border-white/60 group-hover:text-white ${
                  playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                }`}
              >
                {playing ? (
                  <PauseIcon className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <PlayIcon className="ml-0.5 h-6 w-6" aria-hidden="true" />
                )}
              </span>
            </button>
            <p className="pointer-events-none absolute bottom-4 left-5 z-10 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65">
              Su geçirmez hücresel yapı
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
