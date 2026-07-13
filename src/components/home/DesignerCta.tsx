import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { ArrowRightIcon } from "lucide-react";

// Oluşturucudaki gerçek renk kartelası — taban ve kenar ayrı seçilir
const FLOOR_SWATCHES = [
  { name: "Siyah", hex: "#16161a" },
  { name: "Antrasit", hex: "#3a3d42" },
  { name: "Gri", hex: "#8a8f96" },
  { name: "Açık Gri", hex: "#b9bec5" },
  { name: "Bej", hex: "#c9b79c" },
  { name: "Kahve", hex: "#6b4a2f" },
  { name: "Lacivert", hex: "#1e3a5f" },
  { name: "Bordo", hex: "#5e1a22" },
];

const EDGE_SWATCHES = [
  { name: "Siyah", hex: "#141414" },
  { name: "Gri", hex: "#8a8f96" },
  { name: "Bej", hex: "#c9b79c" },
  { name: "Kırmızı", hex: "#e31c23" },
  { name: "Mavi", hex: "#2456a6" },
  { name: "Turuncu", hex: "#e07a20" },
  { name: "Yeşil", hex: "#2e7d4f" },
  { name: "Mor", hex: "#6b3fa0" },
];

const PREVIEW_DETAILS = [
  { label: "Taban", value: "Bej EVA" },
  { label: "Kenar", value: "Ton sür ton" },
  { label: "Set", value: "5 parçalı" },
];

function SwatchRow({ label, swatches }: { label: string; swatches: { name: string; hex: string }[] }) {
  return (
    <div className="flex flex-col gap-2 border-b border-dashed border-border py-4 sm:flex-row sm:items-center sm:gap-6">
      <span className="spec-value w-20 shrink-0 text-[11px] font-medium uppercase tracking-[0.18em] text-sand">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {swatches.map((s) => (
          <span
            key={s.name}
            title={s.name}
            className="h-7 w-7 border border-white/15"
            style={{ backgroundColor: s.hex }}
          />
        ))}
      </div>
    </div>
  );
}

export default function DesignerCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <ScrollReveal>
          <div className="overflow-hidden border border-border bg-surface shadow-2xl shadow-black/40">
            <div className="relative aspect-[4/3] overflow-hidden bg-background">
              <Image
                src="/media/eva-complete-beige.png"
                alt="Araç içinde özel kesim EVA paspas renk kombinasyonu"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                quality={90}
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/10" />
              <div className="absolute left-4 top-4 border border-white/10 bg-background/80 px-3 py-2 backdrop-blur-sm">
                <p className="font-heading text-sm font-bold uppercase text-white">
                  Örnek kombinasyon
                </p>
                <p className="spec-value text-[10px] font-medium uppercase tracking-[0.14em] text-sand">
                  Taban + Kenar
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 border-t border-border bg-background/70">
              {PREVIEW_DETAILS.map((detail) => (
                <div
                  key={detail.label}
                  className="border-r border-border px-3 py-4 last:border-r-0 sm:px-5"
                >
                  <p className="spec-value text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
                    {detail.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {detail.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <span className="spec-label">Taban + Kenar</span>
          <h2 className="mt-4 font-heading text-4xl font-bold text-white sm:text-5xl">
            Rengini sen seç,
            <span className="block text-sand">biz aracına göre keselim</span>
          </h2>
          <p className="mt-5 leading-relaxed text-muted">
            Her set iki renkten oluşur: paspasın tabanı ve overlok kenarı.
            8 taban ve 8 kenar rengiyle 64 farklı kombinasyonu gerçek araç
            içi fotoğraflarıyla inceleyin.
          </p>

          <div className="mt-6">
            <SwatchRow label="Taban" swatches={FLOOR_SWATCHES} />
            <SwatchRow label="Kenar" swatches={EDGE_SWATCHES} />
          </div>

          <Link
            href="/olusturucu"
            className="btn-press mt-8 inline-flex items-center gap-2 bg-brand-red px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-red-dark"
          >
            Tasarlamaya Başla
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
