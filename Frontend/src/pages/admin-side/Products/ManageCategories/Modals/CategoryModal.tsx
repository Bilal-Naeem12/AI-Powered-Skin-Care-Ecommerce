import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@/types/Category";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().max(200, "Max 200 characters").optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().nullable(),
});

export type CategoryPayload = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  initialData: Category | null;
  onSave: (payload: CategoryPayload) => void;
}

export default function CategoryModal({
  open,
  onClose,
  initialData,
  onSave,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryPayload>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description ?? "",
        imageUrl: initialData.imageUrl ?? "",
      });
    } else {
      reset({
        name: "",
        description: "",
        imageUrl: "",
      });
    }
  }, [initialData, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? "Edit Category" : "Add Category"}</DialogTitle>
      <Divider />
      <form onSubmit={handleSubmit(onSave)}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                {...register("name")}
                label="Name"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("description")}
                label="Description (optional)"
                fullWidth
                multiline
                rows={2}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("imageUrl")}
                label="Image URL (optional)"
                fullWidth
                error={!!errors.imageUrl}
                helperText={errors.imageUrl?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
