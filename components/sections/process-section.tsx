import Image from "next/image";

export default function ProcessSection() {
  return (
    <section className="py-20 sm:py-28 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="text-sm font-medium text-[#c8956c] italic block mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            We Love What We Do
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2d2016] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            How We Make Our Treats
          </h2>
          <p className="text-sm text-[#5a4635]/70 leading-relaxed max-w-xl mx-auto">
            Every Dilisshious product starts with intention and ends with
            delight. Here&apos;s a peek into our process.
          </p>
        </div>

        {/* Process Grid — Image center, steps around */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Left Column — Steps 1 & 2 */}
          <div className="flex flex-col gap-6">
            {/* Step 1 */}
            <div className="bg-[#fdf8f3] rounded-2xl p-6 border border-[#f0e6d8] text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-3">🧈</div>
              <h3
                className="text-base font-bold text-[#2d2016] mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                1. Ingredients
              </h3>
              <p className="text-xs text-[#5a4635]/70 leading-relaxed mb-3">
                We source the finest natural ingredients — organic flour, real
                butter, farm-fresh eggs, no shortcuts.
              </p>
              <a
                href="#products"
                className="text-xs font-bold text-[#2d2016] uppercase tracking-wider underline underline-offset-4 decoration-[#c8956c] hover:text-[#c8956c] transition-colors"
              >
                Read More
              </a>
            </div>

            {/* Step 2 */}
            <div className="bg-[#fdf8f3] rounded-2xl p-6 border border-[#f0e6d8] text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-3">🫙</div>
              <h3
                className="text-base font-bold text-[#2d2016] mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                2. Small Batches
              </h3>
              <p className="text-xs text-[#5a4635]/70 leading-relaxed mb-3">
                Every product is made in small, careful batches to preserve
                taste, texture, and nutritional value.
              </p>
              <a
                href="#about"
                className="text-xs font-bold text-[#2d2016] uppercase tracking-wider underline underline-offset-4 decoration-[#c8956c] hover:text-[#c8956c] transition-colors"
              >
                Read More
              </a>
            </div>
          </div>

          {/* Center — Image */}
          <div className="flex items-center justify-center order-first md:order-0">
            <div className="relative w-full max-w-[350px] aspect-square">
              <Image
                src="/images/cookie-01.png"
                alt="Dilisshious handmade process"
                fill
                className="object-contain drop-shadow-2xl"
                sizes="350px"
              />
            </div>
          </div>

          {/* Right Column — Steps 3 & 4 */}
          <div className="flex flex-col gap-6">
            {/* Step 3 */}
            <div className="bg-[#fdf8f3] rounded-2xl p-6 border border-[#f0e6d8] text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-3">👩‍🍳</div>
              <h3
                className="text-base font-bold text-[#2d2016] mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                3. Handcrafted
              </h3>
              <p className="text-xs text-[#5a4635]/70 leading-relaxed mb-3">
                Made by hand with love, not machines. Every cookie, jar, and
                podi is crafted with personal attention.
              </p>
              <a
                href="#about"
                className="text-xs font-bold text-[#2d2016] uppercase tracking-wider underline underline-offset-4 decoration-[#c8956c] hover:text-[#c8956c] transition-colors"
              >
                Read More
              </a>
            </div>

            {/* Step 4 */}
            <div className="bg-[#fdf8f3] rounded-2xl p-6 border border-[#f0e6d8] text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-3">🚚</div>
              <h3
                className="text-base font-bold text-[#2d2016] mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                4. Delivered Fresh
              </h3>
              <p className="text-xs text-[#5a4635]/70 leading-relaxed mb-3">
                Delivered to your door on Wednesdays and Sundays in
                eco-friendly, food-safe packaging.
              </p>
              <a
                href="#about"
                className="text-xs font-bold text-[#2d2016] uppercase tracking-wider underline underline-offset-4 decoration-[#c8956c] hover:text-[#c8956c] transition-colors"
              >
                Read More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
