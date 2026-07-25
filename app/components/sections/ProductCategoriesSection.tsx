import { useRef } from "react";
import { motion } from "framer-motion";
import { ProductTile } from "~/components/ui";
import { productCategories } from "~/types/products";

interface ProductCategoriesSectionProps {
  animatedSections: { products: boolean };
}

export default function ProductCategoriesSection({
  animatedSections,
}: ProductCategoriesSectionProps) {
  const productsRef = useRef(null);

  return (
    <motion.section
      ref={productsRef}
      initial={{ opacity: 0, y: 50 }}
      animate={
        animatedSections.products ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
      }
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="py-20 relative overflow-hidden bg-gradient-to-t from-gray-100 to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ">
        

        <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={
              animatedSections.products
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl font-bold mb-4 w-full text-center"
          >
            Product Categories
          </motion.h2>
          <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {productCategories.map((category) => (
              <ProductTile key={category.id} {...category} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
