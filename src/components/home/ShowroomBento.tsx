"use client";

import { useState } from "react";
import Image from "next/image";

interface SpecData {
  tag: string;
  title: string;
  desc: string;
  image: string;
  specs: string[];
  side: "right" | "left"; // Console opens on this side
}

const SPEC_ITEMS: SpecData[] = [
  {
    tag: "POLİMER MATRİKS TEKNOLOJİSİ",
    title: "Nano-EVA Elastomer Yapı",
    desc: "Sert köpük ve kauçuk karışımı; koku yapmayan, %100 su geçirmez, hafif ve esnek teknolojik elastomer matrisi.",
    image: "/media/real-eva-black-detail.jpg",
    specs: [
      "Çift moleküllü kopolimer yapısıyla yüksek dirençli esneklik.",
      "Yaz aylarında en yüksek sıcaklıklarda dahi koku oluşturmaz.",
      "Aşınma ve yırtılmaya karşı kauçuğa göre 3 kat daha dayanıklı."
    ],
    side: "right" // Driver mat is on the LEFT → console opens RIGHT
  },
  {
    tag: "HİDROFOBİK SAF HÜCRE SİSTEMİ",
    title: "3D Sıvı Kilit Haznesi",
    desc: "10mm derinliğindeki baklava dilimli hücreler, dökülen çamur, su ve tozları yüzey gerilimiyle hapsederek akışı tamamen önler.",
    image: "/media/real-eva-cargo-detail.jpg",
    specs: [
      "1 Litreye kadar sıvıyı dökülmeden hücre haznesinde tutar.",
      "Ayak tabanının sıvıyla temasını keserek kuru ve temiz tutar.",
      "Sadece ters çevirip silkeleyerek saniyeler içinde temizlenir."
    ],
    side: "left" // Passenger mat is on the RIGHT → console opens LEFT
  },
  {
    tag: "CAD / LAZER MİKROMETRE HASSASİYETİ",
    title: "3D CNC Lazer Kesim Uyum",
    desc: "Aracınızın zemin hatlarına sıfır hata toleransla birebir oturan, kaymayı ve boşlukları engelleyen CNC lazer kesim teknolojisi.",
    image: "/media/real-eva-red-detail.jpg",
    specs: [
      "Lazer mikrometre tarama verileri ile milimetrik şablon uyumu.",
      "Overlok kenar biyesinde aşınmayı önleyen çift dikiş kalitesi.",
      "Alt zemindeki özel cırtlar sayesinde kaymayı sıfıra indirir."
    ],
    side: "left" // Rear mat is on the RIGHT → console opens LEFT
  }
];

export default function ShowroomBento() {
  const [active, setActive] = useState<number | null>(null);

  const currentSide = active !== null ? SPEC_ITEMS[active].side : "right";

  return (
    <section className="blk">
      <div className="wrap">
        <div className="head rev">
          <div>
            <span className="mono">NEDEN OTOPOLİK</span>
            <h2>Showroom kalitesi,<br />zemin seviyesinde.</h2>
          </div>
          <p>Her set sipariş üzerine üretilir — stoktan değil, aracının kalıbından.</p>
        </div>
        
        {/* Full-width showroom tile with HUD */}
        <div 
          className="showroom-hud-wrap"
          onMouseLeave={() => setActive(null)}
        >
          <div className="tile big rev showroom-full-tile">
            <Image
              src="/media/eva_mat_pedestal.jpg"
              alt="EVA paspas seti sergide"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="veil"></div>
            
            {/* Interactive Hotspots Container */}
            <div className="hotspot-container">
              {/* Hotspot 1: Material — driver mat (LEFT side) → line goes RIGHT */}
              <div 
                className={`hotspot-trigger hs-1 ${active === 0 ? "active" : ""}`}
                style={{ top: "52%", left: "30%" }}
                onMouseEnter={() => setActive(0)}
                onClick={() => setActive(0)}
              >
                <div className="hotspot-dot"></div>
                <div className="hotspot-pulse"></div>
                <div className="hotspot-line line-right"></div>
              </div>

              {/* Hotspot 2: Cell pattern — passenger mat (RIGHT side) → line goes LEFT */}
              <div 
                className={`hotspot-trigger hs-2 ${active === 1 ? "active" : ""}`}
                style={{ top: "32%", left: "56%" }}
                onMouseEnter={() => setActive(1)}
                onClick={() => setActive(1)}
              >
                <div className="hotspot-dot"></div>
                <div className="hotspot-pulse"></div>
                <div className="hotspot-line line-left"></div>
              </div>

              {/* Hotspot 3: Laser fit — rear mat (RIGHT side) → line goes LEFT */}
              <div 
                className={`hotspot-trigger hs-3 ${active === 2 ? "active" : ""}`}
                style={{ top: "56%", left: "54%" }}
                onMouseEnter={() => setActive(2)}
                onClick={() => setActive(2)}
              >
                <div className="hotspot-dot"></div>
                <div className="hotspot-pulse"></div>
                <div className="hotspot-line line-left"></div>
              </div>
            </div>

            {/* HUD CONSOLE — positioned dynamically left or right */}
            <div className={`hud-console hud-${currentSide} ${active !== null ? "active" : ""}`}>
              <span className="tag">{SPEC_ITEMS[active ?? 0].tag}</span>
              <h4>{SPEC_ITEMS[active ?? 0].title}</h4>
              <p>{SPEC_ITEMS[active ?? 0].desc}</p>
              
              <div className="hud-image-frame">
                <Image
                  src={SPEC_ITEMS[active ?? 0].image}
                  alt={SPEC_ITEMS[active ?? 0].title}
                  fill
                  className="object-cover"
                  sizes="340px"
                />
                <div className="hud-grid-overlay"></div>
              </div>

              <ul className="hud-specs">
                {SPEC_ITEMS[active ?? 0].specs.map((spec, i) => (
                  <li key={i}>{spec}</li>
                ))}
              </ul>

              {/* Console selector tabs */}
              <div className="hud-tabs">
                <button 
                  className={`hud-tab-btn ${active === 0 ? "active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setActive(0); }}
                >
                  MALZEME
                </button>
                <button 
                  className={`hud-tab-btn ${active === 1 ? "active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setActive(1); }}
                >
                  HÜCRE YAPISI
                </button>
                <button 
                  className={`hud-tab-btn ${active === 2 ? "active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setActive(2); }}
                >
                  3D CAD KALIP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
