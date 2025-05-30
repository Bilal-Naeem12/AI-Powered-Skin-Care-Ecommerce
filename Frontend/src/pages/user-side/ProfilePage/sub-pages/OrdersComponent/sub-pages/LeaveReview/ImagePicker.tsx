import React, { useState, ChangeEvent, useEffect } from "react";
import { X, Upload } from "lucide-react";
import axios from "axios";
import usePostAuthData from "@/hooks/usePostAuthData";

interface Props {
  productId: string;                // used in request URL
  onUploaded: (urls: string[]) => void;
}

export default function ImagePicker({ productId, onUploaded }: Props) {
  const [files, setFiles] = useState<File[]>([]);
//   const [loading, setLoading] = useState(false);
const { data: resp, loading, postData } =                 // ⬅️ NEW
  usePostAuthData<{ images: string[] }, FormData>();
const [justUploaded, setJustUploaded] = useState(false);

  /* --- drag / drop --- */
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

  /* --- upload to backend --- */
const upload = async () => {
  if (!files.length) return;

  const form = new FormData();
  files.forEach((f) => form.append("images", f));
    setJustUploaded(true); // ✅ mark that we're uploading
await postData(                                    // ⬅️ NEW
   `${import.meta.env.VITE_API_BACKEND_URL}/products/${productId}/review/images`,          // relative URL
   form,                                            // payload
   "Images uploaded successfully!"                  // toast message
 );



};
useEffect(() => {
  if (justUploaded && resp?.images?.length) {
    onUploaded(resp.images);       // ✅ use actual response
    setFiles([]);                  // ✅ reset files
    setJustUploaded(false);       // ✅ reset flag
  }
}, [resp, justUploaded]);          // ✅ run when resp updates
  return (
    <div className="space-y-3">
      {/* drop-zone */}
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

      {/* previews */}
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

      {/* upload button */}
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
