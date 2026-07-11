import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

export default function Showcase() {
  return (
    <>
      {/* Neden EVA — açık zemin */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <ScrollReveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-black/15 ring-1 ring-black/5">
              <Image
              src="/media/eva-driver-black.png"
                alt="Aracın içinde EVA oto paspası kullanımı"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                quality={90}
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-black/20 via-transparent to-transparent" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
              Neden EVA Paspas?
            </span>
            <h2 className="font-heading mt-3 text-3xl font-extrabold text-neutral-900 sm:text-4xl">
              Ayağınızın altında hissedeceğiniz gerçek fark
            </h2>
            <p className="mt-4 text-neutral-600 leading-relaxed">
              Klasik dokuma paspasların aksine EVA malzeme; suyu, çamuru ve
              tozu emmez, aracınızın tabanına sızdırmaz. Yüksek kenar yapısı
              sayesinde sıvılar dışarı taşmadan paspasın içinde tutulur.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Aracınızın orijinal taban hatlarına göre kalıplanır",
                "Kaymaz taban, güçlendirilmiş topukluk bölgesi",
                "Kokusuz, esnek, kırılmaya dayanıklı premium malzeme",
                "4 mevsim kullanım: yazın serin, kışın sıcak tutar",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-neutral-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-brand-red text-xs">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/urunler"
              className="btn-press mt-8 inline-flex rounded-full bg-brand-black px-7 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-md shadow-black/10 hover:bg-brand-red hover:shadow-lg hover:shadow-brand-red/30"
            >
              Aracının Paspasını Bul
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Kolay temizlik — koyu zemin */}
      <section className="bg-dots-dark relative overflow-hidden bg-brand-black py-14 text-white sm:py-16">
        <div className="pointer-events-none absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-brand-red/15 blur-[120px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-2">
          <ScrollReveal className="order-2 lg:order-1">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
              Kolay Temizlik
            </span>
            <h2 className="font-heading mt-3 text-3xl font-extrabold sm:text-4xl">
              Sadece bir sıkım suyla tertemiz
            </h2>
            <p className="mt-4 leading-relaxed text-neutral-300">
              Paspası araçtan çıkarın, üzerine su tutun, kirler saniyeler
              içinde akıp gitsin. Deterjan ya da özel temizlik malzemesine
              gerek kalmadan hijyenik bir kullanım sağlar.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:max-w-sm">
              <div className="relative aspect-square overflow-hidden rounded-2xl ring-1 ring-white/10">
                <Image
                  src="/media/eva-detail-gray.png"
                  alt="EVA paspas su damlası detayı"
                  fill
                  sizes="200px"
                  quality={90}
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center gap-3 text-sm text-neutral-300">
                <p><strong className="text-white">Su geçirmez</strong> yüzey yapısı</p>
                <p><strong className="text-white">Kolay temizlenen</strong> EVA yüzey</p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120} className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-black/40 ring-1 ring-white/10">
              <Image
                src="/media/eva-complete-beige.png"
                alt="Hortumla yıkanan EVA oto paspası"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                quality={90}
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
