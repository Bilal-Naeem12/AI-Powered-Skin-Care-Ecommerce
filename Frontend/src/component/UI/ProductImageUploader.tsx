/* ────────────────────────────────────────────────────────────────
   src/components/ProductImageUploader.tsx
──────────────────────────────────────────────────────────────── */
import React, { useState } from "react";
import axios from "axios";
import { Button, CircularProgress, TextField } from "@mui/material";
import { toast } from "react-toastify";

/** REST response shape */
interface UploadResponse {
  images: string[];
  message: string;
}

const ProductImageUploader: React.FC = () => {
  const [productId, setProductId] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  /* choose files */
  const handleSelect: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  /* upload to backend */
  const upload = async () => {
    if (!files.length || !productId.trim()) {
      toast.error("Please enter a Product ID and select images.");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      files.forEach((f) => form.append("images", f));

      const { data } = await axios.post<UploadResponse>(
        `${import.meta.env.VITE_API_BACKEND_URL}/products/${productId}/images`,
        form,
        { withCredentials: true }
      );

      toast.success(data.message);
      setFiles([]);
      setProductId("");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded space-y-4 max-w-sm">
      {/* Product ID Input */}
      <TextField
        label="Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        fullWidth
        size="small"
        required
      />

      {/* File Picker */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleSelect}
        className="block"
      />

      {/* Selected File Count */}
      {files.length > 0 && (
        <p className="text-sm text-gray-600">
          {files.length} image{files.length > 1 ? "s" : ""} selected
        </p>
      )}

      {/* Upload Button */}
      <Button
        variant="contained"
        fullWidth
        disabled={loading || !productId.trim() || files.length === 0}
        onClick={upload}
      >
        {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Upload"}
      </Button>
    </div>
  );
};

export default ProductImageUploader;
