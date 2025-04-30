// src/pages/InpaintingPage.tsx
import React, { useState } from "react";
import Breadcrumb from "@/component/UI/Breadcrumb";
import MainLayout from "@/component/Layout/MainLayout";
import useInpaintingStore from "@/store/useInpaintingStore"; // assume you have a zustand store similar to analysis
import { Skeleton } from "@mui/material";

const InpaintingPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const { inpaint, result, loading, error } = useInpaintingStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f) {
      setFile(f);
    }
  };

  const handleAnalyze = () => {
    if (file) inpaint(file);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb
          paths={[
            { name: "Home", link: "/" },
            { name: "AI Tools", link: "/ai-tools-page" },
            { name: "Inpainting", link: "/inpainting" },
          ]}
        />

        <h1 className="text-2xl font-bold text-gray-800">Acne Inpainting</h1>

        {/* File upload & button */}
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-2/3 text-sm text-gray-600
                       file:mr-4 file:py-2 file:px-4
                       file:border file:rounded file:text-sm
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Processing…" : "Start Inpainting"}
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}

        {/* Side-by-side cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Original</h2>
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Original"
                className="w-full h-64 object-contain rounded border"
              />
            ) : (
              <p className="text-sm text-gray-500">Upload an image above</p>
            )}
          </div>

          {/* Inpainted */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium text-gray-700 mb-2">
              Inpainted
            </h2>

            {loading ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={256}
                animation="wave"
              />
            ) : result?.inpainted_image ? (
              <img
                src={`data:image/jpeg;base64,${result.inpainted_image}`}
                alt="Inpainted"
                className="w-full h-64 object-contain rounded border"
              />
            ) : (
              <p className="text-sm text-gray-500">
                No inpainted result yet
              </p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default InpaintingPage;
