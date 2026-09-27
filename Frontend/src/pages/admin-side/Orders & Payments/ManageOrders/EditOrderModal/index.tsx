import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { Order, OrderStatus } from "@/types/Order";
import usePutAuthData from "@/hooks/usePutAuthData";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

interface FormState {
  orderStatus: OrderStatus;
  carrier: string;
  shippingStatus: string;
  trackingNumber: string;
  eta: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Props {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onSuccess?: () => void; // refresh parent list
}
const ORDER_STATUSES = ["Created","Paid","Cancelled","Refunded"] as const;
const Carrier = ["DHL", "FedEx", "UPS", "USPS", "Other"] as const;
const SHIPPING_STATUSES = [
  "Pending",
  "Processing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Returned",
] as const;

const EditOrderModal: React.FC<Props> = ({ open, order, onClose, onSuccess }) => {
  /* ---------------- form state ---------------- */
  const [form, setForm] = useState<FormState | null>(null);

  useEffect(() => {
    if (!order) return;
    const ship = order.shippingId;
    setForm({
      orderStatus:
        (order.isCancelled
          ? "Cancelled"
          : ((order.statusHistory?.at(0)?.what || "Created") as OrderStatus)),
      carrier: ship?.carrier ?? "Other",
      shippingStatus: ship?.shippingStatus ?? "Pending",
      trackingNumber: ship?.trackingNumber ?? "",
      eta: ship?.estimatedDeliveryDate
        ? new Date(ship.estimatedDeliveryDate).toISOString().slice(0, 10)
        : "",
      street: ship?.shippingAddress?.street ?? "",
      city: ship?.shippingAddress?.city ?? "",
      state: ship?.shippingAddress?.state ?? "",
      postalCode: ship?.shippingAddress?.postal_code ?? "",
      country: ship?.shippingAddress?.country ?? "",
    });
  }, [order]);

  /* ---------------- PUT hook ---------------- */
  const [patchData, setPatchData] = useState<Partial<Order> | null>(null);
  const [fire, setFire] = useState(false); // trigger

  const { loading, error, responseData } = usePutAuthData(
    order ? `${import.meta.env.VITE_API_BACKEND_URL}/orders/${order._id}` : "",
    patchData,
    fire
  );

  /* close + refresh on success */
  useEffect(() => {
    if (responseData && patchData) {
      toast.success("Order updated successfully!");
      setPatchData(null);      // reset so hook won't refire
      onClose();
      onSuccess?.();
    }
  }, [responseData, patchData, onClose, onSuccess]);

  /* helper */
  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => (p ? { ...p, [k]: v } : p));

  const handleSave = () => {
    if (!order || !form) return;
  // Current history
  const currentHistory = order.statusHistory || [];

  // Get the last status in the existing history
  const lastStatus = currentHistory.at(0)?.what;
    console.log(lastStatus)
  // Determine what to send
  const updatedHistory = lastStatus === form.orderStatus
    ? currentHistory // no duplicate push
    : [
        ...currentHistory,
        { what: form.orderStatus, updatedAt: new Date().toISOString() } as any,
      ];
    const patch: Partial<Order> = {
      statusHistory: updatedHistory,
      shippingId: {
        ...order.shippingId,
        carrier: form.carrier,
        shippingStatus: form.shippingStatus,
        trackingNumber: form.trackingNumber,
        estimatedDeliveryDate: form.eta ? new Date(form.eta) : null,
        shippingAddress: {
          street: form.street,
          city: form.city,
          state: form.state,
          postal_code: form.postalCode,
          country: form.country,
        },
      } as any,
    };

    setPatchData(patch);
    setFire((f) => !f); // fire the PUT once
  };

  /* ---------------- UI ---------------- */
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {!form ? (
        <div className="flex items-center justify-center p-10">
          <CircularProgress />
        </div>
      ) : (
        <>
          <DialogTitle>Edit Order #{order?.orderNumber}</DialogTitle>

          <DialogContent dividers sx={{ pt: 3 }}>
            {/* Order status */}
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel>Order Status</FormLabel>
              <RadioGroup
                row
                value={form.orderStatus}
                onChange={(e) =>
                  update("orderStatus", e.target.value as OrderStatus)
                }
              >
                {ORDER_STATUSES.map((s) => (
                  <FormControlLabel key={s} value={s} control={<Radio />} label={s} />
                ))}
              </RadioGroup>
            </FormControl>

            {/* Shipping details */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <FormLabel>Carrier</FormLabel>
                  <Select
                    size="small"
                    value={form.carrier}
                    onChange={(e) =>
                      update("carrier", e.target.value as typeof Carrier[number])
                    }
                  >
                    {Carrier.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <FormLabel>Shipping Status</FormLabel>
                  <Select
                    size="small"
                    value={form.shippingStatus}
                    onChange={(e) =>
                      update(
                        "shippingStatus",
                        e.target.value as typeof SHIPPING_STATUSES[number]
                      )
                    }
                  >
                    {SHIPPING_STATUSES.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Tracking Number"
                  value={form.trackingNumber}
                  onChange={(e) => update("trackingNumber", e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
 <LocalizationProvider dateAdapter={AdapterDateFns}>
  <DesktopDatePicker
    label="ETA"
    format="yyyy-MM-dd"
    value={form.eta ? new Date(form.eta) : null}
    onChange={(newValue) => update("eta", newValue && !Number.isNaN(newValue.getTime()) ? newValue.toISOString() : "")}
    slotProps={{ textField: { fullWidth: true, size: "small" } }}
  />
</LocalizationProvider>

              </Grid>

              {[
                ["street", "Street"],
                ["city", "City"],
                ["state", "State"],
                ["postalCode", "Postal Code"],
                ["country", "Country"],
              ].map(([k, label]) => (
                <Grid item xs={12} sm={6} key={k}>
                  <TextField
                    fullWidth
                    size="small"
                    label={label}
                    value={form[k as keyof FormState] as string}
                    onChange={(e) =>
                      update(k as keyof FormState, e.target.value)
                    }
                  />
                </Grid>
              ))}
            </Grid>

            {error && (
              <p className="mt-3 text-sm text-red-600">
                {error} — please try again.
              </p>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={20} color="inherit" /> : "Save"}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default EditOrderModal;
