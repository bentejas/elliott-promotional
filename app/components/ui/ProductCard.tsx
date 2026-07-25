// components/ui/ProductCard.tsx
import { Link } from "react-router";
import type { Product } from "../../../db/schema";
import { NO_GENDER_CATEGORIES } from "~/utils/categories";

interface ProductCardProps {
  product: Product;
}

const PLACEHOLDER_IMAGE = "/images/placeholder-product.svg";

export default function ProductCard({ product }: ProductCardProps) {
  const showGender =
    product.gender !== "none" &&
    !NO_GENDER_CATEGORIES.includes(product.category?.toLowerCase() ?? "");

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
    >
      {/* Product Image — fixed aspect ratio prevents layout shift */}
      <div className="bg-gray-100 overflow-hidden aspect-square">
        <img
          src={product.imgSrc || PLACEHOLDER_IMAGE}
          alt={product.title}
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src !== window.location.origin + PLACEHOLDER_IMAGE) {
              img.src = PLACEHOLDER_IMAGE;
            }
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-2 p-4">
        {/* Brand and Gender */}
        <div className="flex items-center space-x-2 text-sm">
          <span className="font-medium text-gray-900">{product.brand}</span>
          {showGender && (
            <span className="text-gray-500 capitalize">
              <span className="mr-2">•</span>
              {product.gender}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-sm text-gray-900 group-hover:text-gray-700">
          {product.title}
        </h3>

        {/* Color Options Count */}
        {product.colours && product.colours.length > 0 && (
          <p className="text-xs text-gray-500">
            {product.colours.length} colour option
            {product.colours.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </Link>
  );
}
