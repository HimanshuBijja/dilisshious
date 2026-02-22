"use client";

import { motion } from "framer-motion";

interface RotatingStarBadgeProps {
  text: string;
  color?: string;
  size?: number;
  textClassName?: string;
}

export default function RotatingStarBadge({
  text,
  color = "#C23737",
  size = 80,
  textClassName = "text-xs font-bold text-white uppercase tracking-wider",
}: RotatingStarBadgeProps) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Rotating SVG Star */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 200 200"
        width={size}
        height={size}
        animate={{ rotate: -360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
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
            />
          </mask>
          <g mask="url(#cs_mask_1_star-11)">
            <path fill={color} d="M200 0H0v200h200V0z" />
          </g>
        </g>
        <defs>
          <clipPath id="cs_clip_1_star-11">
            <path fill="#fff" d="M0 0H200V200H0z" />
          </clipPath>
        </defs>
      </motion.svg>

      {/* Centered Text (does NOT rotate) */}
      <div className="absolute inset-0 flex items-center justify-center mb-1 ">
        <span className="-rotate-30">
          <span className={textClassName}>{text}</span>
        </span>
      </div>
    </div>
  );
}
