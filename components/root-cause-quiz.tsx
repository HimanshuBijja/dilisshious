"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import { ArrowLeft, Check, Plus, Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

type QuestionType = "single" | "multi";

interface Question {
  id: string;
  title: string;
  subtitle: string;
  type: QuestionType;
  options: { id: string; label: string; description: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: "q1",
    title: "What's your primary health concern?",
    subtitle: "Select all that apply",
    type: "multi",
    options: [
      { id: "energy", label: "Energy", description: "Fatigue, afternoon crash, difficulty starting the day" },
      { id: "gut", label: "Gut", description: "Bloating, constipation, sluggish digestion" },
      { id: "hormones", label: "Hormones", description: "Mood swings, PMS, irregular cycles, reactivity" },
      { id: "skin", label: "Skin & Hair", description: "Dullness, breakouts, hair loss, slow growth" },
      { id: "liver", label: "Liver", description: "Feeling heavy, puffy, or needing a reset" },
      { id: "immunity", label: "Immunity", description: "Falling sick often, slow recovery" },
    ],
  },
  {
    id: "q2",
    title: "How would you describe your stress & adrenal state?",
    subtitle: "Pick the one that fits best",
    type: "single",
    options: [
      { id: "wired", label: "Wired but exhausted", description: "Can't switch off, tired but can't rest" },
      { id: "flat", label: "Flat and unmotivated", description: "Low drive, brain fog, difficulty getting going" },
      { id: "anxious", label: "Anxious and reactive", description: "Easily overwhelmed, on edge" },
      { id: "balanced", label: "Mostly balanced", description: "Stress is manageable right now" },
    ],
  },
  {
    id: "q3",
    title: "How's your digestion?",
    subtitle: "Select all that apply",
    type: "multi",
    options: [
      { id: "slow", label: "Slow and constipated", description: "Less than daily, feels incomplete" },
      { id: "bloated", label: "Bloated after meals", description: "Distension, discomfort, gas" },
      { id: "irregular", label: "Irregular", description: "Unpredictable, alternating patterns" },
      { id: "good", label: "Pretty good", description: "No major complaints" },
    ],
  },
  {
    id: "q4",
    title: "What's your dietary preference?",
    subtitle: "This determines your bone broth variant",
    type: "single",
    options: [
      { id: "vegan", label: "Vegan", description: "Fully plant-based" },
      { id: "vegetarian", label: "Vegetarian", description: "No meat; dairy & egg ok" },
      { id: "omnivore", label: "Omnivore", description: "Full animal food access" },
      { id: "flexitarian", label: "Flexitarian", description: "Vegan or non-veg each delivery cycle" },
    ],
  },
  {
    id: "q5",
    title: "When do you crash the most?",
    subtitle: "Pick your worst energy dip",
    type: "single",
    options: [
      { id: "morning", label: "Morning", description: "Hard to wake up, groggy start" },
      { id: "afternoon", label: "Afternoon", description: "Post-lunch slump, yawning at 3pm" },
      { id: "evening", label: "Evening", description: "Wired at night, can't wind down" },
      { id: "allday", label: "All day", description: "Consistently low throughout" },
    ],
  },
  {
    id: "q6",
    title: "What's your health goal?",
    subtitle: "This helps us pick your plan",
    type: "single",
    options: [
      { id: "correct", label: "Correct an imbalance", description: "Something is off, fix it at the root" },
      { id: "elevate", label: "Elevate my baseline", description: "I feel okay but want to feel truly well" },
      { id: "maintain", label: "Maintain & sustain", description: "I've done the work, keep it going" },
    ],
  },
];

type BundleId = "GRV" | "HHB" | "GFW" | "PVP";
type PlanId = "W1" | "BW" | "MO";

interface Bundle {
  id: BundleId;
  name: string;
  focus: string;
  products: string[];
  pricing: Record<PlanId, number>;
}

