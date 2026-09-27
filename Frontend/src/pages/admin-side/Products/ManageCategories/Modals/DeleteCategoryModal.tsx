import React from "react";
import { Modal } from "@/component/admin/ui/modal";
import Button from "@/component/admin/ui/button/Button";
import { Category } from "@/types/Category";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  category: Category | null;
}

export default function DeleteCategoryModal({
  open,
  onClose,
  onConfirm,
  category,
}: Props) {
  if (!category) return null;

  return (
    <Modal isOpen={open} onClose={onClose} className="max-w-sm">
      <div className="space-y-6 p-6 text-center">
        <p>
          Delete <strong>{category.name}</strong>? This action can be undone
          from the backend only.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-red-600 hover:bg-red-700" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
