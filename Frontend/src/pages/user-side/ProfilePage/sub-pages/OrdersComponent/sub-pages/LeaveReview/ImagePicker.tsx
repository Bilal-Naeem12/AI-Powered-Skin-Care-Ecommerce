import React, { useState, ChangeEvent, useEffect } from "react";
import { X, Upload } from "lucide-react";
import axios from "axios";
import usePostAuthData from "@/hooks/usePostAuthData";

interface Props {
  productId: string;                // used for default fallback URL
  onUploaded: (urls: string[]) => void;

  /**
   * Optional: fully custom upload endpoint.
   * If not provided, fallback is `/api/products/{productId}/review/images`
   */
  uploadUrl?: string;
}

export default function ImagePicker({ productId, onUploaded, uploadUrl }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const { data: resp, loading, postData } =
    usePostAuthData<{ images: string[] }, FormData>();

  const [justUploaded, setJustUploaded] = useState(false);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles = Array.from(fileList).slice(0, 6 - files.length);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const remove = (idx: number) => setFiles(files.filter((_, i) => i !== idx));

  const upload = async () => {
    if (!files.length) return;

    const form = new FormData();
    files.forEach((f) => form.append("images", f));

    setJustUploaded(true);

    // ✅ fallback to default if no custom `uploadUrl` given
    const targetUrl =uploadUrl?
      `${import.meta.env.VITE_API_BACKEND_URL}${uploadUrl}` :
      `${import.meta.env.VITE_API_BACKEND_URL}/products/${productId}/review/images`;

    await postData(targetUrl, form, "Images uploaded successfully!");
  };

  useEffect(() => {
    if (justUploaded && resp?.images?.length) {
      onUploaded(resp.images);
      setFiles([]);
      setJustUploaded(false);
    }
  }, [resp, justUploaded]);

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        className="border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        <p className="text-sm text-gray-600">
          Drag & drop images here, or click to select&nbsp;(max&nbsp;6)
        </p>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleFiles(e.target.files)
          }
        />
      </div>

      {/* Previews */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((f, idx) => (
            <div key={idx} className="relative w-20 h-20">
              <img
                src={URL.createObjectURL(f)}
                className="w-full h-full object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => remove(idx)}
                className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <button
        type="button"
        disabled={!files.length || loading}
        onClick={upload}
        className="flex items-center gap-2 bg-orange-500 text-white px-4 py-1.5 rounded disabled:opacity-40"
      >
        <Upload size={16} />
        {loading ? "Uploading…" : "Upload"}
      </button>
    </div>
  );
}
