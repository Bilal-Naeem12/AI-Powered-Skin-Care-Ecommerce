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

  const handleCapture = () => {
    const snapshot = faceRef.current?.captureSnapshot();
    if (snapshot) {
      setCaptured(snapshot);
      onCapture(snapshot);
    } else {
      alert("Please align your face properly before capturing.");
    }
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


      {!constraintsMet && !captured && (
        <div className="text-sm text-gray-500 text-center">
          Make sure your face is inside the oval, look straight, and ensure good lighting.
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mt-4">
        {!captured && (
          <button
            onClick={handleCapture}
            disabled={!constraintsMet}
            className={`px-6 py-2 rounded-full text-white ${
              constraintsMet ? "bg-black hover:bg-gray-900" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Capture Now
          </button>
        )}

       
      </div>
    </div>
  );
};

export default UniversalCapture;
