import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VideocamIcon from "@mui/icons-material/Videocam";
import CheckIcon from "@mui/icons-material/Check";
import ReplayIcon from "@mui/icons-material/Replay";
import useFaceScanStore from "@/store/useFaceScanStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SkinAnalysisResult } from "@/types/SkinAnalysisResult";
import useSkinAnalysisStore from "@/store/useSkinAnalysis";

type Step = "choice" | "preview" | "uploading";

const FaceScanEntry: React.FC<{ closeAll: () => void }> = ({ closeAll }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("choice");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    openModal: openLiveModal,
    showLoading,
    hideLoading,
    setDetectedImage,
    setDetections,
  } = useFaceScanStore();
  const {
    result,
    loading,
    error,
    analyzeSkin,
    clearResult,
  } = useSkinAnalysisStore();

  const navigate = useNavigate();

  /* select-file handler ---------------------------------------------------- */
  const handleChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setStep("preview");
  };

  /* confirm & upload ------------------------------------------------------- */
  const handleAnalyze = async () => {
    if (!file) return;
    setStep("uploading");
    showLoading();

    const fd = new FormData();
    fd.append("file", file);

    try {
      clearResult();               // reset any prior result
    await analyzeSkin(fd); 

      setDetectedImage(`data:image/jpeg;base64,${result?.scanned_image}`);
      // setDetections(resp.data.acne.detections.concat(resp.data.puffy_eyes.detections));
      closeAll();
      navigate("/ai-tools-page/skin-analysis");
    } catch (err) {
      console.error("❌ upload-analysis failed", err);
    } finally {
      hideLoading();
    }
  };

  /* reset selection -------------------------------------------------------- */
  const resetSelection = () => {
    setFile(null);
    setPreviewUrl(null);
    setStep("choice");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <motion.div
        className="relative bg-white rounded-lg w-[90%] max-w-xl p-6 shadow-xl flex flex-col gap-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={closeAll}
          className="absolute top-4 right-2 text-gray-500 hover:text-black"
        >
          <CloseIcon fontSize="medium" />
        </button>

        {step === "choice" && (
          <>
            <h2 className="text-xl font-semibold text-center">
              How would you like to analyze your skin?
            </h2>

            {/* upload */}
            <button
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-secondary text-white hover:bg-secondary/90 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUploadIcon /> Upload Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChooseFile}
            />

            {/* live */}
            <button
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
              onClick={() => {
                closeAll();
                openLiveModal();
              }}
            >
              <VideocamIcon /> Live Analysis
            </button>
          </>
        )}

        {step === "preview" && previewUrl && (
          <>
            <h2 className="text-lg font-semibold text-center">Preview</h2>
            <img
              src={previewUrl}
              alt="preview"
              className="w-full h-72 object-contain rounded-md border"
            />

            <div className="flex gap-3">
            
              <button
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400"
                onClick={resetSelection}
              >
                <ReplayIcon /> Choose another
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-secondary text-white hover:bg-secondary/90"
                onClick={handleAnalyze}
              >
                <CheckIcon /> Analyze
              </button>
            </div>
          </>
        )}

        {step === "uploading" && (
          <p className="text-center text-sm text-gray-600">
            Uploading &amp; analyzing…
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default FaceScanEntry;
