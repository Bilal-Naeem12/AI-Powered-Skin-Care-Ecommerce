import React from "react";
import { motion } from "framer-motion";

// Define the props type for LoadingModal
interface LoadingModalProps {
  message?: string; // Optional message prop (default is "Processing...")
}

const LoadingModal: React.FC<LoadingModalProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <motion.div
        className="relative bg-white rounded-lg w-[90%] max-w-sm p-6 shadow-xl flex flex-col items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Loading Spinner */}
        <div className="loader border-t-2 border-black rounded-full w-12 h-12 animate-spin mb-4"></div>

        {/* Loading Message */}
        <p className="text-gray-700 text-center">{message || "Processing..."}</p>
      </motion.div>
    </div>
  );
};

export default LoadingModal;
