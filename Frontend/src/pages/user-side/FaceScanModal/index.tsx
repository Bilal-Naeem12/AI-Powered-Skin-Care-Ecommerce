import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import Instructions from "./Instructions";
import CameraView from "./CameraView";
import ResultButtons from "./ResultButtons";
import useFaceScanStore from "@/store/useFaceScanStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {  SkinAnalysisResult } from "@/types/SkinAnalysisResult";
import useSkinAnalysisStore from "@/store/useSkinAnalysis";

const FaceScanModal: React.FC = () => {
  /* ------------ local state ------------------------------------------------ */
  const [viewState, setViewState] = useState<
    "capture" | "countdown" | "loading" | "result"
  >("capture");
  const [countdown, setCountdown] = useState<number>(3);

  /* ------------ refs ------------------------------------------------------- */
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const faceRef = useRef<any>(null); // exposed by <FaceScanner />

  /* ------------ zustand shortcuts ----------------------------------------- */
  const {
    capturedImage,
    setCapturedImage,
    resetCapturedImage,
    setFaceRef,
    closeModal,
    showLoading,
    hideLoading,
  } = useFaceScanStore();

  const {
    result,
    loading,
    error,
    analyzeSkin,
    clearResult,
  } = useSkinAnalysisStore();

  const navigate = useNavigate();

  /* expose faceRef to other components via store */
  useEffect(() => {
    setFaceRef(faceRef.current);
  }, [setFaceRef]);

  /* ------------ countdown logic ------------------------------------------- */
  const startCountdown = () => {
    setViewState("countdown");
    setCountdown(3);
    let count = 3;

    intervalRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);

      if (count <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        captureImage();
      }
    }, 1_000);
  };

  /** abort if constraints break mid-countdown */
  const abortCountdown = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCountdown(3);
    setViewState("capture");
  };

  /** take snapshot & switch to loading → result */
  const captureImage = () => {
    setViewState("loading");

    setTimeout(() => {
      const base64Image = faceRef.current?.captureSnapshot();
      if (base64Image) {
        setCapturedImage(base64Image);
        console.log("✅ Snapshot Captured");
      } else {
        console.error("❌ faceRef is null or image not captured");
      }
      setViewState("result");
    }, 500);
  };

  /* clear interval on unmount */
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /* ------------ analyse ---------------------------------------------------- */
  const handleAnalyze = async () => {
    
    if (!capturedImage) return;

    // base64 → blob
    const [meta, data] = capturedImage.split(",");
    const mime = meta.match(/data:(.+);base64/)?.[1] ?? "image/jpeg";
    const byteStr = atob(data);
    const bytes = Uint8Array.from(byteStr, (b) => b.charCodeAt(0));
    const blob = new Blob([bytes], { type: mime });

    const fd = new FormData();
    fd.append("file", blob);

    try {
      close();
      showLoading();
      clearResult();               // reset any prior result
      await analyzeSkin(fd); 
  
     
      navigate("/ai-tools-page/skin-analysis");
    } catch (err) {
      console.error("❌ Error analyzing image:", err);
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <motion.div
        className="relative bg-white rounded-lg w-[90%] max-w-md p-6 shadow-xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <CloseIcon fontSize="medium" />
        </button>

        <Instructions />

        <CameraView
          viewState={viewState}
          countdown={countdown}
          startCountdown={startCountdown}
          abortCountdown={abortCountdown}
          faceRef={faceRef}
          capturedImage={capturedImage}
        />

        {viewState === "result" && (
          <ResultButtons
            resetCapture={() => {
              resetCapturedImage();
              setViewState("capture");
            }}
            analyzeCapture={handleAnalyze}
          />
        )}
      </motion.div>
    </div>
  );
};

export default FaceScanModal;
