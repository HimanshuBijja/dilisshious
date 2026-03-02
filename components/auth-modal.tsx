"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useAuth } from "@/lib/auth-context";
import { X, Phone, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Step = "choose" | "phone-input" | "otp-input";

export default function AuthModal() {
  const { showAuthModal, closeAuthModal } = useAuth();
  const { status } = useSession();
  const [step, setStep] = useState<Step>("choose");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Close modal if user becomes authenticated
  useEffect(() => {
    if (status === "authenticated" && showAuthModal) {
      closeAuthModal();
    }
  }, [status, showAuthModal, closeAuthModal]);

  // Reset state when modal opens
  useEffect(() => {
    if (showAuthModal) {
      setStep("choose");
      setPhone("");
      setName("");
      setOtp("");
      setError("");
      setLoading(false);
    }
  }, [showAuthModal]);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("otp-input");
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setError("Please enter the OTP");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp }),
      });
      const data = await res.json();
      if (data.verified) {
        // Sign in with credentials
        const result = await signIn("phone-otp", {
          phone: data.phone,
          name: name || data.phone,
          verified: "true",
          redirect: false,
        });
        if (result?.ok) {
          closeAuthModal();
        } else {
          setError("Sign in failed. Please try again.");
        }
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { redirect: false });
  };

  return (
    <AnimatePresence>
      {showAuthModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={closeAuthModal}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="relative bg-gradient-to-br from-[#2d2016] to-[#4a3628] px-8 pt-8 pb-10 text-center">
                <button
                  onClick={closeAuthModal}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X size={18} className="text-white" />
                </button>
                <h2
                  className="text-3xl font-bold text-white mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Welcome
                </h2>
                <p className="text-[#c8956c] text-sm">
                  Sign in to continue to checkout
                </p>
              </div>

              <div className="px-8 pb-8 -mt-4">
                <div className="bg-white rounded-2xl border border-[#f0e6d8] shadow-sm p-6">
                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600"
                    >
                      {error}
                    </motion.div>
                  )}

                  {step === "choose" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      {/* Google Sign In */}
                      <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border-2 border-[#f0e6d8] rounded-xl hover:border-[#c8956c]/40 hover:shadow-md transition-all duration-200 group"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span className="text-sm font-semibold text-[#2d2016] group-hover:text-[#c8956c] transition-colors">
                          Continue with Google
                        </span>
                      </button>

                      {/* Divider */}
                      <div className="flex items-center gap-3 py-1">
                        <div className="flex-1 h-px bg-[#f0e6d8]" />
                        <span className="text-xs text-[#5a4635]/40 font-medium">OR</span>
                        <div className="flex-1 h-px bg-[#f0e6d8]" />
                      </div>

                      {/* Phone Sign In */}
                      <button
                        onClick={() => setStep("phone-input")}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-[#2d2016] text-white rounded-xl hover:bg-[#1a120d] transition-all duration-200 hover:shadow-lg"
                      >
                        <Phone size={18} />
                        <span className="text-sm font-semibold">
                          Continue with Phone Number
                        </span>
                      </button>
                    </motion.div>
                  )}

                  {step === "phone-input" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-[#5a4635] mb-1.5">
                          Your Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                          className="w-full px-4 py-3 rounded-xl border border-[#f0e6d8] bg-[#fdf8f3] text-sm text-[#2d2016] focus:outline-none focus:ring-2 focus:ring-[#c8956c]/40 focus:border-[#c8956c] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#5a4635] mb-1.5">
                          Phone Number
                        </label>
                        <div className="flex gap-2">
                          <div className="flex items-center px-3 py-3 rounded-xl border border-[#f0e6d8] bg-[#fdf8f3] text-sm text-[#5a4635] font-medium">
                            +91
                          </div>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setPhone(val);
                            }}
                            placeholder="98765 43210"
                            maxLength={10}
                            className="flex-1 px-4 py-3 rounded-xl border border-[#f0e6d8] bg-[#fdf8f3] text-sm text-[#2d2016] focus:outline-none focus:ring-2 focus:ring-[#c8956c]/40 focus:border-[#c8956c] transition-all"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleSendOtp}
                        disabled={loading || phone.length < 10}
                        className="w-full py-3.5 bg-[#2d2016] text-white font-semibold rounded-xl hover:bg-[#1a120d] transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          "Send OTP"
                        )}
                      </button>

                      <button
                        onClick={() => { setStep("choose"); setError(""); }}
                        className="w-full text-center text-sm text-[#5a4635]/60 hover:text-[#c8956c] transition-colors"
                      >
                        ← Back to sign in options
                      </button>
                    </motion.div>
                  )}

                  {step === "otp-input" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="text-center">
                        <p className="text-sm text-[#5a4635]">
                          OTP sent to{" "}
                          <span className="font-semibold text-[#2d2016]">
                            +91 {phone}
                          </span>
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#5a4635] mb-1.5">
                          Enter OTP
                        </label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                            setOtp(val);
                          }}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          className="w-full px-4 py-3 rounded-xl border border-[#f0e6d8] bg-[#fdf8f3] text-center text-lg tracking-[0.5em] font-mono text-[#2d2016] focus:outline-none focus:ring-2 focus:ring-[#c8956c]/40 focus:border-[#c8956c] transition-all"
                          autoFocus
                        />
                      </div>

                      <button
                        onClick={handleVerifyOtp}
                        disabled={loading || otp.length < 4}
                        className="w-full py-3.5 bg-[#2d2016] text-white font-semibold rounded-xl hover:bg-[#1a120d] transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify & Continue"
                        )}
                      </button>

                      <button
                        onClick={() => { setStep("phone-input"); setOtp(""); setError(""); }}
                        className="w-full text-center text-sm text-[#5a4635]/60 hover:text-[#c8956c] transition-colors"
                      >
                        ← Change phone number
                      </button>
                    </motion.div>
                  )}
                </div>

                <p className="text-center text-xs text-[#5a4635]/40 mt-4 leading-relaxed">
                  By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
