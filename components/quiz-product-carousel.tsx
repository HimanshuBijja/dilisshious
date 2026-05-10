"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";

export default function QuizProductCarousel() {
  const { addToCartSilent } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [added, setAdded] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/data/products.json")
      .then((r) => r.json())
      .then((data: Product[]) => setProducts(data))
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartSilent({
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.volumes[0].price,
      originalPrice: product.volumes[0].originalPrice,
      volume: product.volumes[0].label,
      quantity: 1,
    });
    setAdded((prev) => new Set(prev).add(product.slug));
    setTimeout(() => {
      setAdded((prev) => {
        const next = new Set(prev);
        next.delete(product.slug);
        return next;
      });
    }, 1800);
  };

  return (
    <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
      <h3 className="text-xs font-semibold text-[#c8956c] uppercase tracking-[0.2em] mb-4">
        Add to Your Order
      </h3>

      {/* 2-row horizontal scroll grid */}
      <div
        className="-mx-4 px-4 sm:-mx-6 sm:px-6 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        <div
          className="grid gap-2.5"
          style={{
            gridTemplateRows: "repeat(2, auto)",
            gridAutoFlow: "column",
            gridAutoColumns: "130px",
            width: "max-content",
          }}
        >
          {products.map((product) => {
            const isAdded = added.has(product.slug);
            return (
              <Link
                key={product.slug}
                href={`/product/${product.slug}`}
                className="group block w-[130px]"
              >
                <div className="relative bg-white rounded-xl overflow-hidden border border-[#f0e6d8] hover:border-[#c8956c]/30 hover:shadow-md hover:shadow-[#c8956c]/5 transition-all duration-300 flex flex-col h-full">
                  {/* Image */}
                  <div className="relative w-full aspect-square bg-[#faf5ef] overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="130px"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-2 flex flex-col flex-grow">
                    <p className="text-[9px] font-medium text-[#c8956c] uppercase tracking-wider mb-0.5 leading-tight truncate">
                      {product.category}
                    </p>
                    <h4 className="text-[11px] font-semibold text-[#2d2016] leading-tight line-clamp-2 mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                      {product.name}
                    </h4>
                    <div className="flex items-baseline gap-1 mb-1.5">
                      <span className="text-xs font-bold text-[#2d2016]">₹{product.volumes[0].price}</span>
                      {product.volumes[0].originalPrice && (
                        <span className="text-[9px] text-[#5a4635]/40 line-through">₹{product.volumes[0].originalPrice}</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleAdd(e, product)}
                      className={`mt-auto w-full py-1 text-[10px] font-medium rounded-lg flex items-center justify-center gap-1 active:scale-[0.97] transition-all duration-300 ${
                        isAdded
                          ? "bg-[#c8956c] text-white"
                          : "bg-[#2d2016] text-white hover:bg-[#c8956c]"
                      }`}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={10} />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={10} />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
