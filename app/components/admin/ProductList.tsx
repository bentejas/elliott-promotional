// components/admin/ProductList.tsx
import { useState } from "react";
import { Form } from "react-router";
import { Edit, Trash2, Eye } from "lucide-react";
import type { Product } from "../../../db/schema";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

export default function ProductList({ products, onEdit }: ProductListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !categoryFilter || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map((p) => p.category))];
  const subCategories = [...new Set(products.map((p) => p.subCategory))];

  const handleDelete = (productId: string) => {
    setDeleteConfirm(productId);
  };

  const confirmDelete = () => {
    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Product Catalog
        </h2>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
          </div>
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={subCategoryFilter}
              onChange={(e) => setSubCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            >
              <option value="">All Sub Categories</option>
              {subCategories
                .filter(
                  (subCategory): subCategory is string =>
                    typeof subCategory === "string" && subCategory !== null
                )
                .map((subCategory) => (
                  <option key={subCategory} value={subCategory}>
                    {subCategory.charAt(0).toUpperCase() + subCategory.slice(1)}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sub Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brand
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price Range
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Colors
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {product.title}
                    </div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {product.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.productCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.subCategory}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.brand}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${product.priceLow.toFixed(2)} - $
                  {product.priceHigh.toFixed(2)}
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-1">
                    {product.colours &&
                      product.colours
                        .slice(0, 3)
                        .map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.toLowerCase() }}
                            title={color}
                          />
                        ))}
                    {product.colours && product.colours.length > 3 && (
                      <span className="text-xs text-gray-500 ml-1">
                        +{product.colours.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors border border-gray-300"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {deleteConfirm === product.id ? (
                      <div className="flex items-center space-x-2">
                        <Form method="post" className="inline">
                          <input type="hidden" name="intent" value="delete" />
                          <input type="hidden" name="id" value={product.id} />
                          <button
                            type="submit"
                            onClick={confirmDelete}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-full transition-colors"
                            title="Confirm Delete"
                          >
                            Confirm
                          </button>
                        </Form>
                        <button
                          onClick={cancelDelete}
                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs rounded-full transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors border border-red-200"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm || categoryFilter
                ? "No products match your search criteria."
                : "No products found. Add your first product above."}
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
