import { useEffect, useState } from "react";
import { Header, Footer } from "~/components/layout";
import { getCartCount, clearCart } from "~/utils/cart";
import { CheckCircle, Mail, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function meta() {
  return [
    { title: "Quote Request Submitted - Elliott Promotional Products" },
    {
      name: "description",
      content:
        "Your quote request has been successfully submitted. We'll get back to you soon!",
    },
  ];
}

export default function QuoteSuccess() {
  const [cartCount, setCartCount] = useState(getCartCount());

  useEffect(() => {
    // Clear the cart when the success page loads
    clearCart();
    setCartCount(0);

    // Dispatch cart update event for other components
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  }, []);

  return (
    <>
      <Header cartCount={cartCount} />

      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>

            {/* Main Message */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Quote Request Submitted!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
            >
              Thank you for your interest in our promotional products. We've
              received your quote request and will get back to you as soon as
              possible.
            </motion.p>

            {/* Information Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid md:grid-cols-2 gap-8 mb-12"
            >
              {/* Email Confirmation Card */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 mx-auto">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Confirmation Email Sent
                </h3>
                <p className="text-gray-600">
                  Check your inbox for a confirmation email with all the details
                  of your quote request.
                </p>
              </div>

              {/* Response Time Card */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4 mx-auto">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Quick Response Time
                </h3>
                <p className="text-gray-600">
                  We'll review your request and get back to you within 24 hours
                  with a detailed quote.
                </p>
              </div>
            </motion.div>

            {/* What Happens Next */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-12 text-left"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                What Happens Next?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full flex-shrink-0 mt-1">
                    <span className="text-sm font-semibold text-red-600">
                      1
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Review & Analysis
                    </h4>
                    <p className="text-gray-600">
                      Our team will review your product selections and
                      requirements.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full flex-shrink-0 mt-1">
                    <span className="text-sm font-semibold text-red-600">
                      2
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Custom Quote Preparation
                    </h4>
                    <p className="text-gray-600">
                      We'll prepare a detailed quote with pricing, timelines,
                      and options.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full flex-shrink-0 mt-1">
                    <span className="text-sm font-semibold text-red-600">
                      3
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Personal Follow-up
                    </h4>
                    <p className="text-gray-600">
                      We'll contact you directly to discuss your project and
                      answer any questions.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors font-semibold"
              >
                Browse More Products
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors font-semibold"
              >
                Return to Home
              </a>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 pt-8 border-t border-gray-200"
            >
              <p className="text-gray-500 text-sm">
                Need immediate assistance? Contact us directly at{" "}
                <a
                  href="mailto:info@elliott-promotional.ca"
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  info@elliott-promotional.ca
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
}
