"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import {
  Trash2,
  Plus,
  Minus,
  X,
  Truck,
  Gift,
  BadgePercent,
} from "lucide-react";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
  } = useCart();

  // Rewards thresholds
  const freeShippingThreshold = 500;
  const discountThreshold = 1000;
  const surpriseThreshold = 1500;
  const progress = Math.min((subtotal / surpriseThreshold) * 100, 100);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          borderTopLeftRadius: "24px",
          borderBottomLeftRadius: "24px",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <button
              onClick={closeCart}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close cart"
            >
              <X size={20} className="text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-500">Your Cart</span>
            <div className="relative p-1">
              <span className="text-xs font-bold text-[#c8956c]">
                {totalItems} items
              </span>
            </div>
          </div>

          {/* Rewards Banner */}
          <div className="bg-[#fdf8f3] px-5 py-3">
            <div className="flex items-center gap-1 text-xs font-medium text-[#2d2016] mb-2">
              <span>🎉</span>
              {subtotal < freeShippingThreshold ?
                <span>
                  Add ₹{freeShippingThreshold - subtotal} more for free
                  shipping!
                </span>
              : subtotal < discountThreshold ?
                <span>
                  Add ₹{discountThreshold - subtotal} more for 5% off!
                </span>
              : subtotal < surpriseThreshold ?
                <span>
                  Add ₹{surpriseThreshold - subtotal} more for a surprise box!
                </span>
              : <span>🎁 You&apos;ve unlocked all rewards!</span>}
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background:
                    "linear-gradient(90deg, #c8956c, #e8b98a, #c8956c)",
                }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${subtotal >= freeShippingThreshold ? "bg-[#c8956c] text-white" : "bg-gray-200 text-gray-400"}`}
                >
                  <Truck size={14} />
                </div>
                <span className="text-[10px] font-medium text-gray-500 mt-1">
                  Free Ship
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${subtotal >= discountThreshold ? "bg-[#c8956c] text-white" : "bg-gray-200 text-gray-400"}`}
                >
                  <BadgePercent size={14} />
                </div>
                <span className="text-[10px] font-medium text-gray-500 mt-1">
                  5% Off
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${subtotal >= surpriseThreshold ? "bg-[#c8956c] text-white" : "bg-gray-200 text-gray-400"}`}
                >
                  <Gift size={14} />
                </div>
                <span className="text-[10px] font-medium text-gray-500 mt-1">
                  Surprise
                </span>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {items.length === 0 ?
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ShoppingBagEmpty />
                <p className="mt-4 text-sm font-medium">Your cart is empty</p>
                <p className="text-xs mt-1">Add something delicious!</p>
              </div>
            : <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.slug}-${item.volume}`}
                    className="flex items-center gap-4 p-3 rounded-xl bg-[#fdf8f3] border border-[#f0e6d8]"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#2d2016] truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.volume}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-[#2d2016]">
                          ₹{item.price}
                        </span>
                        {item.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 border border-gray-200 rounded-lg bg-white">
                      <button
                        onClick={() => {
                          if (item.quantity === 1) {
                            removeFromCart(item.slug, item.volume);
                          } else {
                            updateQuantity(
                              item.slug,
                              item.volume,
                              item.quantity - 1,
                            );
                          }
                        }}
                        className="p-1.5 hover:bg-gray-50 rounded-l-lg transition-colors"
                      >
                        {item.quantity === 1 ?
                          <Trash2 size={14} className="text-red-400" />
                        : <Minus size={14} className="text-gray-500" />}
                      </button>
                      <span className="w-6 text-center text-sm font-medium text-[#2d2016]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.slug,
                            item.volume,
                            item.quantity + 1,
                          )
                        }
                        className="p-1.5 hover:bg-gray-50 rounded-r-lg transition-colors"
                      >
                        <Plus size={14} className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div
              className="border-t border-gray-100 px-5 py-4 bg-white"
              style={{ borderBottomLeftRadius: "24px" }}
            >
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#2d2016] mb-4">
                <span>Total to Pay</span>
                <span>₹{subtotal}</span>
              </div>
              <button className="w-full py-3.5 bg-[#2d2016] text-white font-semibold rounded-xl hover:bg-[#1a120d] transition-colors relative overflow-hidden group">
                <span className="relative z-10">Checkout</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#c8956c] to-[#e8b98a] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function ShoppingBagEmpty() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
