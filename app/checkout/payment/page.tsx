"use client";

import { useRouter } from "next/navigation";
import { useCheckout } from "@/lib/checkout-context";
import { useCart } from "@/lib/cart-context";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Banknote,
  Check,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const paymentOptions = [
  {
    id: "cod" as const,
    title: "Cash on Delivery",
    description: "Pay when your order arrives",
    icon: Banknote,
  },
  {
    id: "upi" as const,
    title: "UPI Payment",
    description: "GPay, PhonePe, Paytm, etc.",
    icon: Smartphone,
  },
  {
    id: "card" as const,
    title: "Credit / Debit Card",
    description: "Visa, Mastercard, RuPay",
    icon: CreditCard,
  },
];

export default function PaymentPage() {
  const router = useRouter();
  const { data, setPaymentMethod, setOrderId } = useCheckout();
  const { subtotal, clearCart } = useCart();

  const deliveryCost =
    data.deliveryMethod === "express" ? 49
    : subtotal >= 500 ? 0
    : 30;
  const total = subtotal + deliveryCost;

  const handlePlaceOrder = () => {
    // Generate a mock order ID
    const orderId = "DLS" + Date.now().toString(36).toUpperCase();
    setOrderId(orderId);
    clearCart();
    router.push("/checkout/confirmed");
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
            <span className="text-green-600">✓ Delivery</span>
            <span>→</span>
            <span className="font-semibold text-[#c8956c]">3. Payment</span>
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
                <CreditCard size={18} className="text-[#c8956c]" />
              </div>
              <h1
                className="text-2xl font-bold text-[#2d2016]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Payment Method
              </h1>
            </div>

            <div className="space-y-3">
              {paymentOptions.map((option) => {
                const isSelected = data.paymentMethod === option.id;
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setPaymentMethod(option.id)}
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
                      <h3 className="text-sm font-semibold text-[#2d2016]">
                        {option.title}
                      </h3>
                      <p className="text-xs text-[#5a4635]/60 mt-0.5">
                        {option.description}
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

          {/* Address Summary */}
          <div className="bg-white rounded-2xl p-6 border border-[#f0e6d8] shadow-sm mb-6">
            <h3 className="text-sm font-bold text-[#2d2016] mb-2">
              Delivering to
            </h3>
            <p className="text-sm text-[#5a4635]/80">{data.address.fullName}</p>
            <p className="text-xs text-[#5a4635]/60">
              {data.address.address}, {data.address.city}, {data.address.state}{" "}
              - {data.address.pincode}
            </p>
            <p className="text-xs text-[#5a4635]/60">{data.address.phone}</p>
          </div>

          {/* Total */}
          <div className="bg-white rounded-2xl p-6 border border-[#f0e6d8] shadow-sm mb-6">
            <div className="flex justify-between text-sm text-[#5a4635]/70 mb-1">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-[#5a4635]/70 mb-1">
              <span>
                Delivery (
                {data.deliveryMethod === "express" ? "Express" : "Standard"})
              </span>
              <span>{deliveryCost === 0 ? "Free" : `₹${deliveryCost}`}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#2d2016] mt-2 pt-2 border-t border-[#f0e6d8]">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full py-3.5 bg-[#2d2016] text-white font-semibold rounded-xl hover:bg-[#1a120d] transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <ShieldCheck size={18} />
            Place Order — ₹{total}
          </button>

          <p className="text-center text-xs text-[#5a4635]/40 mt-3">
            Your personal data will be used to process your order only.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
