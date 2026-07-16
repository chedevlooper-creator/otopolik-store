import Image from "next/image";
import {
  CarIcon,
  LayersIcon,
  LeafIcon,
  LockIcon,
} from "lucide-react";

const DETAILS = [
  { label: "%100 Araca Özel", icon: CarIcon },
  { label: "Yüksek Kenar Koruması", icon: LayersIcon },
  { label: "Kokusuz EVA Malzeme", icon: LeafIcon },
  { label: "Klips Sistemli Sabitleme", icon: LockIcon },
] as const;

export default function DetailSection() {
  return (
    <section className="home-section detail-section border-t border-white/[0.04] bg-[#07080c]">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-[4/3] overflow-hidden border border-white/[0.08] bg-black">
          <Image
            src="/media/scraped/evaotopaspas/paspas-seti/05-comparison.webp"
            alt="EVA paspas üzerinde su tutma detayı"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <div>
          <p className="section-kicker">Detay</p>
          <h2 className="section-title mt-5 max-w-lg">
            Her detayında farkı hissedin
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/55">
            Petek dokulu yüzey suyu ve çamuru hücrelerde tutar. Tek sıkım suyla
            temizlenir; araç kokusuna karışmayan kokusuz EVA formülüyle üretilir.
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {DETAILS.map(({ label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-sand/30 text-sand">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-white/85">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
