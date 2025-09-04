// routes/admin.tsx
import type { Route } from "./+types/admin";
import { useLoaderData, useNavigate, Form, useActionData } from "react-router";
import { db, products, type Product, type NewProduct } from "../../db";
import { eq } from "drizzle-orm";
import { Layout, Navbar } from "~/components/layout";
import ProductFormModal from "~/components/admin/ProductFormModal";
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
        imgSrc:
          (formData.get("imgSrc") as string) ||
          "/images/placeholder-product.png",
        secondaryImages: formData.get("secondaryImages")
          ? JSON.parse(formData.get("secondaryImages") as string)
          : [],
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
        imgSrc: formData.get("imgSrc") as string,
        secondaryImages: formData.get("secondaryImages")
          ? JSON.parse(formData.get("secondaryImages") as string)
          : [],
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  const handleFormSuccess = () => {
    // Modal will close automatically via handleCloseModal in ProductFormModal
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              className="bg-red-400 p-4 rounded-md hover:bg-red-400/80 text-white cursor-pointer"
            >
              Add New Product
            </button>
          </div>

          {/* Success/Error Messages */}
          {actionData?.success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl shadow-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                {actionData.success}
              </div>
            </div>
          )}
          {actionData?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl shadow-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                {actionData.error}
              </div>
            </div>
          )}

          {/* Product List */}
          <ProductList products={productList} onEdit={handleEdit} />

          {/* Product Form Modal */}
          <ProductFormModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            product={editingProduct}
            onSuccess={handleFormSuccess}
          />
        </div>
      </Layout>
    </div>
  );
}
