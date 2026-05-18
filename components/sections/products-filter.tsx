"use client";

import { useState, useRef, useEffect } from "react";
import ProductCard from "@/components/product-card";
import type { Product } from "@/lib/products";

type CategoryTab = {
  id: string;
  label: string;
  filter: (p: Product) => boolean;
};

const ALL_TABS: CategoryTab[] = [
  { id: "all",         label: "All",          filter: () => true },
  { id: "bestsellers", label: "Best Sellers",  filter: (p) => p.badge === "Bestseller" },
  { id: "new",         label: "New Arrivals",  filter: (p) => p.badge === "Fresh" },
  { id: "breakfast",   label: "Breakfast",     filter: (p) => p.category === "Breakfast" },
  { id: "sauces",      label: "Sauces",        filter: (p) => p.category === "Spreads · Sauces" },
  { id: "cookies",     label: "Cookies",       filter: (p) => p.category === "Cookies" },
  { id: "snacks",      label: "Snacks",        filter: (p) => p.category === "Bars · Snacks" },
  { id: "desserts",    label: "Dessert Jars",  filter: (p) => p.category === "Dessert Jars" },
  { id: "breads",      label: "Baked",         filter: (p) => p.category === "Baked · Breads" },
  { id: "condiments",  label: "Condiments",    filter: (p) => p.category === "Podi · Condiments" },
];

function TabChip({
  tab,
  isActive,
  count,
  compact,
  onClick,
}: {
  tab: CategoryTab;
  isActive: boolean;
  count: number;
  compact?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "group relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium",
        "transition-all duration-300 ease-out select-none whitespace-nowrap",
        isActive
          ? "bg-[#2d2016] text-[#fdf8f3] shadow-lg shadow-[#2d2016]/25 scale-[1.02]"
          : "bg-white border border-[#e8d5c0] text-[#5a4635] hover:border-[#c8956c]/50 hover:bg-[#fdf8f3] hover:shadow-sm hover:shadow-[#c8956c]/5",
        compact ? "w-full" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span>{tab.label}</span>
      <span
        className={`min-w-[18px] h-[18px] px-1 rounded-md text-[10px] font-bold flex items-center justify-center transition-all duration-300 ${
          isActive
            ? "bg-[#c8956c]/20 text-[#c8956c]"
            : "bg-[#f5ebe0] text-[#5a4635]/60 group-hover:bg-[#e8d5c0]/60"
        }`}
      >
        {count}
      </span>
      {isActive && !compact && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-[#c8956c]" />
      )}
    </button>
  );
}

