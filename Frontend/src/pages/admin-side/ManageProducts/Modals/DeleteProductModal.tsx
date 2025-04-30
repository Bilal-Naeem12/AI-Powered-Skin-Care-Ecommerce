import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar,
} from "@mui/material";
import { Product } from "@/types/Product";

interface DeleteProductModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: Product | null;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  open,
  onClose,
  onConfirm,
  product,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth  className="z-999999">
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent className="flex flex-col items-center text-center gap-4 py-2">
        {product && (
          <>
            <Avatar
              src={product.images?.[0]}
              alt={product.name}
              sx={{ width: 80, height: 80 }}
              variant="rounded"
            />
            <Typography variant="h6" className="font-semibold">
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Are you sure you want to delete this product?
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions className="px-4 pb-3">
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProductModal;
