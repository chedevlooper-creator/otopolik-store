import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

const PHOTOS = [
  "/media/galeri/paspas-seti/10-siyah-surucu.jpg",
  "/media/galeri/paspas-seti/03-taba-surucu.jpg",
  "/media/galeri/paspas-seti/15-gri-surucu.jpg",
  "/media/galeri/paspas-seti/16-mavi-on-yolcu.jpg",
  "/media/galeri/paspas-seti/08-siyah-arka-sira.jpg",
  "/media/galeri/paspas-seti/18-bej-surucu.jpg",
  "/media/galeri/paspas-seti/11-siyah-on-yolcu-suv.jpg",
  "/media/galeri/paspas-seti/04-taba-on-yolcu.jpg",
  "/media/galeri/paspas-seti/14-gri-arka-sira.jpg",
  "/media/galeri/paspas-seti/06-taba-kenar-detay.jpg",
] as const;

export default function CustomerGallery() {
  return (
    <section className="home-section border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="section-kicker">Galeri</p>
            <h2 className="section-title mt-5">Müşteri kullanımından kareler</h2>
          </div>
          <Link
            href="/galeri"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-sand transition-colors hover:text-white"
          >
            Daha fazla görsel
            <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 md:gap-3">
          {PHOTOS.map((src) => (
            <div
              key={src}
              className="relative aspect-square overflow-hidden border border-white/[0.06] bg-black"
            >
              <Image
                src={src}
                alt="Müşteri araç içi EVA paspas uygulaması"
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
