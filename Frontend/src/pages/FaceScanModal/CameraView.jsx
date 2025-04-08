import React from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ResultButtons from "./ResultButtons";
import FaceScanner from "../../component/UI/FaceScanner";
import useFaceScanStore from "../../store/useFaceScanStore";

const CameraView = ({ viewState, countdown, startCapture, faceRef, capturedImage }) => {
  const {
      faceInsideOval, facingCamera, lightingOk 
    } = useFaceScanStore.getState();
    const constraintsMet = faceInsideOval && facingCamera && lightingOk;
  return (
    <div className="relative flex flex-col items-center justify-center">
      <div
        className={`relative border border-gray-300 rounded-lg w-[300px] h-[400px] bg-gray-100 flex items-center justify-center overflow-hidden ${
          viewState === "countdown" ? "opacity-50" : "opacity-100"
        } transition-opacity duration-500`}
      >
        {/* 👇 Show captured image when in result mode */}
        {viewState === "result" && capturedImage ? (
  <img src={capturedImage} alt="Captured" className="object-cover w-full h-full rounded-lg" />
) : (
  <FaceScanner ref={faceRef} />
)}

        
        {/* 👇 Countdown overlay */}
        {viewState === "countdown" && (
          <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-black z-10">
            {countdown}
          </div>
        )}

        {/* 👇 Loading spinner */}
        {viewState === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="loader border-t-2 border-black rounded-full w-12 h-12 animate-spin"></div>
          </div>
        )}
      </div>

      {/* 👇 Capture button */}
      {viewState === "capture" && (
  <button
    onClick={startCapture}
    disabled={!constraintsMet}
    className={`mt-6 px-6 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300 ${
      constraintsMet
        ? "bg-black text-white hover:bg-gray-800 cursor-pointer"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
  >
    <CameraAltIcon fontSize="small" />
    {constraintsMet ? "Capture" : "Align Face to Capture"}
  </button>
)}

    </div>
  );
};

export default CameraView;
