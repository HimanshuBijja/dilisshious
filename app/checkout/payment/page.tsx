"use client";

import { useRouter } from "next/navigation";
import { useCheckout } from "@/lib/checkout-context";
import { useCart } from "@/lib/cart-context";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  QrCode,
  Smartphone,
  Check,
  ShieldCheck,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

export default function PaymentPage() {
  const router = useRouter();
  const { data, setOrderId } = useCheckout();
  const { items, subtotal, clearCart } = useCart();
  const { data: session } = useSession();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const qrGenerated = useRef(false);

  const deliveryCost =
    data.deliveryMethod === "express" ? 49
    : subtotal >= 500 ? 0
    : 30;
  const total = subtotal + deliveryCost;

  const upiId = process.env.NEXT_PUBLIC_UPI_ID || "dilisshious@upi";
  const upiName = process.env.NEXT_PUBLIC_UPI_NAME || "Dilisshious";
  const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${total}&cu=INR&tn=${encodeURIComponent(`Order from Dilisshious`)}`;

  // Detect mobile
  useEffect(() => {
    const check = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    setIsMobile(check);
  }, []);

  // Generate QR code
  useEffect(() => {
    if (qrGenerated.current || total <= 0) return;
    qrGenerated.current = true;

    import("qrcode").then((QRCode) => {
      QRCode.toDataURL(upiString, {
        width: 280,
        margin: 2,
        color: {
          dark: "#2d2016",
          light: "#ffffff",
        },
      }).then(setQrDataUrl);
    });
  }, [upiString, total]);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      // 1. Create order in DB
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          address: data.address,
          deliveryMethod: data.deliveryMethod,
          deliveryCost,
          subtotal,
          total,
          paymentMethod: "upi",
        }),
      });

      const orderData = await orderRes.json();

      if (orderData.orderId) {
        setOrderId(orderData.orderId);

        // 2. Send invoice email
        const email = data.address.email || (session?.user as { email?: string })?.email;
        if (email) {
          fetch("/api/orders/invoice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: orderData.orderId,
              email,
              customerName: data.address.fullName,
              items,
              address: data.address,
              deliveryMethod: data.deliveryMethod,
              deliveryCost,
              subtotal,
              total,
            }),
          }).catch(() => {
            // Email sending failure shouldn't block order confirmation
          });
        }

        clearCart();
        router.push("/checkout/confirmed");
      } else {
        throw new Error(orderData.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Order error:", error);
      // Fallback: still create a local order ID
      const fallbackId = "DLS" + Date.now().toString(36).toUpperCase();
      setOrderId(fallbackId);
      clearCart();
      router.push("/checkout/confirmed");
    } finally {
      setPlacing(false);
    }
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
          {/* UPI Payment */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#f0e6d8] shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#c8956c]/10 flex items-center justify-center">
                <QrCode size={18} className="text-[#c8956c]" />
              </div>
              <div>
                <h1
                  className="text-2xl font-bold text-[#2d2016]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Pay via UPI
                </h1>
                <p className="text-xs text-[#5a4635]/60 mt-0.5">
                  Scan QR or use your preferred UPI app
                </p>
              </div>
            </div>

            {/* Amount Card */}
            <div className="bg-gradient-to-br from-[#2d2016] to-[#4a3628] rounded-xl p-5 mb-6 text-center">
              <p className="text-xs text-[#c8956c] uppercase tracking-wider font-medium mb-1">Amount to Pay</p>
              <p className="text-4xl font-bold text-white">₹{total}</p>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center mb-6">
              {qrDataUrl ? (
                <div className="bg-white p-4 rounded-2xl border-2 border-[#f0e6d8] shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt="UPI QR Code"
                    width={280}
                    height={280}
                    className="rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-[280px] h-[280px] rounded-2xl bg-[#fdf8f3] border-2 border-[#f0e6d8] flex items-center justify-center">
                  <Loader2 size={32} className="animate-spin text-[#c8956c]" />
                </div>
              )}
              <p className="text-xs text-[#5a4635]/50 mt-3 text-center">
                {isMobile ? "Tap a button below or scan this QR" : "Scan this QR code with any UPI app"}
              </p>
            </div>

            {/* UPI Deep Links (Mobile) */}
            {isMobile && (
              <div className="space-y-2 mb-6">
                <p className="text-xs font-semibold text-[#5a4635] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Smartphone size={14} />
                  Pay with App
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`gpay://upi/pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${total}&cu=INR`}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-[#f0e6d8] hover:border-[#c8956c]/40 transition-all text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg font-bold text-blue-600">
                      G
                    </div>
                    <span className="text-[11px] font-medium text-[#2d2016]">Google Pay</span>
                    <ExternalLink size={10} className="text-[#5a4635]/40" />
                  </a>
                  <a
                    href={`phonepe://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${total}&cu=INR`}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-[#f0e6d8] hover:border-[#c8956c]/40 transition-all text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg font-bold text-purple-600">
                      P
                    </div>
                    <span className="text-[11px] font-medium text-[#2d2016]">PhonePe</span>
                    <ExternalLink size={10} className="text-[#5a4635]/40" />
                  </a>
                  <a
                    href={`paytmmp://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${total}&cu=INR`}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-[#f0e6d8] hover:border-[#c8956c]/40 transition-all text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg font-bold text-sky-600">
                      T
                    </div>
                    <span className="text-[11px] font-medium text-[#2d2016]">Paytm</span>
                    <ExternalLink size={10} className="text-[#5a4635]/40" />
                  </a>
                </div>
              </div>
            )}
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
            disabled={placing}
            className="w-full py-3.5 bg-[#2d2016] text-white font-semibold rounded-xl hover:bg-[#1a120d] transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {placing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Placing Order...
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                I have paid — Place Order
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 mt-3">
            <Check size={14} className="text-green-500" />
            <p className="text-xs text-[#5a4635]/40">
              Your order will be confirmed after payment verification
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
