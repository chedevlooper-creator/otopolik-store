import { StarIcon } from "lucide-react";
import { getContentPage, getTestimonials } from "@/lib/cms";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} yıldız`}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon
          key={i}
          className={`h-3.5 w-3.5 ${
            i < count ? "fill-white text-white" : "text-white/10"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default async function Testimonials() {
  const [{ items }, { sections }] = await Promise.all([
    getTestimonials(),
    getContentPage("home"),
  ]);
  const header = sections.find((s) => s.sectionKey === "testimonials");

  return (
    <section aria-labelledby="testimonials-title" className="mt-0">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          {header?.eyebrow !== undefined && header?.eyebrow !== null ? (
            header.eyebrow && header.eyebrow.toUpperCase() !== "EYEBROW" ? (
              <span className="section-kicker">{header.eyebrow}</span>
            ) : null
          ) : (
            <span className="section-kicker">Müşteri Yorumları</span>
          )}
          <h2
            id="testimonials-title"
            className="section-title mt-6"
          >
            {header?.title ?? "Araç sahipleri ne diyor?"}
          </h2>
        </div>
        <p className="hidden max-w-xs text-sm text-white/45 sm:block">
          {header?.body ?? "Gerçek kullanıcı deneyimleri"}
        </p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <article
            key={`${t.name}-${t.sortOrder}`}
            className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 transition-all duration-400 hover:border-white/[0.1] hover:bg-white/[0.03]"
          >
            {/* Dekoratif tırnak işareti */}
            <span className="pointer-events-none absolute -right-2 -top-4 font-heading text-[6rem] font-bold leading-none text-white/[0.02] transition-colors duration-500 group-hover:text-white/[0.04]" aria-hidden="true">&ldquo;</span>
            <Stars count={t.rating} />
            <p className="relative text-sm leading-7 text-white/70">&ldquo;{t.text}&rdquo;</p>
            <footer className="mt-auto border-t border-white/[0.05] pt-4">
              <p className="font-heading text-sm font-bold text-white">{t.name}</p>
              <p className="spec-value mt-0.5 text-[10px] uppercase tracking-[0.14em] text-white/38">
                {t.location}
              </p>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
