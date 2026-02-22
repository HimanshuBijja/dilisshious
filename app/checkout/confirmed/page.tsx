"use client";

import { useRouter } from "next/navigation";
import { useCheckout } from "@/lib/checkout-context";
import {
  PartyPopper,
  Package,
  MapPin,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function OrderConfirmedPage() {
  const router = useRouter();
  const { data, reset } = useCheckout();

  const handleContinueShopping = () => {
    reset();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] pt-24 sm:pt-28 pb-12 px-4">
      <div className="max-w-lg mx-auto text-center">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          }}
          className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.3,
            }}
          >
            <PartyPopper size={40} className="text-green-600" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h1
            className="text-3xl sm:text-4xl font-bold text-[#2d2016] mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Order Confirmed!
          </h1>
          <p className="text-[#5a4635]/70 mb-2">
            Thank you for your order. We&apos;re already preparing your treats
            with love.
          </p>
          <p className="text-sm font-mono text-[#c8956c] font-bold mb-8">
            Order ID: {data.orderId || "N/A"}
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-2xl p-6 border border-[#f0e6d8] shadow-sm text-left mb-6"
        >
          <h3 className="text-sm font-bold text-[#2d2016] mb-4 uppercase tracking-wider">
            Order Details
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#c8956c]/10 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={14} className="text-[#c8956c]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#5a4635] mb-0.5">
                  Delivery Address
                </p>
                <p className="text-xs text-[#5a4635]/70">
                  {data.address.fullName}
                </p>
                <p className="text-xs text-[#5a4635]/60">
                  {data.address.address}, {data.address.city},{" "}
                  {data.address.state} - {data.address.pincode}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#c8956c]/10 flex items-center justify-center shrink-0 mt-0.5">
                <Package size={14} className="text-[#c8956c]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#5a4635] mb-0.5">
                  Delivery Method
                </p>
                <p className="text-xs text-[#5a4635]/70">
                  {data.deliveryMethod === "express" ?
                    "Express Delivery"
                  : "Standard Delivery (Wed & Sun)"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#c8956c]/10 flex items-center justify-center shrink-0 mt-0.5">
                <CreditCard size={14} className="text-[#c8956c]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#5a4635] mb-0.5">
                  Payment
                </p>
                <p className="text-xs text-[#5a4635]/70">
                  {data.paymentMethod === "cod" && "Cash on Delivery"}
                  {data.paymentMethod === "upi" && "UPI Payment"}
                  {data.paymentMethod === "card" && "Credit / Debit Card"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-[#c8956c]/10 rounded-2xl p-5 border border-[#c8956c]/20 mb-6"
        >
          <p className="text-sm text-[#2d2016] font-semibold mb-1">
            What happens next?
          </p>
          <p className="text-xs text-[#5a4635]/70 leading-relaxed">
            You&apos;ll receive an order confirmation on{" "}
            <strong>{data.address.email || "your email"}</strong>. We&apos;ll
            prepare your treats fresh and deliver them on the next delivery day.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={handleContinueShopping}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#2d2016] text-white font-semibold rounded-xl hover:bg-[#1a120d] transition-all duration-300 hover:shadow-lg"
        >
          Continue Shopping
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  );
}
