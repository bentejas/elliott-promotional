// components/admin/ProductForm.tsx
import { useState, useEffect } from "react";
import { Form } from "react-router";
import type { Product } from "../../../db/schema";

interface ProductFormProps {
  product?: Product | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const categories = [
  "apparel",
  "athletic",
  "hats",
  "hi-vis",
  "leisure",
  "drinkware",
  "office",
  "bags",
];

const genderOptions = ["unisex", "men", "women", "kids"];

export default function ProductForm({
  product,
  onCancel,
  onSuccess,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    productCode: "",
    colours: "",
    sizes: "",
    gender: "unisex",
    priceLow: "",
    priceHigh: "",
    category: "apparel",
    brand: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        productCode: product.productCode,
        colours: product.colours ? product.colours.join(", ") : "",
        sizes: product.sizes ? product.sizes.join(", ") : "",
        gender: product.gender,
        priceLow: product.priceLow.toString(),
        priceHigh: product.priceHigh.toString(),
        category: product.category,
        brand: product.brand,
      });
    } else {
      // Reset form for new product
      setFormData({
        title: "",
        description: "",
        productCode: "",
        colours: "",
        sizes: "",
        gender: "unisex",
        priceLow: "",
        priceHigh: "",
        category: "apparel",
        brand: "",
      });
    }
    setErrors({});
  }, [product]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.productCode.trim())
      newErrors.productCode = "Product code is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";

    const priceLow = parseFloat(formData.priceLow);
    const priceHigh = parseFloat(formData.priceHigh);

    if (isNaN(priceLow) || priceLow < 0)
      newErrors.priceLow = "Valid low price is required";
    if (isNaN(priceHigh) || priceHigh < 0)
      newErrors.priceHigh = "Valid high price is required";
    if (!isNaN(priceLow) && !isNaN(priceHigh) && priceLow > priceHigh) {
      newErrors.priceHigh =
        "High price must be greater than or equal to low price";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (!validateForm()) {
      e.preventDefault();
      return;
    }
    // Form will submit naturally to the action
  };

  const processArrayField = (value: string): string => {
    if (!value.trim()) return "[]";
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    return JSON.stringify(items);
  };

  return (
    <Form method="post" onSubmit={handleSubmit} className="space-y-4">
      <input
        type="hidden"
        name="intent"
        value={product ? "update" : "create"}
      />
      {product && <input type="hidden" name="id" value={product.id} />}

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Product Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter product title"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter product description"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      {/* Product Code */}
      <div>
        <label
          htmlFor="productCode"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Product Code *
        </label>
        <input
          type="text"
          id="productCode"
          name="productCode"
          value={formData.productCode}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.productCode ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="e.g., CT001"
        />
        {errors.productCode && (
          <p className="text-red-500 text-xs mt-1">{errors.productCode}</p>
        )}
      </div>

      {/* Brand */}
      <div>
        <label
          htmlFor="brand"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Brand *
        </label>
        <input
          type="text"
          id="brand"
          name="brand"
          value={formData.brand}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.brand ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="e.g., Nike, Gildan"
        />
        {errors.brand && (
          <p className="text-red-500 text-xs mt-1">{errors.brand}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category *
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Gender */}
      <div>
        <label
          htmlFor="gender"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Gender *
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {genderOptions.map((gender) => (
            <option key={gender} value={gender}>
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="priceLow"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Low Price *
          </label>
          <input
            type="number"
            id="priceLow"
            name="priceLow"
            value={formData.priceLow}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.priceLow ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="0.00"
          />
          {errors.priceLow && (
            <p className="text-red-500 text-xs mt-1">{errors.priceLow}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="priceHigh"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            High Price *
          </label>
          <input
            type="number"
            id="priceHigh"
            name="priceHigh"
            value={formData.priceHigh}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.priceHigh ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="0.00"
          />
          {errors.priceHigh && (
            <p className="text-red-500 text-xs mt-1">{errors.priceHigh}</p>
          )}
        </div>
      </div>

      {/* Colors */}
      <div>
        <label
          htmlFor="colours"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Colors
        </label>
        <input
          type="text"
          id="colours"
          name="colours"
          value={formData.colours}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="red, blue, green (comma separated)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter colors separated by commas
        </p>
        <input
          type="hidden"
          name="colours"
          value={processArrayField(formData.colours)}
        />
      </div>

      {/* Sizes */}
      <div>
        <label
          htmlFor="sizes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Sizes
        </label>
        <input
          type="text"
          id="sizes"
          name="sizes"
          value={formData.sizes}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="XS, S, M, L, XL (comma separated)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter sizes separated by commas
        </p>
        <input
          type="hidden"
          name="sizes"
          value={processArrayField(formData.sizes)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
        >
          {product ? "Update Product" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </Form>
  );
}
