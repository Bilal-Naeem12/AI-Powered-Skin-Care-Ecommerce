import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaceScannerHandle } from "./FaceScanner";
import FaceScanner from "./FaceScanner";
import useUserStore from "@/store/UserStore";
import axios from "axios";
import { toast } from "react-toastify";
import UniversalCapture from "./UniversalCapture";
import ProfilePicUploader from "./ProfilePicUploader";
import IngredientSelect from "../comboboxes/IngredientSelect";
import { useForm } from "react-hook-form";
import { User } from "@/types/User";
const steps = ["Welcome", "Face Scan", "Allergen Preferences", "Profile Picture"];
export  async function handleUploadFaceVerification(
  capturedImage: string  , // base64
) {
  try {
    // Convert base64 data URL to Blob
    const blob = await (await fetch(capturedImage)).blob();

    const formData = new FormData();
    formData.append("file", blob, "face-scan.jpg");

    const response = await axios.post(
      `${import.meta.env.VITE_API_BACKEND_URL}/scan-session/upload-face-verification`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );


    // You might store in user context or local state:
    return ;

  } catch (err) {
    console.error("❌ Upload failed:", err);
    throw err;
  }
}
export default function OnboardingModal() {
  const { user, isFirstLogin, setUser } = useUserStore();
  const [step, setStep] = useState(0);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const scannerRef = useRef<FaceScannerHandle>(null);
const [profilePic, setProfilePic] = useState<string>(user?.profileImage??"");  
const [usedUploader, setUsedUploader] = useState(false);
const [allergens, setAllergens] = useState<string[]>(user?.allergenPreferences ?? []);
const allergenForm = useForm<{ allergens: string[] }>({
  defaultValues: { allergens: allergens },
});


  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") e.preventDefault();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("walkThroughInProgress");
    if (!stored && !user?.walkThroughCompleted) {
      localStorage.setItem("walkThroughInProgress", "true");
    }
  }, [user?.walkThroughCompleted]);

  const nextStep = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else handleFinishOnboarding();
  };

  const skipStep = () => {
    nextStep();
  };
 if (user?.walkThroughCompleted) return null;
const handleFinishOnboarding = async () => {
  try {

    if (!faceImage || !faceImage.startsWith("data:image/")) {
  console.error("⚠️ Invalid or empty base64 image");
  return;
}

await handleUploadFaceVerification(faceImage);
   const response = await axios.patch<{user:User}>(
  `${import.meta.env.VITE_API_BACKEND_URL}/users/${user?._id}/walkthrough`,
  {
    walkThroughCompleted: true,
    profileImage: profilePic,
    allergenPreferences: allergens,
  },
  { withCredentials: true }
);

// ✅ Grab the updated user from response.data.user
const updatedUser = response.data.user;

// ✅ Now update your local user state properly
setUser(updatedUser);
    localStorage.removeItem("walkThroughInProgress");
    toast.success("Onboarding complete!");
  } catch (err) {
    console.error("Failed to complete walkthrough:", err);
  }
};

  const handleCaptureFace = () => {
    const captured = scannerRef.current?.captureSnapshot();
    if (captured) {
      setFaceImage(captured);
      nextStep();
    } else {
      toast.error("Please align your face properly before capturing.");
    }
  };


  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}  
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl p-6 md:p-10 relative"
        >
          {/* ──────────────────────────────
              1️⃣ WELCOME SCREEN
          ────────────────────────────── */}
          {step === 0 && (
            <div className="flex flex-col gap-6 text-center">
              <img
                src="/assets/Hero-Section-Image.jpg"
                alt="Welcome"
                className="w-full h-40 md:h-60 object-cover rounded-lg"
              />
              <h2 className="text-3xl md:text-4xl font-bold">Welcome to SkinCare Pro!</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Discover your personalized skincare journey. Our AI helps you track your skin health, analyze progress, and pick products that truly match you.
              </p>
              <button
                onClick={nextStep}
                className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-900 transition"
              >
                Let’s Get Started
              </button>
            </div>
          )}

          {/* ──────────────────────────────
              2️⃣ FACE SCAN STEP
          ────────────────────────────── */}
       {step === 1 && (
  <div className="flex flex-col gap-4">
    <UniversalCapture
      title="Capture Your Face"
      description="Align your face properly to scan, or upload a clear photo instead."
      onCapture={(dataUrl) => {
        setFaceImage(dataUrl);
     
      }}
      onContinue={   nextStep}
   
    />

    <div className="flex justify-center mt-2">
      <button
        onClick={skipStep}
        className="text-gray-500 underline text-sm"
      >
        Skip this step
      </button>
    </div>
  </div>
)}
{step === 2 && (
  <div className="flex flex-col gap-6 text-center items-center">
    <h2 className="text-2xl md:text-3xl font-bold">
      Select Your Allergen Preferences
    </h2>
    <p className="text-gray-600 max-w-md">
      Choose any ingredients you’d like to avoid. This helps us personalize your recommendations.
    </p>

    <div className="w-full max-w-lg">
     <IngredientSelect
  control={allergenForm.control}
  name="allergens"
  label="Allergens"
  multiple
/>
    </div>

 <button
  onClick={() => {
    const selected = allergenForm.getValues("allergens");
    setAllergens(selected);
    nextStep();
  }}
  className="bg-black text-white px-8 py-3 rounded-full font-semibold mt-4 hover:bg-gray-900 transition"
>
  Continue
</button>
  </div>
)}
          {/* ──────────────────────────────
              3️⃣ PROFILE PICTURE STEP
          ────────────────────────────── */}
         {step === 3 && (
  <div className="flex flex-col items-center gap-4 text-center">
    <h2 className="text-2xl md:text-3xl font-bold">Add a Profile Picture</h2>
    <p className="text-gray-600 max-w-md">
      Personalize your profile. Pick an avatar or upload your own photo.
    </p>

    {/* ────────────────────────────── */}
    {/* Profile Picture Preview & Uploader */}
    <ProfilePicUploader
      profilePic={profilePic}
      onChange={(url) => {
        setProfilePic(url);
        setUsedUploader(true);
      }}
    />

    {/* ────────────────────────────── */}
    {/* Avatar Choices */}
 <div className="grid grid-cols-3 md:grid-cols-4 gap-4 place-items-center  mx-auto">
  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
    <img
      key={i}
      src={`https://raw.githubusercontent.com/Bilal-Naeem12/Semster-Project/refs/heads/Master/src/main/resources/Images/Profile/${i}.png`}
      alt={`Avatar ${i}`}
      className={`w-16 h-16 md:w-20 md:h-20 rounded-full object-cover cursor-pointer border-4 ${
        profilePic?.includes(`/Profile/${i}.png`)
          ? "border-black"
          : "border-transparent"
      } hover:scale-105 transition`}
      onClick={() => {
        setProfilePic(
          `https://raw.githubusercontent.com/Bilal-Naeem12/Semster-Project/refs/heads/Master/src/main/resources/Images/Profile/${i}.png`
        );
        setUsedUploader(false);
      }}
    />
  ))}
</div>

    {/* ────────────────────────────── */}
    <button
    onClick={handleFinishOnboarding }
      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold mt-6 hover:opacity-90 transition"
    >
      Finish
    </button>
  </div>
)}
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body
  );
}


