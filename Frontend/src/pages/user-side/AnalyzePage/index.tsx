import React from "react";
import Breadcrumb from "../../../component/UI/Breadcrumb";
import FaceScanResult from "./FaceScanResult";
import PersonalizedRoutine from "./PersonalizedRoutine";
import RecommendedProducts from "../../../component/UI/RecommendedProducts";
import MainLayout from "../../../component/Layout/MainLayout";
import products from "../../../data/product";
import useFaceScanStore from "@/store/useFaceScanStore";
import { Warning } from "@mui/icons-material";

const AnalyzePage = () => {
  const { detectedImage } = useFaceScanStore();

  return (
    <MainLayout>
      <div className="p-6">
        {/* Conditional Alert for Dummy Data */}
        {detectedImage === null && (
          <div className="bg-yellow-300 text-yellow-800 p-4 mb-4 rounded-md">
            <p className="flex gap-2 items-center"><Warning/> <strong>Note:</strong> This is dummy data. Please analyze your skin to get accurate results.</p>
          </div>
        )}

        {/* Breadcrumb */}
        <Breadcrumb
          paths={[
            { name: "Home", link: "/" },
            { name: "Face Scan Results", link: "/analyze-page" },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Left Column */}
          <div>
            <FaceScanResult />
            <PersonalizedRoutine />
          </div>

          {/* Right Column */}
          <div className="md:col-span-2">
            <RecommendedProducts products={products} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AnalyzePage;
