import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AboutSectionProps {
  animatedSections: { business: boolean };
}

// Client logos for carousel
const clientLogos = [
  { src: "/images/clients/toyota_logo.png", alt: "Toyota" },
  {
    src: "/images/clients/stratford_festival_logo.png",
    alt: "Stratford Festival",
  },
  { src: "/images/clients/elliott_motors_logo.png", alt: "Elliott Motors" },
  {
    src: "/images/clients/national_ballet.jpg",
    alt: "National Ballet of Canada",
  },
];

export default function AboutSection({ animatedSections }: AboutSectionProps) {
  const businessRef = useRef(null);

  return (
    <motion.section
      ref={businessRef}
      initial={{ opacity: 0, y: 50 }}
      animate={
        animatedSections.business ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
      }
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 text-white relative overflow-hidden"
      id="about-section"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={
              animatedSections.business
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Every business is{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              unique
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={
              animatedSections.business
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            And you deserve to tell your story your way.
          </motion.p>
        </div>

        {/* Stats/Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={
              animatedSections.business
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-red-400 mb-2">27+</div>
            <div className="text-lg text-gray-300">Years of Experience</div>
            <div className="text-sm text-gray-400 mt-2">
              Helping businesses promote their brand with quality promotional
              products
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={
              animatedSections.business
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-red-400 mb-2">🍁</div>
            <div className="text-lg text-gray-300">Proudly Canadian</div>
            <div className="text-sm text-gray-400 mt-2">
              Family-run and committed to sourcing locally when we can
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={
              animatedSections.business
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-red-400 mb-2">200+</div>
            <div className="text-lg text-gray-300">Happy Clients</div>
            <div className="text-sm text-gray-400 mt-2">
              Located in the London-Kitchener area, serving businesses
              nationwide
            </div>
          </motion.div>
        </div>

        {/* Client Showcase - Smooth Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={
            animatedSections.business
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 30 }
          }
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center"
        >
          <h3 className="text-2xl font-semibold mb-12 text-gray-300">
            Trusted by leading brands
          </h3>

          {/* Smooth scrolling carousel */}
          <div className="relative overflow-hidden">
            <div
              className="flex space-x-16 w-max"
              style={{
                animation: "scroll-rtl 20s linear infinite",
              }}
            >
              {/* Duplicate the logos for seamless loop */}
              {[...clientLogos, ...clientLogos].map((logo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center h-16 w-32 flex-shrink-0"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="max-w-full max-h-full object-contain filter grayscale invert opacity-70 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Add the keyframes animation to the page */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
                @keyframes scroll-rtl {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
              `,
            }}
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
