"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X, LogOut, User, Package } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useSession, signOut } from "next-auth/react";
import { useAuth } from "@/lib/auth-context";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const { data: session, status } = useSession();
  const { openAuthModal } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              <span className="text-[#2d2016]">Dilissh</span>
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

          {/* Cart + Profile + Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart */}
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

            {/* Profile */}
            {status === "authenticated" && session?.user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#f0e6d8] hover:border-[#c8956c] transition-colors flex items-center justify-center bg-[#fdf8f3]"
                  aria-label="Profile menu"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-[#c8956c]">
                      {(session.user.name || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-xl border border-[#f0e6d8] shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-[#f0e6d8] bg-[#fdf8f3]">
                      <p className="text-sm font-semibold text-[#2d2016] truncate">
                        {session.user.name || "User"}
                      </p>
                      {session.user.email && (
                        <p className="text-xs text-[#5a4635]/60 truncate mt-0.5">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                    <Link
                      href="/orders"
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#2d2016] hover:bg-[#fdf8f3] transition-colors border-b border-[#f0e6d8]"
                    >
                      <Package size={16} className="text-[#c8956c]" />
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : status === "unauthenticated" ? (
              <button
                onClick={openAuthModal}
                className="p-2 text-[#2d2016] hover:text-[#c8956c] transition-colors"
                aria-label="Sign in"
              >
                <User size={22} />
              </button>
            ) : null}

            {/* Mobile Menu Toggle */}
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
              {status === "authenticated" && session?.user && (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors pt-2 border-t border-[#f0e6d8]"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

