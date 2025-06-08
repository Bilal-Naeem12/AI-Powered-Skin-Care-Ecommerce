import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Instructions from "@/component/UI/Instructions";
import CameraView from "@/component/UI/CameraView";
import ResultButtons from "@/component/UI/ResultButtons";
import useFaceScanStore from "@/store/useFaceScanStore";
import useSkinAnalysisStore from "@/store/useSkinAnalysis";

const SkinAnalyzerComponent: React.FC = () => {
  const [viewState, setViewState] = useState<
    "capture" | "countdown" | "loading" | "result"
  >("capture");
  const [countdown, setCountdown] = useState<number>(3);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const faceRef = useRef<any>(null);

  const {
    capturedImage,
    setCapturedImage,
    resetCapturedImage,
    setFaceRef,
    showLoading,
    hideLoading,
  } = useFaceScanStore();

  const {
    analyzeSkin,
    clearResult,
  } = useSkinAnalysisStore();

  const navigate = useNavigate();

  useEffect(() => {
    setFaceRef(faceRef.current);
  }, [setFaceRef]);

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
    }, 1000);
  };

  const abortCountdown = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCountdown(3);
    setViewState("capture");
  };

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

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleAnalyze = async () => {
    if (!capturedImage) return;

    const [meta, data] = capturedImage.split(",");
    const mime = meta.match(/data:(.+);base64/)?.[1] ?? "image/jpeg";
    const byteStr = atob(data);
    const bytes = Uint8Array.from(byteStr, (b) => b.charCodeAt(0));
    const blob = new Blob([bytes], { type: mime });

    const fd = new FormData();
    fd.append("file", blob);

    try {
      showLoading();
      clearResult();
      await analyzeSkin(fd);
      navigate("/ai-tools-page/skin-analysis");
    } catch (err) {
      console.error("❌ Error analyzing image:", err);
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100  px-4 flex flex-col items-center justify-start">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
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
      </div>
    </div>
  );
};

export default SkinAnalyzerComponent;
