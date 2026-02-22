"use client";

import { useRouter } from "next/navigation";
import { useCheckout } from "@/lib/checkout-context";
import { useCart } from "@/lib/cart-context";
import { ArrowLeft, Truck, Zap, Check } from "lucide-react";
import { motion } from "framer-motion";

const deliveryOptions = [
  {
    id: "standard" as const,
    title: "Standard Delivery",
    description: "Wed & Sun delivery schedule",
    price: 0,
    priceLabel: "Free",
    eta: "Next delivery day",
    icon: Truck,
  },
  {
    id: "express" as const,
    title: "Express Delivery",
    description: "Same day if ordered before 12 PM",
    price: 49,
    priceLabel: "₹49",
    eta: "Today / Tomorrow",
    icon: Zap,
  },
];

export default function DeliveryPage() {
  const router = useRouter();
  const { data, setDeliveryMethod } = useCheckout();
  const { subtotal } = useCart();

  const deliveryCost =
    data.deliveryMethod === "express" ? 49
    : subtotal >= 500 ? 0
    : 30;

  const handleContinue = () => {
    router.push("/checkout/payment");
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] pt-24 sm:pt-28 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => router.back()}
            className="text-[#5a4635] hover:text-[#2d2016] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 text-sm text-[#5a4635]/60">
            <span className="text-green-600">✓ Address</span>
            <span>→</span>
            <span className="font-semibold text-[#c8956c]">2. Delivery</span>
            <span>→</span>
            <span>3. Payment</span>
            <span>→</span>
            <span>4. Confirmed</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#f0e6d8] shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#c8956c]/10 flex items-center justify-center">
                <Truck size={18} className="text-[#c8956c]" />
              </div>
              <h1
                className="text-2xl font-bold text-[#2d2016]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Delivery Method
              </h1>
            </div>

            <div className="space-y-3">
              {deliveryOptions.map((option) => {
                const isSelected = data.deliveryMethod === option.id;
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setDeliveryMethod(option.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      isSelected ?
                        "border-[#c8956c] bg-[#c8956c]/5"
                      : "border-[#f0e6d8] hover:border-[#c8956c]/40"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected ?
                          "bg-[#c8956c] text-white"
                        : "bg-[#fdf8f3] text-[#5a4635]"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-[#2d2016]">
                          {option.title}
                        </h3>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            option.price === 0 ?
                              "bg-green-100 text-green-700"
                            : "bg-[#fdf8f3] text-[#c8956c]"
                          }`}
                        >
                          {option.priceLabel}
                        </span>
                      </div>
                      <p className="text-xs text-[#5a4635]/60 mt-0.5">
                        {option.description}
                      </p>
                      <p className="text-xs text-[#5a4635]/40 mt-0.5">
                        ETA: {option.eta}
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ?
                          "border-[#c8956c] bg-[#c8956c]"
                        : "border-gray-300"
                      }`}
                    >
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl p-6 border border-[#f0e6d8] shadow-sm mb-6">
            <div className="flex justify-between text-sm text-[#5a4635]/70 mb-1">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-[#5a4635]/70 mb-1">
              <span>Delivery</span>
              <span>{deliveryCost === 0 ? "Free" : `₹${deliveryCost}`}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#2d2016] mt-2 pt-2 border-t border-[#f0e6d8]">
              <span>Total</span>
              <span>₹{subtotal + deliveryCost}</span>
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="w-full py-3.5 bg-[#2d2016] text-white font-semibold rounded-xl hover:bg-[#1a120d] transition-all duration-300 hover:shadow-lg"
          >
            Continue to Payment
          </button>
        </motion.div>
      </div>
    </div>
  );
}
