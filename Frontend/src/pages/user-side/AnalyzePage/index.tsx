import React from "react";
import Breadcrumb from "../../../component/UI/Breadcrumb";
import FaceScanResult from "./FaceScanResult";
import PersonalizedRoutine from "./PersonalizedRoutine";
import RecommendedProducts from "../../../component/UI/RecommendedProducts";
import MainLayout from "../../../component/Layout/MainLayout";
import products from "../../../data/product"
const AnalyzePage = () => {
 

  return (
    <MainLayout>
    <div className="p-6">
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
