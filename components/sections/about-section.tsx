import Image from "next/image";
import { Cookie, Leaf, Star } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="relative py-20 sm:py-28 px-4 bg-[#fdf8f3] overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c8956c]/[0.03] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="inline-block text-xs font-semibold text-[#c8956c] uppercase tracking-[0.25em] mb-4">
              About Us
            </span>
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#2d2016] mb-6 leading-[1.1]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Crafted with
              <br />
              <span className="text-[#c8956c] italic">intention</span>
            </h2>
            <p className="text-[#5a4635]/70 leading-relaxed mb-5 text-[15px]">
              At Dilisshious, we believe food is more than fuel — it&apos;s an
              experience, a memory, a quiet act of self-care. Every product we
              create starts with a conviction: that what you eat should nourish
              your body, your senses, and your spirit.
            </p>
            <p className="text-[#5a4635]/70 leading-relaxed mb-10 text-[15px]">
              We source from farms, not factories. We use whole ingredients,
              never shortcuts. Our recipes are rooted in tradition but presented
              with modern elegance.
            </p>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { icon: Cookie, value: "100%", label: "Natural" },
                { icon: Leaf, value: "Small", label: "Batches" },
                { icon: Star, value: "Premium", label: "Quality" },
              ].map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="text-center p-4 rounded-xl bg-white border border-[#f0e6d8] hover:border-[#c8956c]/30 transition-colors duration-300"
                >
                  <Icon size={22} className="mx-auto text-[#c8956c] mb-2" />
                  <p className="text-lg font-bold text-[#2d2016]">{value}</p>
                  <p className="text-xs text-[#5a4635]/50">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-[#e8d5c0] shadow-2xl shadow-[#2d2016]/10">
              <Image
                src="/images/gourmet-brown-butter-cookies.jpg"
                alt="About Dilisshious"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 sm:-bottom-6 sm:-left-6 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-[#2d2016] flex items-center justify-center text-white p-4 shadow-xl">
              <div className="text-center">
                <p
                  className="text-2xl sm:text-3xl font-semibold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  100+
                </p>
                <p className="text-[10px] sm:text-xs mt-1 text-white/70">
                  Happy Customers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
