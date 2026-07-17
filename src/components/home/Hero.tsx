"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import HeroMedia from "@/components/home/HeroMedia";
import { ArrowRightIcon } from "lucide-react";
import type { ContentSection } from "@/lib/cms-defaults";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";

type Props = {
  content?: {
    hero: ContentSection | null;
    secondaryCta: ContentSection | null;
  };
};

const MATERIAL_SPECS = [
  { label: "Yoğunluk", value: "850 kg/m³" },
  { label: "Koku Seviyesi", value: "0 (Kokusuz)" },
  { label: "Hammadde", value: "100% Premium EVA" },
  { label: "Sıcaklık Direnci", value: "-40°C / +80°C" },
];

export default function Hero({ content }: Props) {
  const hero = content?.hero;
  const secondary = content?.secondaryCta;
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll animations for Apple launch scaling effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 1], [0.95, 0.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Mouse tilt tracking for 3D Parallax Car Card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  function handleMouseMove(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = event.clientX - rect.left - width / 2;
    const y = event.clientY - rect.top - height / 2;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const headline =
    hero?.title && hero?.subtitle
      ? `${hero.title} ${hero.subtitle}`.replace(/\s+/g, " ").trim()
      : hero?.title ?? "Araca özel havuzlu paspas";

  // Stagger variants for smooth entrance
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.85,
        ease: [0.19, 1, 0.22, 1] as const,
      },
    },
  };

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1.1,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: 0.4,
      },
    },
  };

  const spineVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: {
        duration: 1.4,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: 0.2,
      },
    },
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-[calc(100svh-7.375rem)] flex-col justify-center overflow-hidden bg-black text-white sm:min-h-[calc(100svh-8.3125rem)] lg:min-h-[calc(100svh-9.25rem)]"
    >
      {/* Background Media with Scroll-Linked Scale */}
      <motion.div
        style={{ scale: backgroundScale, opacity: backgroundOpacity }}
        className="absolute inset-0 z-0 origin-center"
      >
        <div className="absolute inset-0">
          <HeroMedia />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.55)_0%,rgba(0,0,0,.22)_38%,rgba(0,0,0,.92)_100%)]" />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      {/* Central engineering spine — Spine Safeguard motif */}
      <motion.div
        variants={spineVariants}
        initial="hidden"
        animate="visible"
        style={{ transformOrigin: "top" }}
        className="pointer-events-none absolute inset-y-0 left-1/2 z-10 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-brand-red/70 to-transparent shadow-[0_0_16px_rgba(237,27,36,0.45)] lg:block"
        aria-hidden="true"
      />

      {/* Main Content Layout */}
      <div className="relative z-10 mx-auto flex w-full max-w-screen-2xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-12 2xl:px-8 lg:py-12">
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          <motion.span variants={itemVariants} className="section-kicker">
            Hassas Mühendislik Protokolü
          </motion.span>

          <motion.p
            variants={itemVariants}
            className="mt-3 font-heading text-[clamp(2.8rem,7vw,5.75rem)] font-medium leading-[0.88] tracking-[-0.055em] text-white"
          >
            OTOPOLİK
          </motion.p>

          <svg
            className="mx-auto mt-3 h-[18px] w-full max-w-md text-brand-red"
            viewBox="0 0 420 18"
            fill="none"
            aria-hidden="true"
          >
            <motion.path
              variants={lineVariants}
              d="M2 12 C48 4, 72 16, 118 9 S190 3, 230 11 S310 16, 360 7 L418 10"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
            <motion.circle
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              cx="2"
              cy="12"
              r="2"
              fill="currentColor"
            />
          </svg>

          <motion.h1
            variants={itemVariants}
            className="mt-5 max-w-2xl font-heading text-[clamp(1.25rem,2.1vw,1.85rem)] font-medium leading-[1.15] tracking-[-0.03em] text-white"
          >
            {headline}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-3 max-w-md text-sm leading-6 text-white/68 sm:text-base"
          >
            {hero?.body ?? "Lazer kesim kalıp. Premium EVA. 1-3 günde kargo."}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-3"
          >
            <Link
              href={hero?.ctaHref ?? "/#arac-sec"}
              className="btn-press btn-red-rich inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-8 text-[11px] font-bold uppercase tracking-[0.12em] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {hero?.ctaLabel ?? "Aracını seç"}
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={secondary?.ctaHref ?? "/urunler"}
              className="btn-press btn-ghost-rich inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-8 text-[11px] font-bold uppercase tracking-[0.12em] text-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {secondary?.ctaLabel ?? "Koleksiyonu keşfet"}
            </Link>
          </motion.div>
        </motion.div>

        {/* Symmetric engineering grid: spec panel / 3D car / diagnostic panel */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 grid grid-cols-1 items-center gap-5 lg:mt-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-10"
        >
          {/* Left: Material Analysis */}
          <div className="hidden lg:block">
            <div className="premium-card mx-auto max-w-xs rounded-2xl p-5">
              <span className="spec-label">Malzeme Analizi</span>
              <div className="mt-5 space-y-3">
                {MATERIAL_SPECS.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between border-b border-white/8 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-[11px] uppercase tracking-[0.08em] text-white/45">
                      {spec.label}
                    </span>
                    <span className="spec-value text-sm text-white">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center: 3D Mouse Parallax Floating Car Card */}
          <div className="flex justify-center">
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              className="premium-card group relative flex h-80 w-72 flex-col items-center justify-between overflow-hidden rounded-[1.75rem] p-7 sm:h-[21rem] sm:w-80"
            >
              {/* Backlight red glow inside the card */}
              <div className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-red/10 blur-[60px] pointer-events-none transition-all duration-500 group-hover:bg-brand-red/15 group-hover:scale-110" />

              <div className="w-full text-center" style={{ transform: "translateZ(30px)" }}>
                <span className="text-[9px] font-black tracking-[0.2em] text-brand-red uppercase sm:text-[10px]">
                  Hücresel Mimari
                </span>
                <h3 className="mt-1 font-heading text-lg font-medium text-white sm:text-xl">
                  Premium EVA Koruma
                </h3>
              </div>

              {/* Floating 3D Car Image — engineered drift, not a cartoon bounce */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative h-40 w-56 select-none sm:h-44 sm:w-64"
                style={{ transform: "translateZ(60px)" }}
              >
                <Image
                  src="/media/car-icon-3d.png"
                  alt="3D Car"
                  fill
                  className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] filter brightness-110"
                  sizes="256px"
                  priority
                />
              </motion.div>

              <div className="w-full text-center" style={{ transform: "translateZ(30px)" }}>
                <p className="text-xs text-white/55 leading-relaxed">
                  Sıvı ve kiri elmas hücrelerinde
                  <br />
                  hapsederek zemini korur.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: Fitment Diagnostic */}
          <div className="hidden lg:block">
            <div className="premium-card mx-auto max-w-xs rounded-2xl p-5">
              <span className="spec-label">Performans & Dayanım</span>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] text-white/70">Kontur Uyum Hassasiyeti</span>
                  <span className="spec-value text-xs text-emerald-400 font-bold">Sıfır Boşluk</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] text-white/70">Sıvı Kapasitesi</span>
                  <span className="spec-value text-xs text-white">4 Litre / m²</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] text-white/70">Kolay Temizlik</span>
                  <span className="spec-value text-xs text-white">15 saniye (Salla & Yıka)</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] text-white/70">Yüzey Kaymazlık Katsayısı</span>
                  <span className="spec-value text-xs text-white">0.98</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/50 lg:flex">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em]">Kaydırarak keşfet</span>
        <span className="animate-scroll-cue h-8 w-px bg-gradient-to-b from-white/60 to-transparent" />
      </div>

      {/* Bottom ambient red glow */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-brand-red/[0.08] to-transparent pointer-events-none z-10" />
    </section>
  );
}
