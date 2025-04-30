import React from 'react'
import FaceScanResult from './FaceScanResult'
import SkinHealthGauge from '@/component/UI/SkinHealthGauge'
import RecommendedProducts from '@/component/UI/RecommendedProducts'
import products from "@/data/product";
import MainLayout from '@/component/Layout/MainLayout';
import Breadcrumb from '@/component/UI/Breadcrumb';

function FaceScanResultPage() {
  return (
    <MainLayout>
        <div className="p-6 space-y-6">
          <Breadcrumb
          paths={[
            { name: "Home", link: "/" },
            { name: "AI Tools", link: "/ai-tools-page" },
            { name: "Skin Anaylsis", link: "/skin-analysis" },
          ]}
        />
    <div className="grid grid-cols-1 md:grid-cols-7 gap-6 mt-4 ">
    {/* Left Column */}
    <div className="md:col-span-3">
      <FaceScanResult />
      {/* <PersonalizedRoutine /> */}
      {/* <SkinHealthGauge/> */}
    </div>

    {/* Right Column */}
    <div className="md:col-span-4">
      <RecommendedProducts products={products} />
     
    </div>
   
  </div>
  </div>
  </MainLayout>
  )
}

export default FaceScanResultPage
