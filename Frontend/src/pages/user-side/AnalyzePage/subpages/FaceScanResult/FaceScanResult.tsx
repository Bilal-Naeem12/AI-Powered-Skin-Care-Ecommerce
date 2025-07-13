// src/components/FaceScanResult.tsx
import React, { useState } from "react";
import useSkinAnalysisStore from "@/store/SkinAnalysis";
import { Classification, Classifications, Detections } from "@/types/SkinAnalysisResult";
import {  useNavigate } from "react-router-dom";
const severityLabelMap: Record<string, string> = {
  "level -1": "Clear",
  "level 0": "Mild",
  "level 1": "Moderate",
  "level 2": "Severe",
  "level 3": "Very Severe"
};



const FaceScanResult: React.FC = () => {
  const { result,triggerInpaint } = useSkinAnalysisStore();
  const [showScores, setShowScores] = useState(false);

const navigate = useNavigate()
  if (!result) {
    return (
      <div className="p-6 text-center text-gray-500">
        No analysis yet. Upload an image to see results.
      </div>
    );
  }

  const { detections, classifications, scanned_image } = result;

  return (
    <div className="space-y-6 px-6 pt-2 pb-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-extrabold text-gray-800 text-start">
        Face Scan Results
      </h2>

    <div className="relative">
  {/* Image */}
  <img
    src={`data:image/jpeg;base64,${scanned_image}`}
    alt="Annotated result"
    className="w-fit h-auto object-contain rounded-md border"
  />

  {/* Sticky AI Button */}
 {detections.acne.objects.length>0  && <div className="absolute top-4 right-4 z-10">
    <div className="sticky top-20">
      <button
        onClick={() => {navigate("/ai-tools-page/inpainting"); triggerInpaint(); }}
        className="group relative flex items-center h-14 w-14 rounded-full transition-all duration-300 shadow-lg overflow-hidden hover:w-40"
        style={{
          backgroundImage: "linear-gradient(to right, #a855f7, #ec4899, #3b82f6)",
        }}
      >
        {/* Icon Container */}
        <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full z-10 transition-transform duration-300 group-hover:translate-x-1">
          <span className="text-yellow-500 text-xl">✨</span>
        </div>

        {/* Sliding Text */}
        <span className="absolute left-14 opacity-0 whitespace-nowrap text-white font-medium transition-all duration-300 group-hover:opacity-100 group-hover:left-16">
          See a Magic
        </span>
      </button>
    </div>
  </div>}
</div>

      {/* Detections */}
      <h3 className="text-xl font-semibold text-gray-800">Detections</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(["acne", "puffy_eyes"] as (keyof Detections)[]).map((key) => {
          const objs = detections[key].objects;
          const color = key === "acne" ? "red" : "green";
          const title = key === "acne" ? "Acne Spots" : "Puffy Eyes";

          return (
            <div
              key={key}
              className="p-4 bg-gray-50 rounded-lg border-l-4"
              style={{ borderColor: color === "red" ? "#ef4444" : "#10b981" }}
            >
              <h3 className="text-md font-semibold text-gray-700 mb-2">
                {title} ({objs.length})
              </h3>
            
            </div>
          );
        })}
      </div>

      {/* Classifications */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Classifications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            Object.entries(classifications) as [keyof Classifications, Classifications][]
          ).map(([name, cls ]) => (
            <div
              key={name}
              className="p-4 bg-gray-50 rounded-lg border shadow-sm"
            >
              <p className="capitalize text-gray-600">{name.replace("_", " ")} (score)</p>
              <p className="text-2xl font-bold text-gray-800 capitalize">
  {(name === "acne_severity" ? severityLabelMap[cls.label] || cls.label : cls.label)}
  <span className="text-gray-500"> ({cls.score})</span>
</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowScores((v) => !v)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showScores ? "Hide" : "Show"} all confidence scores
        </button>

        {showScores && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(
              Object.entries(classifications) as [keyof Classifications, Classification][]
            ).map(([name, cls]) => (
              <div key={name} className="p-3 bg-white rounded-lg border">
                <p className="font-medium mb-2 capitalize">
                  {name.replace("_", " ")} scores
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 capitalize">
                {Object.entries(cls.all_scores).map(([lbl, sc]) => {
  const mappedLabel = severityLabelMap[lbl] || lbl;
  return (
    <li key={lbl}>
      {mappedLabel}: {sc}
    </li>
  );
})}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceScanResult;
