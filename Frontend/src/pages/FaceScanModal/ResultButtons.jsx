import React from "react";
import ReplayIcon from "@mui/icons-material/Replay";
import AssessmentIcon from "@mui/icons-material/Assessment";

const ResultButtons = ({ resetCapture, analyzeCapture }) => {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <button
        onClick={resetCapture}
        className="bg-gray-100 text-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
      >
        <ReplayIcon fontSize="small" />
        Retake
      </button>
      <button
        onClick={analyzeCapture}
        className="bg-black text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
      >
        <AssessmentIcon fontSize="small" />
        Analyze
      </button>
    </div>
  );
};

export default ResultButtons;
