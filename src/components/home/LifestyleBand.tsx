import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export default function LifestyleBand() {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.06]">
      <div className="absolute inset-0">
        <Image
          src="/media/galeri/paspas-seti/18-bej-surucu.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
      </div>

      <div className="relative mx-auto flex min-h-[22rem] max-w-7xl flex-col justify-center px-4 py-16 sm:min-h-[26rem]">
        <p className="section-kicker">Tasarım</p>
        <h2 className="mt-5 max-w-xl font-heading text-[clamp(1.85rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.03em] text-white">
          Paspas değil, tasarımın devamı.
        </h2>
        <p className="mt-4 max-w-md text-sm leading-7 text-white/60">
          İç mekânın çizgisine uyum sağlayan kenar hatları ve renk seçenekleriyle
          aracınızın karakterini tamamlar.
        </p>
        <Link
          href="/galeri"
          className="btn-press btn-sand-rich mt-8 inline-flex min-h-12 w-fit items-center gap-2 px-7 text-[11px] font-bold uppercase tracking-[0.12em] text-background"
        >
          Galeriyi gör
          <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
