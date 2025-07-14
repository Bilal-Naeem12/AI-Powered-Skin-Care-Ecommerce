// src/modules/admin/AdminContactMessagesPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    axios
      .get<ContactMessage[]>(`${import.meta.env.VITE_API_BACKEND_URL}/contact`, {
        withCredentials: true,
      })
      .then((res) => setMessages(res.data))
      .catch((err) => {
        console.error("Failed to fetch contact messages", err);
        setSnackbar({
          open: true,
          message: "Could not load messages.",
          severity: "error",
        });
      });
  }, []);

  const openDialog = (msg: ContactMessage) => {
    setSelected(msg);
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setDialogOpen(false);
    setSelected(null);
  };

  return (
      <main className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
    <Box p={6}>
      <Typography variant="h4" gutterBottom>
        Contact Messages
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Received</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {messages.map((m) => (
            <TableRow key={m._id} hover>
              <TableCell>{m.name}</TableCell>
              <TableCell>{m.email}</TableCell>
              <TableCell>{m.phone}</TableCell>
              <TableCell>
                {new Date(m.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => openDialog(m)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Message from {selected?.name}</DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Box className="space-y-4">
              <Typography>
                <strong>Name:</strong> {selected.name}
              </Typography>
              <Typography>
                <strong>Email:</strong> {selected.email}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {selected.phone}
              </Typography>
              <Typography>
                <strong>Message:</strong>
              </Typography>
              <Typography
                component="div"
                sx={{ whiteSpace: "pre-wrap", p: 1, bgcolor: "grey.100", borderRadius: 1 }}
              >
                {selected.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Received: {new Date(selected.createdAt).toLocaleString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
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
    </Box></main>
  );
}
