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
import FaceVerificationModal from "./FaceVerificationModal";
import UniversalCapture from "@/component/UI/UniversalCapture";
import { handleUploadFaceVerification } from "@/component/UI/OnboardingModal";

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
  const [faceVerifyOpen, setFaceVerifyOpen] = useState(false);
type Mode = "general" | "progress";
const [capturedImage, setCapturedImage] = useState<string | null>(null);
const [isUploading, setIsUploading] = useState(false);

const [mode, setMode] = useState<Mode | null>(null);
const [askModeOpen, setAskModeOpen] = useState(false);
const [nextAction, setNextAction] = useState<() => void>(() => {});
const [captureRequired, setCaptureRequired] = useState(false);


const { setProgressTracking } = useSkinAnalysisStore();

const handleChoice = (next: () => void) => {
  // Save what the user wants to do
  setNextAction(() => next);
  // Open the mode choice modal
  setAskModeOpen(true);
};


const triggerFilePicker = () => {
  fileInputRef.current?.click(); // runs after user confirms in modal
};
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


  const confirmMode = (selected: Mode) => {
  setMode(selected);
  setAskModeOpen(false);
  setProgressTracking(false);

  // ✅ Now do normal consent check flow:
  if (user?.consent?.termsAccepted && user?.consent?.faceScanConsent) {
    // If Progress mode, you might run verification here
    if (selected === "progress") {
 setFaceVerifyOpen(true); 
      // e.g. open a new modal or run verification

    } else {
     nextAction();        // trigger fileInput.click() while still handling the button click
  setAskModeOpen(false);
    }
  } else {
    setOnConsentProceed(() => () => {
      if (selected === "progress") {
      setFaceVerifyOpen(true); 

      } else {
        nextAction();
      }
    });
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
      const analysis = useSkinAnalysisStore.getState();
      if (analysis.error || !analysis.result) { setStep("preview"); return; }
      setDetectedImage(`data:image/jpeg;base64,${analysis.result.scanned_image}`);
      closeAll();
      navigate("/ai-tools-page/skin-analysis");
    } catch (err) {
      console.error("❌ upload-analysis failed", err);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => () => { if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const resetSelection = () => {
    setFile(null);
    setPreviewUrl(null);
    setStep("choice");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleScanWithPhone = async () => {
    try {
      const resp = await axios.post<{sessionId:string}>(`${import.meta.env.VITE_API_BACKEND_URL}/scan-session`);
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
    let cancelled = false;
    let polling = false;
    let poller: NodeJS.Timeout;
    if (step === "qr" && sessionId) {
      poller = setInterval(async () => {
        if (polling || cancelled) return;
        polling = true;
        try {
          const statusResp = await axios.get(
            `${import.meta.env.VITE_API_BACKEND_URL}/scan-session/${sessionId}/status`
          );
          if (cancelled) return;
          const data = statusResp.data as { status: string; imageUrl?: string };
          if (data.status === "uploaded" && data.imageUrl) {
            clearInterval(poller);
            const imgResp = await axios.get(data.imageUrl, { responseType: "blob" });
            if (cancelled) return;
            const blob = imgResp.data as Blob;
            const fakeFile = new File([blob], "mobile-upload.jpg", { type: blob.type });
            setFile(fakeFile);
            setPreviewUrl(URL.createObjectURL(blob));
            setStep("preview");
          }
        } catch { /* Retry on the next poll. */ } finally { polling = false; }
      }, 10000);
      return () => { cancelled = true; clearInterval(poller); };
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
     onClick={() => handleChoice(()=>triggerFilePicker())}

    >
      <CloudUploadIcon className="text-[#FF69B4]" />
      <span className="text-sm mt-2 text-black">Upload</span>
    </div>

    {/* Live */}
    <div
      className="flex flex-col items-center justify-center border border-gray-200 rounded-xl p-4 w-24 h-24 shadow-sm hover:bg-purple-50 cursor-pointer transition"
     onClick={() => handleChoice(() => {
  closeAll();
  openLiveModal();
})}

    >
      <VideocamIcon className="text-[#FF69B4]" />
      <span className="text-sm mt-2 text-black">Live</span>
    </div>

    {/* Phone */}
    <div
      className="flex flex-col items-center justify-center border border-gray-200 rounded-xl p-4 w-24 h-24 shadow-sm hover:bg-indigo-50 cursor-pointer transition"
onClick={() => handleChoice(handleScanWithPhone)}

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
    {askModeOpen && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-5">
    <motion.div
      className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl text-center flex flex-col gap-4"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      <h2 className="text-xl font-bold">Choose Mode</h2>
      <p className="text-gray-600 mb-4">
        Is this for a general analysis or to track your skin progress securely?
      </p>
      <div className="flex gap-3">
       
         <button
          onClick={() => confirmMode("progress")}
          className="py-3 px-5  w-1/2 rounded-full bg-pink-600 text-white hover:bg-pink-700"
        >
          Progress Tracking
        </button> <button
          onClick={() => confirmMode("general")}
          className="py-3 px-5  w-1/2 rounded-full bg-black text-white hover:bg-gray-900"
        >
          General Analysis
        </button>
      
      </div>
      <button
        onClick={() => setAskModeOpen(false)}
        className="text-sm text-gray-500 hover:underline mt-2"
      >
        Cancel
      </button>
    </motion.div>
  </div>
)}


{captureRequired && (
 <div className="fixed bg-white rounded p-2">
  <div className="relative">
    <UniversalCapture
      onCapture={(dataUrl) => {
        setCapturedImage(dataUrl);
      }}
      onContinue={async () => {
        if (!capturedImage) return;

        setIsUploading(true); // ✅ Show loader
        try {
          await handleUploadFaceVerification(capturedImage);
          setCaptureRequired(false);
          setFaceVerifyOpen(true);
        } catch (err) {
          console.error("❌ Upload failed", err);
        } finally {
          setIsUploading(false); // ✅ Hide loader
        }
      }}
      title="Capture Your Face"
      description="We'll use this image to verify your identity and track your skincare progress. Please ensure it's a clear image of your face."
    />

    {isUploading && (
      <div className="absolute inset-0 z-20 bg-white/80 flex items-center justify-center rounded">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )}
  </div>
</div>

)}

{faceVerifyOpen && (
  <FaceVerificationModal
    userId={userId ?? ""}
    onVerified={() => {
      setProgressTracking(true);
      setFaceVerifyOpen(false);
      nextAction?.();
    }}
     onCancel={() => {
    // ❌ user canceled
    setProgressTracking(false);
    setFaceVerifyOpen(false);
  }}
    onRequireCapture={() => {
      setProgressTracking(false);
      setFaceVerifyOpen(false);
      setCaptureRequired(true);
    }}
  />
)}
    </div>

  );
};

export default FaceScanEntry;
