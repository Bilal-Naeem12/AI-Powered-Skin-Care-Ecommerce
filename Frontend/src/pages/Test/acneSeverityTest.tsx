// src/pages/AcneSeverityTestPage.tsx
import React, { useState } from "react";
import axios from "axios";

type SeverityResult = {
    severity: {
      label: string;
      score: number;
      all_scores: Record<string, number>;
    };
  };

export const AcneSeverityTestPage: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<SeverityResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] ?? null;
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      setError("Please select an image first.");
      return;
    }
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const resp = await axios.post<SeverityResult>(
        `${import.meta.env.VITE_API_FASTAPI}/acne_severity/predict`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(resp.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to get severity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Acne Severity Grader</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-600
                   file:mr-4 file:py-2 file:px-4
                   file:rounded file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100 mb-4"
      />

      {previewUrl && (
        <div className="mb-4">
          <p className="text-gray-600 mb-2">Preview:</p>
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full object-contain rounded-md border"
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md 
                   hover:bg-blue-700 disabled:opacity-50 mb-4"
      >
        {loading ? "Analyzing..." : "Upload & Grade Severity"}
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {result && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-gray-600">Predicted Severity:</p>
              <p className="text-xl font-bold">{result.severity.label} ({result.severity.score})</p>
            </div>
          
          </div>

          <div>
            <p className="text-gray-600 mb-2">All Class Probabilities:</p>
            {result?.severity?.all_scores && (
  <ul className="grid grid-cols-2 gap-2">
    {Object.entries(result.severity.all_scores).map(([lbl, sc]) => (
      <li key={lbl} className="text-sm">
        <span className="font-medium">{lbl}:</span> {sc}
      </li>
    ))}
  </ul>
)}

          </div>
        </div>
      )}
    </div>
  );
};

export default AcneSeverityTestPage;
