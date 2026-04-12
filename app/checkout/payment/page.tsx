"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCheckout } from "@/lib/checkout-context";
import { useCart } from "@/lib/cart-context";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  QrCode,
  Smartphone,
  Check,
  ShieldCheck,
  Loader2,
  Upload,
  Copy,
  CheckCircle,
  X,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function PaymentPage() {
  const router = useRouter();
  const { status } = useSession();
  const { data, setOrderId } = useCheckout();
  const { items, subtotal, clearCart } = useCart();

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const qrGenerated = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const deliveryCost =
    data.deliveryMethod === "express" ? 70
    : subtotal >= 500 ? 0
    : 30;
  const discount = data.discount || 0;
  const total = subtotal - discount + deliveryCost;

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

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = upiId;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB");
      return;
    }
    setScreenshotName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setPaymentScreenshot(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePlaceOrder = async () => {
    if (!paymentScreenshot) return;
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
          couponCode: data.couponCode || undefined,
          discount: discount || undefined,
          paymentMethod: "upi",
          paymentScreenshot,
        }),
      });

      const orderData = await orderRes.json();

      if (orderData.orderId) {
        setOrderId(orderData.orderId);

        // 2. Send invoice email (API gets customer email from server-side session)
        fetch("/api/orders/invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderData.orderId,
            customerName: data.address.fullName,
            items,
            address: data.address,
            deliveryMethod: data.deliveryMethod,
            deliveryCost,
            subtotal,
            total,
            couponCode: data.couponCode || undefined,
            discount: discount || undefined,
          }),
        }).catch(() => {
          // Email sending failure shouldn't block order confirmation
        });

        clearCart();
        router.push("/checkout/confirmed");
      } else {
        throw new Error(orderData.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Order error:", error);
      setOrderError("Something went wrong placing your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] pt-24 sm:pt-28 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
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
          {/* Two-column layout on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-start">
            {/* LEFT COLUMN — Pay with UPI */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#f0e6d8] shadow-sm lg:sticky lg:top-28">
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

              {/* UPI Payment Options */}
              <div>
                <p className="text-xs font-semibold text-[#5a4635] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Smartphone size={14} />
                  Pay with App
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: "Google Pay", logo: "/payment_logos/google-pay.png", scheme: "gpay" },
                    { name: "PhonePe", logo: "/payment_logos/phonepe.png", scheme: "phonepe" },
                    { name: "Paytm", logo: "/payment_logos/paytm.png", scheme: "paytmmp" },
                  ].map((app) => (
                    <a
                      key={app.scheme}
                      href={`${app.scheme}://upi/pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${total}&cu=INR`}
                      className="flex flex-col items-center justify-center gap-2 p-4 sm:p-5 rounded-2xl border-2 border-[#f0e6d8] hover:border-[#c8956c] hover:shadow-md bg-white transition-all duration-200 group"
                    >
                      <div className="">
                        <Image src={app.logo} alt={app.name} width={56} height={56} className="object-contain" />
                      </div>
                      {/* <span className="text-[11px] sm:text-xs font-semibold text-[#2d2016]">{app.name}</span> */}
                    </a>
                  ))}
                </div>

                {/* Copy UPI ID */}
                <button
                  onClick={handleCopyUpi}
                  className="w-full mt-3 flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-[#f0e6d8] hover:border-[#c8956c]/40 hover:bg-[#fdf8f3] transition-all"
                >
                  {copied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} className="text-[#c8956c]" />}
                  <span className="text-sm font-semibold text-[#2d2016]">{copied ? "Copied!" : "Copy UPI ID"}</span>
                  <span className="text-[11px] text-[#5a4635]/50 font-mono">{upiId}</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN — Screenshot + Summary + Place Order */}
            <div className="space-y-6">
              {/* Payment Screenshot Upload */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#f0e6d8] shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#c8956c]/10 flex items-center justify-center">
                    <Upload size={18} className="text-[#c8956c]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#2d2016]" style={{ fontFamily: "var(--font-heading)" }}>
                      Payment Screenshot
                    </h2>
                    <p className="text-xs text-[#5a4635]/60">Upload proof of payment (required)</p>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  className="hidden"
                  id="payment-screenshot"
                />

                {paymentScreenshot ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={paymentScreenshot}
                      alt="Payment screenshot"
                      className="w-full max-h-[300px] object-contain rounded-xl border-2 border-[#f0e6d8] bg-[#fdf8f3]"
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span className="text-sm text-green-600 font-medium">{screenshotName || "Screenshot uploaded"}</span>
                      </div>
                      <button
                        onClick={() => { setPaymentScreenshot(null); setScreenshotName(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                        className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                      >
                        <X size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-8 rounded-xl border-2 border-dashed border-[#f0e6d8] hover:border-[#c8956c]/60 bg-[#fdf8f3] hover:bg-[#c8956c]/5 transition-all flex flex-col items-center gap-3 group"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#c8956c]/10 group-hover:bg-[#c8956c]/20 flex items-center justify-center transition-colors">
                      <Upload size={24} className="text-[#c8956c]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-[#2d2016]">Tap to upload screenshot</p>
                      <p className="text-xs text-[#5a4635]/50 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </button>
                )}
              </div>

              {/* Address Summary */}
              <div className="bg-white rounded-2xl p-6 border border-[#f0e6d8] shadow-sm">
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
              <div className="bg-white rounded-2xl p-6 border border-[#f0e6d8] shadow-sm">
                <div className="flex justify-between text-sm text-[#5a4635]/70 mb-1">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 mb-1">
                    <span>Discount ({data.couponCode})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
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

              {/* Place Order Button */}
              <div>
                {orderError && (
                  <div className="flex items-center gap-2 p-3 mb-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                    <AlertTriangle size={16} className="shrink-0" />
                    <span>{orderError}</span>
                  </div>
                )}

                <button
                  onClick={() => { setOrderError(null); handlePlaceOrder(); }}
                  disabled={placing || !paymentScreenshot}
                  className="w-full py-3.5 bg-[#2d2016] text-white font-semibold rounded-xl hover:bg-[#1a120d] transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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

                {!paymentScreenshot && (
                  <p className="text-xs text-center text-amber-600 mt-2">
                    Please upload your payment screenshot to place the order
                  </p>
                )}

                <div className="flex items-center justify-center gap-2 mt-3">
                  <Check size={14} className="text-green-500" />
                  <p className="text-xs text-[#5a4635]/40">
                    Your order will be confirmed after payment verification
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
