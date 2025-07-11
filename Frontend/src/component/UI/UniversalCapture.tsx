import React, { useEffect, useRef, useState } from "react";
import FaceScanner, { FaceScannerHandle } from "./FaceScanner";
import useFaceScanStore from "@/store/FaceScanStore";

interface Props {
  onCapture: (dataUrl: string) => void;
  title: string;
  description: string;
}

const UniversalCapture: React.FC<Props> = ({ onCapture, title, description }) => {
  const faceRef = useRef<FaceScannerHandle>(null);
  const { faceInsideOval, facingCamera, lightingOk } = useFaceScanStore();
  const constraintsMet = faceInsideOval && facingCamera && lightingOk;

  const [captured, setCaptured] = useState<string | null>(null);

  // Auto-capture when constraints are met
  useEffect(() => {
    if (constraintsMet && !captured) {
      const snapshot = faceRef.current?.captureSnapshot();
      if (snapshot) {
        setCaptured(snapshot);
        onCapture(snapshot);
      }
    }
  }, [constraintsMet, captured, onCapture]);

  const handleRecapture = () => {
    setCaptured(null);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center">{title}</h2>
      <p className="text-gray-600 text-center max-w-md">{description}</p>

      <div className="relative w-full max-w-[600px] mx-auto aspect-video border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
        {captured ? (
          <img
            src={captured}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        ) : (
          <FaceScanner ref={faceRef} />
        )}
      </div>

      {/* --- Live constraints status like CameraView --- */}
      {!captured && (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <div className="flex items-center gap-1">
            <span
              className={`w-3 h-3 rounded-full ${
                lightingOk ? "bg-green-600" : "bg-red-500"
              }`}
            ></span>
            <span className="text-sm">Low Lighting</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`w-3 h-3 rounded-full ${
                faceInsideOval ? "bg-green-600" : "bg-red-500"
              }`}
            ></span>
            <span className="text-sm">Adjust Face</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`w-3 h-3 rounded-full ${
                facingCamera ? "bg-green-600" : "bg-yellow-500"
              }`}
            ></span>
            <span className="text-sm">Look Straight</span>
          </div>
        </div>
      )}

      {/* --- Helper text --- */}
      {!constraintsMet && !captured && (
        <div className="text-sm text-gray-500 text-center mt-2">
          Align your face inside the oval, face the camera directly, and ensure good lighting to auto-capture.
        </div>
      )}

      {/* --- Buttons after capture --- */}
      {captured && (
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <button
            onClick={() => onCapture(captured)}
            className="px-6 py-2 rounded-full bg-black text-white hover:bg-gray-900"
          >
            Continue
          </button>
          <button
            onClick={handleRecapture}
            className="px-6 py-2 rounded-full bg-gray-200 text-black hover:bg-gray-300"
          >
            Recapture
          </button>
        </div>
      )}
    </div>
  );
};

export default UniversalCapture;
