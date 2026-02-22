"use client";

import { CartProvider } from "@/lib/cart-context";
import { CheckoutProvider } from "@/lib/checkout-context";
import Navbar from "@/components/navbar";
import CartDrawer from "@/components/cart-drawer";
import Footer from "@/components/footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <CheckoutProvider>
        <Navbar />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
      </CheckoutProvider>
    </CartProvider>
  );
}
