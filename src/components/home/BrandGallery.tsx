import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

/** OTO POLİK markalı ürün detay fotoğrafları (LORS filigranı temizlenmiş). */
const BRAND_PHOTOS = [
  { src: "/media/marka-galeri/op-8932.jpg", alt: "AMG rozetli siyah ve taba EVA paspas detayı" },
  { src: "/media/marka-galeri/op-8854.jpg", alt: "Geely rozetli EVA paspas renk seçenekleri" },
  { src: "/media/marka-galeri/op-8906.jpg", alt: "Metal topukluklu siyah ve taba EVA paspas" },
  { src: "/media/marka-galeri/op-8914.jpg", alt: "Araca özel rozetli EVA paspas dokusu" },
  { src: "/media/marka-galeri/op-8899.jpg", alt: "Lexus rozetli premium EVA paspas seti" },
  { src: "/media/marka-galeri/op-8901.jpg", alt: "Nissan rozetli EVA paspas yakın çekim" },
  { src: "/media/marka-galeri/op-8870.jpg", alt: "Hyundai rozetli renkli EVA paspas katmanı" },
  { src: "/media/marka-galeri/op-8850.jpg", alt: "Chevrolet rozetli EVA paspas detayı" },
  { src: "/media/marka-galeri/op-8845.jpg", alt: "TOGG rozetli araca özel EVA paspas" },
  { src: "/media/marka-galeri/op-8865.jpg", alt: "Maserati rozetli premium EVA dokusu" },
  { src: "/media/marka-galeri/op-8927.jpg", alt: "Peugeot rozetli EVA paspas katmanları" },
  { src: "/media/marka-galeri/op-8928.jpg", alt: "Citroën rozetli EVA paspas renkleri" },
] as const;

export default function BrandGallery() {
  return (
    <section className="home-section relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4">
        <ScrollReveal>
          <div className="mb-8 max-w-3xl sm:mb-10">
            <span className="section-kicker">Üretimden kareler</span>
            <h2 className="section-title mt-5">
              Her sete araca özel rozet, her dokuya OTO POLİK imzası.
            </h2>
            <p className="section-copy mt-5 max-w-2xl">
              Gerçek ürün fotoğrafları — marka ve modele göre metal rozet, metal
              topukluk ve milimetrik EVA hücre dokusu.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {BRAND_PHOTOS.map((photo, index) => (
            <ScrollReveal key={photo.src} delay={40 + index * 30}>
              <figure className="group relative aspect-[3/4] overflow-hidden bg-[#0c0d10]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
              </figure>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
