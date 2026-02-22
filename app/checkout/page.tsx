"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useCheckout } from "@/lib/checkout-context";
import { ArrowLeft, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal } = useCart();
  const { data, setAddress } = useCheckout();
  const [form, setForm] = useState(data.address);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddress(form);
    router.push("/checkout/delivery");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-lg text-[#5a4635] mb-4">Your cart is empty</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-[#2d2016] text-white rounded-xl font-semibold hover:bg-[#1a120d] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f3] pt-24 sm:pt-28 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => router.back()}
            className="text-[#5a4635] hover:text-[#2d2016] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 text-sm text-[#5a4635]/60">
            <span className="font-semibold text-[#c8956c]">1. Address</span>
            <span>→</span>
            <span>2. Delivery</span>
            <span>→</span>
            <span>3. Payment</span>
            <span>→</span>
            <span>4. Confirmed</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#f0e6d8] shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#c8956c]/10 flex items-center justify-center">
                  <MapPin size={18} className="text-[#c8956c]" />
                </div>
                <h1
                  className="text-2xl font-bold text-[#2d2016]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Delivery Address
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5a4635] mb-1.5">
                      Full Name
                    </label>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#f0e6d8] bg-[#fdf8f3] text-sm text-[#2d2016] focus:outline-none focus:ring-2 focus:ring-[#c8956c]/40 focus:border-[#c8956c] transition-all"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5a4635] mb-1.5">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      type="tel"
                      className="w-full px-4 py-3 rounded-xl border border-[#f0e6d8] bg-[#fdf8f3] text-sm text-[#2d2016] focus:outline-none focus:ring-2 focus:ring-[#c8956c]/40 focus:border-[#c8956c] transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5a4635] mb-1.5">
                    Email
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-[#f0e6d8] bg-[#fdf8f3] text-sm text-[#2d2016] focus:outline-none focus:ring-2 focus:ring-[#c8956c]/40 focus:border-[#c8956c] transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5a4635] mb-1.5">
                    Address
                  </label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#f0e6d8] bg-[#fdf8f3] text-sm text-[#2d2016] focus:outline-none focus:ring-2 focus:ring-[#c8956c]/40 focus:border-[#c8956c] transition-all"
                    placeholder="House no, Street, Landmark"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5a4635] mb-1.5">
                      City
                    </label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#f0e6d8] bg-[#fdf8f3] text-sm text-[#2d2016] focus:outline-none focus:ring-2 focus:ring-[#c8956c]/40 focus:border-[#c8956c] transition-all"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5a4635] mb-1.5">
                      State
                    </label>
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#f0e6d8] bg-[#fdf8f3] text-sm text-[#2d2016] focus:outline-none focus:ring-2 focus:ring-[#c8956c]/40 focus:border-[#c8956c] transition-all"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5a4635] mb-1.5">
                      Pincode
                    </label>
                    <input
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#f0e6d8] bg-[#fdf8f3] text-sm text-[#2d2016] focus:outline-none focus:ring-2 focus:ring-[#c8956c]/40 focus:border-[#c8956c] transition-all"
                      placeholder="500001"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3.5 bg-[#2d2016] text-white font-semibold rounded-xl hover:bg-[#1a120d] transition-all duration-300 hover:shadow-lg"
                >
                  Continue to Delivery
                </button>
              </form>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl p-6 border border-[#f0e6d8] shadow-sm sticky top-28">
              <h2
                className="text-lg font-bold text-[#2d2016] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Order Summary
              </h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div
                    key={`${item.slug}-${item.volume}`}
                    className="flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#fdf8f3] border border-[#f0e6d8] shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2d2016] truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.volume} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#2d2016]">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#f0e6d8] pt-3">
                <div className="flex justify-between text-sm text-[#5a4635]/70 mb-1">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-[#5a4635]/70 mb-1">
                  <span>Delivery</span>
                  <span className="text-[#c8956c] font-medium">
                    Calculated next
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-[#2d2016] mt-2">
                  <span>Total</span>
                  <span>₹{subtotal}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
