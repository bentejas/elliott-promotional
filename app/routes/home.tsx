// routes/home.tsx
import type { Route } from "./+types/home";
import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import { Header, Footer } from "~/components/layout";
import type { ActionFunctionArgs } from "react-router";
import { isbot } from "isbot";
import { sendContactSubmissionEmail } from "~/utils/ses.server";
import {
  buildRateKey,
  getClientIp,
  isLikelyBadOrigin,
  rateLimit,
} from "~/utils/rateLimit.server";
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
  const description =
    "Premium promotional products that bring your brand to life. Apparel, drinkware, bags, and more — proudly Canadian, serving businesses nationwide.";
  return [
    { title: "Elliott Promotional Products" },
    { name: "description", content: description },
    { property: "og:title", content: "Elliott Promotional Products" },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ];
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const userAgent = request.headers.get("user-agent") || "";
  const formData = await request.formData();
  const formName = String(formData.get("formName") || "unknown");

  const isBot = (isbot as unknown as (ua: string) => boolean)(userAgent);
  if (isBot) {
    return Response.json(
      {
        error:
          "We couldn't process your submission. Please try again, or contact us directly.",
      },
      { status: 400 }
    );
  }
  if (isLikelyBadOrigin(request)) {
    return Response.json(
      {
        error:
          "We couldn't process your submission. Please refresh the page and try again.",
      },
      { status: 400 }
    );
  }

  const ip = getClientIp(request);
  const key = buildRateKey(["contact", formName, ip]);
  const rl = rateLimit(key, { windowMs: 60_000, max: 5 });
  if (!rl.allowed) {
    return Response.json(
      { error: "Too many requests. Please try later." },
      { status: 429 }
    );
  }

  const website = String(formData.get("website") || "");
  const middleName = String(formData.get("middleName") || "");
  const formStart = Number(formData.get("formStart") || "0");

  if (website || middleName) {
    return Response.json(
      {
        error:
          "We couldn't process your submission. Please contact us directly if this keeps happening.",
      },
      { status: 400 }
    );
  }

  const now = Date.now();
  if (!formStart || now - formStart < 1500) {
    return Response.json(
      { error: "That was quick! Please review your details and try again." },
      { status: 400 }
    );
  }

  const fullName = String(formData.get("fullName") || "").trim();
  const emailOrPhone = String(formData.get("emailOrPhone") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!fullName || !emailOrPhone || !message) {
    return Response.json(
      { error: "Please fill in all required fields." },
      { status: 400 }
    );
  }

  try {
    await sendContactSubmissionEmail({
      fullName,
      emailOrPhone,
      company,
      message,
    });
    return Response.json({ success: true });
  } catch (err) {
    console.error("Contact submission failed:", err);
    return Response.json(
      { error: "Failed to send. Please try again." },
      { status: 500 }
    );
  }
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

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header
        onAboutClick={() => scrollToSection("about-section")}
        onContactClick={() => scrollToSection("contact-section")}
        cartCount={cartCount}
      />

      {/* Hero Section */}
      <HeroSection />

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
