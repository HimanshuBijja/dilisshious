import Image from "next/image";
import { Cookie, Leaf, Star } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 px-4 bg-[#fdf8f3]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="inline-block text-xs font-semibold text-[#c8956c] uppercase tracking-[0.2em] mb-3">
              About Us
            </span>
            <h2
              className="text-4xl sm:text-5xl font-bold text-[#2d2016] mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Crafted with
              <br />
              <span className="text-[#c8956c] italic">intention</span>
            </h2>
            <p className="text-[#5a4635]/80 leading-relaxed mb-6">
              At Dilisshious, we believe food is more than fuel — it&apos;s an
              experience, a memory, a quiet act of self-care. Every product we
              create starts with a conviction: that what you eat should nourish
              your body, your senses, and your spirit.
            </p>
            <p className="text-[#5a4635]/80 leading-relaxed mb-8">
              We source from farms, not factories. We use whole ingredients,
              never shortcuts. Our recipes are rooted in tradition but presented
              with modern elegance. Every batch is small, every detail is
              deliberate, and every bite tells you that someone cared.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-white border border-[#f0e6d8]">
                <Cookie size={24} className="mx-auto text-[#c8956c] mb-2" />
                <p className="text-xl font-bold text-[#2d2016]">100%</p>
                <p className="text-xs text-gray-500">Natural</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white border border-[#f0e6d8]">
                <Leaf size={24} className="mx-auto text-[#c8956c] mb-2" />
                <p className="text-xl font-bold text-[#2d2016]">Small</p>
                <p className="text-xs text-gray-500">Batches</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white border border-[#f0e6d8]">
                <Star size={24} className="mx-auto text-[#c8956c] mb-2" />
                <p className="text-xl font-bold text-[#2d2016]">Premium</p>
                <p className="text-xs text-gray-500">Quality</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-[#e8d5c0]">
              <Image
                src="/images/cookie-01.png"
                alt="About Dilisshious"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-2xl bg-[#c8956c] flex items-center justify-center text-white p-4 shadow-xl">
              <div className="text-center">
                <p className="text-2xl font-bold">100+</p>
                <p className="text-xs mt-1">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