const BUNDLES: Record<BundleId, Bundle> = {
  HHB: {
    id: "HHB",
    name: "Hormone Health Bundle",
    focus: "Hormonal Balance",
    products: [
      "Estrogen Detox Shots",
      "Orange Peel Adaptogenic Jam",
      "Herb Blend (Raw)",
      "Adaptogenic Hormonal Tea",
      "Royal Saffron-Cacao Snack Bites",
      "Adaptogenic Bone Broth (v/nv)",
    ],
    pricing: { W1: 1790, BW: 3090, MO: 5590 },
  },
  GRV: {
    id: "GRV",
    name: "Gut Health Bundle",
    focus: "Gut Health",
    products: [
      "Happy Belly Shots",
      "Crunchy Yoghurt Bowl (Seasonal Fruit)",
      "Probiotic Rich Snack Bars",
      "Adaptogenic Bone Broth (v/nv)",
      "Bloat-Free Spray",
      "Relax-Me (Digestive Blend)",
    ],
    pricing: { W1: 1890, BW: 3290, MO: 5990 },
  },
  GFW: {
    id: "GFW",
    name: "Skin & Hair Bundle",
    focus: "Skin & Hair Health",
    products: [
      "Vitamin C Shots",
      "Adaptogenic Hair Growth Oil",
      "Saffron Kumkumadi Face Oil",
      "Salmon Bone Broth",
      "Collagen Gummies",
      "Seed Crackers",
    ],
    pricing: { W1: 2190, BW: 3690, MO: 6490 },
  },
  PVP: {
    id: "PVP",
    name: "Energy Bundle",
    focus: "Energy & Vitality",
    products: [
      "Adrenal Cocktail Blend with Trace Minerals",
      "Divine Energy Bars",
      "Diva Energy Drink",
      "Buckwheat Berry Granola",
      "Magic Mushroom Blend",
      "Mineral Rich Bone Broth",
    ],
    pricing: { W1: 1690, BW: 2890, MO: 5190 },
  },
};

interface Plan {
  id: PlanId;
  name: string;
  frequency: string;
  commitment: string;
  pausable: boolean;
}

const PLANS: Plan[] = [
  { id: "W1", name: "1-Week Trial", frequency: "Once-off", commitment: "None", pausable: false },
  { id: "BW", name: "Bi-Weekly", frequency: "Every 2 weeks", commitment: "1 month (2 orders)", pausable: true },
  { id: "MO", name: "Monthly", frequency: "Every month", commitment: "3 months", pausable: true },
];

interface AddOn {
  id: string;
  name: string;
  price: number;
  image: string | null;
  slug: string | null;
  category: string;
}

const ADD_ONS: AddOn[] = [];

const BONE_BROTH_VARIANTS: Record<string, string> = {
  vegan: "Vegan Mushroom + Adaptogen Broth",
  vegetarian: "Vegan or Dairy-based Broth",
  omnivore: "Collagen-rich Non-Veg Broth",
  flexitarian: "Choice per delivery",
};

const PRODUCT_IMAGES: Record<string, string | null> = {
  "Estrogen Detox Shots": null,
  "Orange Peel Adaptogenic Jam": null,
  "Herb Blend (Raw)": null,
  "Adaptogenic Hormonal Tea": null,
  "Royal Saffron-Cacao Snack Bites": null,
  "Adaptogenic Bone Broth (v/nv)": null,
  "Happy Belly Shots": null,
  "Crunchy Yoghurt Bowl (Seasonal Fruit)": null,
  "Probiotic Rich Snack Bars": null,
  "Bloat-Free Spray": null,
  "Relax-Me (Digestive Blend)": null,
  "Vitamin C Shots": null,
  "Adaptogenic Hair Growth Oil": null,
  "Saffron Kumkumadi Face Oil": null,
  "Salmon Bone Broth": null,
  "Collagen Gummies": null,
  "Seed Crackers": null,
  "Adrenal Cocktail Blend with Trace Minerals": null,
  "Divine Energy Bars": null,
  "Diva Energy Drink": null,
  "Buckwheat Berry Granola": null,
  "Magic Mushroom Blend": null,
  "Mineral Rich Bone Broth": null,
};

// ─── Routing logic ───────────────────────────────────────────────────────────

function routeBundle(q1: string[]): BundleId {
  if (q1.includes("hormones")) return "HHB";
  if (q1.includes("skin")) return "GFW";
  if (q1.includes("energy") && !q1.includes("gut")) return "PVP";
  // gut, liver, immunity, mixed, or anything else
  return "GRV";
}

function recommendedPlan(q6: string): PlanId {
  if (q6 === "correct") return "MO";
  if (q6 === "elevate") return "BW";
  return "BW"; // maintain → Bi-Weekly or 1-Week Trial, default BW
}

