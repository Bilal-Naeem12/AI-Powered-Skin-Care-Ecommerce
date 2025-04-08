import React, { useState } from "react";
import Footer from "../UI/Footer";
import Navbar from "../UI/Navbar";
import QrCodeScannerRounded from "@mui/icons-material/QrCodeScannerRounded";
import ChatIcon from "@mui/icons-material/Chat";
import FaceScanModal from "../../pages/FaceScanModal";
import LoadingModal from "../../pages/LoadingModal";
import { useNavigate } from "react-router-dom";
import AnnouncementBar from "../UI/AnnouncementBar";
import useFaceScanStore from "../../store/useFaceScanStore"; // ✅ Zustand store

const MainLayout = ({ children }) => {
  const navigate = useNavigate();

  // Zustand store
  const {
    isModalOpen,
    isLoading,
    openModal,
    closeModal,
    showLoading,
    hideLoading
  } = useFaceScanStore();

  // Local state (not managed by Zustand)
  const [isAnnoucement, setIsAnnoucement] = useState(true);

  const handleAnalyze = () => {
    closeModal();     // ✅ Close modal via Zustand
    showLoading();    // ✅ Show loading via Zustand
    setTimeout(() => {
      navigate("/analyze-page");
      hideLoading()
    }, 3000);
   
  };

  return (
    <div>
      {isAnnoucement && <AnnouncementBar />}
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />

      {/* Sticky Buttons */}
      <div className="fixed bottom-5 right-5 flex flex-col gap-4 z-50">
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full shadow-lg hover:bg-black hover:text-white transition-all duration-300"
          aria-label="Scan Face"
        >
          <QrCodeScannerRounded className="w-5 h-5" />
          <span className="text-sm font-medium">Scan Face</span>
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full shadow-lg hover:bg-black hover:text-white transition-all duration-300"
          aria-label="Chat With Us"
        >
          <ChatIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Chat With Us</span>
        </button>
      </div>

      {/* Face Scan Modal */}
      {isModalOpen && <FaceScanModal onClose={closeModal} onAnalyze={handleAnalyze} />}

      {/* Loading Modal */}
      {isLoading && <LoadingModal message="Analyzing your face..." />}
    </div>
  );
};

export default MainLayout;
