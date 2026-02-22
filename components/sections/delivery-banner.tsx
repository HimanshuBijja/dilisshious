export default function DeliveryBanner() {
  return (
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
  );
}
