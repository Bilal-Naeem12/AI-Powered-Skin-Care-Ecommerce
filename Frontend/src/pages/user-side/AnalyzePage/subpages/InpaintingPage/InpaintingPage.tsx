import useObjectUrl from "@/hooks/useObjectUrl";
import React, { useState, useRef, useEffect } from "react";
import Breadcrumb from "@/component/UI/Breadcrumb";
import MainLayout from "@/component/Layout/MainLayout";
import useInpaintingStore from "@/store/InpaintingStore";
import { Skeleton, Box, Modal, Card } from "@mui/material";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
  ReactCompareSliderHandle,
} from "react-compare-slider";
import { GripHorizontal, UploadCloud } from "lucide-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import useSkinAnalysisStore from "@/store/SkinAnalysis";

const InpaintingPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { inpaint, result, loading, clear } = useInpaintingStore();
  const inputRef = useRef<HTMLInputElement | null>(null);
const { originalImage ,triggerInpaintId} = useSkinAnalysisStore();
const hasInpaintedOriginal = useRef(false);

  const handleFileSelect = (f: File, showPreview = true) => {
  setFile(f);
  clear();
  if (showPreview) {
    setShowModal(true);
  } else {
    inpaint(f);
  }
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
   if (f) {
 handleFileSelect(f, true); // ✅ always show preview when uploading manually

}

  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
   if (f) {
  handleFileSelect(f, true); // ✅ always show preview when uploading manually

}

  };

  const resetAll = () => {
      setFile(null);     
    clear();
      hasInpaintedOriginal.current = false;
      if (inputRef.current) {
    inputRef.current.value = ""; // ✅ clear native input value
  }
  };

useEffect(() => {
  if (originalImage && triggerInpaintId) {
    setFile(originalImage);
    clear();
    inpaint(originalImage);
  }
}, [triggerInpaintId, originalImage, clear, inpaint]);

  const scanned_image_before = useObjectUrl(file);
  const scanned_image_after = result?.inpainted_image
    ? `data:image/jpeg;base64,${result.inpainted_image}`
    : null;

  const showCompareSlider = scanned_image_before && scanned_image_after;

  return (
    <MainLayout>
      
      <div className=" space-y-5 p-6 gap-10 justify-between ">
          <Breadcrumb
    paths={[
      { name: "Home", link: "/" },
      { name: "AI Tools", link: "/ai-tools-page" },
      { name: "Inpainting", link: "/inpainting" },
    ]}
  />  
     {/* LEFT SIDE */}
<div className="flex flex-col md:flex-row  bg-white p-5 shadow-2xl rounded-xl w-full gap-10 ">
     {/* LEFT SIDE */}
<div className=" flex flex-col gap-6 flex-1 ">
 

  <h1 className="text-4xl font-extrabold text-[#FF69B4] leading-tight flex items-center gap-2">
    ✨ AI Acne Inpainting 
  </h1>

  <p className="text-gray-700 text-base md:text-lg leading-relaxed">
    Upload a clear photo and watch our AI gently retouch your skin — showing you what’s possible with a healthy routine and modern magic.
  </p>

  <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex flex-col gap-3">
    <h3 className="text-lg font-bold text-[#FF69B4] flex items-center gap-1">
      📌 How It Works
    </h3>
    <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
      <li>1️⃣ Click or drag your clear face photo</li>
      <li>2️⃣ Confirm preview & let AI do its work</li>
      <li>3️⃣ Slide to compare your clear skin transformation</li>
    </ul>
  </div>

  <div className="bg-pink-100/30 border-l-4 border-[#FF69B4] p-4 rounded-lg shadow-sm">
    <h4 className="text-[#FF69B4] font-bold mb-1 flex items-center gap-1">
      💧 Skincare Tip
    </h4>
    <p className="text-sm text-gray-700">
      Consistent daily care beats any filter: cleanse, hydrate, wear SPF — your skin will thank you.
    </p>
  </div>

  <div className="flex flex-col gap-2 text-xs text-gray-400 mt-auto">
    <p>✨ 100% private — your uploads never saved</p>
    <p>🌱 Powered by AI, guided by real care</p>
  </div>
</div>

        {/* RIGHT SIDE */}
        <div className=" flex flex-col flex-1 gap-4">
          <Box
            onClick={
              showCompareSlider || loading
                ? undefined
                : () => inputRef.current?.click()
            }
            onDrop={showCompareSlider || loading ? undefined : handleDrop}
            onDragOver={
              showCompareSlider || loading ? undefined : (e) => e.preventDefault()
            }
            sx={{
              width: "100%",
              maxWidth: "900px",
              height: scanned_image_before ? "520px" : "70vh",
              mx: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              overflow: "hidden",
              border: showCompareSlider
                ? "2px solid #FF69B4"
                : "2px dashed #FF69B4",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              bgcolor: "#f9fafb",
              cursor: showCompareSlider ? "default" : "pointer",
              position: "relative",
            }}
          >
            <input
              ref={inputRef}
              id="hiddenFileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {!scanned_image_before && (<>
           <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />

  {/* Message */}
  <p className="text-gray-400 text-lg text-center">
    Drag & drop or click to upload an image
  </p>
            </>)}

            {scanned_image_before && !showCompareSlider && (
              <Box className="w-full h-full relative">
                <img
                  src={scanned_image_before}
                  alt="Original"
                  className="w-full h-full object-contain"
                />
                {loading && (
                  <Box className="absolute inset-0 flex items-center justify-center bg-black/50">
                   
                  <div className="w-[200px]"> <DotLottieReact
      src="/assets/gif/sparkles.json"
      loop
      autoplay
    /></div>
                  </Box>
                )}
              </Box>
            )}

            {showCompareSlider && (
              <ReactCompareSlider

                itemOne={
                  <ReactCompareSliderImage
                    src={scanned_image_before!}
                    alt="Original"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                }
                itemTwo={
                  <ReactCompareSliderImage
                    src={scanned_image_after!}
                    alt="Inpainted"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                }
                handle={
                  <ReactCompareSliderHandle
                    buttonStyle={{
                      width: 40,
                      height: 40,
                      background: "#FF69B4",
  
                      borderRadius: "50%",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                    }}
                  >
                    <GripHorizontal size={10} />
                  </ReactCompareSliderHandle>
                }
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#fefefe",
                }}
              />
            )}
          </Box>

         

          <p className="text-sm text-gray-500 text-center">
            💡 Tip: {showCompareSlider ? "Slide to compare your result!" : "Click or drag to upload your image."}
          </p>
           {showCompareSlider && (
            <button
              onClick={resetAll}
              className="mt-4 mx-auto px-5 py-2 bg-[#FF69B4] text-white font-semibold rounded shadow hover:bg-pink-500 transition-colors"
            >
              Upload New Image
            </button>
          )}
        </div>
</div>
        {/* PREVIEW MODAL */}
        <Modal
          open={showModal}
          onClose={() => {
            setShowModal(false);
            resetAll();
          }}
          className="flex items-center justify-center"
        >
          <Box className="bg-white rounded-lg p-6 max-w-md w-full flex flex-col items-center text-center space-y-4">
            <h2 className="text-xl font-bold text-[#FF69B4]">Preview Image</h2>
            {scanned_image_before && (
              <img
                src={scanned_image_before}
                alt="Preview"
                className="w-full h-auto rounded border"
              />
            )}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetAll();
                }}
                className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  inpaint(file!);
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-[#FF69B4] text-white rounded shadow hover:bg-pink-500"
              >
                Yes, Process
              </button>
            </div>
          </Box>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default InpaintingPage;
