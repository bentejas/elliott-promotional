// components/ui/ProductCard.tsx
import { Link } from "react-router";
import type { Product } from "../../../db/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // const priceRange =
  //   product.priceLow === product.priceHigh
  //     ? `$${product.priceLow.toFixed(2)}`
  //     : `$${product.priceLow.toFixed(2)} - ${product.priceHigh.toFixed(2)}`;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-white hover:shadow-md transition-shadow duration-200 w-80"
    >
      {/* Product Image */}
      <div className="bg-gray-100 overflow-hidden">
        <img
          src={product.imgSrc}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-2 p-4">
        {/* Brand and Category */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900">
            {product.brand}
          </span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-500 capitalize">
            {product.gender}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="text-sm text-gray-900 group-hover:text-gray-700">
          {product.title}
        </h3>

        {/* Price */}
        {/* <p className="text-sm text-gray-600">{priceRange}/unit</p> */}

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
