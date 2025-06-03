// components/Modals/CancelOrderModal.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { Order } from "@/types/Order";
import usePutAuthData from "@/hooks/usePutAuthData";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onSuccess?: () => void; // optional callback to refresh parent list
}

const CancelOrderModal: React.FC<Props> = ({ open, order, onClose, onSuccess }) => {
  const [trigger, setTrigger] = useState(false);

  const { responseData, loading, error } = usePutAuthData(
    order ? `${import.meta.env.VITE_API_BACKEND_URL}/orders/${order._id}/cancel` : "",
    null,
    trigger
  );

  const handleConfirm = async () => {
    if (!order) return;
    setTrigger(prev => !prev);
    toast.success("Order cancelled successfully");
    onClose();
    onSuccess?.(); // notify parent to refresh
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cancel Order</DialogTitle>

      <DialogContent dividers>
        Are you sure you want to cancel&nbsp;
        <b>#{order?.orderNumber}</b>?
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Keep Order
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          sx={{ bgcolor: "#FF69B4", "&:hover": { bgcolor: "#ff5fae" } }}
        >
          {loading ? <CircularProgress size={18} color="inherit" /> : "Confirm Cancel"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelOrderModal;
