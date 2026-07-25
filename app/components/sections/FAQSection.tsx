import { useRef } from "react";
import { motion } from "framer-motion";
import { FAQAccordion } from "~/components/sections";
import { faqItems } from "~/types/faq";

interface FAQSectionProps {
  animatedSections: { faq: boolean };
}

export default function FAQSection({ animatedSections }: FAQSectionProps) {
  const faqRef = useRef(null);

  return (
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
            animatedSections.faq ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
          }
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <FAQAccordion items={faqItems} />
        </motion.div>
      </div>
    </motion.section>
  );
}
