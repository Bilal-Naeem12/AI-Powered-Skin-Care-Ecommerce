import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const Instructions = () => {
  return (
    <div className="flex justify-around text-sm my-6">
      <span className="text-green-500 flex items-center gap-1">
        <CheckCircleIcon fontSize="small" />
        Good Lighting
      </span>
      <span className="text-red-500 flex items-center gap-1">
        <ErrorIcon fontSize="small" />
        Face Positioning
      </span>
      <span className="text-yellow-500 flex items-center gap-1">
        <WarningAmberIcon fontSize="small" />
        Look Straight
      </span>
    </div>
  );
};

export default Instructions;
