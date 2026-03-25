import { Star } from "lucide-react";

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

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-20 sm:py-28 px-4 bg-white overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c8956c]/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold text-[#c8956c] uppercase tracking-[0.25em] mb-4">
            What People Say
          </span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#2d2016] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Real Love, Real Words
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-[#c8956c]/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8956c]" />
            <span className="h-px w-12 bg-[#c8956c]/40" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`relative bg-[#fdf8f3] rounded-2xl p-6 sm:p-8 border border-[#f0e6d8] hover:shadow-lg hover:shadow-[#c8956c]/5 transition-all duration-500 ${
                i === 1 ? "md:-translate-y-4" : ""
              }`}
            >
              {/* Decorative quote */}
              <span
                className="absolute top-4 right-5 text-6xl sm:text-7xl text-[#c8956c]/10 leading-none select-none pointer-events-none"
                style={{ fontFamily: "var(--font-heading)" }}
                aria-hidden="true"
              >
                &ldquo;
              </span>

              <div className="relative">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      size={14}
                      className="fill-[#c8956c] text-[#c8956c]"
                    />
                  ))}
                </div>
                <p className="text-[#5a4635] leading-relaxed mb-6 text-sm sm:text-[15px]">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#f0e6d8]">
                  <div className="w-10 h-10 rounded-full bg-[#c8956c]/15 flex items-center justify-center text-[#c8956c] font-semibold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2d2016]">
                      {t.name}
                    </p>
                    <p className="text-xs text-[#5a4635]/50">{t.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
