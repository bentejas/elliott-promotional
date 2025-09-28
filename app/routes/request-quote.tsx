import { useState, useEffect } from "react";
import { redirect, useActionData } from "react-router";
import type { Route } from "./+types/request-quote";
import { Header, Footer } from "~/components/layout";
import {
  getCartItems,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  getCartCount,
} from "~/utils/cart";
import type { CartItem } from "~/utils/cart";
import { Trash2, Edit3, ShoppingCart, Send } from "lucide-react";
import { motion } from "framer-motion";
import Breadcrumbs from "~/components/ui/Breadcrumbs";
import {
  sendQuoteRequestEmail,
  sendQuoteConfirmationEmail,
} from "~/utils/ses.server";
import { db, quoteRequests } from "../../db";
import { isbot } from "isbot";
import {
  buildRateKey,
  getClientIp,
  isLikelyBadOrigin,
  rateLimit,
} from "~/utils/rateLimit.server";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return { error: "Method not allowed" };
  }

  const userAgent = request.headers.get("user-agent") || "";
  if ((isbot as unknown as (ua: string) => boolean)(userAgent)) {
    return { error: "Blocked" };
  }
  if (isLikelyBadOrigin(request)) {
    return { error: "Invalid origin" };
  }

  const ip = getClientIp(request);
  const rl = rateLimit(buildRateKey(["request-quote", ip]), {
    windowMs: 60_000,
    max: 5,
  });
  if (!rl.allowed) {
    return { error: "Too many requests. Please try later." };
  }
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "submit-quote") {
    const customerName = formData.get("customerName") as string;
    const customerEmail = formData.get("customerEmail") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const customerMessage = formData.get("customerMessage") as string;
    const cartItemsJson = formData.get("cartItems") as string;
    const website = String(formData.get("website") || "");
    const middleName = String(formData.get("middleName") || "");
    const formStart = Number(formData.get("formStart") || "0");

    if (website || middleName) {
      return { error: "Spam detected" };
    }
    if (!formStart || Date.now() - formStart < 2500) {
      return { error: "Form submitted too quickly" };
    }

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !cartItemsJson) {
      return {
        error: "Please fill in all required fields.",
      };
    }

    try {
      const cartItems = JSON.parse(cartItemsJson) as CartItem[];

      if (!cartItems || cartItems.length === 0) {
        return {
          error:
            "Your cart is empty. Please add products before requesting a quote.",
        };
      }

      // Send quote request email to internal team
      await sendQuoteRequestEmail({
        customerName,
        customerEmail,
        customerPhone,
        customerMessage: customerMessage || "",
        cartItems,
      });

      // Send confirmation email to customer
      await sendQuoteConfirmationEmail(customerEmail, customerName);

      // Create product details string for database storage
      const productDetails = JSON.stringify(
        cartItems.map((item) => ({
          productCode: item.productCode,
          title: item.title,
          brand: item.brand,
          quantity: item.quantity,
          selectedColor: item.selectedColor || null,
          selectedSize: item.selectedSize || null,
          // priceRange: item.priceRange,
        }))
      );

      // Insert quote request into database
      await db.insert(quoteRequests).values({
        customerName,
        emailAddress: customerEmail,
        phoneNumber: customerPhone,
        additionalInformation: customerMessage || null,
        productDetails,
      });

      console.log("Quote request submitted successfully:", {
        customerName,
        customerEmail,
        customerPhone,
        productsCount: cartItems.length,
        totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      });

      // Redirect to success page
      return redirect("/quote-success");
    } catch (error) {
      console.error("Failed to submit quote request:", error);
      return {
        error:
          "Failed to submit quote request. Please try again or contact us directly.",
      };
    }
  }

  return { error: "Invalid request" };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Request Quote - Elliott Promotional Products" },
    {
      name: "description",
      content: "Review your selected items and request a custom quote.",
    },
  ];
}

