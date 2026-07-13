import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

// İkon ızgarası yerine kesim föyü dili: malzemenin teknik değer tablosu
const SPEC_ROWS = [
  { key: "MALZEME", value: "Premium EVA — kokusuz, esnek, kırılmaya dayanıklı" },
  { key: "YÜZEY", value: "Su geçirmez baklava hücre; sıvıyı emmez, içinde tutar" },
  { key: "KALIP", value: "Aracınızın taban hatlarına göre kesim, milimetrik uyum" },
  { key: "KENAR", value: "Yüksek kenar yapısı — çamur ve su dışarı taşmaz" },
  { key: "KULLANIM", value: "4 mevsim: yazın serin, kışın sıcak tutar" },
];

export default function Showcase() {
  return (
    <>
      {/* Neden EVA — malzeme hikâyesi + teknik tablo */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal>
            <div className="relative aspect-[4/3] overflow-hidden border border-border">
              <Image
                src="/media/premium-eva-campaign.png"
                alt="Premium EVA paspasın araç içindeki görünümü"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                quality={90}
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <span className="spec-label">Neden EVA paspas?</span>
            <h2 className="mt-4 font-heading text-4xl font-bold text-white sm:text-5xl">
              Ayağınızın altında
              <span className="block text-sand">gerçek fark</span>
            </h2>
            <p className="mt-5 leading-relaxed text-muted">
              Klasik dokuma paspasların aksine EVA malzeme suyu, çamuru ve tozu
              emmez; aracınızın tabanına sızdırmaz. Aşağıdaki değerler her sette
              standarttır.
            </p>
            <dl className="mt-8">
              {SPEC_ROWS.map((row) => (
                <div
                  key={row.key}
                  className="flex flex-col gap-1 border-b border-dashed border-border py-3 sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <dt className="spec-value w-28 shrink-0 text-[11px] font-medium tracking-[0.18em] text-sand">
                    {row.key}
                  </dt>
                  <dd className="text-sm leading-relaxed text-foreground/85">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
            <Link
              href="/urunler"
              className="btn-press mt-8 inline-flex bg-brand-red px-7 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-red-dark"
            >
              Aracının Paspasını Bul
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Kolay temizlik */}
      <section className="bg-eva relative overflow-hidden border-y border-border bg-surface py-16 text-white sm:py-20">
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal className="order-2 lg:order-1">
            <span className="spec-label">Kolay temizlik</span>
            <h2 className="mt-4 font-heading text-4xl font-bold sm:text-5xl">
              Sadece bir sıkım suyla
              <span className="block text-sand">tertemiz</span>
            </h2>
            <p className="mt-5 leading-relaxed text-muted">
              Paspası araçtan çıkarın, üzerine su tutun; kirler saniyeler içinde
              akıp gitsin. Deterjan ya da özel temizlik malzemesi gerekmez.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-4 sm:max-w-sm">
              <div className="relative aspect-square overflow-hidden border border-border">
                <Image
                  src="/media/eva-detail-gray.png"
                  alt="EVA paspas su damlası detayı"
                  fill
                  sizes="200px"
                  quality={90}
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center gap-3 text-sm text-foreground/80">
                <p><strong className="text-white">Su geçirmez</strong> yüzey yapısı</p>
                <p><strong className="text-white">Deterjansız</strong> temizlik</p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120} className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] overflow-hidden border border-border shadow-2xl shadow-black/40">
              <Image
                src="/media/eva-complete-beige.png"
                alt="Bej EVA paspas seti görünümü"
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
