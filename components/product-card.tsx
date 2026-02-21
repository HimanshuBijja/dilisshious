"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.volumes[0].price,
      originalPrice: product.volumes[0].originalPrice,
      volume: product.volumes[0].label,
      quantity: 1,
    });
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative bg-white rounded-2xl overflow-hidden border border-[#f0e6d8] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="absolute top-3 left-3 z-10 flex gap-1">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#c8956c] text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Image */}
        <div className="relative aspect-square bg-[#fdf8f3] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Hover Actions */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <button
              onClick={handleAddToCart}
              className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-[#c8956c] hover:text-white transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingCart size={16} />
            </button>
            <button
              onClick={(e) => e.preventDefault()}
              className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-400 hover:text-white transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart size={16} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs font-medium text-[#c8956c] uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h3
            className="text-base font-semibold text-[#2d2016] mb-1 leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mb-3 line-clamp-1">
            {product.tagline}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#c8956c]">
              ₹{product.volumes[0].price}
            </span>
            {product.volumes[0].originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.volumes[0].originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
