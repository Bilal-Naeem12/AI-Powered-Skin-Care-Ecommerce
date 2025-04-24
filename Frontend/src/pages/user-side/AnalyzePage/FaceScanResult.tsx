import React from "react";
import useFaceScanStore from "../../../store/useFaceScanStore"; // Adjust path as needed
import anaylsispic from "@/assets/anaylsis.png"; // Adjust path as needed

const FaceScanResult = () => {
  
const { detectedImage } = useFaceScanStore();

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-bold mb-4">Face Scan Results</h3>
    
  <img
    src={detectedImage 
    || anaylsispic
    }
    alt="Detected Result"
    className="w-full rounded-lg mb-4"
  />

      <div className="flex gap-5 items-center text-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 bg-green-500 rounded-full"></span>
          <span>Acne</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 bg-red-500 rounded-full"></span>
          <span>Puffy Eyes</span>
        </div>
      </div>
    </div>
  );
};

export default FaceScanResult;