// ─── Formatting ──────────────────────────────────────────────────────────────

function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

// ─── Persistence helpers ─────────────────────────────────────────────────────

const STORAGE_KEY = "dilisshious-quiz-result";
const PENDING_CHECKOUT_KEY = "dilisshious-quiz-pending-checkout";

interface QuizResultData {
  answers: Record<string, string | string[]>;
  recommendedBundle: BundleId;
}

interface PendingCheckout {
  bundleId: BundleId;
  bundleName: string;
  planId: PlanId;
  planName: string;
  frequency: string;
  bundlePrice: number;
  bundleImage: string;
  addOns: { id: string; slug: string | null; name: string; price: number; image: string | null }[];
  orderTotal: number;
}

function saveToLocalStorage(data: QuizResultData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

async function saveToDatabase(data: QuizResultData) {
  try {
    await fetch("/api/quiz-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {}
}

// ─── Component ───────────────────────────────────────────────────────────────

interface RootCauseQuizProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export default function RootCauseQuiz({ onComplete, onSkip }: RootCauseQuizProps) {
  const { data: session } = useSession();
  const { addToCartSilent } = useCart();
  const { openAuthModal } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0); // 0..5 = questions, 6 = result
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());
  const [animKey, setAnimKey] = useState(0); // triggers re-animation on step change

  const currentQuestion = QUESTIONS[step];
  const totalQuestions = QUESTIONS.length;
  const isResult = step === totalQuestions;

  // Derive result
  const bundleId = routeBundle((answers.q1 as string[]) || []);
  const bundle = BUNDLES[bundleId];

  // Set recommended plan when reaching results
  useEffect(() => {
    if (isResult && !selectedPlan) {
      setSelectedPlan(recommendedPlan(answers.q6 as string));
    }
  }, [isResult, selectedPlan, answers.q6]);

  // Save result on completion
  useEffect(() => {
    if (!isResult) return;
    const data: QuizResultData = { answers, recommendedBundle: bundleId };
    if (session?.user) {
      saveToDatabase(data);
    } else {
      saveToLocalStorage(data);
    }
    // Mark quiz as seen so first-visit redirect doesn't fire again
    try {
      localStorage.setItem("dilisshious-quiz-seen", "1");
    } catch {}
  }, [isResult, answers, bundleId, session]);

  const handleSelect = useCallback(
    (optionId: string) => {
      const q = currentQuestion;
      if (q.type === "single") {
        const newAnswers = { ...answers, [q.id]: optionId };
        setAnswers(newAnswers);
        // Auto-advance after short delay for single-select
        setTimeout(() => {
          setAnimKey((k) => k + 1);
          setStep((s) => s + 1);
        }, 300);
      } else {
        // multi-select
        const current = (answers[q.id] as string[]) || [];
        const updated = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        setAnswers({ ...answers, [q.id]: updated });
      }
    },
    [answers, currentQuestion]
  );

  const canAdvance =
    !isResult &&
    currentQuestion &&
    (currentQuestion.type === "single"
      ? typeof answers[currentQuestion.id] === "string"
      : ((answers[currentQuestion.id] as string[]) || []).length > 0);

  const handleNext = () => {
    if (canAdvance) {
      setAnimKey((k) => k + 1);
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setAnimKey((k) => k + 1);
      setStep((s) => s - 1);
    }
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Price calculation
  const bundlePrice = selectedPlan ? bundle.pricing[selectedPlan] : 0;
  const addOnTotal = ADD_ONS.filter((a) => selectedAddOns.has(a.id)).reduce((sum, a) => sum + a.price, 0);
  const orderTotal = bundlePrice + addOnTotal;

  // Bone broth variant
  const dietPref = (answers.q4 as string) || "omnivore";
  const brothVariant = BONE_BROTH_VARIANTS[dietPref] || BONE_BROTH_VARIANTS.omnivore;

  // Resume pending checkout after sign-in
  useEffect(() => {
    if (!session?.user) return;
    let raw: string | null = null;
    try { raw = localStorage.getItem(PENDING_CHECKOUT_KEY); } catch {}
    if (!raw) return;

    let pending: PendingCheckout;
    try { pending = JSON.parse(raw); } catch { return; }

    // Clear immediately to prevent re-triggering
    try { localStorage.removeItem(PENDING_CHECKOUT_KEY); } catch {}

    // Add bundle to cart silently
    addToCartSilent({
      slug: `bundle-${pending.bundleId.toLowerCase()}`,
      name: `${pending.bundleName} — ${pending.planName}`,
      image: pending.bundleImage,
      price: pending.bundlePrice,
      volume: pending.frequency,
      quantity: 1,
    });

    // Add add-ons to cart silently
    pending.addOns.forEach((addon) => {
      addToCartSilent({
        slug: addon.slug || `addon-${addon.id.toLowerCase()}`,
        name: addon.name,
        image: addon.image || "/images/moringa-dust.jpg",
        price: addon.price,
        volume: "per delivery",
        quantity: 1,
      });
    });

    // Save subscription to DB and go to checkout
    (async () => {
      try {
        await fetch("/api/subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bundleId: pending.bundleId,
            bundleName: pending.bundleName,
            planId: pending.planId,
            planName: pending.planName,
            frequency: pending.frequency,
            bundlePrice: pending.bundlePrice,
            addOns: pending.addOns.map((a) => ({ id: a.id, name: a.name, price: a.price })),
            total: pending.orderTotal,
          }),
        });
      } catch {}
      try { localStorage.setItem("dilisshious-quiz-seen", "1"); } catch {}
      router.push("/checkout");
    })();
  }, [session, addToCartSilent, router]);

  // Add-on carousel scroll
  const addOnScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = addOnScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  const scrollAddOns = useCallback((dir: "left" | "right") => {
    const el = addOnScrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.getBoundingClientRect().width || 160;
    el.scrollBy({ left: dir === "left" ? -cardWidth * 2 : cardWidth * 2, behavior: "smooth" });
  }, []);

  // ─── Result screen ──────────────────────────────────────────────────────────

  if (isResult) {
    const recPlanId = recommendedPlan(answers.q6 as string);

    return (
      <div className="h-full bg-[#fdf8f3] flex flex-col relative overflow-hidden grain-overlay">
        {/* Atmospheric background accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c8956c]/[0.04] rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#c8956c]/[0.03] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#e8d5c0]/40 bg-[#fdf8f3]/80 backdrop-blur-sm">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm text-[#5a4635] hover:text-[#c8956c] transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <button
            onClick={onSkip}
            className="w-8 h-8 rounded-full border border-[#e8d5c0] flex items-center justify-center text-[#5a4635]/60 hover:text-[#5a4635] hover:border-[#c8956c]/40 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto min-h-0">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {/* Bundle recommendation */}
            <div className="text-center mb-12 animate-fade-in-up">
              <span className="inline-block text-xs font-semibold text-[#c8956c] uppercase tracking-[0.25em] mb-4">
                Your Personalised Protocol
              </span>
              <h1
                className="text-4xl sm:text-5xl font-semibold text-[#2d2016] mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {bundle.name}
              </h1>
              {/* Decorative flourish */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-12 bg-[#c8956c]/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#c8956c]" />
                <span className="h-px w-12 bg-[#c8956c]/40" />
              </div>
              <p className="text-[#5a4635]/70 text-sm sm:text-base">{bundle.focus}</p>
            </div>

            {/* Products in bundle */}
            <div className="bg-white rounded-2xl border border-[#f0e6d8] p-5 sm:p-6 mb-8 shadow-sm animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <h3 className="text-xs font-semibold text-[#c8956c] uppercase tracking-[0.2em] mb-5">
                What&apos;s Included
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {bundle.products.map((product) => {
                  const img = PRODUCT_IMAGES[product] ?? null;
                  return (
                    <div
                      key={product}
                      className="relative bg-[#fdf8f3] rounded-xl overflow-hidden border border-[#f0e6d8] hover:border-[#c8956c]/30 hover:shadow-md hover:shadow-[#c8956c]/5 transition-all duration-300 group"
                    >
                      <div className="aspect-square relative overflow-hidden">
                        {img ? (
                          <Image
                            src={img}
                            alt={product}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 40vw, 180px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f5ebe0] to-[#e8d5c0]/30 p-3">
                            <span className="text-[#c8956c]/50 text-xs font-medium text-center leading-tight">
                              {product}
                            </span>
                          </div>
                        )}
                        {/* Included badge */}
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#c8956c] flex items-center justify-center shadow-sm">
                          <Check size={10} className="text-white" />
                        </div>
                      </div>
                      <div className="px-2.5 py-2.5">
                        <p className="text-[11px] font-medium text-[#2d2016] leading-tight line-clamp-2">
                          {product}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {bundle.id !== "GFW" && (
                <div className="mt-5 pt-4 border-t border-[#f0e6d8]">
                  <p className="text-xs text-[#5a4635]/60">
                    Bone broth variant: <span className="font-medium text-[#5a4635]">{brothVariant}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Plan picker */}
            <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <h3 className="text-xs font-semibold text-[#c8956c] uppercase tracking-[0.2em] mb-5">
                Choose Your Plan
              </h3>
              <div className="grid gap-3">
                {PLANS.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  const isRec = plan.id === recPlanId;
                  return (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
                        isSelected
                          ? "border-[#c8956c] bg-[#c8956c]/[0.04] shadow-md shadow-[#c8956c]/10"
                          : "border-[#f0e6d8] bg-white hover:border-[#c8956c]/30 hover:shadow-sm"
                      }`}
                    >
                      {isRec && (
                        <span className="absolute -top-2.5 right-4 px-3 py-0.5 bg-[#c8956c] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                          Recommended
                        </span>
                      )}
                      <div className="flex items-center justify-between pl-9">
                        <div>
                          <p className="font-semibold text-[#2d2016] text-[15px]">{plan.name}</p>
                          <p className="text-xs text-[#5a4635]/60 mt-1">
                            {plan.frequency} · {plan.commitment === "None" ? "No commitment" : `Min. ${plan.commitment}`}
                            {plan.pausable ? " · Pausable" : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className="text-xl font-semibold text-[#2d2016]"
                            style={{ fontFamily: "var(--font-heading)" }}
                          >
                            {formatINR(bundle.pricing[plan.id])}
                          </p>
                          <p className="text-[10px] text-[#5a4635]/50 mt-0.5">per delivery</p>
                        </div>
                      </div>
                      {/* Selection indicator */}
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          isSelected ? "border-[#c8956c] bg-[#c8956c] scale-110" : "border-[#d4c4b0]"
                        }`}
                      >
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add-ons carousel */}
            {ADD_ONS.length > 0 && <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xs font-semibold text-[#c8956c] uppercase tracking-[0.2em]">
                  Optional Add-ons
                </h3>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => scrollAddOns("left")}
                    disabled={!canScrollLeft}
                    className="w-8 h-8 rounded-full border border-[#e8d5c0] flex items-center justify-center text-[#5a4635] hover:bg-[#f5ebe0] hover:border-[#c8956c]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => scrollAddOns("right")}
                    disabled={!canScrollRight}
                    className="w-8 h-8 rounded-full border border-[#e8d5c0] flex items-center justify-center text-[#5a4635] hover:bg-[#f5ebe0] hover:border-[#c8956c]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div
                ref={addOnScrollRef}
                onScroll={updateScrollState}
                className="flex gap-3 overflow-x-auto scroll-smooth pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
              >
                {ADD_ONS.map((addon) => {
                  const isSelected = selectedAddOns.has(addon.id);
                  return (
                    <div
                      key={addon.id}
                      className={`relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col flex-shrink-0 w-[140px] sm:w-[156px] group ${
                        isSelected
                          ? "border-[#c8956c] shadow-lg shadow-[#c8956c]/10"
                          : "border-[#f0e6d8] hover:border-[#c8956c]/30 hover:shadow-md hover:shadow-[#c8956c]/5"
                      }`}
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/3] bg-[#faf5ef] overflow-hidden flex-shrink-0">
                        {addon.image ? (
                          <Image
                            src={addon.image}
                            alt={addon.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="156px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f5ebe0] to-[#e8d5c0]/30 p-2">
                            <span className="text-[#c8956c]/50 text-[10px] font-medium text-center leading-tight">
                              {addon.name}
                            </span>
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#c8956c] flex items-center justify-center shadow-sm">
                            <Check size={10} className="text-white" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-2.5 flex flex-col flex-grow">
                        <p className="text-[9px] font-semibold text-[#c8956c] uppercase tracking-[0.15em] mb-0.5">
                          {addon.category}
                        </p>
                        <h4
                          className="text-xs font-semibold text-[#2d2016] mb-1 leading-tight line-clamp-2"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {addon.name}
                        </h4>
                        <p className="text-sm font-bold text-[#2d2016] mb-2">
                          {formatINR(addon.price)}
                        </p>

                        <button
                          onClick={() => toggleAddOn(addon.id)}
                          className={`mt-auto w-full py-1.5 text-[11px] font-medium rounded-lg flex items-center justify-center gap-1 active:scale-[0.97] transition-all duration-300 ${
                            isSelected
                              ? "bg-[#c8956c] text-white hover:bg-[#b07f5a]"
                              : "bg-[#2d2016] text-white hover:bg-[#c8956c]"
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check size={12} />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus size={12} />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>}
          </div>
        </div>

        {/* Sticky footer with total */}
        <div className="relative z-10 flex-shrink-0 bg-white/90 backdrop-blur-xl border-t border-[#f0e6d8] px-4 sm:px-6 py-4 shadow-[0_-4px_20px_rgba(45,32,22,0.04)]">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-xs text-[#5a4635]/60">Order total</p>
              <p
                className="text-2xl font-semibold text-[#2d2016]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {formatINR(orderTotal)}
              </p>
              <p className="text-[10px] text-[#5a4635]/50">Free shipping on all bundles</p>
            </div>
            <button
              onClick={async () => {
                if (!selectedPlan) return;

                // Require auth — save pending checkout and open sign-in modal
                if (!session?.user) {
                  const plan = PLANS.find((p) => p.id === selectedPlan)!;
                  const pendingData: PendingCheckout = {
                    bundleId: bundle.id,
                    bundleName: bundle.name,
                    planId: selectedPlan,
                    planName: plan.name,
                    frequency: plan.frequency,
                    bundlePrice: bundle.pricing[selectedPlan],
                    bundleImage: bundle.products[0] ? (PRODUCT_IMAGES[bundle.products[0]] || "/images/moringa-dust.jpg") : "/images/moringa-dust.jpg",
                    addOns: ADD_ONS.filter((a) => selectedAddOns.has(a.id)).map((a) => ({
                      id: a.id, slug: a.slug, name: a.name, price: a.price, image: a.image,
                    })),
                    orderTotal,
                  };
                  try {
                    localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(pendingData));
                    localStorage.setItem("dilisshious-quiz-seen", "1");
                  } catch {}
                  openAuthModal();
                  return;
                }

                const plan = PLANS.find((p) => p.id === selectedPlan)!;
                const selectedAddOnItems = ADD_ONS.filter((a) => selectedAddOns.has(a.id));

                // Add bundle to cart silently (no drawer)
                addToCartSilent({
                  slug: `bundle-${bundle.id.toLowerCase()}`,
                  name: `${bundle.name} — ${plan.name}`,
                  image: bundle.products[0] ? (PRODUCT_IMAGES[bundle.products[0]] || "/images/moringa-dust.jpg") : "/images/moringa-dust.jpg",
                  price: bundle.pricing[selectedPlan],
                  volume: plan.frequency,
                  quantity: 1,
                });

                // Add selected add-ons to cart silently
                selectedAddOnItems.forEach((addon) => {
                  addToCartSilent({
                    slug: addon.slug || `addon-${addon.id.toLowerCase()}`,
                    name: addon.name,
                    image: addon.image || "/images/moringa-dust.jpg",
                    price: addon.price,
                    volume: "per delivery",
                    quantity: 1,
                  });
                });

                // Save subscription to DB
                try {
                  await fetch("/api/subscriptions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      bundleId: bundle.id,
                      bundleName: bundle.name,
                      planId: selectedPlan,
                      planName: plan.name,
                      frequency: plan.frequency,
                      bundlePrice: bundle.pricing[selectedPlan],
                      addOns: selectedAddOnItems.map((a) => ({
                        id: a.id,
                        name: a.name,
                        price: a.price,
                      })),
                      total: orderTotal,
                    }),
                  });
                } catch {}

                // Mark quiz seen and go to checkout
                try { localStorage.setItem("dilisshious-quiz-seen", "1"); } catch {}
                router.push("/checkout");
              }}
              disabled={!selectedPlan}
              className="px-8 py-3.5 bg-[#2d2016] text-white text-sm font-semibold rounded-full hover:bg-[#5a4635] active:scale-[0.97] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#2d2016]/20"
            >
              {!session?.user ? "Sign in to continue" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Question screen ─────────────────────────────────────────────────────────

  const isMulti = currentQuestion.type === "multi";
  const currentAnswer = answers[currentQuestion.id];
  const multiSelected = (currentAnswer as string[]) || [];

  return (
    <div className="h-full bg-[#fdf8f3] flex flex-col relative overflow-hidden grain-overlay">
      {/* Atmospheric background accents */}
      <div className="absolute top-1/4 -right-32 w-[400px] h-[400px] bg-[#c8956c]/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-[350px] h-[350px] bg-[#c8956c]/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#e8d5c0]/40 bg-[#fdf8f3]/80 backdrop-blur-sm">
        <button
          onClick={step > 0 ? handleBack : onSkip}
          className="flex items-center gap-1.5 text-sm text-[#5a4635] hover:text-[#c8956c] transition-colors"
        >
          <ArrowLeft size={18} />
          {step > 0 ? "Back" : "Exit"}
        </button>
        {/* Step dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-500 ${
                i === step
                  ? "w-6 h-2 bg-[#c8956c]"
                  : i < step
                  ? "w-2 h-2 bg-[#c8956c]/60"
                  : "w-2 h-2 bg-[#e8d5c0]"
              }`}
            />
          ))}
        </div>
        <button
          onClick={onSkip}
          className="text-sm text-[#5a4635]/60 hover:text-[#c8956c] transition-colors font-medium"
        >
          Skip
        </button>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 flex-shrink-0 h-0.5 bg-[#e8d5c0]/20">
        <div
          className="h-full bg-gradient-to-r from-[#c8956c] to-[#d4a57a] transition-all duration-700 ease-out"
          style={{ width: `${((step + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question content */}
      <div className="relative z-10 flex-1 overflow-y-auto min-h-0 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12">
        <div key={animKey} className="w-full max-w-lg">
          <div className="text-center mb-10 animate-fade-in-up">
            <span className="inline-block text-xs font-semibold text-[#c8956c] uppercase tracking-[0.25em] mb-4">
              Question {step + 1} of {totalQuestions}
            </span>
            <h2
              className="text-3xl sm:text-4xl font-semibold text-[#2d2016] mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {currentQuestion.title}
            </h2>
            {/* Decorative flourish */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="h-px w-10 bg-[#c8956c]/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8956c]" />
              <span className="h-px w-10 bg-[#c8956c]/40" />
            </div>
            <p className="text-sm text-[#5a4635]/60">
              {currentQuestion.subtitle}
            </p>
          </div>

          {/* Option tiles */}
          <div className="grid gap-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = isMulti
                ? multiSelected.includes(option.id)
                : currentAnswer === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`animate-fade-in-up w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 group ${
                    isSelected
                      ? "border-[#c8956c] bg-[#c8956c]/[0.04] shadow-md shadow-[#c8956c]/10"
                      : "border-[#f0e6d8] bg-white hover:border-[#c8956c]/30 hover:shadow-md hover:shadow-[#c8956c]/5"
                  }`}
                  style={{ animationDelay: `${0.1 + idx * 0.06}s` }}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`mt-0.5 w-5 h-5 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        isMulti ? "rounded-md" : "rounded-full"
                      } ${
                        isSelected
                          ? "bg-[#c8956c] border-2 border-[#c8956c] scale-110"
                          : "border-2 border-[#d4c4b0] group-hover:border-[#c8956c]/50"
                      }`}
                    >
                      {isSelected && <Check size={12} className="text-white" />}
                    </div>
                    <div>
                      <p className="font-semibold text-[#2d2016] text-[15px]">{option.label}</p>
                      <p className="text-xs text-[#5a4635]/60 mt-0.5 leading-relaxed">{option.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next button for multi-select questions */}
          {isMulti && (
            <button
              onClick={handleNext}
              disabled={!canAdvance}
              className="mt-8 w-full py-3.5 bg-[#2d2016] text-white text-sm font-semibold rounded-full hover:bg-[#5a4635] active:scale-[0.97] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-[#2d2016]/20 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
