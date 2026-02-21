"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#f0e6d8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span
              className="text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className="text-[#2d2016]">Dilish</span>
              <span className="text-[#c8956c]">ious</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-[#5a4635] hover:text-[#c8956c] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#products"
              className="text-sm font-medium text-[#5a4635] hover:text-[#c8956c] transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/#about"
              className="text-sm font-medium text-[#5a4635] hover:text-[#c8956c] transition-colors"
            >
              About
            </Link>
            <Link
              href="/#testimonials"
              className="text-sm font-medium text-[#5a4635] hover:text-[#c8956c] transition-colors"
            >
              Testimonials
            </Link>
          </div>

          {/* Cart + Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleCart}
              className="relative p-2 text-[#2d2016] hover:text-[#c8956c] transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c8956c] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-[#2d2016]"
              aria-label="Toggle menu"
            >
              {mobileOpen ?
                <X size={24} />
              : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-[#f0e6d8]">
            <div className="flex flex-col gap-3 pt-4">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-[#5a4635] hover:text-[#c8956c] transition-colors"
              >
                Home
              </Link>
              <Link
                href="/#products"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-[#5a4635] hover:text-[#c8956c] transition-colors"
              >
                Shop
              </Link>
              <Link
                href="/#about"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-[#5a4635] hover:text-[#c8956c] transition-colors"
              >
                About
              </Link>
              <Link
                href="/#testimonials"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-[#5a4635] hover:text-[#c8956c] transition-colors"
              >
                Testimonials
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
