import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

// Bu alan, @otopolik hesabından seçilip public/media/ altına eklenen onaylı içerikler içindir.
const media = [
  { src: "/media/eva-driver-black.png", alt: "Siyah EVA sürücü paspası görünümü" },
  { src: "/media/eva-complete-beige.png", alt: "Bej EVA paspas seti görünümü" },
  { src: "/media/eva-detail-gray.png", alt: "Gri EVA yüzey doku detayı" },
  { src: "/media/eva-rear-black.png", alt: "Arka sıra EVA paspas görünümü" },
];

export default function InstagramGallery() {
  return <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Instagram</span>
        <h2 className="font-heading mt-2 text-3xl font-extrabold text-neutral-900 sm:text-4xl">Atölyeden ve kullanım detayları</h2>
        <p className="mt-2 max-w-2xl text-neutral-600">Seçilen içerikler siteye sabit olarak eklenir; hızlı ve tutarlı bir deneyim sunar.</p>
      </div>
      <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-red hover:underline">@otopolik&apos;i ziyaret et →</a>
    </div>
    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {media.map((item) => (
        <div key={item.src} className="group relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-black/5">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(min-width: 640px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      ))}
    </div>
    <Link href="/urunler" className="btn-press mt-8 inline-flex rounded-full bg-brand-black px-7 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-md shadow-black/10 hover:bg-brand-red hover:shadow-lg hover:shadow-brand-red/30">Katalogu incele</Link>
  </section>;
}
