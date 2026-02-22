import ProductCard from "@/components/product-card";
import { products } from "@/lib/products";

export default function ProductsSection() {
  return (
    <section id="products" className="pb-20 pt-0 sm:py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <span className="inline-block text-xs font-semibold text-[#c8956c] uppercase tracking-[0.2em] mb-3">
            Our Collection
          </span>
          <h2
            className="text-4xl sm:text-5xl font-bold text-[#2d2016] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Made with Love
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Each product is crafted in small batches with the finest natural
            ingredients
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
