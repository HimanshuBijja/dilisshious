"use client";

import Image from "next/image";
import ProductCard from "@/components/product-card";
import { products } from "@/lib/products";
import { ChevronDown, Leaf, Cookie, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fdf8f3]">
      {/* Delivery Banner */}
      <div className="overflow-hidden bg-[#2d2016] text-white py-2.5 mt-16 sm:mt-20">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
          {[...Array(20)].map((_, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 text-sm font-medium "
            >
              <span className="text-[#c8956c]"></span> We Deliver on Wednesdays
              and Sundays
              <span className="mx-4 text-[#c8956c]"></span>
            </span>
          ))}
        </div>
      </div>

      {/* Hero Section */}


      {/* Products Section */}
      <section id="products" className="pb-20 pt-0 sm:py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <span className="inline-block text-xs font-semibold text-[#c8956c] uppercase tracking-[0.2em] mb-3">
              Our Collection
            </span>
            <h2
              className="text-4xl sm:text-5xl font-bold text-[#2d2016] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Made with Love
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Each product is crafted in small batches with the finest natural
              ingredients
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 sm:py-28 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold text-[#c8956c] uppercase tracking-[0.2em] mb-3">
              What People Say
            </span>
            <h2
              className="text-4xl sm:text-5xl font-bold text-[#2d2016]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Real Love, Real Words
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-[#fdf8f3] rounded-2xl p-6 sm:p-8 border border-[#f0e6d8] hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      size={16}
                      className="fill-[#c8956c] text-[#c8956c]"
                    />
                  ))}
                </div>
                <p className="text-[#5a4635] leading-relaxed mb-6 text-sm italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c8956c]/20 flex items-center justify-center text-[#c8956c] font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2d2016]">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-400">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
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
                create starts with a conviction: that what you eat should
                nourish your body, your senses, and your spirit.
              </p>
              <p className="text-[#5a4635]/80 leading-relaxed mb-8">
                We source from farms, not factories. We use whole ingredients,
                never shortcuts. Our recipes are rooted in tradition but
                presented with modern elegance. Every batch is small, every
                detail is deliberate, and every bite tells you that someone
                cared.
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
    </div>
  );
}

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Bangalore",
    text: "The brown butter cookies are absolutely divine. The nutty, caramelized flavour is unlike anything I've ever tasted. My kids are obsessed!",
  },
  {
    name: "Arjun Reddy",
    location: "Hyderabad",
    text: "The Moringa Dust has become a staple in our kitchen. We sprinkle it on everything — rice, dosa, even pasta. So good and so healthy!",
  },
  {
    name: "Meera Iyer",
    location: "Chennai",
    text: "Ordered the strawberry cheesecake jars for a party and they were gone in minutes. Creamy, fresh, and not overly sweet. Perfect!",
  },
];
