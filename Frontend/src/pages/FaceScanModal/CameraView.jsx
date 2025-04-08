import React from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ResultButtons from "./ResultButtons";
import FaceScanner from "../../component/UI/FaceScanner";

const CameraView = ({ viewState, countdown, startCapture }) => {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <div
        className={`relative border border-gray-300 rounded-lg w-[300px] h-[400px] bg-gray-100 flex items-center justify-center ${
          viewState === "countdown" ? "opacity-50" : "opacity-100"
        } transition-opacity duration-500`}
      >
        {/* Capture View */}
        {viewState === "capture" && (
         <FaceScanner />
        )}

        {/* Countdown View */}
        {viewState === "countdown" && (
       <div className="relative w-full h-full">
       {/* Image */}
       <img
         src="/assets/face-image.jpg" // Replace with a real camera feed or placeholder
         alt="Camera View"
         className="object-cover w-full h-full rounded-lg"
       />
     
       {/* Countdown */}
       <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-black">
         {countdown}
       </div>
     </div>
        )}

        {/* Loading View */}
        {viewState === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="loader border-t-2 border-black rounded-full w-12 h-12 animate-spin"></div>
          </div>
        )}

        {/* Result View */}
        {viewState === "result" && (
          <img
            src="/assets/face-image.jpg" // Display the captured image
            alt="Captured"
            className="object-cover w-full h-full rounded-lg"
          />
        )}
      </div>

      {/* Capture Button */}
      {viewState === "capture" && (
        <button
          onClick={startCapture}
          className="mt-6 bg-black text-white px-6 py-2 rounded-full shadow-lg flex items-center gap-2"
        >
          <CameraAltIcon fontSize="small" />
          Capture
        </button>
      )}

    
    </div>
  );
};

export default CameraView;
