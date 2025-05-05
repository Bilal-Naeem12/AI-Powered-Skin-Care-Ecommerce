// src/pages/admin/users/Modals/DeleteUserModal.tsx
import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Avatar, Typography, Button
} from "@mui/material";
import { User } from "..";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
}

export default function DeleteUserModal({ open, onClose, onConfirm, user }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent className="flex flex-col items-center text-center gap-4 py-2">
        {user && (
          <>
            <Avatar
              src={user.profileImage}
              alt={user.first_name}
              sx={{ width: 80, height: 80 }}
            />
            <Typography variant="h6" className="font-semibold">
              {user.first_name} {user.last_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Are you sure you want to delete this user?
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
}
