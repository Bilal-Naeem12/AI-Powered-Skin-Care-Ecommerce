/* ------------------------------------------------------------------
   src/components/Product/SimpleReviewSection.tsx
-------------------------------------------------------------------*/
import React, { useState } from "react";
import {
  Paper,
  Rating,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  IconButton,
} from "@mui/material";
import AddPhotoIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Dialog, DialogContent } from "@mui/material";
import useUserStore from "@/store/useUserStore";
import { motion } from "framer-motion";
import useFetchData from "@/hooks/useFetchData";
import { ProductReview } from "@/types/Product";

/* ---------- schema & types ---------- */
const FormSchema = z.object({
  rating: z.number().min(1).max(5),
  reviewText: z.string().min(10, "Write at least 10 characters").max(1000),
  images: z.string().url().array().max(4),
});
type FormValues = z.infer<typeof FormSchema>;

interface Props {
  productId: string;
}

/* ------------------------------------------------------------------ */
const SimpleReviewSection: React.FC<Props> = ({ productId }) => {
  const { user } = useUserStore();

  /* fetch existing reviews */
  const { data: reviews, loading, error } = useFetchData<
    ProductReview[]
  >(
    `${import.meta.env.VITE_API_BACKEND_URL}/products/${productId}/reviews`
  );
  const [openImage, setOpenImage] = useState<string | null>(null);
  /* form setup */
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { rating: 5, reviewText: "", images: [] },
  });
  const images = watch("images");

  /* send review */
  const onSubmit = async (data: FormValues) => {
    await axios.post(
      `${import.meta.env.VITE_API_BACKEND_URL}/products/${productId}/reviews`,
      {
        rating: data.rating,
        reviewText: data.reviewText,
        reviewImages: data.images, // backend expects this field
      },
      { withCredentials: true }
    );
    reset();
  };

  /* ui states */
  if (loading)
    return (
      <div className="flex justify-center py-10">
        <CircularProgress size={32} />
      </div>
    );
  if (error) return <p className="text-red-600">{error}</p>;

  /* ------------------------------------------------------------------ */
  return (
    <div className="space-y-6 p-6">
      {user && (
        <Paper elevation={1} className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">Leave a review</h3>

          {/* rating */}
          <Controller
            control={control}
            name="rating"
            render={({ field }) => (
              <Rating
                value={field.value}
                onChange={(_, v) => field.onChange(v)}
              />
            )}
          />

          {/* text */}
          <Controller
            control={control}
            name="reviewText"
            render={({ field }) => (
              <TextField
                {...field}
                label="Your review"
                multiline
                fullWidth
                minRows={3}
                error={!!errors.reviewText}
                helperText={errors.reviewText?.message}
              />
            )}
          />

          {/* image URLs (simple) */}
          <div>
            <p className="text-sm font-medium mb-1">Images (URL, max 4)</p>
            <div className="flex gap-2 flex-wrap">
              {images.map((url, idx) => (
                <Thumb key={url} url={url} onRemove={() => {
                  const next = [...images];
                  next.splice(idx, 1);
                  setValue("images", next);
                }} />
              ))}
              {images.length < 4 && (
                <IconButton
                  size="small"
                  onClick={() => {
                    const url = prompt("Paste image URL");
                    if (url) setValue("images", [...images, url.trim()]);
                  }}
                >
                  <AddPhotoIcon />
                </IconButton>
              )}
            </div>
            {errors.images && (
              <p className="text-xs text-red-600">{errors.images.message}</p>
            )}
          </div>

          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting…" : "Submit"}
          </Button>
        </Paper>
      )}

      {/* list reviews */}
      {(!reviews || reviews.length === 0) && (
        <p className="text-gray-500">No reviews yet.</p>
      )}
      {reviews?.map((rv) => (
        <Paper
          key={rv._id}
          className="p-4 bg-gray-50 border space-y-2"
          elevation={0}
        >
          <div className="flex items-center gap-2">
          <Avatar
  sx={{ width: 28, height: 28 }}
  src={rv.userId?.profileImage || "/assets/default-avatar.png"}
>
  {rv.userId?.first_name?.charAt(0).toUpperCase() || "U"}
</Avatar>
            <Rating readOnly value={rv.rating} size="small" />
            <span className="text-xs text-gray-600">
              {new Date(rv.createdAt ?? "").toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm">{rv.reviewText}</p>
          {rv.reviewImages?.length ? (
            <div className="flex gap-2 flex-wrap">
              {rv.reviewImages.map((img) => (
                <img
                  key={img}
                  src={img}
                  className="w-16 h-16 rounded object-cover hover:cursor-pointer hover:scale-110  transition-all "
                  onClick={() => setOpenImage(img)}
                />
              ))}
            </div>
          ) : null}
        </Paper>
      ))}
    <Dialog open={!!openImage} onClose={() => setOpenImage(null)} maxWidth="md">
  <DialogContent className="flex justify-center items-center p-0 bg-black">
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25 }}
    >
      <img
        src={openImage || ""}
        alt="Preview"
        className="w-full max-h-[80vh] object-contain rounded"
      />
    </motion.div>
  </DialogContent>
</Dialog>

    </div>
    
  );
};

export default SimpleReviewSection;

/* ---------- Thumb helper ---------- */
const Thumb: React.FC<{ url: string; onRemove: () => void }> = ({
  url,
  onRemove,
}) => (
  <div className="relative w-16 h-16 border rounded overflow-hidden">
    <img src={url} alt="" className="w-full h-full object-cover" />
    <IconButton
      size="small"
      className="!absolute !top-0 !right-0 !bg-white/70"
      onClick={onRemove}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  </div>
);
