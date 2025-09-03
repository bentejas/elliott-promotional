// components/AnimatedRipple.tsx
import { motion } from "framer-motion";

export default function AnimatedRipple() {
  return (
    <div className="absolute top-0 left-2/5 h-full -translate-x-1/2 w-64">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Base wave pattern that flows downward */}
        <motion.path
          d="M50 0 C60 20, 40 40, 50 60 C60 80, 40 100, 50 120"
          stroke="#18181b"
          strokeWidth="20"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="1"
          animate={{
            // Simulate flowing by shifting the wave pattern downward
            y: [0, 10, 0],
            // Add subtle side-to-side movement while keeping it centered
            d: [
              "M50 0 C60 20, 40 40, 50 60 C60 80, 40 100, 50 120",
              "M50 0 C55 20, 45 40, 50 60 C55 80, 45 100, 50 120",
              "M50 0 C65 20, 35 40, 50 60 C65 80, 35 100, 50 120",
              "M50 0 C60 20, 40 40, 50 60 C60 80, 40 100, 50 120",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Overlapping wave for continuous flow effect */}
        <motion.path
          d="M50 -40 C60 -20, 40 0, 50 20 C60 40, 40 60, 50 80"
          stroke="#18181b"
          strokeWidth="20"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
          animate={{
            y: [0, 50, 0],
            d: [
              "M50 -40 C60 -20, 40 0, 50 20 C60 40, 40 60, 50 80",
              "M50 -40 C55 -20, 45 0, 50 20 C55 40, 45 60, 50 80",
              "M50 -40 C65 -20, 35 0, 50 20 C65 40, 35 60, 50 80",
              "M50 -40 C60 -20, 40 0, 50 20 C60 40, 40 60, 50 80",
            ],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
            delay: 2, // Offset for continuous flow
          }}
        />
      </svg>
    </div>
  );
}
