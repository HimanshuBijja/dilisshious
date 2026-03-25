import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)]">
      <Image
        src="/home/home_page_reference.jpeg"
        alt="Farm, Not Pharma — Dilisshious Pure Bakery. Purely organic, naturally yours."
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
    </section>
  );
}
