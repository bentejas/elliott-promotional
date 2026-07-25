// routes/admin.tsx
import type { Route } from "./+types/admin";
import {
  useLoaderData,
  useActionData,
  useSubmit,
  Form,
  Link,
} from "react-router";
import { db, products, suppliers, type Product, type NewProduct } from "../../db";
import { eq, asc } from "drizzle-orm";
import { Layout } from "~/components/layout";
import ProductFormModal from "~/components/admin/ProductFormModal";
import ProductList from "~/components/admin/ProductList";
import { useState, useEffect } from "react";
import { requireAdminAuth } from "~/utils/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  // Require admin authentication
  const session = await requireAdminAuth(request);
  const adminEmail = session.get("adminEmail");

  const [allProducts, allSuppliers] = await Promise.all([
    db.select().from(products).orderBy(products.createdAt),
    db.select().from(suppliers).orderBy(asc(suppliers.supplierName)),
  ]);

  // Get unique subcategories (filter out null/empty values and deduplicate case-insensitively)
  const subcategoriesSet = new Set<string>();
  allProducts.forEach((product) => {
    if (product.subCategory && product.subCategory.trim()) {
      subcategoriesSet.add(product.subCategory.trim());
    }
  });
  const existingSubcategories = Array.from(subcategoriesSet).sort((a, b) =>
    a.localeCompare(b)
  );

  return {
    products: allProducts,
    existingSubcategories,
    suppliers: allSuppliers,
    adminEmail,
  };
}

function parseOptionalPrice(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseProductForm(formData: FormData): NewProduct {
  return {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    productCode: formData.get("productCode") as string,
    colours: formData.get("colours")
      ? JSON.parse(formData.get("colours") as string)
      : [],
    primaryColor: formData.get("primaryColor") as string,
    sizes: formData.get("sizes")
      ? JSON.parse(formData.get("sizes") as string)
      : [],
    gender: formData.get("gender") as string,
    priceLow: parseOptionalPrice(formData.get("priceLow")),
    priceHigh: parseOptionalPrice(formData.get("priceHigh")),
    pricesLow: parseOptionalPrice(formData.get("pricesLow")),
    imgSrc:
      (formData.get("imgSrc") as string) || "/images/placeholder-product.svg",
    secondaryImages: formData.get("secondaryImages")
      ? JSON.parse(formData.get("secondaryImages") as string)
      : [],
    colorImages: formData.get("colorImages")
      ? JSON.parse(formData.get("colorImages") as string)
      : {},
    category: formData.get("category") as string,
    subCategory: formData.get("subCategory") as string,
    brand: formData.get("brand") as string,
    supplierId: (formData.get("supplierId") as string) || null,
  };
}

function isUniqueViolation(error: unknown): boolean {
  const message = error instanceof Error ? error.message : "";
  return /duplicate key|unique constraint/i.test(message);
}

export async function action({ request }: Route.ActionArgs) {
  // Require admin authentication
  await requireAdminAuth(request);

  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "create") {
      const newProduct = parseProductForm(formData);
      await db.insert(products).values(newProduct);
      return { success: "Product created successfully!" };
    }

    if (intent === "update") {
      const id = formData.get("id") as string;
      const updateData: Partial<NewProduct> = {
        ...parseProductForm(formData),
        updatedAt: new Date(),
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
    if (isUniqueViolation(error)) {
      return {
        error:
          "A product with that product code already exists. Please use a different code.",
      };
    }
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
  const {
    products: productList,
    existingSubcategories,
    suppliers: supplierList,
    adminEmail,
  } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastActionData, setLastActionData] = useState<any>(null);
  const [banner, setBanner] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);

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

  // Handle form success and close modal
  useEffect(() => {
    if (actionData?.success && actionData !== lastActionData) {
      setLastActionData(actionData);
      setIsModalOpen(false);
      setEditingProduct(null);
    }
  }, [actionData, lastActionData]);

  // Surface action results as an auto-dismissing banner
  useEffect(() => {
    if (!actionData) return;
    if (actionData.success) {
      setBanner({ kind: "success", message: actionData.success });
      const timer = setTimeout(() => setBanner(null), 5000);
      return () => clearTimeout(timer);
    }
    if (actionData.error) {
      setBanner({ kind: "error", message: actionData.error });
    }
  }, [actionData]);

  const handleFormSuccess = () => {
    // This will be handled by the useEffect above
  };

  const handleDelete = () => {
    if (editingProduct) {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${editingProduct.title}"? This action cannot be undone.`
      );

      if (confirmed) {
        submit(
          { intent: "delete", id: editingProduct.id },
          { method: "post" }
        );
      }
    }
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
              {adminEmail && (
                <p className="text-sm text-gray-500 mt-1">
                  Logged in as: {adminEmail}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/suppliers"
                className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 text-gray-700 text-sm font-medium transition-colors"
              >
                Manage Suppliers
              </Link>
              <button
                onClick={handleNew}
                className="bg-red-400 px-4 py-2 rounded-md hover:bg-red-400/80 text-white cursor-pointer text-sm"
              >
                Add New Product
              </button>
              <Form method="post" action="/admin/logout">
                <button
                  type="submit"
                  className="bg-gray-600 px-4 py-2 rounded-md hover:bg-gray-700 text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </Form>
            </div>
          </div>

          {/* Success/Error Messages */}
          {banner && (
            <div
              role="alert"
              className={`mb-6 p-4 rounded-2xl shadow-sm border ${
                banner.kind === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-3 ${
                      banner.kind === "success" ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></div>
                  {banner.message}
                </div>
                <button
                  onClick={() => setBanner(null)}
                  className="text-sm opacity-60 hover:opacity-100"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
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
            onDelete={handleDelete}
            existingSubcategories={existingSubcategories}
            suppliers={supplierList}
          />
        </div>
      </Layout>
    </div>
  );
}
