// routes/home.tsx
import type { Route } from "./+types/home";
// Layout components
import { Layout } from "~/components/layout/Layout";
import { Navbar } from "~/components/layout/Navbar";

// UI components
import { ArrowUpRight, CornerRightDown } from "lucide-react";
import { BlackCallout, AnimatedRipple, ProductTile } from "~/components/ui";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

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
    <div className="flex min-h-screen flex-col gap-6 md:gap-8 px-8 pt-6">
      <Navbar />

      {/* HERO: same rounded-3xl section, but with background image */}
      <Layout className="relative flex w-full h-[96vh] overflow-hidden !p-0">
        {/* Left White Panel */}
        <div className="flex flex-col justify-evenly z-10 w-2/5 bg-zinc-900 p-12 pl-36">
          <div className="flex flex-col space-y-8">
            <h2 className="text-white text-8xl leading-30 font-normal">
              Bring your <br />
              brand to life
            </h2>
            <div className="w-20 bg-red-400 h-2 mb-12"></div>
            <div className="flex flex-row justify-between items-center space-x-6 bg-white rounded-full p-1 pl-3 w-fit">
              <h3 className="text-black text-3xl ml-4 tracking-tight">
                Explore Products
              </h3>
              <a
                href=""
                className="rounded-full aspect-square w-20 bg-black text-white flex items-center justify-center"
              >
                <ArrowUpRight className="w-8 h-8" />
              </a>
            </div>
          </div>

          {/** Contact Bubble */}
          <div className="relative">
            <button
              onClick={scrollToContact}
              className="absolute bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center h-48 w-48 border border-white/50 hover:bg-white/10 transition-all duration-300 group"
            >
              <span className="text-white text-2xl font-light group-hover:scale-105 transition-transform duration-300">
                Contact
              </span>
            </button>
            <button
              onClick={scrollToContact}
              className="absolute bg-white/5 backdrop-blur-md rounded-full aspect-square flex items-center justify-center h-48 w-48 translate-x-7/8 border border-white/50 hover:bg-white/10 transition-all duration-300 group"
            >
              <CornerRightDown
                className="w-12 h-12 text-white group-hover:scale-110 group-hover:translate-y-1 transition-all duration-300"
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>

        {/* Right Hero Image */}
        <div className="w-3/5 relative">
          <img
            src="/images/background-image.png"
            alt="Hero"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Animated Ripple Divider */}
        <AnimatedRipple />
      </Layout>

      {/* Product Categories (dark section) */}
      <motion.div
        ref={productsRef}
        initial={{ opacity: 0, y: 100 }}
        animate={
          animatedSections.products
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 100 }
        }
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Layout className="bg-zinc-900 text-white">
          {/* category tiles */}
          <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
            <h2 className="text-white text-6xl font-normal py-4">
              Product Categories
            </h2>
            <div className="w-full grid grid-cols-4 gap-y-8">
              {productCategories.map((category) => (
                <ProductTile key={category.id} {...category} />
              ))}
            </div>
          </div>
        </Layout>
      </motion.div>

      {/* "Every business is unique" section */}
      <motion.div
        ref={businessRef}
        initial={{ opacity: 0, y: 100 }}
        animate={
          animatedSections.business
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 100 }
        }
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <Layout className="bg-[#F0F0F0] flex flex-col justify-center items-center">
          {/* cards & brand logos per mock */}
          <div className="flex flex-col justify-center items-center py-10 pt-4 w-full max-w-5xl space-y-2">
            <h2 className="text-black text-6xl font-normal text-left w-full">
              Every business is unique
            </h2>
            <p className="text-black text-2xl font-light text-right w-full">
              And you deserve to tell your story{" "}
              <span className="font-bold">your way.</span>
            </p>

            <div className="flex flex-col justify-center items-start w-full mt-6">
              <BlackCallout>
                <p className="text-xl">
                  We've been helping businesses promote their brand with{" "}
                  <span className="underline">quality</span> promotional
                  products for over 25 years.
                </p>
              </BlackCallout>
            </div>

            <div className="flex flex-col justify-center items-end w-full mt-6">
              <BlackCallout>
                <p className="text-xl">
                  Proudly Canadian, family-run and committed to sourcing locally
                  when we can.
                </p>
              </BlackCallout>
            </div>

            <div className="flex flex-col justify-center items-start w-full mt-6">
              <BlackCallout>
                <p className="text-xl">
                  Located in the London-Kitchener area, these are some of the
                  brands we've helped...
                </p>
              </BlackCallout>
            </div>

            {/* Brand Images */}
            <div className="w-full mt-12 relative min-h-[1000px]">
              {/* Stratford Festival - Top Left */}
              <motion.div
                className="absolute top-0 left-0 max-w-lg"
                initial={{ opacity: 0, x: -100, rotate: -5 }}
                animate={
                  animatedSections.businessImages
                    ? { opacity: 1, x: 0, rotate: 0 }
                    : { opacity: 0, x: -100, rotate: -5 }
                }
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
              >
                <img
                  src="/images/stratford-festival.png"
                  alt="Stratford Festival"
                  className="w-full h-auto object-contain"
                />
              </motion.div>

              {/* Toyota - Top Right */}
              <motion.div
                className="absolute top-52 right-0 max-w-md"
                initial={{ opacity: 0, x: 100, rotate: 5 }}
                animate={
                  animatedSections.businessImages
                    ? { opacity: 1, x: 0, rotate: 0 }
                    : { opacity: 0, x: 100, rotate: 5 }
                }
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
              >
                <img
                  src="/images/toyota.png"
                  alt="Toyota"
                  className="w-full h-auto object-contain"
                />
              </motion.div>

              {/* Jellystone Parks - Bottom Center-Left */}
              <motion.div
                className="absolute bottom-10 left-20 max-w-md"
                initial={{ opacity: 0, y: 100, rotate: -3 }}
                animate={
                  animatedSections.businessImages
                    ? { opacity: 1, y: 0, rotate: 0 }
                    : { opacity: 0, y: 100, rotate: -3 }
                }
                transition={{ duration: 0.8, ease: "easeOut", delay: 1.0 }}
              >
                <img
                  src="/images/jellystone.png"
                  alt="Jellystone Parks"
                  className="w-full h-auto object-contain"
                />
              </motion.div>
            </div>
          </div>
        </Layout>
      </motion.div>

      {/* FAQ */}
      <motion.div
        ref={faqRef}
        initial={{ opacity: 0, y: 100 }}
        animate={
          animatedSections.faq ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }
        }
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Layout className="bg-[#F0F0F0]">
          <div className="max-w-5xl mx-auto py-12 pt-4">
            <div className="text-right mb-12">
              <h2 className="text-6xl font-normal text-gray-900">
                Frequently Asked Questions
              </h2>
            </div>
            <FAQAccordion items={faqItems} />
          </div>
        </Layout>
      </motion.div>

      {/* Contact */}
      <motion.div
        ref={contactRef}
        initial={{ opacity: 0, y: 100 }}
        animate={
          animatedSections.contact
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 100 }
        }
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Layout className="bg-gray-50" id="contact-section">
          <div className="max-w-5xl mx-auto py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-start">
              {/* Contact Form */}
              <div>
                <ContactForm />
              </div>

              {/* Company Details */}
              <div className="flex justify-end">
                <CompanyDetails />
              </div>
            </div>

            {/* Large Elliott Logo */}
            <div className="mt-10 flex justify-center">
              <img
                src="/images/epp-logo-stacked.png"
                alt="Elliott Logo"
                className="w-48"
              />
            </div>

            {/* Copyright */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Elliott Promotional Products. All
                rights reserved.
              </p>
            </div>
          </div>
        </Layout>
      </motion.div>
    </div>
  );
}