export default function RequestQuote() {
  const actionData = useActionData<typeof action>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerMessage: "",
  });

  // Load cart items on mount
  useEffect(() => {
    const items = getCartItems();
    setCartItems(items);
    setCartCount(getCartCount());
  }, []);

  const handleRemoveItem = (
    productId: string,
    selectedColor: string,
    selectedSize: string
  ) => {
    removeFromCart(productId, selectedColor, selectedSize);
    const updatedItems = getCartItems();
    setCartItems(updatedItems);
    setCartCount(getCartCount());
  };

  const handleUpdateQuantity = (
    productId: string,
    selectedColor: string,
    selectedSize: string,
    newQuantity: number
  ) => {
    updateCartItemQuantity(productId, selectedColor, selectedSize, newQuantity);
    const updatedItems = getCartItems();
    setCartItems(updatedItems);
    setCartCount(getCartCount());
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Request Quote", isActive: true },
  ];

  if (cartItems.length === 0) {
    return (
      <>
        <Header cartCount={cartCount} />
        <Breadcrumbs items={breadcrumbItems} />

        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <ShoppingCart className="mx-auto h-24 w-24 text-gray-400 mb-8" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Your cart is empty
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Add some products to your cart to request a quote.
              </p>
              <a
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors font-semibold"
              >
                Browse Products
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header cartCount={cartCount} />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Request Quote
            </h1>
            <p className="text-lg text-gray-600">
              Review your selected items and provide your details to receive a
              custom quote.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Selected Items ({cartItems.length})
              </h2>

              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow"
                  >
                    {/* Top Row: Image, Details, and Remove Button */}
                    <div className="flex items-start gap-3 flex-1">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.imgSrc}
                          alt={item.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                          {item.brand} • {item.productCode}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          {item.selectedColor && (
                            <span>
                              Color:{" "}
                              <span className="capitalize font-medium">
                                {item.selectedColor}
                              </span>
                            </span>
                          )}
                          {item.selectedSize && (
                            <span>
                              Size:{" "}
                              <span className="uppercase font-medium">
                                {item.selectedSize}
                              </span>
                            </span>
                          )}
                        </div>
                        {/* <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {item.priceRange}/unit
                        </p> */}
                      </div>

                      {/* Remove Button (Top Right on Mobile) */}
                      <div className="sm:hidden">
                        <button
                          onClick={() =>
                            handleRemoveItem(
                              item.productId,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          className="p-2 text-red-400 hover:text-red-600 rounded-full hover:bg-red-50"
                          title="Remove Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Row: Quantity Controls and Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-gray-50 rounded-full px-1 py-1">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.selectedColor,
                              item.selectedSize,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 text-sm font-semibold shadow-sm"
                        >
                          −
                        </button>
                        <span className="w-8 sm:w-12 text-center font-semibold text-sm sm:text-base">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.selectedColor,
                              item.selectedSize,
                              item.quantity + 1
                            )
                          }
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 text-sm font-semibold shadow-sm"
                        >
                          +
                        </button>
                      </div>

                      {/* Quantity Label on Mobile */}
                      {/* <span className="text-xs text-gray-500 sm:hidden">
                        Qty
                      </span> */}

                      {/* Actions (Desktop Only) */}
                      <div className="hidden sm:flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleRemoveItem(
                              item.productId,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          className="p-2 text-red-400 hover:text-red-600 rounded-full hover:bg-red-50"
                          title="Remove Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quote Request Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Your Details
              </h2>

              {/* Error Message */}
              {actionData?.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl shadow-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                    {actionData.error}
                  </div>
                </div>
              )}

              <form method="post" className="space-y-6" noValidate>
                <input type="hidden" name="intent" value="submit-quote" />
                <input
                  type="hidden"
                  name="cartItems"
                  value={JSON.stringify(cartItems)}
                />
                {/* honeypots */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  name="middleName"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />
                {/* form start */}
                <input type="hidden" name="formStart" value={Date.now()} />

                <div>
                  <label
                    htmlFor="customerName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="customerEmail"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    required
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="customerPhone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="customerMessage"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Additional Information
                  </label>
                  <textarea
                    id="customerMessage"
                    name="customerMessage"
                    rows={4}
                    value={formData.customerMessage}
                    onChange={handleInputChange}
                    placeholder="Tell us about your project, timeline, budget, or any special requirements..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-6 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors font-semibold text-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <Send className="w-5 h-5" />
                  <span>Submit Quote Request</span>
                </motion.button>

                <p className="text-sm text-gray-500 text-center">
                  We'll review your request and get back to you within 24 hours
                  with a detailed quote.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
