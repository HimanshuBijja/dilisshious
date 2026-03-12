"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/cart-context";
import { useCheckout, CheckoutAddress } from "@/lib/checkout-context";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowLeft,
  MapPin,
  Plus,
  Check,
  Pencil,
  Trash2,
  Loader2,
  Navigation,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import the map component (Leaflet requires window)
const LocationMap = dynamic(() => import("@/components/location-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] rounded-xl bg-[#fdf8f3] border-2 border-dashed border-[#f0e6d8] flex items-center justify-center">
      <Loader2 size={24} className="animate-spin text-[#c8956c]" />
    </div>
  ),
});

interface SavedAddress extends CheckoutAddress {
  _id: string;
  label?: string;
  isDefault?: boolean;
}

type FlowMode = "saved" | "step-map" | "step-form";

export default function CheckoutPage() {
  const router = useRouter();
  const { status } = useSession();
  const { openAuthModal } = useAuth();
  const { items, subtotal } = useCart();
  const { data, setAddress, setSelectedAddressId } = useCheckout();

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [flowMode, setFlowMode] = useState<FlowMode>("saved");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CheckoutAddress>(data.address);
  const [mapPosition, setMapPosition] = useState<{ lat: number; lng: number } | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      openAuthModal();
      router.push("/");
    }
  }, [status, openAuthModal, router]);

  // Load saved addresses
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/addresses")
        .then((res) => res.json())
        .then((data) => {
          setSavedAddresses(data.addresses || []);
          setLoadingAddresses(false);
          if (!data.addresses?.length) {
            setFlowMode("step-map");
          }
        })
        .catch(() => setLoadingAddresses(false));
    }
  }, [status]);

  const handleMapSelect = useCallback((lat: number, lng: number, address?: string) => {
    setMapPosition({ lat, lng });
    setForm((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      formattedAddress: address || "",
    }));
  }, []);

  const handleContinueToForm = () => {
    setFlowMode("step-form");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectSavedAddress = (addr: SavedAddress) => {
    setSelectedAddressId(addr._id);
    setAddress({
      _id: addr._id,
      fullName: addr.fullName,
      phone: addr.phone,
      email: addr.email,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      latitude: addr.latitude,
      longitude: addr.longitude,
      formattedAddress: addr.formattedAddress,
    });
  };

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form };
    if (mapPosition) {
      payload.latitude = mapPosition.lat;
      payload.longitude = mapPosition.lng;
    }

    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.addresses) {
        setSavedAddresses(result.addresses);
        const newAddr = result.addresses[result.addresses.length - 1];
        handleSelectSavedAddress(newAddr);
        setFlowMode("saved");
        setEditingId(null);
      }
    } catch {
      // Still set the address locally
      setAddress(payload);
    }
    router.push("/checkout/delivery");
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    const payload = { addressId: editingId, ...form };
    if (mapPosition) {
      payload.latitude = mapPosition.lat;
      payload.longitude = mapPosition.lng;
    }

    try {
      const res = await fetch("/api/addresses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.addresses) {
        setSavedAddresses(result.addresses);
        const updated = result.addresses.find((a: SavedAddress) => a._id === editingId);
        if (updated) handleSelectSavedAddress(updated);
        setFlowMode("saved");
        setEditingId(null);
      }
    } catch {
      // continue
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const res = await fetch("/api/addresses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId }),
      });
      const result = await res.json();
      if (result.addresses) {
        setSavedAddresses(result.addresses);
        if (data.selectedAddressId === addressId) {
          setSelectedAddressId(null);
        }
      }
    } catch {
      // continue
    }
  };

  const handleContinue = () => {
    if (data.selectedAddressId && data.address.fullName) {
      router.push("/checkout/delivery");
    }
  };

  const startEdit = (addr: SavedAddress) => {
    setEditingId(addr._id);
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      email: addr.email,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      latitude: addr.latitude,
      longitude: addr.longitude,
      formattedAddress: addr.formattedAddress,
    });
    if (addr.latitude && addr.longitude) {
      setMapPosition({ lat: addr.latitude, lng: addr.longitude });
    }
    setFlowMode("step-map");
  };

  const startNewAddress = () => {
    setEditingId(null);
    setForm({ fullName: "", phone: "", email: "", address: "", city: "", state: "", pincode: "" });
    setMapPosition(null);
    setFlowMode("step-map");
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

  const isAddressSelected = data.selectedAddressId && data.address.fullName;

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
          {/* Address Section */}
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

              {loadingAddresses ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-[#c8956c]" />
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {/* ======= SAVED ADDRESSES ======= */}
                  {flowMode === "saved" && (
                    <motion.div
                      key="saved"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      {savedAddresses.length > 0 && (
                        <div className="space-y-3 mb-4">
                          {savedAddresses.map((addr) => {
                            const isSelected = data.selectedAddressId === addr._id;
                            return (
                              <button
                                key={addr._id}
                                onClick={() => handleSelectSavedAddress(addr)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                                  isSelected
                                    ? "border-[#c8956c] bg-[#c8956c]/5"
                                    : "border-[#f0e6d8] hover:border-[#c8956c]/40"
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-semibold text-[#2d2016]">
                                        {addr.fullName}
                                      </span>
                                      {addr.label && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fdf8f3] text-[#c8956c] border border-[#f0e6d8]">
                                          {addr.label}
                                        </span>
                                      )}
                                      {addr.isDefault && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">
                                          Default
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-[#5a4635]/70">
                                      {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                                    </p>
                                    <p className="text-xs text-[#5a4635]/50 mt-0.5">{addr.phone}</p>
                                  </div>
                                  <div className="flex items-center gap-1 ml-3">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); startEdit(addr); }}
                                      className="p-1.5 rounded-lg hover:bg-[#fdf8f3] transition-colors"
                                    >
                                      <Pencil size={14} className="text-[#5a4635]/50" />
                                    </button>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr._id); }}
                                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                      <Trash2 size={14} className="text-red-400" />
                                    </button>
                                    <div
                                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-1 ${
                                        isSelected ? "border-[#c8956c] bg-[#c8956c]" : "border-gray-300"
                                      }`}
                                    >
                                      {isSelected && <Check size={14} className="text-white" />}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            );
                          })}

                          <button
                            onClick={startNewAddress}
                            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-[#f0e6d8] text-sm font-medium text-[#c8956c] hover:border-[#c8956c] hover:bg-[#c8956c]/5 transition-all"
                          >
                            <Plus size={16} />
                            Add New Address
                          </button>
                        </div>
                      )}

                      {savedAddresses.length === 0 && (
                        <div className="text-center py-6">
                          <p className="text-sm text-[#5a4635]/60 mb-3">No saved addresses</p>
                          <button
                            onClick={startNewAddress}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2d2016] text-white text-sm font-semibold rounded-xl hover:bg-[#1a120d] transition-all"
                          >
                            <Plus size={16} />
                            Add Address
                          </button>
                        </div>
                      )}

                      {isAddressSelected && (
                        <button
                          onClick={handleContinue}
                          className="w-full mt-4 py-3.5 bg-[#2d2016] text-white font-semibold rounded-xl hover:bg-[#1a120d] transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                        >
                          Continue to Delivery
                          <ChevronRight size={18} />
                        </button>
                      )}
                    </motion.div>
                  )}

                  {/* ======= STEP 1: MAP ======= */}
                  {flowMode === "step-map" && (
                    <motion.div
                      key="map"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* Step Indicator */}
                      <div className="flex items-center gap-3 mb-5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-7 h-7 rounded-full bg-[#c8956c] text-white text-xs font-bold flex items-center justify-center">1</div>
                          <span className="text-xs font-semibold text-[#2d2016]">Pin Location</span>
                        </div>
                        <div className="flex-1 h-px bg-[#f0e6d8]" />
                        <div className="flex items-center gap-1.5">
                          <div className="w-7 h-7 rounded-full bg-[#f0e6d8] text-[#5a4635]/50 text-xs font-bold flex items-center justify-center">2</div>
                          <span className="text-xs font-medium text-[#5a4635]/50">Fill Details</span>
                        </div>
                      </div>

                      <p className="text-sm text-[#5a4635]/70 mb-3">
                        Drag the map or tap to pin your delivery location
                      </p>

                      <LocationMap
                        onSelect={handleMapSelect}
                        initialLat={mapPosition?.lat}
                        initialLng={mapPosition?.lng}
                      />

                      {mapPosition && form.formattedAddress && (
                        <div className="mt-3 p-3 rounded-xl bg-[#fdf8f3] border border-[#f0e6d8] flex items-start gap-2">
                          <Navigation size={14} className="text-[#c8956c] mt-0.5 shrink-0" />
                          <p className="text-xs text-[#5a4635]/70">{form.formattedAddress}</p>
                        </div>
                      )}

                      <div className="flex gap-3 mt-4">
                        {savedAddresses.length > 0 && (
                          <button
                            onClick={() => { setFlowMode("saved"); setEditingId(null); }}
                            className="px-4 py-3 text-sm font-medium text-[#5a4635] rounded-xl border border-[#f0e6d8] hover:bg-[#fdf8f3] transition-all flex items-center gap-1"
                          >
                            <ChevronLeft size={16} />
                            Back
                          </button>
                        )}
                        <button
                          onClick={handleContinueToForm}
                          className="flex-1 py-3.5 bg-[#2d2016] text-white font-semibold rounded-xl hover:bg-[#1a120d] transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                        >
                          Continue to Details
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ======= STEP 2: FORM ======= */}
                  {flowMode === "step-form" && (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* Step Indicator */}
                      <div className="flex items-center gap-3 mb-5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-7 h-7 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center">
                            <Check size={14} />
                          </div>
                          <span className="text-xs font-medium text-green-600">Location Set</span>
                        </div>
                        <div className="flex-1 h-px bg-[#c8956c]" />
                        <div className="flex items-center gap-1.5">
                          <div className="w-7 h-7 rounded-full bg-[#c8956c] text-white text-xs font-bold flex items-center justify-center">2</div>
                          <span className="text-xs font-semibold text-[#2d2016]">Fill Details</span>
                        </div>
                      </div>

                      {mapPosition && form.formattedAddress && (
                        <div className="mb-4 p-3 rounded-xl bg-[#fdf8f3] border border-[#f0e6d8] flex items-start gap-2">
                          <Navigation size={14} className="text-[#c8956c] mt-0.5 shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs text-[#5a4635]/70">{form.formattedAddress}</p>
                          </div>
                          <button
                            onClick={() => setFlowMode("step-map")}
                            className="text-xs font-medium text-[#c8956c] hover:underline shrink-0"
                          >
                            Change
                          </button>
                        </div>
                      )}

                      <form
                        onSubmit={editingId ? handleUpdateAddress : handleSaveNewAddress}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#5a4635] mb-1.5">
                              Full Name *
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
                              Phone Number *
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
                            Email *
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
                            Address / Flat / Street *
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
                              City *
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
                              State *
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
                              Pincode *
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

                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setFlowMode("step-map")}
                            className="px-4 py-3 text-sm font-medium text-[#5a4635] rounded-xl border border-[#f0e6d8] hover:bg-[#fdf8f3] transition-all flex items-center gap-1"
                          >
                            <ChevronLeft size={16} />
                            Back to Map
                          </button>
                          <button
                            type="submit"
                            className="flex-1 py-3.5 bg-[#2d2016] text-white font-semibold rounded-xl hover:bg-[#1a120d] transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                          >
                            {editingId ? "Update & Continue" : "Save & Continue"}
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
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
                  <div key={`${item.slug}-${item.volume}`} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#fdf8f3] border border-[#f0e6d8] shrink-0">
                      <Image src={item.image} alt={item.name} width={48} height={48} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2d2016] truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.volume} × {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-[#2d2016]">₹{item.price * item.quantity}</span>
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
                  <span className="text-[#c8956c] font-medium">Calculated next</span>
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
