"use client";

import { useState } from "react";
import ProductCard from "@/components/product-card";
import type { Product } from "@/lib/products";

type CategoryTab = {
  id: string;
  label: string;
  icon: string;
  filter: (p: Product) => boolean;
};

const ALL_TABS: CategoryTab[] = [
  { id: "all",         label: "All",          icon: "✦", filter: () => true },
  { id: "bestsellers", label: "Best Sellers",  icon: "◆", filter: (p) => p.badge === "Bestseller" },
  { id: "new",         label: "New Arrivals",  icon: "✿", filter: (p) => p.badge === "Fresh" },
  { id: "sauces",      label: "Sauces",        icon: "⌘", filter: (p) => p.category === "Spreads · Sauces" },
  { id: "cookies",     label: "Cookies",       icon: "◎", filter: (p) => p.category === "Cookies" },
  { id: "snacks",      label: "Snacks",        icon: "◈", filter: (p) => p.category === "Bars · Snacks" },
  { id: "desserts",    label: "Dessert Jars",  icon: "◉", filter: (p) => p.category === "Dessert Jars" },
  { id: "breads",      label: "Baked",         icon: "❋", filter: (p) => p.category === "Baked · Breads" },
  { id: "condiments",  label: "Condiments",    icon: "◇", filter: (p) => p.category === "Podi · Condiments" },
];

export default function ProductsFilter({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = ALL_TABS.filter(
    (tab) => tab.id === "all" || products.some(tab.filter)
  );

  const activeFilter = tabs.find((t) => t.id === activeTab)?.filter ?? (() => true);
  const filteredProducts = products.filter(activeFilter);

  return (
    <>
      {/* ── Category selector ── */}
      <div className="mb-12">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#e8d5c0] to-transparent" />
          <span className="text-[10px] font-semibold text-[#c8956c]/70 uppercase tracking-[0.3em]">Browse by category</span>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#e8d5c0] to-transparent" />
        </div>

        {/* Grid of category chips */}
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const count = tab.id === "all"
              ? products.length
              : products.filter(tab.filter).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-300 ease-out select-none
                  ${isActive
                    ? "bg-[#2d2016] text-[#fdf8f3] shadow-lg shadow-[#2d2016]/25 scale-[1.02]"
                    : "bg-white border border-[#e8d5c0] text-[#5a4635] hover:border-[#c8956c]/50 hover:bg-[#fdf8f3] hover:shadow-sm hover:shadow-[#c8956c]/5"
                  }
                `}
              >
                {/* Icon glyph */}
                <span
                  className={`text-[11px] transition-colors duration-300 ${
                    isActive ? "text-[#c8956c]" : "text-[#c8956c]/50 group-hover:text-[#c8956c]"
                  }`}
                >
                  {tab.icon}
                </span>

                {/* Label */}
                <span>{tab.label}</span>

                {/* Count pill */}
                <span
                  className={`
                    min-w-[18px] h-[18px] px-1 rounded-md text-[10px] font-bold
                    flex items-center justify-center transition-all duration-300
                    ${isActive
                      ? "bg-[#c8956c]/20 text-[#c8956c]"
                      : "bg-[#f5ebe0] text-[#5a4635]/60 group-hover:bg-[#e8d5c0]/60"
                    }
                  `}
                >
                  {count}
                </span>

                {/* Active bottom bar */}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-[#c8956c]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active category descriptor */}
        <div
          className="mt-5 flex items-center gap-2 transition-all duration-500"
          key={activeTab}
        >
          <span className="w-6 h-px bg-[#c8956c]/40" />
          <p className="text-xs text-[#5a4635]/50 animate-fade-in-up">
            {filteredProducts.length === products.length
              ? `All ${products.length} products`
              : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} in ${tabs.find(t => t.id === activeTab)?.label}`
            }
          </p>
        </div>
      </div>

      {/* ── Product grid ── */}
      <div
        key={activeTab}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 animate-fade-in-up"
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-3xl mb-3">◇</p>
          <p className="text-[#5a4635]/50 text-sm">Nothing here yet — more coming soon.</p>
        </div>
      )}
    </>
  );
}
