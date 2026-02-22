"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getProductBySlug } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Minus,
  Plus,
  ShoppingCart,
  ChevronRight,
  ChevronDown,
  Truck,
  Heart as HeartIcon,
  BadgePercent,
  X,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import Link from "next/link";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = getProductBySlug(slug);
  const { addToCart } = useCart();

  const [selectedVolume, setSelectedVolume] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] flex items-center justify-center pt-20">
        <div className="text-center">
          <h1
            className="text-2xl font-bold text-[#2d2016] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Product not found
          </h1>
          <Link href="/" className="text-[#c8956c] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentVolume = product.volumes[selectedVolume];

  const handleAddToCart = () => {
    addToCart({
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: currentVolume.price,
      originalPrice: currentVolume.originalPrice,
      volume: currentVolume.label,
      quantity,
    });
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] pt-20 sm:pt-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-[#c8956c] transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link
            href="/#products"
            className="hover:text-[#c8956c] transition-colors"
          >
            Shop
          </Link>
          <ChevronRight size={14} />
          <span className="text-[#2d2016] font-medium">{product.name}</span>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left — Image */}
          <div className="relative">
            <div className="sticky top-28 aspect-square rounded-3xl overflow-hidden bg-white border border-[#f0e6d8] shadow-sm">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {product.tags && product.tags.length > 0 && (
                <div className="absolute top-4 left-4 flex gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-[#c8956c] text-white shadow-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — Details */}
          <div className="flex flex-col">
            {/* Category */}
            <span className="text-xs font-semibold text-[#c8956c] uppercase tracking-[0.15em] mb-2">
              {product.category}
            </span>

            {/* Name */}
            <h1
              className="text-3xl sm:text-4xl font-bold text-[#2d2016] mb-2 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {product.name}
            </h1>

            {/* Tagline */}
            <p className="text-sm text-[#5a4635]/70 italic mb-6">
              {product.tagline}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-[#2d2016]">
                ₹{currentVolume.price}
              </span>
              {currentVolume.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ₹{currentVolume.originalPrice}
                </span>
              )}
              {currentVolume.originalPrice && (
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  Save ₹{currentVolume.originalPrice - currentVolume.price}
                </span>
              )}
            </div>

            {/* Volume Selection */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-[#2d2016] mb-3 block">
                Volume
              </label>
              <div className="flex gap-3">
                {product.volumes.map((vol, i) => (
                  <button
                    key={vol.label}
                    onClick={() => setSelectedVolume(i)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                      selectedVolume === i ?
                        "border-[#c8956c] bg-[#c8956c]/5 text-[#c8956c]"
                      : "border-gray-200 text-gray-500 hover:border-[#c8956c]/40"
                    }`}
                  >
                    {vol.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2.5 text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2.5 font-semibold text-[#2d2016] min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2.5 text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button className="p-3 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:text-red-400 transition-colors text-gray-400">
                  <HeartIcon size={18} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full sm:w-auto sm:flex-1 px-6 py-3 bg-[#2d2016] text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-[#1a120d] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </div>

            {/* Description Drawer */}
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <button className="flex items-center justify-between w-full py-4 text-left border-t border-gray-200 hover:text-[#c8956c] transition-colors group">
                  <span className="text-sm font-semibold text-[#2d2016] group-hover:text-[#c8956c] transition-colors">
                    Description
                  </span>
                  <ChevronRight
                    size={16}
                    className="text-gray-400 group-hover:text-[#c8956c] transition-colors"
                  />
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Description</DrawerTitle>
                  <DrawerClose asChild>
                    <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                      <X size={18} className="text-gray-500" />
                    </button>
                  </DrawerClose>
                </DrawerHeader>
                <DrawerDescription className="sr-only">
                  Product description for {product.name}
                </DrawerDescription>
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  {/* Product Image in Drawer */}
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 bg-[#fdf8f3]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                  </div>

                  <p className="text-sm text-[#5a4635] leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Collapsible Sections */}
                  <div className="border-t border-gray-200">
                    {/* Ingredients */}
                    <button
                      onClick={() => toggleSection("ingredients")}
                      className="flex items-center justify-between w-full py-3.5 text-left group"
                    >
                      <span className="text-sm font-semibold text-[#2d2016]">
                        Ingredients
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-200 ${
                          openSections.ingredients ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openSections.ingredients ? "max-h-96 pb-4" : "max-h-0"
                      }`}
                    >
                      <table className="w-full text-sm border border-[#f0e6d8] rounded-lg overflow-hidden">
                        <thead>
                          <tr className="bg-[#f5ede3]">
                            <th className="text-left py-2 px-3 text-xs font-semibold text-[#2d2016] uppercase tracking-wider">
                              #
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-[#2d2016] uppercase tracking-wider">
                              Ingredient
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.ingredients.split(",").map((item, idx) => (
                            <tr
                              key={idx}
                              className={
                                idx % 2 === 0 ? "bg-white" : "bg-[#fdf8f3]"
                              }
                            >
                              <td className="py-2 px-3 text-[#5a4635]/60 font-medium">
                                {idx + 1}
                              </td>
                              <td className="py-2 px-3 text-[#5a4635]">
                                {item.trim()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="border-t border-gray-200" />

                    {/* How to Enjoy */}
                    <button
                      onClick={() => toggleSection("howToEnjoy")}
                      className="flex items-center justify-between w-full py-3.5 text-left group"
                    >
                      <span className="text-sm font-semibold text-[#2d2016]">
                        How to Enjoy
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-200 ${
                          openSections.howToEnjoy ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openSections.howToEnjoy ? "max-h-40 pb-4" : "max-h-0"
                      }`}
                    >
                      <p className="text-sm text-[#5a4635]/80 leading-relaxed">
                        {product.howToEnjoy}
                      </p>
                    </div>
                    <div className="border-t border-gray-200" />

                    {/* Storage */}
                    <button
                      onClick={() => toggleSection("storage")}
                      className="flex items-center justify-between w-full py-3.5 text-left group"
                    >
                      <span className="text-sm font-semibold text-[#2d2016]">
                        Storage
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-200 ${
                          openSections.storage ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openSections.storage ? "max-h-40 pb-4" : "max-h-0"
                      }`}
                    >
                      <p className="text-sm text-[#5a4635]/80 leading-relaxed">
                        {product.storage}
                      </p>
                    </div>
                    <div className="border-t border-gray-200" />

                    {/* Best Before */}
                    <button
                      onClick={() => toggleSection("bestBefore")}
                      className="flex items-center justify-between w-full py-3.5 text-left group"
                    >
                      <span className="text-sm font-semibold text-[#2d2016]">
                        Best Before
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-200 ${
                          openSections.bestBefore ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openSections.bestBefore ? "max-h-40 pb-4" : "max-h-0"
                      }`}
                    >
                      <p className="text-sm text-[#5a4635]/80 leading-relaxed">
                        {product.bestBefore}
                      </p>
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>

            {/* Delivery Details Drawer */}
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <button className="flex items-center justify-between w-full py-4 text-left border-t border-b border-gray-200 hover:text-[#c8956c] transition-colors group">
                  <span className="text-sm font-semibold text-[#2d2016] group-hover:text-[#c8956c] transition-colors">
                    Delivery Details
                  </span>
                  <ChevronRight
                    size={16}
                    className="text-gray-400 group-hover:text-[#c8956c] transition-colors"
                  />
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Delivery Details</DrawerTitle>
                  <DrawerClose asChild>
                    <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                      <X size={18} className="text-gray-500" />
                    </button>
                  </DrawerClose>
                </DrawerHeader>
                <DrawerDescription className="sr-only">
                  Delivery details for {product.name}
                </DrawerDescription>
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <p className="text-sm text-[#5a4635] leading-relaxed mb-6">
                    {product.deliveryDetails}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-[#fdf8f3] border border-[#f0e6d8]">
                      <Truck
                        size={20}
                        className="text-[#c8956c] mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#2d2016]">
                          Delivery Schedule
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          We deliver on Wednesdays and Sundays. Orders placed
                          before 8 PM the previous day will be delivered on the
                          next delivery day.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-[#fdf8f3] border border-[#f0e6d8]">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-[#c8956c] mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-[#2d2016]">
                          Safe Packaging
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          All items are carefully packed in food-grade,
                          eco-friendly packaging to ensure freshness.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-[#fdf8f3] border border-[#f0e6d8]">
                      <BadgePercent
                        size={20}
                        className="text-[#c8956c] mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#2d2016]">
                          Free Delivery
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Free delivery on all orders above ₹500.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>

            {/* Info Grid */}
            <div className="pt-6 mt-2">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-4 rounded-xl bg-white border border-[#f0e6d8]">
                  <Truck size={22} className="mx-auto text-[#c8956c] mb-2" />
                  <p className="text-xs font-semibold text-[#2d2016] leading-tight">
                    Free Delivery
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    On orders above ₹500
                  </p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white border border-[#f0e6d8]">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[22px] h-[22px] mx-auto text-[#c8956c] mb-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  <p className="text-xs font-semibold text-[#2d2016] leading-tight">
                    Homemade
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    High quality products
                  </p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white border border-[#f0e6d8]">
                  <BadgePercent
                    size={22}
                    className="mx-auto text-[#c8956c] mb-2"
                  />
                  <p className="text-xs font-semibold text-[#2d2016] leading-tight">
                    10% Extra Off
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    On large orders
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-3 mt-8 pt-6 border-t border-gray-200">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border-2 border-[#c8956c]/30 flex items-center justify-center text-[#c8956c] hover:bg-[#c8956c] hover:text-white hover:border-[#c8956c] transition-all duration-300"
              >
                <Instagram size={15} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border-2 border-[#c8956c]/30 flex items-center justify-center text-[#c8956c] hover:bg-[#c8956c] hover:text-white hover:border-[#c8956c] transition-all duration-300"
              >
                <Facebook size={15} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border-2 border-[#c8956c]/30 flex items-center justify-center text-[#c8956c] hover:bg-[#c8956c] hover:text-white hover:border-[#c8956c] transition-all duration-300"
              >
                <Twitter size={15} />
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border-2 border-[#c8956c]/30 flex items-center justify-center text-[#c8956c] hover:bg-[#c8956c] hover:text-white hover:border-[#c8956c] transition-all duration-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="15"
                  height="15"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
