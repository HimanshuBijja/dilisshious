"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, RefreshCw, Loader2, Pause, Play, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface SubscriptionAddOn {
  id: string;
  name: string;
  price: number;
}

interface Subscription {
  _id: string;
  bundleId: string;
  bundleName: string;
  planId: string;
  planName: string;
  frequency: string;
  bundlePrice: number;
  addOns: SubscriptionAddOn[];
  total: number;
  status: "active" | "paused" | "cancelled";
  createdAt: string;
}

const statusConfig: Record<string, { bg: string; text: string; icon: typeof Play }> = {
  active: { bg: "bg-green-100 text-green-700", text: "Active", icon: Play },
  paused: { bg: "bg-yellow-100 text-yellow-700", text: "Paused", icon: Pause },
  cancelled: { bg: "bg-red-100 text-red-700", text: "Cancelled", icon: XCircle },
};

// Bundle products and image mapping — mirrors quiz component data
const BUNDLE_PRODUCTS: Record<string, string[]> = {
  GRV: [
    "Whole Lemon Shots",
    "Liver Cleanser Tonic",
    "Bone Broth (choice)",
    "Adaptogenic Protein Bar",
    "Adrenal Cocktail + Trace Minerals",
    "Cascara Constipation Relief Drink",
  ],
  HHB: [
    "Adrenal Cocktail + Trace Minerals",
    "Adaptogenic Protein Bar",
    "Liver Cleanser Tonic",
    "Whole Lemon Shots",
    "Energy Booster Adaptogen Drink",
    "Bone Broth with Herbs",
  ],
  GFW: [
    "Whole Lemon Shots",
    "Liver Cleanser Tonic",
    "Bone Broth (Collagen-rich)",
    "Moringa Dust",
    "Adrenal Cocktail",
    "Toxic-Free Skin Ritual Set",
  ],
  PVP: [
    "Adrenal Cocktail + Trace Minerals",
    "Energy Booster Adaptogen Drink",
    "Adaptogenic Protein Bar",
    "Whole Lemon Shots",
    "Bone Broth with Adaptogens",
    "Moringa Dust",
  ],
};

const PRODUCT_IMAGES: Record<string, string | null> = {
  "Whole Lemon Shots": null,
  "Liver Cleanser Tonic": null,
  "Bone Broth (choice)": null,
  "Adaptogenic Protein Bar": "/images/adaptogenic-protein-bars.jpg",
  "Adrenal Cocktail + Trace Minerals": null,
  "Cascara Constipation Relief Drink": null,
  "Energy Booster Adaptogen Drink": null,
  "Bone Broth with Herbs": null,
  "Bone Broth (Collagen-rich)": null,
  "Moringa Dust": "/images/moringa-dust.jpg",
  "Adrenal Cocktail": null,
  "Toxic-Free Skin Ritual Set": null,
  "Bone Broth with Adaptogens": null,
};

const ADD_ON_IMAGES: Record<string, string | null> = {
  A1: "/images/sun-dried-tomato-hummus.jpeg",
  A2: null,
  A3: "/images/moringa-dust.jpg",
  A4: null,
  A5: "/images/orange-peel-jam.jpg",
  A6: "/images/organic-basil-pesto.jpg",
  A7: null,
  A8: "/images/gluten-free-banana-bread.jpg",
};

function formatINR(amount: number): string {
  return "\u20B9" + amount.toLocaleString("en-IN");
}

function ProductRow({ name, image, price }: { name: string; image: string | null; price?: number }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#e8d5c0]/50 bg-[#faf5ef] relative flex-shrink-0">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f5ebe0] to-[#e8d5c0]/40 p-1">
            <span className="text-[#c8956c]/50 text-[6px] font-medium text-center leading-[1.1] line-clamp-2">
              {name}
            </span>
          </div>
        )}
      </div>
      <span className="text-sm text-[#2d2016] flex-1 min-w-0 truncate">{name}</span>
      {price !== undefined && (
        <span className="text-sm font-semibold text-[#2d2016] flex-shrink-0">
          {formatINR(price)}
        </span>
      )}
    </div>
  );
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const { status } = useSession();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/subscriptions")
        .then((res) => res.json())
        .then((data) => {
          setSubscriptions(data.subscriptions || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#c8956c]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f3] pt-24 sm:pt-28 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.push("/")}
            className="text-[#5a4635] hover:text-[#2d2016] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#c8956c]/10 flex items-center justify-center">
              <RefreshCw size={18} className="text-[#c8956c]" />
            </div>
            <h1
              className="text-2xl font-bold text-[#2d2016]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              My Subscriptions
            </h1>
          </div>
        </div>

        {subscriptions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 border border-[#f0e6d8] shadow-sm text-center"
          >
            <RefreshCw size={48} className="text-[#c8956c]/30 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-[#2d2016] mb-2">No subscriptions yet</h2>
            <p className="text-sm text-[#5a4635]/60 mb-6">
              Take the quiz to find your personalised protocol and start your wellness journey.
            </p>
            <button
              onClick={() => router.push("/quiz")}
              className="px-6 py-2.5 bg-[#2d2016] text-white font-semibold rounded-xl hover:bg-[#1a120d] transition-colors text-sm"
            >
              Take the Quiz
            </button>
          </motion.div>
        ) : (
          <div className="space-y-5">
            {subscriptions.map((sub, i) => {
              const cfg = statusConfig[sub.status] || statusConfig.active;
              const products = BUNDLE_PRODUCTS[sub.bundleId] || [];
              return (
                <motion.div
                  key={sub._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-[#f0e6d8] shadow-sm overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-5 sm:p-6 pb-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3
                          className="text-lg font-semibold text-[#2d2016]"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {sub.bundleName}
                        </h3>
                        <p className="text-xs text-[#5a4635]/50 mt-0.5">
                          {sub.planName} &middot; {sub.frequency}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${cfg.bg}`}
                      >
                        {cfg.text}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#5a4635]/40">
                      Started{" "}
                      {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Bundle products */}
                  {products.length > 0 && (
                    <div className="px-5 sm:px-6 pt-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] font-medium text-[#5a4635]/50 uppercase tracking-wider">
                          In your bundle
                        </p>
                        <span className="text-sm font-semibold text-[#2d2016]">
                          {formatINR(sub.bundlePrice)}
                        </span>
                      </div>
                      <div className="divide-y divide-[#f0e6d8]/60">
                        {products.map((name) => (
                          <ProductRow
                            key={name}
                            name={name}
                            image={PRODUCT_IMAGES[name] ?? null}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add-ons */}
                  {sub.addOns.length > 0 && (
                    <div className="px-5 sm:px-6 pt-3">
                      <p className="text-[10px] font-medium text-[#5a4635]/50 uppercase tracking-wider mb-1">
                        Add-ons
                      </p>
                      <div className="divide-y divide-[#f0e6d8]/60">
                        {sub.addOns.map((addon) => (
                          <ProductRow
                            key={addon.id}
                            name={addon.name}
                            image={ADD_ON_IMAGES[addon.id] ?? null}
                            price={addon.price}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mx-5 sm:mx-6 mt-2 mb-5 sm:mb-6 flex items-center justify-between pt-3 border-t border-[#f0e6d8]">
                    <span className="text-xs text-[#5a4635]/50">Per delivery</span>
                    <p className="text-lg font-bold text-[#2d2016]">
                      {formatINR(sub.total)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
