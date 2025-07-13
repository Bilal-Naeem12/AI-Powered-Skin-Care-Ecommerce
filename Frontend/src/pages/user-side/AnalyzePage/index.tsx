// src/pages/AnalyzePage.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../../component/UI/Breadcrumb";
import MainLayout from "../../../component/Layout/MainLayout";
import { Warning } from "@mui/icons-material";
import useSkinAnalysisStore from "@/store/SkinAnalysis";
import LockIcon from "@mui/icons-material/Lock";
import useUserStore from "@/store/UserStore";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import useFaceScanStore from "@/store/FaceScanStore";

const AnalyzePage: React.FC = () => {
  const { result } = useSkinAnalysisStore();
const { isLoggedIn } = useUserStore();  
const navigate = useNavigate();
const triggerFaceScan = () => {
  const { setEntryModal } = useFaceScanStore.getState();
  setEntryModal(true);
};
  return (
    <MainLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb
          paths={[
            { name: "Home", link: "/" },
            { name: "Tools", link: "/ai-tools-page" },
          ]}
        />

        {/* Dummy-alert */}
        {!result?.scanned_image && (
          <div className="flex items-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 sm:p-4 rounded">
            <Warning fontSize="small" />
            <p className="ml-2 text-sm">
              <strong>Note:</strong> No skin analysis run yet. Click “Skin Analysis” below.
            </p>
          </div>
        )}

        {/* Tool cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {/* Skin Analysis Card */}
  <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition group">
    <Link
      to={(isLoggedIn&& result?.scanned_image) ? "/ai-tools-page/skin-analysis" : "/"}
      onClick={(e) => {
        if (!isLoggedIn) e.preventDefault();
      if (!result?.scanned_image)  triggerFaceScan()
      }}
      className="flex flex-col h-full"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src="/assets/Hero-Section-Image.jpg"
          alt="Skin Analysis"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-pink-600">
          AI Skin Analysis
        </h3>
        <p className="text-gray-600 text-sm flex-1">
          Automatically detect acne, puffy eyes, grade severity & type. Get a full combined report.
        </p>
        <span className="inline-block mt-4 self-start px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium hover:bg-pink-200 transition">
          Go to Analysis →
        </span>
      </div>
    </Link>

    {!isLoggedIn && (
      <div
        onClick={() => navigate("/login")}
        className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur cursor-pointer hover:bg-black/50 transition"
      >
        <LockIcon fontSize="large" />
        <span className="mt-2 text-sm font-medium">Login to unlock this AI feature</span>
      </div>
    )}
  </div>

  {/* Inpainting Card */}
  <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition group">
    <Link
      to={isLoggedIn ? "/ai-tools-page/inpainting" : "#"}
      onClick={(e) => {
        if (!isLoggedIn) e.preventDefault();
      }}
      className="flex flex-col h-full"
    >
 <div className="aspect-video overflow-hidden relative group">
  {/* BEFORE image */}
  <img
    src="/assets/inpainting_before.jpg"
    alt="Inpainting Before"
    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
  />

  {/* WHITE FLASH overlay */}
  <div
    className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
  ></div>

  {/* AFTER image */}
  <img
    src="/assets/inpainting_after.jpg"
    alt="Inpainting After"
    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
  />
</div>


      <div className="p-5 flex flex-col flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">

          AI Inpainting
        </h3>
        <p className="text-gray-600 text-sm flex-1">
          Remove acne or puffy-eye regions with seamless inpainting. Clean up your photo with one click.
        </p>
             <span className="inline-block mt-4 self-start px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition">

          Go to Inpainting →
        </span>
      </div>
    </Link>

    {!isLoggedIn && (
      <div
        onClick={() => navigate("/login")}
        className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur cursor-pointer hover:bg-black/50 transition"
      >
        <LockIcon fontSize="large" />
        <span className="mt-2 text-sm font-medium">Login to unlock this AI feature</span>
      </div>
    )}
  </div>
</div>

        {/* Quick Summary of Last Analysis */}
        {/* {result?.scanned_image && (
          <div className="mt-4 sm:w-fit p-2 sm:p-6 bg-white rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Last Analysis Summary
            </h3>
            <img
              src={`data:image/jpeg;base64,${result.scanned_image}`}
              alt="Last analysis"
              className="w-full h-96 sm:h-48 object-contain rounded mb-4"
            />
            <div className="flex space-x-4 text-sm text-gray-700">
              <div>
                <span className="font-medium">Acne spots:</span>{" "}
                {result.detections.acne.objects.length}
              </div>
              <div>
                <span className="font-medium">Puffy eyes:</span>{" "}
                {result.detections.puffy_eyes.objects.length}
              </div>
            </div>
          </div>
        )} */}
      </div>
    </MainLayout>
  );
};

export default AnalyzePage;
