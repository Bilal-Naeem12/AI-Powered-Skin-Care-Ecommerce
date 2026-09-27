// src/modules/admin/AdminRefundsPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Typography,
  Box,
  Badge,
} from "@mui/material";

interface RefundRequest {
  _id: string;
  orderId: { _id: string; orderNumber: string; totalAmount: number };
  userId: { _id: string; first_name: string; last_name: string; email: string };
  reason: string;
  details?: string;
  images: string[];               // proof images
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: { first_name: string; last_name: string };
}

export default function AdminRefundsPage() {
  const [requests, setRequests] = useState<RefundRequest[]>([]);
  const [selected, setSelected] = useState<RefundRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    axios
      .get<RefundRequest[]>(`${import.meta.env.VITE_API_BACKEND_URL}/refund-requests`, {
        withCredentials: true,
      })
      .then((res) => setRequests(res.data))
      .catch((err) => {
        console.error("Fetch refunds failed", err);
        setSnackbar({
          open: true,
          message: "Failed to load refund requests.",
          severity: "error",
        });
      });
  }, []);

  const openDialog = (r: RefundRequest) => {
    setSelected(r);
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setDialogOpen(false);
    setSelected(null);
  };
  const updateStatus = (status: "Approved" | "Rejected") => {
    if (!selected) return;
    axios
      .put(
        `${import.meta.env.VITE_API_BACKEND_URL}/refund-requests/${selected._id}/review`,
        { status },
        { withCredentials: true }
      )
      .then(() => {
        setRequests((prev) =>
          prev.map((r) =>
            r._id === selected._id
              ? { ...r, status, reviewedAt: new Date().toISOString() }
              : r
          )
        );
        setSnackbar({
          open: true,
          message: `Refund ${status.toLowerCase()}.`,
          severity: "success",
        });
        closeDialog();
      })
      .catch((err) => {
        console.error("Update status failed", err);
        setSnackbar({
          open: true,
          message: "Could not update refund status.",
          severity: "error",
        });
      });
  };

  return (
    <main className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
    <Box className="p-6">
      <Typography variant="h4" gutterBottom>
        Manage Refund Requests
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order #</TableCell>
            <TableCell>Proof</TableCell> {/* new column */}
            <TableCell>User</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Submitted</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((r) => (
            <TableRow key={r._id} hover>
              <TableCell>{r.orderId.orderNumber}</TableCell>
              <TableCell>
                {r.images?.[0] ? (
                  <img
                    src={r.images?.[0]}
                    alt="Proof thumbnail"
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <span className="text-theme-sm text-gray-500">—</span>
                )}
              </TableCell>
              <TableCell>
                {r.userId?.first_name} {r.userId?.last_name}
              </TableCell>
              <TableCell>${r.orderId.totalAmount.toFixed(2)}</TableCell>
              <TableCell>{r.reason}</TableCell>
              <TableCell>
                <Badge
                  badgeContent={r.status}
                  color={
                    r.status === "Pending"
                      ? "secondary"
                      : r.status === "Approved"
                      ? "success"
                      : "error"
                  }
                />
              </TableCell>
              <TableCell>
                {new Date(r.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => openDialog(r)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Refund Details</DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Box className="space-y-4">
              <Typography>
                <strong>User:</strong> {selected.userId?.first_name}{" "}
                {selected.userId?.last_name} ({selected.userId?.email})
              </Typography>
              <Typography>
                <strong>Order:</strong> {selected.orderId.orderNumber} — $
                {selected.orderId.totalAmount.toFixed(2)}
              </Typography>
              <Typography>
                <strong>Reason:</strong> {selected.reason}
              </Typography>
              {selected.details && (
                <Typography>
                  <strong>Details:</strong> {selected.details}
                </Typography>
              )}
              {selected.images.length > 0 && (
                <Box className="flex flex-wrap gap-2 mt-2">
                  {selected.images.map((url) => (
                    <img
                      key={url}
                      src={url}
                      alt="Proof"
                      className="w-24 h-24 object-cover rounded"
                    />
                  ))}
                </Box>
              )}
              <Typography>
                <strong>Status:</strong>{" "}
                <Badge
                  badgeContent={selected.status}
                  color={
                    selected.status === "Pending"
                      ? "secondary"
                      : selected.status === "Approved"
                      ? "success"
                      : "error"
                  }
                />
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => updateStatus("Rejected")}
            disabled={selected?.status !== "Pending"}
          >
            Reject
          </Button>
          <Button
            onClick={() => updateStatus("Approved")}
            disabled={selected?.status !== "Pending"}
          >
            Approve
          </Button>
          <Button onClick={closeDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
    </main>
  );
}
