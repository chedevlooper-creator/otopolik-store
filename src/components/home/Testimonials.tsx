import ScrollReveal from "@/components/ScrollReveal";

export default function Testimonials() {
  return (
    <section className="bg-neutral-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <ScrollReveal className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
            Sipariş Öncesi Destek
          </span>
          <h2 className="font-heading mt-2 text-3xl font-extrabold text-neutral-900 sm:text-4xl">
            Aracınıza uygun seti birlikte belirleyelim
          </h2>
        </ScrollReveal>

        <ScrollReveal className="mx-auto mt-10 max-w-2xl rounded-2xl border border-neutral-200 bg-white p-7 text-center">
          <p className="text-sm leading-relaxed text-neutral-700">Marka, model, yıl ve kasa bilginizi paylaşın; siparişe geçmeden önce ürün uyumluluğunu teyit edelim.</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
