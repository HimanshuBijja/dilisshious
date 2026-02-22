import DeliveryBanner from "@/components/sections/delivery-banner";
import ProductsSection from "@/components/sections/products-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import ProcessSection from "@/components/sections/process-section";
import AboutSection from "@/components/sections/about-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fdf8f3]">
      <DeliveryBanner />
      <ProductsSection />
      <TestimonialsSection />
      {/* <ProcessSection /> */}
      <AboutSection />
    </div>
  );
}
