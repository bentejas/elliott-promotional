import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

export default function HeroSection() {
  // Animated text phrases for the hero
  const brandPhrases = [
    "Bring your\nbrand to life",
    "Lasting impressions,\ndelivered.",
    "Amplify your\nbrand.",
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  // Cycle through phrases every 5 seconds (unless the user prefers reduced motion)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % brandPhrases.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [brandPhrases.length]);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <img
        src="/images/background-image.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs"></div>

      {/* Content container */}
      <div className="relative z-10 h-full flex items-center -translate-y-10 md:-translate-y-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            {/* Animated heading */}
            <div className="h-[200px] flex items-center mb-14">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentPhraseIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="text-5xl md:text-7xl font-bold text-white whitespace-pre-line leading-tight"
                >
                  {brandPhrases[currentPhraseIndex]}
                </motion.h1>
              </AnimatePresence>
            </div>

            <p className="text-xl text-gray-100 mb-14 max-w-lg">
              Transform your marketing with premium promotional products that
              make lasting impressions and drive results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="group flex items-center space-x-6 bg-white rounded-full p-1 pl-6 w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
              >
                <span className="text-black text-2xl font-medium">
                  Explore Products
                </span>
                <span className="rounded-full aspect-square w-16 bg-black text-white flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                  <ArrowUpRight className="w-6 h-6" />
                </span>
              </Link>
              <Link
                to="/request-quote"
                className="group flex items-center space-x-6 bg-white/10 backdrop-blur rounded-full p-1 pl-6 w-fit border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
              >
                <span className="text-white text-2xl font-medium">
                  Get Quote
                </span>
                <span className="rounded-full aspect-square w-16 bg-white/20 text-white flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <ArrowUpRight className="w-6 h-6" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
