import { getProducts } from "@/lib/products";
import ProductsFilter from "@/components/sections/products-filter";

export default async function ProductsSection() {
  const products = await getProducts();

  return (
    <section id="products" className="relative pb-20 pt-0 sm:py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-block text-xs font-semibold text-[#c8956c] uppercase tracking-[0.25em] mb-4">
            Our Collection
          </span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#2d2016] mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Made with Love
          </h2>
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-12 bg-[#c8956c]/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8956c]" />
            <span className="h-px w-12 bg-[#c8956c]/40" />
          </div>
          <p className="text-[#5a4635]/70 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Each product is crafted in small batches with the finest natural
            ingredients — from our kitchen to yours.
          </p>
        </div>

        <ProductsFilter products={products} />
      </div>
    </section>
  );
}
