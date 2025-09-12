import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ContactForm } from "~/components/forms";

interface ContactSectionProps {
  animatedSections: { contact: boolean };
}

export default function ContactSection({
  animatedSections,
}: ContactSectionProps) {
  const contactRef = useRef(null);

  return (
    <motion.section
      ref={contactRef}
      initial={{ opacity: 0, y: 50 }}
      animate={
        animatedSections.contact ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
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
  );
}
