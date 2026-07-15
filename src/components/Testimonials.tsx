import { StarIcon } from "lucide-react";
import { getContentPage, getTestimonials } from "@/lib/cms";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} yıldız`}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon
          key={i}
          className={`h-3.5 w-3.5 ${
            i < count ? "fill-sand text-sand" : "text-border"
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
          <span className="section-kicker">
            {header?.eyebrow ?? "Müşteri Yorumları"}
          </span>
          <h2
            id="testimonials-title"
            className="section-title mt-5"
          >
            {header?.title ?? "Araç sahipleri ne diyor?"}
          </h2>
        </div>
        <p className="hidden max-w-xs text-sm text-white/55 sm:block">
          {header?.body ?? "Gerçek kullanıcı deneyimleri"}
        </p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <article
            key={`${t.name}-${t.sortOrder}`}
            className="flex flex-col gap-3 rounded-2xl border border-white/9 bg-white/[0.025] p-5"
          >
            <Stars count={t.rating} />
            <p className="text-sm leading-relaxed text-white/80">&ldquo;{t.text}&rdquo;</p>
            <footer className="mt-auto border-t border-white/8 pt-3">
              <p className="font-heading text-sm font-bold uppercase text-white">{t.name}</p>
              <p className="spec-value mt-0.5 text-[10px] uppercase tracking-[0.14em] text-white/45">
                {t.location}
              </p>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
