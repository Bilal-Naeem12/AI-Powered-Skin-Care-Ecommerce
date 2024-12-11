import React from "react";
import Breadcrumb from "../../component/UI/Breadcrumb";
import FaceScanResult from "./FaceScanResult";
import PersonalizedRoutine from "./PersonalizedRoutine";
import RecommendedProducts from "./ProductCard";
import MainLayout from "../../component/Layout/MainLayout";

const AnalyzePage = () => {
  const products = [
    {
      name: "Moisturizer",
      description: "Give Natural Nourishment",
      price: "950",
      reason: "To help Hydrate your Skin",
      image: "/assets/product_images/moisturizer.jpg",
    },
    {
      name: "Sunscreen",
      description: "Protect your skin from UV rays",
      price: "1250",
      reason: "Prevents pigmentation and sunburn",
      image: "/assets/product_images/sun-screen.jpg",
    },
    {
      name: "Moisturizer",
      description: "Give Natural Nourishment",
      price: "950",
      reason: "To help Hydrate your Skin",
      image: "/assets/product_images/moisturizer.jpg",
    },
    {
      name: "Sunscreen",
      description: "Protect your skin from UV rays",
      price: "1250",
      reason: "Prevents pigmentation and sunburn",
      image: "/assets/product_images/sun-screen.jpg",
    },
 
  ];

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
