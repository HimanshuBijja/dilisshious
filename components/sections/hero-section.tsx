"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] overflow-hidden">
      {/* Background Image */}
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
