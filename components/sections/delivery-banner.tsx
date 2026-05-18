export default function DeliveryBanner() {
  const messages = [
    { text: "Delivering on Wednesdays & Sundays across Hyderabad", accent: "✦" },
    { text: "First order? Use code FIRST10 for 10% off",           accent: "◆" },
    { text: "Small-batch · Handcrafted · No preservatives",        accent: "✦" },
    { text: "Free shipping on all subscription bundles",           accent: "◆" },
    { text: "Freshly made — every single week",                    accent: "✦" },
  ];

  // Triple-repeat for a seamless infinite loop
  const items = [...messages, ...messages, ...messages, ...messages];

  return (
    <div className="relative mt-16 sm:mt-20" aria-label="Delivery information">
      {/* Top micro-rule in gold */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c8956c]/35 to-transparent" />

      {/* Banner body */}
      <div
        className="relative overflow-hidden bg-[#2d2016] py-3"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse at 15% 50%, rgba(200,149,108,0.09) 0%, transparent 55%)",
            "radial-gradient(ellipse at 85% 50%, rgba(200,149,108,0.06) 0%, transparent 55%)",
            /* subtle diagonal texture */
            "repeating-linear-gradient(135deg, rgba(200,149,108,0.015) 0, rgba(200,149,108,0.015) 1px, transparent 0, transparent 12px)",
          ].join(", "),
        }}
      >
        {/* Left edge fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #2d2016 10%, transparent)" }}
        />
        {/* Right edge fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #2d2016 10%, transparent)" }}
        />

        {/* Scrolling ticker */}
        <div className="animate-marquee flex items-center whitespace-nowrap will-change-transform">
          {items.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-2">
              {/* Ornate divider */}
              <span className="flex items-center gap-1.5 flex-shrink-0">
                <span className="w-4 h-px bg-[#c8956c]/30" />
                <span className="text-[9px] text-[#c8956c]/55 leading-none">{item.accent}</span>
                <span className="w-4 h-px bg-[#c8956c]/30" />
              </span>

              {/* Message text */}
              <span className="text-[11px] sm:text-xs font-medium text-[#e8d5c0]/85 uppercase tracking-[0.2em]">
                {item.text}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Bottom micro-rule */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c8956c]/20 to-transparent" />
    </div>
  );
}
