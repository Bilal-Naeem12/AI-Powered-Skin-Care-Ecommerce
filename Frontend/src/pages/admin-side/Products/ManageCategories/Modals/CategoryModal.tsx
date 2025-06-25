// src/components/CategoryModal.tsx
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
  Stack,
} from "@mui/material";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@/types/Category";
import usePostAuthData from "@/hooks/usePostAuthData";

/* ------------------------------------------------------------------ */
/* --------------------------- validation --------------------------- */
const schema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().max(200, "Max 200 characters").optional(),
});

export type CategoryPayload = z.infer<typeof schema>;

/* ------------------------------------------------------------------ */
/* ----------------------------- props ------------------------------ */
interface Props {
  open: boolean;
  onClose: () => void;
  initialData: Category | null;                // null = add
  /** Must return the saved / newly-created category */
  onSave: (payload: CategoryPayload) => Promise<Category>;
}

/* ------------------------------------------------------------------ */
export default function CategoryModal({
  open,
  onClose,
  initialData,
  onSave,
}: Props) {
  /* ── RHF setup ────────────────────────────────────────────── */
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryPayload>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  });

  /* ── preview/queued states ───────────────────────────────── */
  const [thumbPreview, setThumbPreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");

  const [queuedThumb, setQueuedThumb] = useState<File | null>(null);
  const [queuedBanner, setQueuedBanner] = useState<File | null>(null);

  const [uploadingThumb, setUploadingThumb]   = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  /* ── refs for <input type=file> ───────────────────────────── */
  const thumbInputRef  = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  /* ── generic upload helper (Cloudinary) ───────────────────── */
  const { postData } = usePostAuthData<
    { image?: string; bannerUrl?: string },
    FormData
  >();

  const uploadFile = async (
    file: File,
    id: string,
    field: "image" | "banner"
  ) => {
    const fd = new FormData();
    fd.append(field, file);
    const endpoint =
      field === "image"
        ? `/categories/${id}/image`
        : `/categories/${id}/banner`;

    await postData(
      `${import.meta.env.VITE_API_BACKEND_URL}${endpoint}`,
      fd
    );
  };

  /* ── init / reset when dialog opens ------------------------ */
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description ?? "",
      });
      setThumbPreview(initialData.imageUrl ?? "");
      setBannerPreview(initialData.bannerUrl ?? "");
    } else {
      reset({ name: "", description: "" });
      setThumbPreview("");
      setBannerPreview("");
    }
    setQueuedThumb(null);
    setQueuedBanner(null);
  }, [initialData, reset, open]);

  /* ── handlers for file pick -------------------------------- */
  const handleLocalPick =
    (type: "thumb" | "banner") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const preview = URL.createObjectURL(file);
      if (type === "thumb") {
        setThumbPreview(preview);
        if (initialData) {
          // editing -- upload immediately
          setUploadingThumb(true);
          uploadFile(file, initialData._id, "image").finally(() =>
            setUploadingThumb(false)
          );
        } else {
          // adding -- queue until category exists
          setQueuedThumb(file);
        }
      } else {
        setBannerPreview(preview);
        if (initialData) {
          setUploadingBanner(true);
          uploadFile(file, initialData._id, "banner").finally(() =>
            setUploadingBanner(false)
          );
        } else {
          setQueuedBanner(file);
        }
      }
    };

  /* ── submit handler ---------------------------------------- */
  const onSubmit = async (payload: CategoryPayload) => {
    const savedCat = await onSave(payload); // parent will POST/PUT and return cat

    // If we were "add" and files were queued → upload now
    if (!initialData && savedCat) {
      if (queuedThumb) {
        setUploadingThumb(true);
        await uploadFile(queuedThumb, savedCat._id, "image").finally(() =>
          setUploadingThumb(false)
        );
      }
      if (queuedBanner) {
        setUploadingBanner(true);
        await uploadFile(queuedBanner, savedCat._id, "banner").finally(() =>
          setUploadingBanner(false)
        );
      }
    }

    onClose();
  };

  /* ── UI ----------------------------------------------------- */
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Edit Category" : "Add Category"}
      </DialogTitle>
      <Divider />

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* name + description */}
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

            {/* thumbnail */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Thumbnail (optional)
              </Typography>
              <Avatar
                src={thumbPreview}
                variant="rounded"
                sx={{ width: 90, height: 90, mb: 1 }}
              />
              {uploadingThumb ? (
                <CircularProgress size={24} />
              ) : (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => thumbInputRef.current?.click()}
                  >
                    Upload Thumb
                  </Button>
                  <input
                    ref={thumbInputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleLocalPick("thumb")}
                  />
                </Stack>
              )}
            </Grid>

            {/* banner */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Banner (optional)
              </Typography>
              <Avatar
                src={bannerPreview}
                variant="rounded"
                sx={{ width: "100%", height: 120, mb: 1 }}
              />
              {uploadingBanner ? (
                <CircularProgress size={24} />
              ) : (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => bannerInputRef.current?.click()}
                  >
                    Upload Banner
                  </Button>
                  <input
                    ref={bannerInputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleLocalPick("banner")}
                  />
                </Stack>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
