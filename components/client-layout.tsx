"use client";

import { CartProvider } from "@/lib/cart-context";
import { CheckoutProvider } from "@/lib/checkout-context";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/navbar";
import CartDrawer from "@/components/cart-drawer";
import AuthModal from "@/components/auth-modal";
import Footer from "@/components/footer";
import IntroScreen from "@/components/intro-screen";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CartProvider>
        <CheckoutProvider>
          <IntroScreen />
          <Navbar />
          <CartDrawer />
          <AuthModal />
          <main>{children}</main>
          <Footer />
        </CheckoutProvider>
      </CartProvider>
    </AuthProvider>
  );
}
