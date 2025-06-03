// components/Modals/OrderDetailModal.tsx
import React from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { X } from "lucide-react";
import { Order } from "@/types/Order";
import OrderDetailPage from "./index";

interface Props {
  open: boolean;
  order: Order | null;
  onClose: () => void;
}

const OrderDetailModal: React.FC<Props> = ({ open, order, onClose }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
    <DialogTitle className="flex items-center justify-between">
      Order&nbsp;Details
      <IconButton onClick={onClose} size="small">
        <X size={18} />
      </IconButton>
    </DialogTitle>

    <DialogContent dividers>
      {order && <OrderDetailPage order={order} />}  {/* <- pass the order */}
    </DialogContent>
  </Dialog>
);

export default OrderDetailModal;
