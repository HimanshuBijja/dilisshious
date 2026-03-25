"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";
import RotatingStarBadge from "@/components/ui/rotating-star-badge";

const TAG_BADGE_MAP: Record<string, { text: string; color: string }> = {
  Bestseller: { text: "HOT", color: "#FD5758" },
  Fresh: { text: "NEW", color: "#45C873" },
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  // Use dedicated badge field (from admin), fallback to tags for backward compat
  const badgeKey = product.badge || product.tags?.find((t) => TAG_BADGE_MAP[t]);
  const badge = badgeKey ? TAG_BADGE_MAP[badgeKey] : null;

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
      <div className="relative bg-white rounded-2xl overflow-hidden border border-[#e8d5c0]/60 hover:border-[#c8956c]/40 shadow-sm hover:shadow-xl hover:shadow-[#c8956c]/8 transition-all duration-500 hover:-translate-y-1.5 h-full flex flex-col">
        {/* Rotating Star Badge */}
        {badge && (
          <div className="absolute top-2 left-2 z-20">
            <RotatingStarBadge
              text={badge.text}
              color={badge.color}
              size={56}
            />
          </div>
        )}

        {/* Image */}
        <div className="relative aspect-square bg-[#faf5ef] overflow-hidden flex-shrink-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 25vw"
          />
          {/* Subtle vignette on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <p className="text-[10px] sm:text-xs font-medium text-[#c8956c] uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h3
            className="text-sm sm:text-base font-semibold text-[#2d2016] mb-1 leading-tight line-clamp-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {product.name}
          </h3>
          <p className="text-[10px] sm:text-xs text-[#5a4635]/60 mb-2 sm:mb-3 line-clamp-1">
            {product.tagline}
          </p>
          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-3">
            <span className="text-base sm:text-lg font-bold text-[#2d2016]">
              ₹{product.volumes[0].price}
            </span>
            {product.volumes[0].originalPrice && (
              <span className="text-[10px] sm:text-xs text-[#5a4635]/40 line-through">
                ₹{product.volumes[0].originalPrice}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="mt-auto w-full py-2 sm:py-2.5 bg-[#2d2016] text-white text-xs sm:text-sm font-medium rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-[#c8956c] active:scale-[0.97] transition-all duration-300 shadow-sm hover:shadow-md"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={14} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
