// src/pages/SkinTypeTestPage.tsx
import React, { useState } from "react";
import axios from "axios";

type SkinTypeResult = {
  label: string;
  score: number;
  all_scores: Record<string, number>;
  labeled_image: string;
};

const SkinTypeTestPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<SkinTypeResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
      setError("Please select an image first.");
      return;
    }
    setLoading(true);
    setError("");
    const form = new FormData();
    form.append("file", file);

    try {
      const resp = await axios.post<SkinTypeResult>(
        `${import.meta.env.VITE_API_FASTAPI}/skin_type/predict`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(resp.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to classify skin type.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Skin Type Classifier
      </h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="block w-full text-sm text-gray-600
                   file:mr-4 file:py-2 file:px-4
                   file:rounded file:border-0
                   file:text-sm file:font-semibold
                   file:bg-green-50 file:text-green-700
                   hover:file:bg-green-100 mb-4"
      />

      {preview && (
        <div className="mb-4">
          <p className="text-gray-600 mb-2">Preview:</p>
          <img
            src={preview}
            alt="preview"
            className="w-full object-contain rounded-md border"
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md 
                   hover:bg-green-700 disabled:opacity-50 mb-4"
      >
        {loading ? "Classifying..." : "Upload & Classify"}
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {result && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-gray-600">Predicted Skin Type:</p>
              <p className="text-xl font-bold">
                {result.label} ({result.score})
              </p>
            </div>
            <img
              src={`data:image/jpeg;base64,${result.labeled_image}`}
              alt="annotated"
              className="w-24 h-24 object-cover rounded-md border"
            />
          </div>

          <div>
            <p className="text-gray-600 mb-2">All Class Probabilities:</p>
            <ul className="grid grid-cols-2 gap-2">
              {Object.entries(result.all_scores).map(([lbl, sc]) => (
                <li key={lbl} className="text-sm">
                  <span className="font-medium">{lbl}:</span> {sc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkinTypeTestPage;
