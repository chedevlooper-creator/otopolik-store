import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden bg-brand-black text-white sm:min-h-[92vh]">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/media/hero-video.mp4"
        poster="/media/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Sinematik karartma katmanları */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
      {/* Marka kırmızısı vurgu ışığı */}
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-brand-red/25 blur-[140px]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:py-32">
        <div className="max-w-2xl">
          <span className="animate-hero inline-flex items-center gap-2 rounded-full border border-brand-red/40 bg-brand-red/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-red/30">
            Araca Özel Üretim
          </span>
          <h1 className="font-heading animate-hero-delay-1 mt-5 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-[4.2rem]">
            Üstün Koruma,
            <span className="block bg-gradient-to-r from-brand-red to-red-400 bg-clip-text text-transparent">
              Maksimum Konfor
            </span>
          </h1>
          <p className="animate-hero-delay-1 mt-5 max-w-xl text-base leading-relaxed text-neutral-200 sm:text-lg">
            Aracınızın taban hatlarına milimetrik uyum sağlayan premium EVA paspas
            setleri. Çamura, suya ve toza karşı 4 mevsim koruma; tek sıkım suyla
            saniyeler içinde tertemiz.
          </p>
          <div className="animate-hero-delay-2 mt-8 flex flex-wrap gap-3">
            <Link
              href="/urunler"
              className="btn-press rounded-full bg-brand-red px-8 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-brand-red/40 hover:bg-brand-red-dark hover:shadow-xl hover:shadow-brand-red/50"
            >
              Ürünleri İncele
            </Link>
            <Link
              href="/iletisim"
              className="btn-press rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white backdrop-blur-md hover:border-white/60 hover:bg-white/20"
            >
              Aracına Özel Sipariş
            </Link>
          </div>
          <div className="animate-hero-delay-2 mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-300">
            <span>✓ Sipariş öncesi araç uyumluluğu teyidi</span>
            <span>🚚 1-3 iş gününde kargoda</span>
          </div>
        </div>
      </div>

      {/* Aşağı kaydır işareti */}
      <div className="absolute bottom-20 left-1/2 hidden -translate-x-1/2 sm:block" aria-hidden>
        <div className="animate-scroll-cue flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/40 p-1.5">
          <div className="h-2 w-1 rounded-full bg-white/70" />
        </div>
      </div>
    </section>
  );
}
