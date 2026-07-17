import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

/** Referans "Luxury Interior" bölümü: solda iç mekân fotoğrafı, sağda metin + galeri CTA'sı. */
export default function LuxuryInterior() {
  return (
    <section className="ambient-glow-right bg-black py-8 text-white md:py-12">
      <div className="relative z-10 mx-auto grid max-w-screen-2xl 2xl:px-8 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
        <div className="premium-card group relative overflow-hidden rounded-2xl">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src="/media/hero-luxury-interior.png"
              alt="Premium EVA paspas ile döşenmiş lüks araç iç mekanı"
              fill
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        <div>
          <span className="section-kicker">Luxury Interior</span>
          <h2 className="mt-6 font-heading text-3xl font-medium tracking-tight text-white sm:text-4xl">
            Paspas Değil,
            <br />
            Tasarımın Devamı.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
            Aracınızın iç mekân tasarımını tamamlayan, milimetrik hassasiyetle
            kesilmiş şık ve premium bir dokunuş. Her detay, aracınızın orijinal
            hatlarına uyacak şekilde işlenir.
          </p>
          <Link
            href="/galeri"
            className="btn-press btn-ghost-rich mt-6 inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-xs font-semibold text-white"
          >
            Galeriye git
            <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
