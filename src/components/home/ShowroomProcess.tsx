import { SafeImage } from "@/components/ui/SafeImage";

export default function ShowroomProcess() {
  return (
    <section className="blk" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="head rev">
          <div>
            <span className="mono">ÜRETİM & KALİTE</span>
            <h2>Gerçek EVA Deneyimi</h2>
            <p className="mt-4 text-base leading-7 text-white/55 max-w-2xl">
              Aracınıza tam oturan, her türlü kiri hapseden ve estetik görünümüyle iç mekânın havasını değiştiren premium EVA teknolojisi.
            </p>
          </div>
        </div>
        
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {/* Kart 1: Kesim / Uyumluluk */}
          <div className="group premium-card gradient-border card-lift overflow-hidden rounded-3xl flex flex-col min-h-[460px]">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/50">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.05),transparent_60%)] z-10" />
              <SafeImage 
                src="/media/eva-laser-cut.png"
                alt="Lazer kesim işlemi"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <span className="spec-value text-[11px] font-bold uppercase tracking-[0.16em] text-white/50 mb-3">01 / Mükemmel Uyum</span>
              <h3 className="font-heading text-2xl font-bold text-white mb-2">Milimetrik Hassasiyet</h3>
              <p className="text-sm leading-relaxed text-white/60">
                Lazer kesim teknolojisi ile aracınızın taban ölçülerine %100 uyumlu, boşluksuz ve kaymayan bir yapı elde edilir. Pedallara takılmaz.
              </p>
            </div>
          </div>

          {/* Kart 2: Su geçirmezlik */}
          <div className="group premium-card gradient-border card-lift overflow-hidden rounded-3xl flex flex-col min-h-[460px]">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/50">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.05),transparent_60%)] z-10" />
              <SafeImage 
                src="/media/eva-waterproof.png"
                alt="Su geçirmez yapı"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <span className="spec-value text-[11px] font-bold uppercase tracking-[0.16em] text-white/50 mb-3">02 / Maksimum Koruma</span>
              <h3 className="font-heading text-2xl font-bold text-white mb-2">Sıvı ve Kir Hapseden Yüzey</h3>
              <p className="text-sm leading-relaxed text-white/60">
                Elmas şeklindeki derin hücreleri sayesinde çamur, su ve toz yüzeyde hapsolur. Sadece silkeleyin ve aracınız ilk günkü temizliğine kavuşsun.
              </p>
            </div>
          </div>

          {/* Kart 3: Kalite / Detay */}
          <div className="group premium-card gradient-border card-lift overflow-hidden rounded-3xl flex flex-col min-h-[460px]">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/50">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.05),transparent_60%)] z-10" />
              <SafeImage 
                src="/media/eva-perfect-fit.png"
                alt="Premium kenar detayı"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <span className="spec-value text-[11px] font-bold uppercase tracking-[0.16em] text-white/50 mb-3">03 / Premium Hissiyat</span>
              <h3 className="font-heading text-2xl font-bold text-white mb-2">Özel Dikim Kenarlar</h3>
              <p className="text-sm leading-relaxed text-white/60">
                Aracınızın iç mekân renkleriyle uyum sağlayan yüksek mukavemetli kalın biye kenarlar. Zamanla sökülmez ve yıpranmaz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
