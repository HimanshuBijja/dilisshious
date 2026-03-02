"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CheckoutAddress {
  _id?: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  formattedAddress?: string;
}

export interface CheckoutData {
  address: CheckoutAddress;
  deliveryMethod: "standard" | "express";
  paymentMethod: "upi";
  orderId: string;
  selectedAddressId: string | null;
}

interface CheckoutContextType {
  data: CheckoutData;
  setAddress: (address: CheckoutAddress) => void;
  setDeliveryMethod: (method: "standard" | "express") => void;
  setPaymentMethod: (method: "upi") => void;
  setOrderId: (id: string) => void;
  setSelectedAddressId: (id: string | null) => void;
  reset: () => void;
}

const defaultData: CheckoutData = {
  address: {
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  },
  deliveryMethod: "standard",
  paymentMethod: "upi",
  orderId: "",
  selectedAddressId: null,
};

const CHECKOUT_STORAGE_KEY = "dilishious-checkout";

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined,
);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CheckoutData>(defaultData);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Persist to sessionStorage on every change
  useEffect(() => {
    try {
      sessionStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore
    }
  }, [data]);

  const reset = () => {
    setData(defaultData);
    try {
      sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        data,
        setAddress: (address) => setData((d) => ({ ...d, address })),
        setDeliveryMethod: (deliveryMethod) =>
          setData((d) => ({ ...d, deliveryMethod })),
        setPaymentMethod: (paymentMethod) =>
          setData((d) => ({ ...d, paymentMethod })),
        setOrderId: (orderId) => setData((d) => ({ ...d, orderId })),
        setSelectedAddressId: (selectedAddressId) =>
          setData((d) => ({ ...d, selectedAddressId })),
        reset,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context)
    throw new Error("useCheckout must be used within a CheckoutProvider");
  return context;
}
