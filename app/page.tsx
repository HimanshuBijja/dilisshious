import HeroSection from "@/components/sections/hero-section";
import DeliveryBanner from "@/components/sections/delivery-banner";
import ProductsSection from "@/components/sections/products-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import AboutSection from "@/components/sections/about-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fdf8f3]">
      <DeliveryBanner />
      <HeroSection />
      <ProductsSection />
      <TestimonialsSection />
      <AboutSection />
    </div>
  );
}
