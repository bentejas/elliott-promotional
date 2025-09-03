// routes/admin.tsx
import type { Route } from "./+types/admin";
import { useLoaderData, useNavigate, Form, useActionData } from "react-router";
import { db, products, type Product, type NewProduct } from "../../db";
import { eq } from "drizzle-orm";
import { Layout, Navbar } from "~/components/layout";
import ProductForm from "~/components/admin/ProductForm";
import ProductList from "~/components/admin/ProductList";
import { useState } from "react";

export async function loader({ request }: Route.LoaderArgs) {
  const allProducts = await db
    .select()
    .from(products)
    .orderBy(products.createdAt);
  return { products: allProducts };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "create") {
      const newProduct: NewProduct = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        productCode: formData.get("productCode") as string,
        colours: formData.get("colours")
          ? JSON.parse(formData.get("colours") as string)
          : [],
        sizes: formData.get("sizes")
          ? JSON.parse(formData.get("sizes") as string)
          : [],
        gender: formData.get("gender") as string,
        priceLow: parseFloat(formData.get("priceLow") as string),
        priceHigh: parseFloat(formData.get("priceHigh") as string),
        imgSrc: "/images/placeholder-product.png", // Placeholder until AWS upload
        secondaryImages: [],
        category: formData.get("category") as string,
        brand: formData.get("brand") as string,
      };

      await db.insert(products).values(newProduct);
      return { success: "Product created successfully!" };
    }

    if (intent === "update") {
      const id = formData.get("id") as string;
      const updateData: Partial<NewProduct> = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        productCode: formData.get("productCode") as string,
        colours: formData.get("colours")
          ? JSON.parse(formData.get("colours") as string)
          : [],
        sizes: formData.get("sizes")
          ? JSON.parse(formData.get("sizes") as string)
          : [],
        gender: formData.get("gender") as string,
        priceLow: parseFloat(formData.get("priceLow") as string),
        priceHigh: parseFloat(formData.get("priceHigh") as string),
        category: formData.get("category") as string,
        brand: formData.get("brand") as string,
      };

      await db.update(products).set(updateData).where(eq(products.id, id));
      return { success: "Product updated successfully!" };
    }

    if (intent === "delete") {
      const id = formData.get("id") as string;
      await db.delete(products).where(eq(products.id, id));
      return { success: "Product deleted successfully!" };
    }

    return { error: "Invalid action" };
  } catch (error) {
    console.error("Admin action error:", error);
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin - Product Management" },
    {
      name: "description",
      content: "Manage products for Elliott Promotional Products.",
    },
  ];
}

export default function Admin() {
  const { products: productList } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleFormSuccess = () => {
    setEditingProduct(null);
    setShowForm(false);
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 md:gap-8 px-8 pt-6">
      <Layout>
        <div className="max-w-7xl mx-auto py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Product Management
              </h1>
              <p className="text-lg text-gray-600">
                Create, edit, and manage your product catalog
              </p>
            </div>
            <button
              onClick={handleNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Add New Product
            </button>
          </div>

          {/* Success/Error Messages */}
          {actionData?.success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
              {actionData.success}
            </div>
          )}
          {actionData?.error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {actionData.error}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Product Form */}
            {showForm && (
              <div className="xl:col-span-1">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <ProductForm
                    product={editingProduct}
                    onCancel={handleCancel}
                    onSuccess={handleFormSuccess}
                  />
                </div>
              </div>
            )}

            {/* Product List */}
            <div className={showForm ? "xl:col-span-2" : "xl:col-span-3"}>
              <ProductList products={productList} onEdit={handleEdit} />
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
