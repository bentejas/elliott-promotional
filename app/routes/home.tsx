// routes/home.tsx
import type { Route } from "./+types/home";
import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import { Header, Footer } from "~/components/layout";
import { getCartCount } from "~/utils/cart";

// Section components
import {
  HeroSection,
  ProductCategoriesSection,
  AboutSection,
  FAQSection,
  ContactSection,
} from "~/components/sections";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Elliott Promotional Products" },
    { name: "description", content: "Bring your brand to life." },
  ];
}

export default function Home() {
  // Refs for scroll animations
  const productsRef = useRef(null);
  const businessRef = useRef(null);
  const faqRef = useRef(null);
  const contactRef = useRef(null);

  // State to track which animations have been triggered
  const [animatedSections, setAnimatedSections] = useState({
    products: false,
    business: false,
    faq: false,
    contact: false,
  });

  // Cart state
  const [cartCount, setCartCount] = useState(0);

  // Update cart count on mount and when cart changes
  useEffect(() => {
    setCartCount(getCartCount());

    // Listen for storage events (cart updates from other tabs/windows)
    const handleStorageChange = () => {
      setCartCount(getCartCount());
    };

    window.addEventListener("storage", handleStorageChange);

    // Custom event for cart updates within the same tab
    const handleCartUpdate = () => {
      setCartCount(getCartCount());
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

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
      setAnimatedSections((prev) => ({ ...prev, business: true }));
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

  const scrollToContact = () => {
    const targetElement = document.getElementById("contact-section");
    if (targetElement) {
      const startPosition = window.pageYOffset;
      const targetPosition = targetElement.offsetTop;
      const distance = targetPosition - startPosition;
      const duration = 1500; // 1.5 seconds for smooth animation
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
        cartCount={cartCount}
      />

      {/* Hero Section */}
      <HeroSection
        onContactClick={scrollToContact}
        scrollToContact={scrollToContact}
      />

      {/* Product Categories */}
      <div ref={productsRef}>
        <ProductCategoriesSection animatedSections={animatedSections} />
      </div>

      {/* About Section */}
      <div ref={businessRef}>
        <AboutSection animatedSections={animatedSections} />
      </div>

      {/* FAQ */}
      <div ref={faqRef}>
        <FAQSection animatedSections={animatedSections} />
      </div>

      {/* Contact */}
      <div ref={contactRef}>
        <ContactSection animatedSections={animatedSections} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
