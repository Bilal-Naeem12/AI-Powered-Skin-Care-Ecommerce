import React, { ReactNode, useState } from "react";
import Footer from "../UI/Footer";
import Navbar from "../UI/Navbar";
import QrCodeScannerRounded from "@mui/icons-material/QrCodeScannerRounded";
import ChatIcon from "@mui/icons-material/Chat";
import FaceScanModal from "@/pages/user-side/FaceScanModal";
import FaceScanEntry from "@/pages/user-side/FaceScanModal/FaceScanEntry";
import LoadingModal from "@/pages/user-side/LoadingModal";
import AnnouncementBar from "../UI/AnnouncementBar";
import useFaceScanStore from "@/store/useFaceScanStore";

/* -------------------------------------------------------------------------- */
/* props                                                                      */
/* -------------------------------------------------------------------------- */
interface MainLayoutProps {
  children: ReactNode;
}

/* -------------------------------------------------------------------------- */
/* component                                                                  */
/* -------------------------------------------------------------------------- */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  /* zustand flags ---------------------------------------------------------- */
  const {
    isModalOpen,   // ← renamed for clarity in store
    openModal,
    closeModal,
    isLoading,
  } = useFaceScanStore();

  /* local flag for entry modal -------------------------------------------- */
  const [entryOpen, setEntryOpen] = useState(false);

  return (
    <div>
      <AnnouncementBar />
      <Navbar />
      <main className="">{children}</main>
      <Footer />

      {/* sticky action buttons --------------------------------------------- */}
     <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-50">
  <button
    onClick={() => setEntryOpen(true)}
    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full shadow-md hover:bg-black hover:text-white transition-all
               text-xs sm:text-sm sm:px-4 sm:py-2 sm:shadow-lg"
  >
    <QrCodeScannerRounded className="w-4 h-4 sm:w-5 sm:h-5" />
    <span className="font-medium">Scan Face</span>
  </button>

  <button
    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full shadow-md hover:bg-black hover:text-white transition-all
               text-xs sm:text-sm sm:px-4 sm:py-2 sm:shadow-lg"
  >
    <ChatIcon className="w-4 h-4 sm:w-5 sm:h-5" />
    <span className="font-medium">Chat With Us</span>
  </button>
</div>


      {/* entry decision sheet ---------------------------------------------- */}
      {entryOpen && (
        <FaceScanEntry
          closeAll={() => {
            setEntryOpen(false);
            closeModal(); // ensure both closed
          }}
        />
      )}

      {/* live face-scanner modal ------------------------------------------- */}
      {isModalOpen && <FaceScanModal />}

      {/* global loading dialog --------------------------------------------- */}
      {isLoading && <LoadingModal message="Analyzing your face…" />}
    </div>
  );
};

export default MainLayout;
