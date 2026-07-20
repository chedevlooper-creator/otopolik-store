import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function ShowroomProducts() {
  // Get all active products from our catalog
  const featuredProducts = getFeaturedProducts(6);

  return (
    <section className="blk border-b border-white/5 bg-black/20">
      <div className="wrap">
        <div className="head rev justify-between items-end gap-6 flex-wrap md:flex-nowrap">
          <div>
            <h2 className="text-gradient-white">Gerçek EVA Paspas ve Aksesuarları</h2>
            <p className="mt-4 max-w-xl text-white/50">
              Lazer ölçümlü EVA paspas setlerimiz, sıvı hapseden bagaj havuzlarımız ve araç içi kullanım ömrünü uzatan özel topuk pedlerimizi inceleyin.
            </p>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-12 rev-stagger items-stretch">
          {featuredProducts.map((product) => {
            const isPaspas = product.slug === "eva-oto-paspas-seti";
            return (
              <div
                key={product.slug}
                className={`rev flex ${isPaspas ? "lg:col-span-2" : ""}`}
              >
                <ProductCard product={product} featured={isPaspas} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
