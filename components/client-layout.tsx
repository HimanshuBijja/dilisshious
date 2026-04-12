"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CartProvider } from "@/lib/cart-context";
import { CheckoutProvider } from "@/lib/checkout-context";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/navbar";
import CartDrawer from "@/components/cart-drawer";
import AuthModal from "@/components/auth-modal";
import Footer from "@/components/footer";
import IntroScreen from "@/components/intro-screen";

function FirstVisitRedirect() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Only redirect from the homepage — don't hijack deep links to /orders, /checkout, etc.
    if (pathname !== "/") return;

    try {
      const seen = localStorage.getItem("dilisshious-quiz-seen");
      if (!seen) {
        router.push("/quiz");
      }
    } catch {}
  }, [pathname, router]);

  return null;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CartProvider>
        <CheckoutProvider>
          <FirstVisitRedirect />
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
