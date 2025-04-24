import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import Instructions from "./Instructions";
import CameraView from "./CameraView";
import ResultButtons from "./ResultButtons";
import useFaceScanStore from "../../../store/useFaceScanStore"; // Zustand store
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PredictionResponse } from "@/types/PredictionResponse";

const FaceScanModal: React.FC = () => {
  const [viewState, setViewState] = useState<"capture" | "countdown" | "loading" | "result">("capture");
  const [countdown, setCountdown] = useState<number>(3);

  const faceRef = useRef<any>(null); // Ref for face scanner
  const setFaceRef = useFaceScanStore((state) => state.setFaceRef);
  const navigate = useNavigate();

  const capturedImage = useFaceScanStore((state) => state.capturedImage);
  const setCapturedImage = useFaceScanStore((state) => state.setCapturedImage);
  const resetCapturedImage = useFaceScanStore((state) => state.resetCapturedImage);

  // Zustand store methods
  const { closeModal } = useFaceScanStore();

  useEffect(() => {
    setFaceRef(faceRef.current);
  }, [faceRef, setFaceRef]);

  const startCapture = () => {
    setViewState("countdown");

    let count = 3;
    setCountdown(count);

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
      count -= 1;

      if (count <= 0) {
        clearInterval(interval);
        setViewState("loading");

        setTimeout(() => {
          const base64Image = faceRef.current?.captureSnapshot();
          if (base64Image) {
            setCapturedImage(base64Image); // Store captured image in Zustand
            console.log("✅ Snapshot Captured");
          } else {
            console.error("❌ faceRef is null or image not captured");
          }
          setViewState("result");
        }, 500);
      }
    }, 1000);
  };

  const handleAnalyze = async () => {
    const {
      closeModal,
      capturedImage,
      setDetectedImage,
      setDetections,
      showLoading,
      hideLoading,
    } = useFaceScanStore.getState();

    if (!capturedImage) return;

    // Convert base64 to Blob
    const byteString = atob(capturedImage.split(",")[1]);
    const mimeString = capturedImage.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    const formData = new FormData();
    formData.append("file", blob);

    try {
      closeModal();
      showLoading();

      
  const response = await axios.post<PredictionResponse>(
    `${import.meta.env.VITE_API_FASTAPI}/acne/predict`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  const result = response.data.result;
  setDetections(result.detections);
  setDetectedImage(`data:image/jpeg;base64,${result.labeled_image}`);

      navigate("/analyze-page");
    } catch (err) {
      console.error("❌ Error analyzing image:", err);
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <motion.div
        className="relative bg-white rounded-lg w-[90%] max-w-md p-6 shadow-xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-black">
          <CloseIcon fontSize="medium" />
        </button>

        <Instructions />

        <CameraView
          viewState={viewState}
          countdown={countdown}
          startCapture={startCapture}
          faceRef={faceRef}
          capturedImage={capturedImage}
        />

        {viewState === "result" && (
          <ResultButtons
            resetCapture={() => {
              resetCapturedImage(); // Reset image via Zustand
              setViewState("capture"); // Reset view locally
            }}
            analyzeCapture={handleAnalyze}
          />
        )}
      </motion.div>
    </div>
  );
};

export default FaceScanModal;
