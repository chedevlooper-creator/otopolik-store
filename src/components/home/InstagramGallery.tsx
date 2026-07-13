import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { ArrowRightIcon } from "lucide-react";

// Bu alan, @otopolik hesabından seçilip public/media/scraped/ altına eklenen
// onaylı içerikler içindir. Atölye içi EVA paspas fotoğrafları.
const media = [
  {
    src: "/media/scraped/evaotopaspas/paspas-seti/01-siyah-urun.png",
    alt: "Siyah EVA sürücü paspası görünümü",
    label: "Sürücü kalıbı",
  },
  {
    src: "/media/scraped/evaotopaspas/paspas-seti/02-siyah-urun-tam.png",
    alt: "Bej EVA paspas seti görünümü",
    label: "Tam set görünüm",
  },
  {
    src: "/media/scraped/evaotopaspas/paspas-seti/03-gallery-1.jpg",
    alt: "Gri EVA yüzey doku detayı",
    label: "Petek yüzey",
  },
  {
    src: "/media/scraped/evaotopaspas/paspas-seti/04-gallery-2.jpg",
    alt: "Arka sıra EVA paspas görünümü",
    label: "Arka sıra uyum",
  },
];

export default function InstagramGallery() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="spec-label">Atölyeden</span>
          <h2 className="mt-4 font-heading text-4xl font-bold text-white sm:text-5xl">
            Üretim ve kullanım detayları
          </h2>
        </div>
        <a
          href={siteConfig.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-muted transition-colors hover:text-sand"
        >
          @otopolik
          <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-px border border-border bg-border sm:mt-10 sm:grid-cols-4">
        {media.map((item) => (
          <figure key={item.src} className="group relative aspect-[4/5] overflow-hidden bg-surface sm:aspect-square">
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(min-width: 640px) 25vw, 50vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            />
            <figcaption className="spec-value absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent px-3 pb-3 pt-10 text-[10px] font-medium uppercase tracking-[0.16em] text-sand">
              {item.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
