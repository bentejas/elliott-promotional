// components/admin/ProductFormModal.tsx
import React from "react";
import { Modal } from "../ui";
import ProductForm from "./ProductForm";
import type { Product } from "../../../db/schema";

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? "Edit Product" : "Add New Product"}
      size="xl"
    >
      <ProductForm
        product={product}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
        showActions={true}
      />
    </Modal>
  );
}
