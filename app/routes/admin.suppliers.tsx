// routes/admin.suppliers.tsx
import type { Route } from "./+types/admin.suppliers";
import {
  useLoaderData,
  useActionData,
  useNavigation,
  useSubmit,
  Form,
  Link,
} from "react-router";
import { db, suppliers, type Supplier, type NewSupplier } from "../../db";
import { eq, asc, ilike } from "drizzle-orm";
import { Layout } from "~/components/layout";
import { requireAdminAuth } from "~/utils/auth.server";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdminAuth(request);
  const allSuppliers = await db
    .select()
    .from(suppliers)
    .orderBy(asc(suppliers.supplierName));
  return { suppliers: allSuppliers };
}

export async function action({ request }: Route.ActionArgs) {
  await requireAdminAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "create") {
      const supplierName = (formData.get("supplierName") as string)?.trim();
      if (!supplierName) {
        return { error: "Supplier name is required" };
      }
      const [existing] = await db
        .select()
        .from(suppliers)
        .where(ilike(suppliers.supplierName, supplierName))
        .limit(1);
      if (existing) {
        return { error: `A supplier named "${existing.supplierName}" already exists.` };
      }
      const newSupplier: NewSupplier = { supplierName };
      await db.insert(suppliers).values(newSupplier);
      return { success: "Supplier added successfully!" };
    }

    if (intent === "delete") {
      const id = formData.get("id") as string;
      await db.delete(suppliers).where(eq(suppliers.id, id));
      return { success: "Supplier deleted successfully!" };
    }

    return { error: "Invalid action" };
  } catch (error) {
    console.error("Supplier action error:", error);
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Admin - Supplier Management" }];
}

export default function AdminSuppliers() {
  const { suppliers: supplierList } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const isSubmitting = navigation.state !== "idle";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierName, setSupplierName] = useState("");
  const [lastActionData, setLastActionData] = useState<any>(null);

  useEffect(() => {
    if (actionData?.success && actionData !== lastActionData) {
      setLastActionData(actionData);
      setIsModalOpen(false);
      setSupplierName("");
    }
  }, [actionData, lastActionData]);

  const handleDelete = (supplier: Supplier) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${supplier.supplierName}"? This cannot be undone.`
    );
    if (confirmed) {
      submit({ intent: "delete", id: supplier.id }, { method: "post" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Supplier Management
              </h1>
              <p className="text-lg text-gray-600">
                Manage your product suppliers
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 text-gray-700 text-sm font-medium transition-colors"
              >
                ← Back to Products
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-red-400 px-4 py-2 rounded-md hover:bg-red-400/80 text-white cursor-pointer text-sm"
              >
                Add Supplier
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

          {/* Suppliers Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {supplierList.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <p className="text-lg font-medium mb-1">No suppliers yet</p>
                <p className="text-sm">
                  Click "Add Supplier" to get started.
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                      Supplier Name
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                      Date Added
                    </th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {supplierList.map((supplier, index) => (
                    <tr
                      key={supplier.id}
                      className={`border-b border-gray-100 last:border-0 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {supplier.supplierName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {supplier.createdAt
                          ? new Date(supplier.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(supplier)}
                          disabled={isSubmitting}
                          className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </Layout>

      {/* Add Supplier Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && setIsModalOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
          </DialogHeader>
          <Form method="post" className="space-y-4 mt-2">
            <input type="hidden" name="intent" value="create" />
            <div>
              <label
                htmlFor="supplierName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Supplier Name *
              </label>
              <input
                type="text"
                id="supplierName"
                name="supplierName"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Acme Promotions"
                autoFocus
                required
              />
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setSupplierName("");
                }}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm text-white bg-red-400 hover:bg-red-500 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Adding…" : "Add Supplier"}
              </button>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
