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
  );
}
