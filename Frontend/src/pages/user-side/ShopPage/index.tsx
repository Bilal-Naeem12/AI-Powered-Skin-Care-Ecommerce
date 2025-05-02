import React, { useEffect, useState } from "react";
import FilterSidebar from "./FilterSidebar";
import ProductGrid from "./ProductGrid";
import SortOptions from "./SortOptions";
import MainLayout from "@/component/Layout/MainLayout";
import Shop from "./Shop";
import Breadcrumb from "@/component/UI/Breadcrumb";
import Categories from "./Categories";

const ShopPage = () => {
useEffect(()=>{

  window.scroll(0,0)
})
  return (
   <MainLayout>
<div className="p-10 gap-4 flex flex-col mx-auto py-5 bg-white">
<Breadcrumb
        paths={[
          { name: "Home", link: "/" },
          { name: "Skin care shop", link: "/shop" },
        ]}
      />
           <h1 className=" font-bold text-4xl">Shop</h1>
      <Categories/>
   

    <Shop/>
    </div>
   </MainLayout>
  );
};

export default ShopPage;
