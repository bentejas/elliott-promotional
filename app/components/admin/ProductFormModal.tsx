// components/admin/ProductFormModal.tsx
import React, { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import type { Product, Supplier } from "../../../db/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess: () => void;
  onDelete?: () => void;
  existingSubcategories?: string[];
  suppliers?: Supplier[];
}

export default function ProductFormModal({
  isOpen,
  onClose,
  product,
  onSuccess,
  onDelete,
  existingSubcategories = [],
  suppliers = [],
}: ProductFormModalProps) {
  // Track whether the admin has touched the form so an accidental
  // backdrop click or Esc doesn't silently discard their work.
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (isOpen) setIsDirty(false);
  }, [isOpen]);

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  const requestClose = () => {
    if (
      isDirty &&
      !window.confirm("Discard unsaved changes? Your edits will be lost.")
    ) {
      return;
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && requestClose()}>
      <DialogContent
        className="!max-w-screen-lg max-h-[90vh] p-0 overflow-hidden"
        onWheel={(e) => {
          // Ensure wheel events are properly handled for scrolling
          e.stopPropagation();
        }}
      >
        <div className="max-h-[90vh] overflow-y-auto">
          <DialogHeader className="px-6 py-6 sticky top-0 bg-white z-10 shadow-md">
            <DialogTitle>
              {product ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          {/* onChange in capture on this wrapper marks the form dirty on any
              input/textarea/select edit inside it */}
          <div
            className="px-6 py-6 bg-white"
            onChange={() => setIsDirty(true)}
          >
            <ProductForm
              key={product?.id ?? "new"}
              product={product}
              onCancel={requestClose}
              onSuccess={handleSuccess}
              onDelete={onDelete}
              existingSubcategories={existingSubcategories}
              suppliers={suppliers}
              showActions={true}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
