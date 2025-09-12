import { useState, useEffect } from "react";
import { redirect } from "react-router";
import type { Route } from "./+types/products.$productId";
import { Header, Footer } from "~/components/layout";
import { getProductById } from "~/lib/products.server";
import { addToCart, getCartCount } from "~/utils/cart";
import Breadcrumbs from "~/components/ui/Breadcrumbs";

// Product components
import ImageGallery from "~/components/product/ImageGallery";
import ColorSelector from "~/components/product/ColorSelector";
import SizeSelector from "~/components/product/SizeSelector";
import QuantitySelector from "~/components/product/QuantitySelector";
import AddToCartButton from "~/components/product/AddToCartButton";

export async function loader({ params }: Route.LoaderArgs) {
  const { productId } = params;

  if (!productId) {
    throw redirect("/products");
  }

  const product = await getProductById(productId);

  if (!product) {
    throw redirect("/products");
  }

  return { product };
}

export default function ProductDetail({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData;

  // State for product options
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Get images based on selected color or fallback to old system
  const getImagesForColor = (color: string) => {
    if (product.colorImages && product.colorImages[color]) {
      return product.colorImages[color];
    }
    return [];
  };

  const getCurrentImages = () => {
    if (selectedColor && product.colorImages) {
      const colorImages = getImagesForColor(selectedColor);
      if (colorImages.length > 0) {
        return colorImages;
      }
    }
    // Fallback to old system
    return [product.imgSrc, ...(product.secondaryImages || [])];
  };

  const allImages = getCurrentImages();

  // Get ordered colors with primary first
  const getOrderedColors = () => {
    if (!product.colours || product.colours.length === 0) return [];

    const colors = [...product.colours];
    if (product.primaryColor && colors.includes(product.primaryColor)) {
      // Move primary color to the front
      const filtered = colors.filter((color) => color !== product.primaryColor);
      return [product.primaryColor, ...filtered];
    }
    return colors;
  };

  const orderedColors = getOrderedColors();

  // Update cart count on mount
  useEffect(() => {
    setCartCount(getCartCount());
  }, []);

  // Auto-select first available options (prioritize primary color)
  useEffect(() => {
    if (orderedColors.length > 0 && !selectedColor) {
      setSelectedColor(orderedColors[0]);
    }
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product, selectedColor, selectedSize, orderedColors]);

  const handleAddToCart = () => {
    // Get the appropriate image for the selected color
    const getCartImage = () => {
      if (
        selectedColor &&
        product.colorImages &&
        product.colorImages[selectedColor]
      ) {
        const colorImages = product.colorImages[selectedColor];
        if (colorImages.length > 0) {
          return colorImages[0]; // Use first image for the selected color
        }
      }
      return product.imgSrc; // Fallback to primary image
    };

    const cartItem = {
      productId: product.id,
      title: product.title,
      productCode: product.productCode,
      imgSrc: getCartImage(),
      selectedColor,
      selectedSize,
      quantity,
      priceRange: `$${product.priceLow.toFixed(2)} - $${product.priceHigh.toFixed(2)}`,
      brand: product.brand,
    };

    addToCart(cartItem);
    setCartCount(getCartCount());
    setAddedToCart(true);

    // Reset the added state after 2 seconds
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const priceRange =
    product.priceLow === product.priceHigh
      ? `$${product.priceLow.toFixed(2)}`
      : `$${product.priceLow.toFixed(2)} - $${product.priceHigh.toFixed(2)}`;

  return (
    <>
      <Header
        onAboutClick={() => {}}
        onContactClick={() => {}}
        cartCount={cartCount}
      />

      <div className="min-h-screen bg-gray-50">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: product.title, isActive: true },
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <ImageGallery images={allImages} productTitle={product.title} />

            {/* Product Details */}
            <div className="space-y-6">
              {/* Product Info */}
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                  <span className="font-medium text-gray-900">
                    {product.brand}
                  </span>
                  <span>•</span>
                  <span className="capitalize">{product.gender}</span>
                  {/* <span>•</span>
                  <span className="uppercase">{product.productCode}</span> */}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.title}
                </h1>

                <div className="mb-6">
                  <ul className="list-disc list-inside text-lg text-gray-600 space-y-2">
                    {product.description.split(",").map((item, index) => (
                      <li key={index} className="leading-relaxed">
                        {item.trim()}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-2xl font-bold text-gray-900 mb-6">
                  {priceRange}/unit
                </div>
              </div>

              {/* Product Options */}
              <ColorSelector
                colors={orderedColors}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
              />

              <SizeSelector
                sizes={product.sizes || []}
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
              />

              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
              />

              {/* Add to Cart Button */}
              <AddToCartButton
                onAddToCart={handleAddToCart}
                isAdded={addedToCart}
              />

              {/* Product Category */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Category:{" "}
                  <span className="text-gray-900 capitalize font-medium">
                    {product.category}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
