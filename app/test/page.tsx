import Image from "next/image";
import { Cookie, Leaf, Star } from "lucide-react";

export default function AboutSection() {
  // Change this one value to recolor the entire shape
  const SHAPE_COLOR = "#C23737"; // Tailwind red-400

  return (
    <section className="py-20 sm:py-28 px-4 bg-[#fdf8f3]">
      <div className="relative w-fit">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 200 200"
          width="400"
          height="400"
        >
          <g clipPath="url(#cs_clip_1_star-11)">
            <mask
              id="cs_mask_1_star-11"
              style={{ maskType: "alpha" as const }}
              width="200"
              height="200"
              x="0"
              y="0"
              maskUnits="userSpaceOnUse"
            >
              <path
                fill="#fff"
                d="M100 0c7.13 31.563 43.35 46.567 70.711 29.29C153.433 56.65 168.437 92.87 200 100c-31.563 7.13-46.567 43.35-29.289 70.711C143.35 153.433 107.13 168.437 100 200c-7.13-31.563-43.35-46.567-70.71-29.289C46.566 143.35 31.562 107.13 0 100c31.563-7.13 46.567-43.35 29.29-70.71C56.65 46.566 92.87 31.562 100 0z"
              ></path>
            </mask>
            <g mask="url(#cs_mask_1_star-11)">
              <path fill={SHAPE_COLOR} d="M200 0H0v200h200V0z"></path>
            </g>
          </g>
          <defs>
            <filter
              id="filter0_f_748_4294"
              width="338"
              height="327"
              x="-88"
              y="-51"
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              ></feBlend>
              <feGaussianBlur
                result="effect1_foregroundBlur_748_4294"
                stdDeviation="30"
              ></feGaussianBlur>
            </filter>
            <linearGradient
              id="paint0_linear_748_4294"
              x1="200"
              x2="0"
              y1="0"
              y2="200"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF1F00"></stop>
              <stop offset="1" stopColor="#FFD600"></stop>
            </linearGradient>
            <clipPath id="cs_clip_1_star-11">
              <path fill="#fff" d="M0 0H200V200H0z"></path>
            </clipPath>
          </defs>
          <g style={{ mixBlendMode: "overlay" }} mask="url(#cs_mask_1_star-11)">
            <path
              fill="gray"
              stroke="transparent"
              d="M200 0H0v200h200V0z"
              filter="url(#cs_noise_1_star-11)"
            ></path>
          </g>
          <defs>
            <filter
              id="cs_noise_1_star-11"
              width="100%"
              height="100%"
              x="0%"
              y="0%"
              filterUnits="objectBoundingBox"
            >
              <feTurbulence
                baseFrequency="0.6"
                numOctaves="5"
                result="out1"
                seed="4"
              ></feTurbulence>
              <feComposite
                in="out1"
                in2="SourceGraphic"
                operator="in"
                result="out2"
              ></feComposite>
              <feBlend
                in="SourceGraphic"
                in2="out2"
                mode="overlay"
                result="out3"
              ></feBlend>
            </filter>
          </defs>
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-4xl font-bold text-white">HOT</h1>
        </div>
      </div>

      <img className="" src="/shapes/cs_star.svg" alt="" />
    </section>
  );
}
