import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

const SWATCHES = ["#16161a", "#8a8f96", "#c9b79c", "#1e3a5f", "#5e1a22", "#e31c23", "#2456a6", "#e07a20"];

export default function DesignerCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:py-16">
      <ScrollReveal>
        <Link
          href="/olusturucu"
          className="card-lift group relative block overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-neutral-100 p-8 hover:border-brand-red/30 hover:shadow-2xl hover:shadow-brand-red/10 sm:p-10"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-red/10 blur-3xl opacity-70 transition-opacity group-hover:opacity-100" />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
                🎨 Online Paspas Oluşturucu
              </span>
              <h2 className="font-heading mt-2 text-2xl font-extrabold text-neutral-900 sm:text-3xl">
                Kendi Paspasını Tasarla
              </h2>
              <p className="mt-2 max-w-lg text-sm text-neutral-600 sm:text-base">
                Taban ve kenar rengini seç, topuk pedini ekle — 64 renk
                kombinasyonunu canlı önizlemeyle anında gör.
              </p>
              <div className="mt-4 flex items-center gap-1.5">
                {SWATCHES.map((hex) => (
                  <span
                    key={hex}
                    className="h-6 w-6 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-110"
                    style={{ backgroundColor: hex }}
                  />
                ))}
                <span className="ml-1 text-xs font-semibold text-neutral-500">+daha fazlası</span>
              </div>
            </div>
            <span className="btn-press shrink-0 rounded-full bg-brand-red px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-brand-red/30 transition-colors group-hover:bg-brand-red-dark">
              Tasarlamaya Başla →
            </span>
          </div>
        </Link>
      </ScrollReveal>
    </section>
  );
}
