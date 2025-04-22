import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import useFaceScanStore from "../../store/useFaceScanStore"; // make sure path is correct

const Instructions = () => {
  const {
    faceInsideOval, facingCamera, lightingOk 
  } = useFaceScanStore.getState();
  return (
    <div className="flex justify-around text-sm my-6">
      <span
        className={`flex items-center gap-1 ${
          lightingOk ? "text-green-500" : "text-red-500"
        }`}
      >
        <CheckCircleIcon fontSize="small" />
        {lightingOk ? "Good Lighting" : "Low Lighting"}
      </span>

      <span
        className={`flex items-center gap-1 ${
          faceInsideOval ? "text-green-500" : "text-red-500"
        }`}
      >
        <ErrorIcon fontSize="small" />
        {faceInsideOval ? "Face Positioned" : "Adjust Face"}
      </span>

      <span
        className={`flex items-center gap-1 ${
          facingCamera ? "text-green-500" : "text-yellow-500"
        }`}
      >
        <WarningAmberIcon fontSize="small" />
        {facingCamera ? "Looking Straight" : "Look Straight"}
      </span>
    </div>
  );
};

export default Instructions;
