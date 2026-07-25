// components/CompanyDetails.tsx
import { useState } from "react";
import { Mail, Phone, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CompanyDetails() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(itemId);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch {
      // Clipboard unavailable (permissions/insecure context) — ignore
    }
  };
  return (
    <div className="w-full max-w-md">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-medium text-gray-900 mb-2">
            Elliott Promotional Products
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between group">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <a
                href="mailto:owner@elliottpromotional.ca"
                className="text-lg text-gray-900 hover:text-gray-600 transition-colors duration-200"
              >
                owner@elliottpromotional.ca
              </a>
            </div>
            <button
              onClick={() =>
                copyToClipboard("owner@elliottpromotional.ca", "email")
              }
              aria-label="Copy email address"
              className="p-1 hover:bg-gray-100 rounded"
            >
              <AnimatePresence mode="wait">
                {copiedItem === "email" ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          <div className="flex items-center justify-between group">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-600" />
              <a
                href="tel:+15196144897"
                className="text-lg text-gray-900 hover:text-gray-600 transition-colors duration-200"
              >
                (519) 614-4897
              </a>
            </div>
            <button
              onClick={() => copyToClipboard("(519) 614-4897", "phone")}
              aria-label="Copy phone number"
              className="p-1 hover:bg-gray-100 rounded"
            >
              <AnimatePresence mode="wait">
                {copiedItem === "phone" ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
