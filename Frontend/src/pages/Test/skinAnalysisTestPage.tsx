// src/pages/SkinAnalysisTestPage.tsx
import React, { useState } from "react";
import axios from "axios";
import { SkinAnalysisResult } from "@/types/SkinAnalysisResult";

// —— TypeScript interfaces ——


const SkinAnalysisTestPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<SkinAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null);
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Select an image first.");
      return;
    }
    setLoading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const resp = await axios.post<SkinAnalysisResult>(
        `${import.meta.env.VITE_API_FASTAPI}/skin_analysis/predict`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(resp.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Skin Analysis</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="block w-full text-sm text-gray-600
        file:mr-4 file:py-2 file:px-4
        file:rounded file:border-0
        file:text-sm file:font-semibold
        file:bg-green-50 file:text-blue-700
        hover:file:bg-blue-100 mb-4"
      />

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-full object-contain rounded mb-4"
        />
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50 mb-4"
      >
        {loading ? "Analyzing…" : "Upload & Analyze"}
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {result && (
        <div className="space-y-6">
         
          <div>
  <h2 className="font-semibold">Classifications</h2>
  <div className="grid grid-cols-2 gap-4">
    {Object.entries(result.classifications).map(
      ([clsName, clsData]) => (
        <div key={clsName}>
          <p className="capitalize">{clsName.replace("_", " ")}</p>
          <p className="text-sm mb-1">
            <span className="font-medium">Predicted:</span>{" "}
            {clsData.label} ({clsData.score})
          </p>
          <p className="text-xs font-medium">All scores:</p>
          <ul className="text-xs list-disc list-inside">
            {Object.entries(clsData.all_scores).map(
              ([lbl, sc]) => (            // ← destructure both here
                <li key={lbl}>
                  {lbl}: {sc as String}
                </li>
              )
            )}
          </ul>
        </div>
      )
    )}
  </div>
</div>

          <div>
            <h2 className="font-semibold">Combined Image</h2>
            <img
              src={`data:image/jpeg;base64,${result.scanned_image}`}
              alt="annotated"
              className="w-full rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SkinAnalysisTestPage;
