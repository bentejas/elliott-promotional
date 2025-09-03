// components/ui/ProductCard.tsx
import { Link } from "react-router";
import type { Product } from "../../../db/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const priceRange =
    product.priceLow === product.priceHigh
      ? `$${product.priceLow.toFixed(2)}`
      : `$${product.priceLow.toFixed(2)} - $${product.priceHigh.toFixed(2)}`;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.imgSrc}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {product.category}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
          {product.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="font-bold text-lg text-gray-900">{priceRange}</span>
          <span className="text-xs text-gray-500">{product.productCode}</span>
        </div>

        {/* Colors and Sizes */}
        <div className="mt-3 flex flex-wrap gap-2">
          {product.colours && product.colours.length > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">Colors:</span>
              <div className="flex space-x-1">
                {product.colours.slice(0, 4).map((colour, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: colour.toLowerCase() }}
                    title={colour}
                  />
                ))}
                {product.colours.length > 4 && (
                  <span className="text-xs text-gray-500">
                    +{product.colours.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-2">
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {product.brand}
            </span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {product.gender}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
