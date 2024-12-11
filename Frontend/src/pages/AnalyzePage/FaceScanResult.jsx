import React from "react";

const FaceScanResult = () => {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-bold mb-4">Face Scan Results</h3>
      <img
        src="/assets/face-image.png"
        alt="Face Scan"
        className="w-full rounded-lg mb-4"
      />
      <div className="flex gap-5 items-center text-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 bg-green-500 rounded-full"></span>
          <span>Acne</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 bg-red-500 rounded-full"></span>
          <span>Pigmentation</span>
        </div>
      </div>
    </div>
  );
};

export default FaceScanResult;
