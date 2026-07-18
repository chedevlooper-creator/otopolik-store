"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const COLORS = [
  { key: "siyah", name: "Siyah", hex: "#1E1F21", label: "SİYAH — 3D HAVUZLU SET", image: "/media/eva-driver-black.png" },
  { key: "bej", name: "Bej", hex: "#C9B99A", label: "BEJ — 3D HAVUZLU SET", image: "/media/eva-complete-beige.png" },
  { key: "gri", name: "Gri", hex: "#8E9092", label: "GRİ — 3D HAVUZLU SET", image: "/media/eva-detail-gray.png" },
];

export default function ShowroomColorPicker() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeColorObj = COLORS[activeIdx];

  return (
    <section className="blk" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="colorpick">
          <div className="cp-stage rev">
            <span className="mono chip" id="cp-chip">{activeColorObj.label}</span>
            {COLORS.map((c, idx) => (
              <Image
                key={c.key}
                src={c.image}
                alt={`${c.name} EVA set`}
                fill
                className={`object-cover transition-opacity duration-[600ms] ${idx === activeIdx ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]"}`}
                style={{ zIndex: idx === activeIdx ? 2 : 1 }}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={idx === 0}
              />
            ))}
          </div>
          <div className="rev">
            <span className="mono" style={{ color: "var(--red-hot)" }}>RENK SEÇİMİ</span>
            <h2 style={{ marginTop: "12px", fontSize: "clamp(2rem, 3.2vw, 2.9rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.1 }}>
              Zevkine göre.<br />Aracına göre.
            </h2>
            <div className="sw-row">
              {COLORS.map((c, idx) => (
                <button
                  key={c.key}
                  onClick={() => setActiveIdx(idx)}
                  className={`sw ${idx === activeIdx ? "on" : ""}`}
                  style={{ "--c": c.hex } as React.CSSProperties}
                  aria-label={c.name}
                >
                  <span className="lbl">{c.name}</span>
                </button>
              ))}
            </div>
            <p className="cp-note">Taban ve kenar (overlok) rengini ayrı ayrı seçersin — kombinasyonu canlı önizlemeyle gör.</p>
            <Link className="btn btn-ghost" href="/olusturucu">Kombinasyonları Dene →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
