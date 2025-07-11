import React, { useEffect, useRef, useState } from "react";
import FaceScanner, { FaceScannerHandle } from "./FaceScanner";
import useFaceScanStore from "@/store/FaceScanStore";

interface Props {
  onCapture: (dataUrl: string) => void;
   onContinue: () => void;
  title: string;
  description: string;
}

const UniversalCapture: React.FC<Props> = ({ onCapture, onContinue,title, description }) => {
  const faceRef = useRef<FaceScannerHandle>(null);
  const { faceInsideOval, facingCamera, lightingOk } = useFaceScanStore();
  const constraintsMet = faceInsideOval && facingCamera && lightingOk;

  const [captured, setCaptured] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start countdown when constraints met
  useEffect(() => {
    if (constraintsMet && !captured && countdown === null) {
      setCountdown(3);
    }
    if (!constraintsMet && countdown !== null) {
      clearTimeout(timerRef.current!);
      setCountdown(null);
    }
    return () => clearTimeout(timerRef.current!);
  }, [constraintsMet, captured, countdown]);

  // Tick down by 1 each second
  useEffect(() => {
    if (countdown === null || countdown === 0 || captured) return;

    timerRef.current = setTimeout(() => {
      setCountdown((prev) => {
        if (!prev) return null;
        if (prev === 1) {
          // Final tick - capture!
          const snapshot = faceRef.current?.captureSnapshot();
          if (snapshot) {
            setCaptured(snapshot);
            onCapture(snapshot);
          } else {
            alert("❌ Could not capture snapshot. Please try again.");
            return null;
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timerRef.current!);
  }, [countdown, captured, onCapture]);

  const handleRecapture = () => {
    setCaptured(null);
    setCountdown(null);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center">{title}</h2>
      <p className="text-gray-600 text-center max-w-md">{description}</p>

      <div className="relative w-full max-w-[800px] mx-auto aspect-[8/7] border border-gray-300 rounded-xl overflow-hidden bg-black">
        {captured ? (
          <img src={captured} alt="Captured" className="w-full h-full object-cover" />
        ) : (
          <FaceScanner ref={faceRef} />
        )}

        {countdown !== null && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-white bg-black/50 z-10">
            {countdown}
          </div>
        )}
      </div>

      {!captured && (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <div className="flex items-center gap-1">
            <span
              className={`w-3 h-3 rounded-full ${lightingOk ? "bg-green-600" : "bg-red-500"}`}
            ></span>
            <span className="text-sm">Low Lighting</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`w-3 h-3 rounded-full ${faceInsideOval ? "bg-green-600" : "bg-red-500"}`}
            ></span>
            <span className="text-sm">Adjust Face</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`w-3 h-3 rounded-full ${facingCamera ? "bg-green-600" : "bg-yellow-500"}`}
            ></span>
            <span className="text-sm">Look Straight</span>
          </div>
        </div>
      )}

      {!constraintsMet && !captured && (
        <div className="text-sm text-gray-500 text-center mt-2">
          Align your face inside the oval, look straight, and ensure good lighting to start auto-capture.
        </div>
      )}

      {captured && (
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <button
            onClick={() => onContinue()}
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
