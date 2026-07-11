import Link from "next/link";
import { ArrowRightIcon, CheckIcon, TruckIcon } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white">
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover opacity-70"
          src="/media/hero-video.mp4"
          poster="/media/hero-poster.jpg"
          autoPlay muted loop playsInline
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32 lg:py-40">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#141414]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em]">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
            Araca Özel Üretim
          </span>

          <h1 className="mt-6 text-4xl font-extrabold uppercase leading-[0.92] tracking-tight sm:text-5xl lg:text-6xl">
            Üstün Koruma.
            <span className="block text-brand-red">Maksimum Konfor.</span>
          </h1>

          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
            Premium EVA paspas setleri. Aracınıza milimetrik uyum, 4 mevsim koruma, tek sıkım suyla temizlik.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/urunler"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-red/30 transition-colors hover:bg-brand-red-dark"
            >
              Ürünleri İncele
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/iletisim"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-[#141414]/5 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-[#141414]/10"
            >
              Aracına Özel Sipariş
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-4 text-sm text-white/50">
            <span className="inline-flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-brand-red" />
              Araç uyumluluğu teyidi
            </span>
            <span className="inline-flex items-center gap-2">
              <TruckIcon className="h-4 w-4 text-brand-red" />
              1-3 iş gününde kargoda
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
