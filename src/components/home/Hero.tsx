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

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-black text-white"
    >
      {/* Background Media with Scroll-Linked Scale */}
      <motion.div
        style={{ scale: backgroundScale, opacity: backgroundOpacity }}
        className="absolute inset-0 z-0 origin-center"
      >
        <div className="absolute inset-0">
          <HeroMedia />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.96)_0%,rgba(0,0,0,.82)_28%,rgba(0,0,0,.28)_58%,rgba(0,0,0,.06)_82%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.4)_0%,transparent_42%,rgba(0,0,0,.82)_100%)]" />
      </motion.div>

      {/* Main Content Layout */}
      <div className="relative z-10 mx-auto flex w-full max-w-screen-2xl flex-1 flex-col justify-center px-4 py-24 sm:px-6 sm:py-28 2xl:px-8 lg:py-32">
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center"
        >
          {/* Left Column: Text Content */}
          <div className="text-left">
            <motion.p
              variants={itemVariants}
              className="font-heading text-[clamp(3.2rem,8.5vw,7rem)] font-medium leading-[0.9] tracking-[-0.05em] text-white"
            >
              OTOPOLİK
            </motion.p>

            <svg
              className="mt-3 w-full max-w-md text-brand-red"
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
              className="mt-8 max-w-xl font-heading text-[clamp(1.5rem,2.6vw,2.2rem)] font-medium leading-[1.2] tracking-[-0.03em] text-white"
            >
              {headline}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-5 max-w-md text-base leading-7 text-white/68 sm:text-[17px]"
            >
              {hero?.body ?? "Lazer kesim kalıp. Premium EVA. 1-3 günde kargo."}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-3"
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
          </div>

          {/* Right Column: 3D Mouse Parallax Floating Car Card */}
          <motion.div
            variants={itemVariants}
            className="hidden lg:flex justify-center items-center"
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative w-80 h-96 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.01] p-8 shadow-[0_32px_64px_rgba(0,0,0,0.6)] backdrop-blur-md flex flex-col justify-between items-center overflow-hidden group"
            >
              {/* Backlight red glow inside the card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-brand-red/10 blur-[60px] pointer-events-none transition-all duration-500 group-hover:bg-brand-red/15 group-hover:scale-110" />

              <div className="w-full text-center" style={{ transform: "translateZ(30px)" }}>
                <span className="text-[10px] font-black tracking-[0.2em] text-brand-red uppercase">
                  Precision Engineering
                </span>
                <h3 className="text-xl font-heading font-medium text-white mt-1">
                  Ultra-Premium 3D
                </h3>
              </div>

              {/* Floating 3D Car Image */}
              <div
                className="relative w-64 h-48 select-none"
                style={{ transform: "translateZ(60px)" }}
              >
                <Image
                  src="/media/car-icon-3d.png"
                  alt="3D Car"
                  fill
                  className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] filter brightness-110 animate-[bounce_3.5s_ease-in-out_infinite]"
                  sizes="256px"
                  priority
                />
              </div>

              <div className="w-full text-center" style={{ transform: "translateZ(30px)" }}>
                <p className="text-xs text-white/55 leading-relaxed">
                  Lazer ölçümüyle sıfır hata.<br/>Aracınızla mükemmel uyum.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      {/* Bottom ambient red glow */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-brand-red/[0.08] to-transparent pointer-events-none z-10" />
    </section>
  );
}
