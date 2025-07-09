import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VideocamIcon from "@mui/icons-material/Videocam";
import CheckIcon from "@mui/icons-material/Check";
import ReplayIcon from "@mui/icons-material/Replay";
import useFaceScanStore from "@/store/FaceScanStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { QrCodeIcon } from "lucide-react";
import useUserStore from "@/store/UserStore";
import ConsentForm from "@/component/UI/ConsentForm";
import { User } from "@/types/User";
import useSkinAnalysisStore from "@/store/SkinAnalysis";

type Step = "choice" | "preview" | "uploading" | "qr";

const FaceScanEntry: React.FC<{ closeAll: () => void }> = ({ closeAll }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("choice");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { user, isLoggedIn, setUser } = useUserStore();
  const userId = user?._id;
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string>("");
  const [consentOpen, setConsentOpen] = useState(false);
  const [onConsentProceed, setOnConsentProceed] = useState<() => void>(() => {});

  const { openModal: openLiveModal, showLoading, hideLoading, setDetectedImage, setEntryModal } =
    useFaceScanStore();
  const { result, analyzeSkin, clearResult } = useSkinAnalysisStore();
  const navigate = useNavigate();

  const checkConsentAndProceed = (next: () => void) => {
    if (user?.consent?.termsAccepted && user?.consent?.faceScanConsent) {
      next();
    } else {
      setOnConsentProceed(() => next);
      setConsentOpen(true);
    }
  };

  const handleChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setStep("preview");
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setStep("uploading");
    showLoading();
    const fd = new FormData();
    fd.append("file", file);
    try {
      clearResult();
      await analyzeSkin(fd, file, userId);
      setDetectedImage(`data:image/jpeg;base64,${result?.scanned_image}`);
      closeAll();
      navigate("/ai-tools-page/skin-analysis");
    } catch (err) {
      console.error("❌ upload-analysis failed", err);
    } finally {
      hideLoading();
    }
  };

  const resetSelection = () => {
    setFile(null);
    setPreviewUrl(null);
    setStep("choice");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleScanWithPhone = async () => {
    try {
      const resp = await axios.post(`${import.meta.env.VITE_API_BACKEND_URL}/scan-session`);
      const id = resp.data.sessionId as string;
      setSessionId(id);
      const localIP = window.location.origin;
      const url = `${localIP}/mobile-scan/${id}`;
      setQrUrl(url);
      setStep("qr");
    } catch (err) {
      console.error("❌ could not create scan session", err);
    }
  };

  useEffect(() => {
    let poller: NodeJS.Timeout;
    if (step === "qr" && sessionId) {
      poller = setInterval(async () => {
        try {
          const statusResp = await axios.get(
            `${import.meta.env.VITE_API_BACKEND_URL}/scan-session/${sessionId}/status`
          );
          const data = statusResp.data as { status: string; imageUrl?: string };
          if (data.status === "uploaded" && data.imageUrl) {
            clearInterval(poller);
            const imgResp = await axios.get(data.imageUrl, { responseType: "blob" });
            const blob = imgResp.data as Blob;
            const fakeFile = new File([blob], "mobile-upload.jpg", { type: blob.type });
            setFile(fakeFile);
            setPreviewUrl(URL.createObjectURL(blob));
            setStep("preview");
          }
        } catch {}
      }, 10000);
      return () => clearInterval(poller);
    }
  }, [step, sessionId]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        className="relative bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl flex flex-col gap-6 text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={closeAll}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          <CloseIcon fontSize="medium" />
        </button>

        {step === "choice" && (
          <>
            {isLoggedIn ? (
        <>
  <h2 className="text-2xl font-bold text-black">Analyze Your Skin</h2>
  <p className="text-gray-500 mb-4">
    Choose an option below to start your analysis.
  </p>

  <div className="flex justify-center gap-4">
    {/* Upload */}
    <div
      className="flex flex-col items-center justify-center border border-gray-200 rounded-xl p-4 w-24 h-24 shadow-sm hover:bg-pink-50 cursor-pointer transition"
      onClick={() =>
        checkConsentAndProceed(() => fileInputRef.current?.click())
      }
    >
      <CloudUploadIcon className="text-[#FF69B4]" />
      <span className="text-sm mt-2 text-black">Upload</span>
    </div>

    {/* Live */}
    <div
      className="flex flex-col items-center justify-center border border-gray-200 rounded-xl p-4 w-24 h-24 shadow-sm hover:bg-purple-50 cursor-pointer transition"
      onClick={() =>
        checkConsentAndProceed(() => {
          closeAll();
          openLiveModal();
        })
      }
    >
      <VideocamIcon className="text-[#FF69B4]" />
      <span className="text-sm mt-2 text-black">Live</span>
    </div>

    {/* Phone */}
    <div
      className="flex flex-col items-center justify-center border border-gray-200 rounded-xl p-4 w-24 h-24 shadow-sm hover:bg-indigo-50 cursor-pointer transition"
      onClick={() => checkConsentAndProceed(handleScanWithPhone)}
    >
      <QrCodeIcon className="text-[#FF69B4]" size={24} />
      <span className="text-sm mt-2 text-black">Phone</span>
    </div>
  </div>

  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleChooseFile}
  />
</>

            ) : (
              <div className=" space-y-4">
                <h2 className="text-xl font-bold text-black">Please log in to continue</h2>
                <p className="text-gray-600 text-left">
                  Skin analysis features are only available for registered users.
                </p>
                <button
                  className="px-6 py-3 rounded-full bg-[#FF69B4] text-white hover:bg-pink-600 transition"
                  onClick={() => {
                    setEntryModal(false);
                    navigate("/login");
                  }}
                >
                  Log In
                </button>
              </div>
            )}
          </>
        )}

        {step === "preview" && previewUrl && (
          <>
            <h2 className="text-xl font-bold text-black">Preview</h2>
            <img
              src={previewUrl}
              alt="preview"
              className="w-full h-72 object-contain rounded-lg border"
            />
            <div className="flex gap-4">
              <button
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                onClick={resetSelection}
              >
                <ReplayIcon /> Choose Another
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-[#FF69B4] text-white hover:bg-pink-600 transition"
                onClick={handleAnalyze}
              >
                <CheckIcon /> Analyze
              </button>
            </div>
          </>
        )}

        {step === "uploading" && (
          <p className="text-gray-600">Uploading &amp; analyzing…</p>
        )}

        {step === "qr" && qrUrl && (
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-bold text-black">Scan with your phone</h2>
            <div className="p-4 bg-gray-100 rounded-xl flex flex-col items-center">
              <QRCodeCanvas value={qrUrl} size={200} />
              <p className="mt-4 text-sm text-gray-600 text-center">
                Open your camera app, scan this code,<br /> and follow the instructions.
              </p>
            </div>
            <button
              className="text-sm text-indigo-600 hover:underline"
              onClick={() => {
                setSessionId(null);
                setQrUrl("");
                setStep("choice");
              }}
            >
              ← Back
            </button>
          </div>
        )}

        <ConsentForm
          open={consentOpen}
          onAgree={async () => {
            setConsentOpen(false);
            try {
              const res = await axios.patch<{ success: boolean; user: User }>(
                `${import.meta.env.VITE_API_BACKEND_URL}/users/consent/${userId}`,
                {},
                { withCredentials: true }
              );
              setUser(res.data.user);
              onConsentProceed();
            } catch (err) {
              console.error("Consent update failed", err);
            }
          }}
          onCancel={() => setConsentOpen(false)}
        />
      </motion.div>
    </div>
  );
};

export default FaceScanEntry;
