// src/pages/AnalyzePage.tsx
import React from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../../../component/UI/Breadcrumb";
import MainLayout from "../../../component/Layout/MainLayout";
import { Warning } from "@mui/icons-material";
import useSkinAnalysisStore from "@/store/useSkinAnalysis";

const AnalyzePage: React.FC = () => {
  const { result } = useSkinAnalysisStore();

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skin Analysis Card */}
          <Link
            to="/ai-tools-page/skin-analysis"
            className="group block p-2 sm:p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-200 transition"
          >
            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 mb-2">
              AI Skin Analysis
            </h3>
            <img src="/assets/Hero-Section-Image.jpg" className="sm:h-72 w-full object-fill"  alt="" />
            <p className="text-gray-600 mb-4">
              Automatically detect acne, puffy eyes, grade severity & type. Get a full combined report.
            </p>
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
              Go to Analysis →
            </span>
          </Link>

          {/* Inpainting Card */}
          <Link
            to="/ai-tools-page/inpainting "
            className="group block p-2 sm:p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-200 transition"
          >
            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-green-600 mb-2">
              AI Inpainting
            </h3>
            <img src="/assets/inpainting.jpg" className="sm:h-72 w-full object-fill"  alt="" />
            <p className="text-gray-600 mb-4">
              Remove acne or puffy-eye regions with seamless inpainting. Clean up your photo with one click.
            </p>
            <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200">
              Go to Inpainting →
            </span>
          </Link>
        </div>

        {/* Quick Summary of Last Analysis */}
        {result?.scanned_image && (
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
        )}
      </div>
    </MainLayout>
  );
};

export default AnalyzePage;
