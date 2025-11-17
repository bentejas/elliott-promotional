// components/admin/ProductForm.tsx
import { useState, useEffect } from "react";
import { Form, useActionData } from "react-router";
import type { Product } from "../../../db/schema";
import ImageUpload from "./ImageUpload";
import ColorImageUpload from "./ColorImageUpload";

interface ProductFormProps {
  product?: Product | null;
  onCancel: () => void;
  onSuccess: () => void;
  onDelete?: () => void;
  existingSubcategories?: string[];
  showActions?: boolean;
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

const genderOptions = ["unisex", "men", "women", "kids", "none"];

export default function ProductForm({
  product,
  onCancel,
  onSuccess,
  onDelete,
  existingSubcategories = [],
  showActions = true,
}: ProductFormProps) {
  const actionData = useActionData();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    productCode: "",
    colours: "",
    sizes: "",
    gender: "none",
    priceLow: "",
    priceHigh: "",
    category: "apparel",
    subCategory: "",
    brand: "",
    primaryColor: "",
  });

  const [images, setImages] = useState<string[]>([]);
  const [secondaryImages, setSecondaryImages] = useState<string[]>([]);
  const [colorImages, setColorImages] = useState<Record<string, string[]>>({});
  const [parsedColors, setParsedColors] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Subcategory suggestions state
  const [showSubcategorySuggestions, setShowSubcategorySuggestions] =
    useState(false);

  // Handle subcategory input changes
  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      subCategory: value,
    }));

    // Show suggestions if there's input and there are matching suggestions
    const hasMatchingSuggestions = existingSubcategories.some(
      (subcategory) =>
        subcategory.toLowerCase().includes(value.toLowerCase()) &&
        subcategory.toLowerCase() !== value.toLowerCase()
    );
    setShowSubcategorySuggestions(value.length > 0 && hasMatchingSuggestions);

    // Clear error when user starts typing
    if (errors.subCategory) {
      setErrors((prev) => ({
        ...prev,
        subCategory: "",
      }));
    }
  };

  // Filter subcategory suggestions based on current input
  const filteredSubcategorySuggestions = existingSubcategories.filter(
    (subcategory) =>
      subcategory.toLowerCase().includes(formData.subCategory.toLowerCase()) &&
      subcategory.toLowerCase() !== formData.subCategory.toLowerCase() // Don't show exact matches
  );

  // Handle clicking a subcategory suggestion
  const handleSubcategorySuggestionClick = (suggestion: string) => {
    setFormData((prev) => ({
      ...prev,
      subCategory: suggestion,
    }));
    setShowSubcategorySuggestions(false);
  };

  // Handle subcategory input blur (hide suggestions after a delay to allow clicking)
  const handleSubcategoryBlur = () => {
    setTimeout(() => setShowSubcategorySuggestions(false), 150);
  };

  // Handle subcategory input focus
  const handleSubcategoryFocus = () => {
    const hasMatchingSuggestions = existingSubcategories.some(
      (subcategory) =>
        subcategory
          .toLowerCase()
          .includes(formData.subCategory.toLowerCase()) &&
        subcategory.toLowerCase() !== formData.subCategory.toLowerCase()
    );
    if (formData.subCategory.length > 0 && hasMatchingSuggestions) {
      setShowSubcategorySuggestions(true);
    }
  };

  useEffect(() => {
    if (product) {
      const colors = product.colours || [];
      setFormData({
        title: product.title,
        description: product.description,
        productCode: product.productCode,
        colours: colors.join(", "),
        sizes: product.sizes ? product.sizes.join(", ") : "",
        gender: product.gender,
        priceLow: product.priceLow?.toString() ?? "0",
        priceHigh: product.priceHigh?.toString() ?? "0",
        category: product.category,
        subCategory: product.subCategory || "",
        brand: product.brand,
        primaryColor:
          product.primaryColor || (colors.length > 0 ? colors[0] : ""),
      });

      // Set existing images (backward compatibility)
      setImages(product.imgSrc ? [product.imgSrc] : []);
      setSecondaryImages(product.secondaryImages || []);

      // Set color-based images
      setColorImages(product.colorImages || {});
      setParsedColors(colors);
    } else {
      // Reset form for new product
      setFormData({
        title: "",
        description: "",
        productCode: "",
        colours: "",
        sizes: "",
        gender: "none",
        priceLow: "0",
        priceHigh: "0",
        category: "apparel",
        subCategory: "",
        brand: "",
        primaryColor: "",
      });
      setImages([]);
      setSecondaryImages([]);
      setColorImages({});
      setParsedColors([]);
    }
    setErrors({});
  }, [product]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Map input names to form data keys
    const fieldName =
      name === "coloursInput"
        ? "colours"
        : name === "sizesInput"
          ? "sizes"
          : name;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Parse colors when colours field changes
    if (fieldName === "colours") {
      const colors = value
        .split(",")
        .map((color) => color.trim())
        .filter((color) => color.length > 0);

      setParsedColors(colors);

      // Set primary color to first color if not already set
      if (colors.length > 0 && !formData.primaryColor) {
        setFormData((prev) => ({
          ...prev,
          primaryColor: colors[0],
        }));
      }
    }

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const handleColorImagesChange = (color: string, images: string[]) => {
    setColorImages((prev) => ({
      ...prev,
      [color]: images,
    }));
  };

  const handleSetPrimaryColor = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      primaryColor: color,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.productCode.trim())
      newErrors.productCode = "Product code is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";

    // Validate images - check both old and new systems
    if (parsedColors.length > 0) {
      // New color-based system: check if any color has images
      const hasAnyImages = Object.values(colorImages).some(
        (colorImageList) => colorImageList.length > 0
      );
      if (!hasAnyImages) {
        newErrors.colorImages =
          "At least one product image is required for any color";
      }
    } else {
      // Old system: check images array
      if (images.length === 0) {
        newErrors.images = "At least one product image is required";
      }
    }

    // no more prices

    // const priceLow = parseFloat(formData.priceLow);
    // const priceHigh = parseFloat(formData.priceHigh);

    // if (isNaN(priceLow) || priceLow < 0)
    //   newErrors.priceLow = "Valid low price is required";
    // if (isNaN(priceHigh) || priceHigh < 0)
    //   newErrors.priceHigh = "Valid high price is required";
    // if (!isNaN(priceLow) && !isNaN(priceHigh) && priceLow > priceHigh) {
    //   newErrors.priceHigh =
    //     "High price must be greater than or equal to low price";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    const isValid = validateForm();

    if (!isValid) {
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
    <Form
      method="post"
      onSubmit={handleSubmit}
      className="space-y-4 overflow-y-scroll px-2"
    >
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
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-y-scroll ${
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

      {/* Sub Category */}
      <div className="relative">
        <label
          htmlFor="subCategory"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Sub Category
        </label>

        <input
          type="text"
          id="subCategory"
          name="subCategory"
          value={formData.subCategory}
          onChange={handleSubcategoryChange}
          onFocus={handleSubcategoryFocus}
          onBlur={handleSubcategoryBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type to see existing subcategories..."
          autoComplete="off"
        />

        {/* Subcategory Suggestions Dropdown */}
        {showSubcategorySuggestions &&
          filteredSubcategorySuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
              {filteredSubcategorySuggestions
                .slice(0, 5)
                .map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSubcategorySuggestionClick(suggestion)}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                      index === 0 ? "rounded-t-md" : ""
                    } ${
                      index ===
                      filteredSubcategorySuggestions.slice(0, 5).length - 1
                        ? "rounded-b-md"
                        : ""
                    }`}
                  >
                    <span className="text-sm text-gray-900">{suggestion}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      (existing)
                    </span>
                  </button>
                ))}
            </div>
          )}

        {existingSubcategories.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            {existingSubcategories.length} existing subcategories available
          </p>
        )}
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
      {/* <div className="grid grid-cols-2 gap-4">
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
      </div> */}

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
          name="coloursInput"
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
          name="sizesInput"
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

      {/* Color-based Product Images */}
      {parsedColors.length > 0 ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Product Images by Color *
          </label>
          <div className="space-y-4">
            {parsedColors.map((color) => (
              <ColorImageUpload
                key={color}
                color={color}
                productCode={formData.productCode}
                currentImages={colorImages[color] || []}
                onImagesChange={handleColorImagesChange}
                isPrimary={formData.primaryColor === color}
                onSetPrimary={handleSetPrimaryColor}
                maxImages={3}
              />
            ))}
          </div>
          {errors.colorImages && (
            <p className="text-red-500 text-xs mt-1">{errors.colorImages}</p>
          )}
          <input
            type="hidden"
            name="colorImages"
            value={JSON.stringify(colorImages)}
          />
          <input
            type="hidden"
            name="primaryColor"
            value={formData.primaryColor}
          />
          {/* Backward compatibility */}
          <input
            type="hidden"
            name="imgSrc"
            value={
              formData.primaryColor && colorImages[formData.primaryColor]
                ? colorImages[formData.primaryColor][0] || ""
                : ""
            }
          />
          <input
            type="hidden"
            name="secondaryImages"
            value={JSON.stringify([])}
          />
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 italic mb-4">
            Enter colors above to see image upload sections for each color.
          </p>
          {/* Fallback to old image upload system */}
          <div>
            <ImageUpload
              label="Primary Product Image"
              currentImages={images}
              onImagesChange={setImages}
              maxImages={1}
              required={true}
              className={errors.images ? "border-red-300" : ""}
            />
            {errors.images && (
              <p className="text-red-500 text-xs mt-1">{errors.images}</p>
            )}
            <input type="hidden" name="imgSrc" value={images[0] || ""} />
          </div>

          <div className="mt-4">
            <ImageUpload
              label="Additional Product Images (Optional)"
              currentImages={secondaryImages}
              onImagesChange={setSecondaryImages}
              maxImages={4}
              required={false}
            />
            <input
              type="hidden"
              name="secondaryImages"
              value={JSON.stringify(secondaryImages)}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex space-x-4 pt-6">
          <div className="flex items-center space-x-6 bg-black rounded-full p-1 pl-6 w-fit">
            <h3 className="text-white text-lg font-medium">
              {product ? "Update Product" : "Create Product"}
            </h3>
            <button
              type="submit"
              className="rounded-full aspect-square w-12 bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              <span className="text-lg font-bold">✓</span>
            </button>
          </div>
          <div className="flex space-x-2">
            {product && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-colors"
              >
                Delete Product
              </button>
            )}
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-colors border border-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </Form>
  );
}
