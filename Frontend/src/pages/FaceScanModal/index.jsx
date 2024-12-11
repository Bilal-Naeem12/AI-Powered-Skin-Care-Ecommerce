import React, { useState } from "react";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import Instructions from "./Instructions";
import CameraView from "./CameraView";
import ResultButtons from "./ResultButtons";

const FaceScanModal = ({ onClose, onAnalyze }) => {
  const [viewState, setViewState] = useState("capture"); // 'capture', 'countdown', 'loading', 'result'
  const [countdown, setCountdown] = useState(3);

  const startCapture = () => {
    setViewState("countdown");

    let count = 3;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
      count -= 1;

      if (count <= 0) {
        clearInterval(interval);
        setViewState("loading");

        setTimeout(() => {
          setViewState("result");
        }, 2000); // Simulate loading
      }
    }, 1000);
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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <CloseIcon fontSize="medium" />
        </button>

        {/* Instructions */}
        <Instructions />

        {/* Camera View */}
        <CameraView
          viewState={viewState}
          countdown={countdown}
          startCapture={startCapture}
        />

        {/* Result Buttons */}
        {viewState === "result" && (
          <ResultButtons
            resetCapture={() => setViewState("capture")}
            analyzeCapture={onAnalyze} // Call the onAnalyze function passed from MainLayout
          />
        )}
      </motion.div>
    </div>
  );
};

export default FaceScanModal;
