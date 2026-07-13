import { StarIcon } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Mehmet K.",
    location: "İstanbul · VW Passat 2021",
    rating: 5,
    text: "Tam oturdu, 5 dakikada taktım. Çamurlu haftalarda bile zemin kuru kalıyor. Kargo da beklediğimden hızlı geldi.",
  },
  {
    name: "Ayşe D.",
    location: "Ankara · Hyundai i20 2022",
    rating: 5,
    text: "Öncekinden çok farklı, su tutmuyor. Kokusuz olması en büyük artısı, yeni araç kokusu gitmedi.",
  },
  {
    name: "Burak S.",
    location: "İzmir · BMW 3 Seri 2019",
    rating: 5,
    text: "Aracıma özel kesilmesi büyük konfor. Standart paspaslardan çok daha sağlam görünüyor, kayma yok.",
  },
];

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

export default function Testimonials() {
  return (
    <section aria-labelledby="testimonials-title" className="mt-16">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <span className="spec-label">Müşteri Yorumları</span>
          <h2
            id="testimonials-title"
            className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl"
          >
            Araç sahipleri ne diyor?
          </h2>
        </div>
        <p className="hidden text-xs text-muted sm:block">
          <span className="font-heading text-2xl font-bold text-sand">4.9</span>
          <span className="ml-1">/ 5 — 240+ değerlendirme</span>
        </p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <article
            key={t.name}
            className="flex flex-col gap-3 border border-border bg-surface p-5"
          >
            <Stars count={t.rating} />
            <p className="text-sm leading-relaxed text-foreground/85">&ldquo;{t.text}&rdquo;</p>
            <footer className="mt-auto border-t border-dashed border-border pt-3">
              <p className="font-heading text-sm font-bold uppercase text-white">{t.name}</p>
              <p className="spec-value mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted">
                {t.location}
              </p>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
