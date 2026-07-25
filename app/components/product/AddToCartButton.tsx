import { ShoppingCart, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddToCartButtonProps {
  onAddToCart: () => void;
  isAdded: boolean;
  disabled?: boolean;
}

export default function AddToCartButton({
  onAddToCart,
  isAdded,
  disabled = false,
}: AddToCartButtonProps) {
  return (
    <div className="pt-6">
      <motion.button
        onClick={onAddToCart}
        disabled={disabled}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed ${
          isAdded
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl"
        }`}
      >
        <AnimatePresence mode="wait">
          {isAdded ? (
            <motion.div
              key="success"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-2"
            >
              <Check className="w-6 h-6" />
              <span>Added to Quote!</span>
            </motion.div>
          ) : (
            <motion.div
              key="add"
              initial={{ scale: 1 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-2"
            >
              <ShoppingCart className="w-6 h-6" />
              <span>Add to Quote Request</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Announce cart additions to assistive tech */}
      <span aria-live="polite" className="sr-only">
        {isAdded ? "Item added to quote request" : ""}
      </span>

      <p className="text-sm text-gray-500 mt-4 text-center leading-relaxed">
        You may submit a quote request to receive a full estimate on an order
      </p>
    </div>
  );
}
