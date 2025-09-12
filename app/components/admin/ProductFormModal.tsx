// components/admin/ProductFormModal.tsx
import React from "react";
import ProductForm from "./ProductForm";
import type { Product } from "../../../db/schema";
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
}

export default function ProductFormModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: ProductFormModalProps) {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
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

          <div className="px-6 py-6 bg-white">
            <ProductForm
              product={product}
              onCancel={handleCancel}
              onSuccess={handleSuccess}
              showActions={true}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
