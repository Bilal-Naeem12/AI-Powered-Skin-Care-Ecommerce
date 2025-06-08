import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Button,
  Divider,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@/types/Category";
import usePostAuthData from "@/hooks/usePostAuthData";

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
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CategoryPayload>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
  });

  const imageUrl = useWatch({ control, name: "imageUrl" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localUploading, setLocalUploading] = useState(false);

  const { postData, data } = usePostAuthData<{ image: string }, FormData>();

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

  useEffect(() => {
    if (data?.image) {
      setValue("imageUrl", data.image, { shouldValidate: true });
      setLocalUploading(false);
    }
  }, [data, setValue]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !initialData) return;

    const formData = new FormData();
    formData.append("image", file);

    setLocalUploading(true);

    try {
      await postData(
        `${import.meta.env.VITE_API_BACKEND_URL}/categories/${initialData._id}/image`,
        formData,
        "Image uploaded successfully!"
      );
    } catch (e) {
      console.error("Upload failed:", e);
      setLocalUploading(false);
    }
  };

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
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Category Image (optional)
              </Typography>
              <Avatar
                src={imageUrl || ""}
                variant="rounded"
                sx={{ width: 90, height: 90, mb: 1 }}
              />
              {localUploading ? (
                <CircularProgress size={24} />
              ) : (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </>
              )}
              <TextField
                {...register("imageUrl")}
                label="Image URL"
                fullWidth
                margin="dense"
                disabled
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
