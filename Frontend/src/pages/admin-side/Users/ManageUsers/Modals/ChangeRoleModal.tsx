// src/pages/admin/users/Modals/ChangeRoleModal.tsx
import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Radio, RadioGroup, FormControlLabel, Button
} from "@mui/material";
import { User } from "..";


interface Props {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (userId: string, newRole: "user" | "admin") => void;
}

export default function ChangeRoleModal({ open, onClose, user, onSave }: Props) {
  const [role, setRole] = useState<"user" | "admin">(user?.role || "user");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change Role</DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <RadioGroup
          row
          value={role}
          onChange={(e) => setRole(e.target.value as "user" | "admin")}
        >
          <FormControlLabel value="user" control={<Radio />} label="User" />
          <FormControlLabel value="admin" control={<Radio />} label="Admin" />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => user && onSave(user._id, role)}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
