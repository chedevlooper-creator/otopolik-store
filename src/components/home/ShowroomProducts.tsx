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
            <span className="mono text-[var(--red-hot)]">ÜRÜN KATALOĞU</span>
            <h2 className="mt-3 text-gradient-white">Aracınız İçin Premium Aksesuarlar</h2>
            <p className="mt-4 max-w-xl text-white/50">
              Lazer ölçümlü EVA paspas setlerimizin yanı sıra, konfor minderleri, koruyucu ekran filmleri ve bagaj aksesuarlarımızı inceleyin.
            </p>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12 rev-stagger">
          {featuredProducts.map((product) => (
            <div key={product.slug} className="rev">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