export default function ProductsFilter({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState("all");
  const [moreOpen, setMoreOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const tabs = ALL_TABS.filter(
    (tab) => tab.id === "all" || products.some(tab.filter)
  );

  const getCount = (tab: CategoryTab) =>
    tab.id === "all" ? products.length : products.filter(tab.filter).length;

  useEffect(() => {
    const measure = () => {
      const wrapper = wrapperRef.current;
      const measureDiv = measureRef.current;
      if (!wrapper || !measureDiv) return;

      const containerWidth = wrapper.offsetWidth;
      const buttons = Array.from(measureDiv.querySelectorAll("button")) as HTMLElement[];
      const GAP = 8;
      const MORE_W = 96 + GAP;
      const MAX_LINES = 2;

      const widths = buttons.map((b) => b.offsetWidth + GAP);

      // Simulate placing n tabs (+ optional More button) into MAX_LINES rows.
      // Returns true if everything fits.
      const fits = (n: number, includeMore: boolean): boolean => {
        let lineUsed = 0;
        let lineNum = 1;
        for (let i = 0; i < n; i++) {
          if (lineUsed + widths[i] <= containerWidth) {
            lineUsed += widths[i];
          } else if (lineNum < MAX_LINES) {
            lineNum++;
            lineUsed = widths[i];
          } else {
            return false;
          }
        }
        if (includeMore) {
          if (lineUsed + MORE_W > containerWidth) {
            if (lineNum < MAX_LINES) {
              lineNum++;
            } else {
              return false;
            }
          }
        }
        return true;
      };

      if (fits(buttons.length, false)) {
        setVisibleCount(null);
        return;
      }

      // Find the largest count where count tabs + More all fit within MAX_LINES
      let count = buttons.length - 1;
      while (count > 0 && !fits(count, true)) count--;

      setVisibleCount(count > 0 ? count : null);
    };

    const ro = new ResizeObserver(measure);
    const wrapper = wrapperRef.current;
    if (wrapper) ro.observe(wrapper);
    measure();
    return () => ro.disconnect();
  }, [tabs.length]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const visibleTabs = visibleCount !== null ? tabs.slice(0, visibleCount) : tabs;
  const hiddenTabs = visibleCount !== null ? tabs.slice(visibleCount) : [];
  const activeIsHidden = hiddenTabs.some((t) => t.id === activeTab);

  const activeFilter = tabs.find((t) => t.id === activeTab)?.filter ?? (() => true);
  const filteredProducts = products.filter(activeFilter);

  return (
    <>
      {/* ── Category selector ── */}
      <div className="mb-12">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#e8d5c0] to-transparent" />
          <span className="text-[10px] font-semibold text-[#c8956c]/70 uppercase tracking-[0.3em]">
            Browse by category
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#e8d5c0] to-transparent" />
        </div>

        {/* Two-line tab row — overflow collapses into "More" dropdown */}
        <div ref={wrapperRef} className="relative">
          {/* Hidden measurement layer */}
          <div
            ref={measureRef}
            className="flex gap-2 invisible absolute pointer-events-none top-0 left-0"
            aria-hidden="true"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap bg-white border border-[#e8d5c0]"
              >
                <span>{tab.label}</span>
                <span className="min-w-[18px] h-[18px] px-1 rounded-md text-[10px] font-bold">
                  {getCount(tab)}
                </span>
              </button>
            ))}
          </div>

          {/* Visible rows — up to two lines, then "More" */}
          <div className="flex gap-2 flex-wrap items-center">
            {visibleTabs.map((tab) => (
              <TabChip
                key={tab.id}
                tab={tab}
                isActive={activeTab === tab.id}
                count={getCount(tab)}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}

            {hiddenTabs.length > 0 && (
              <div ref={moreRef} className="relative">
                <button
                  onClick={() => setMoreOpen((v) => !v)}
                  className={[
                    "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium",
                    "transition-all duration-300 ease-out select-none whitespace-nowrap",
                    activeIsHidden
                      ? "bg-[#2d2016] text-[#fdf8f3] shadow-lg shadow-[#2d2016]/25"
                      : "bg-white border border-[#e8d5c0] text-[#5a4635] hover:border-[#c8956c]/50 hover:bg-[#fdf8f3]",
                  ].join(" ")}
                >
                  <span>More</span>
                  {activeIsHidden && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c8956c]" />
                  )}
                  <span
                    className={`text-[10px] inline-block transition-transform duration-200 ${
                      moreOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>

                {moreOpen && (
                  <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-[#e8d5c0] rounded-xl shadow-lg shadow-[#2d2016]/10 p-1.5 min-w-[170px] flex flex-col gap-1">
                    {hiddenTabs.map((tab) => (
                      <TabChip
                        key={tab.id}
                        tab={tab}
                        isActive={activeTab === tab.id}
                        count={getCount(tab)}
                        compact
                        onClick={() => {
                          setActiveTab(tab.id);
                          setMoreOpen(false);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
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
              : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} in ${tabs.find((t) => t.id === activeTab)?.label}`}
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
          <p className="text-[#5a4635]/50 text-sm">
            Nothing here yet — more coming soon.
          </p>
        </div>
      )}
    </>
  );
}
