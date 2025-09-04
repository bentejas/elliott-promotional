// routes/home.tsx
import type { Route } from "./+types/home";
// Layout components
import { Layout } from "~/components/layout/Layout";
import { Navbar } from "~/components/layout/Navbar";

// UI components
import { ArrowUpRight, Search, ShoppingBag } from "lucide-react";
import { BlackCallout, AnimatedRipple, ProductTile } from "~/components/ui";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Header } from "~/components/layout/Header";

// Section components
import { FAQAccordion } from "~/components/sections";

// Form components
import { ContactForm, CompanyDetails } from "~/components/forms";

// Data
import { faqItems } from "~/types/faq";
import { productCategories } from "~/types/products";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Elliott Promotional Products" },
    { name: "description", content: "Bring your brand to life." },
  ];
}

export default function Home() {
  // Refs for scroll animations
  const heroRef = useRef(null);
  const productsRef = useRef(null);
  const businessRef = useRef(null);
  const faqRef = useRef(null);
  const contactRef = useRef(null);

  // State to track which animations have been triggered
  const [animatedSections, setAnimatedSections] = useState({
    products: false,
    business: false,
    businessImages: false,
    faq: false,
    contact: false,
  });

  // Animated text phrases for the hero
  const brandPhrases = [
    "Bring your\nbrand to life",
    "Lasting impressions,\ndelivered.",
    "Amplify your\nbrand.",
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

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

  // Cycle through phrases every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % brandPhrases.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [brandPhrases.length]);

  // In view states
  const productsInView = useInView(productsRef, { once: false });
  const businessInView = useInView(businessRef, { once: false });
  const faqInView = useInView(faqRef, { once: false });
  const contactInView = useInView(contactRef, { once: false });

  // Effect to track when sections come into view for the first time
  useEffect(() => {
    if (productsInView && !animatedSections.products) {
      setAnimatedSections((prev) => ({ ...prev, products: true }));
    }
  }, [productsInView, animatedSections.products]);

  useEffect(() => {
    if (businessInView && !animatedSections.business) {
      setAnimatedSections((prev) => ({
        ...prev,
        business: true,
        businessImages: true,
      }));
    }
  }, [businessInView, animatedSections.business]);

  useEffect(() => {
    if (faqInView && !animatedSections.faq) {
      setAnimatedSections((prev) => ({ ...prev, faq: true }));
    }
  }, [faqInView, animatedSections.faq]);

  useEffect(() => {
    if (contactInView && !animatedSections.contact) {
      setAnimatedSections((prev) => ({ ...prev, contact: true }));
    }
  }, [contactInView, animatedSections.contact]);

  // Slower scroll animation function
  const scrollToContact = () => {
    const targetElement = document.getElementById("contact-section");
    if (targetElement) {
      const startPosition = window.pageYOffset;
      const targetPosition = targetElement.offsetTop;
      const distance = targetPosition - startPosition;
      const duration = 1500; // 2 seconds for slower animation
      let start: any = null;

      function animation(currentTime: any) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);

        // Smooth easing function (ease-in-out)
        const ease =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }
      requestAnimationFrame(animation);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header
        onAboutClick={() =>
          document
            .getElementById("about-section")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        onContactClick={scrollToContact}
      />

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <img
          src="/images/background-image.png"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs"></div>

        {/* Content container */}
        <div className="relative z-10 h-full flex items-center -translate-y-20">
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
                <div className="flex items-center space-x-6 bg-white rounded-full p-1 pl-6 w-fit">
                  <h3 className="text-black text-2xl font-medium">
                    Explore Products
                  </h3>
                  <a
                    href="/products"
                    className="rounded-full aspect-square w-16 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                  >
                    <ArrowUpRight className="w-6 h-6" />
                  </a>
                </div>
                <div className="flex items-center space-x-6 bg-white/10 backdrop-blur rounded-full p-1 pl-6 w-fit border border-white/20">
                  <h3 className="text-white text-2xl font-medium">Get Quote</h3>
                  <button
                    onClick={scrollToContact}
                    className="rounded-full aspect-square w-16 bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <ArrowUpRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <motion.section
        ref={productsRef}
        initial={{ opacity: 0, y: 50 }}
        animate={
          animatedSections.products
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 50 }
        }
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="py-20 relative overflow-hidden bg-gradient-to-t from-gray-100 to-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ">
          {/* <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={
                animatedSections.products
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl font-bold mb-4"
            >
              Product Categories
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={
                animatedSections.products
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 15 }
              }
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Discover our comprehensive range of promotional products designed
              to elevate your brand
            </motion.p>
          </div> */}

          <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={
                animatedSections.faq
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl font-bold mb-4 w-full text-center"
            >
              Product Categories
            </motion.h2>
            <div className="w-full grid grid-cols-4 gap-y-8">
              {productCategories.map((category) => (
                <ProductTile key={category.id} {...category} />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* About Section - Redesigned */}
      <motion.section
        ref={businessRef}
        initial={{ opacity: 0, y: 50 }}
        animate={
          animatedSections.business
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 50 }
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

      {/* FAQ */}
      <motion.section
        ref={faqRef}
        initial={{ opacity: 0, y: 50 }}
        animate={
          animatedSections.faq ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
        }
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="py-20 relative overflow-hidden bg-background"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={
                animatedSections.faq
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl font-bold mb-4"
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={
                animatedSections.faq
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 15 }
              }
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600"
            >
              Get answers to common questions about our promotional products and
              services
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={
              animatedSections.faq
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <FAQAccordion items={faqItems} />
          </motion.div>
        </div>
      </motion.section>

      {/* Contact */}
      <motion.section
        ref={contactRef}
        initial={{ opacity: 0, y: 50 }}
        animate={
          animatedSections.contact
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 50 }
        }
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="py-20 bg-gradient-to-br from-red-900 via-gray-800 to-gray-900 text-white relative overflow-hidden"
        id="contact-section"
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={
                animatedSections.contact
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl font-bold mb-4"
            >
              Start Your Project
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={
                animatedSections.contact
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 15 }
              }
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-background"
            >
              Ready to bring your brand to life? Let's discuss your promotional
              product needs.
            </motion.p>
          </div>

          {/* Centered Contact Form with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={
              animatedSections.contact
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-background p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <ContactForm />
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-background border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Company Details */}
            <div>
              <CompanyDetails />
            </div>

            {/* Logo and Copyright */}
            <div className="text-center lg:text-right">
              <div className="mb-8">
                <img
                  src="/images/epp-logo-horizontal.png"
                  alt="Elliott Promotional Products"
                  className="h-16 mx-auto lg:ml-auto lg:mr-0"
                />
              </div>
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Elliott Promotional Products. All
                rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
