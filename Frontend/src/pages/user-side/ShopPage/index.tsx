import React, { useState } from "react";
import FilterSidebar from "./FilterSidebar";
import ProductGrid from "./ProductGrid";
import SortOptions from "./SortOptions";
import MainLayout from "@/component/Layout/MainLayout";
import Shop from "./Shop";
import Breadcrumb from "@/component/UI/Breadcrumb";
import Categories from "./Categories";

const ShopPage = () => {

  return (
   <MainLayout>
<div className=" w-10/12 mx-auto py-5">
<Breadcrumb
        paths={[
          { name: "Home", link: "/" },
          { name: "Skin care shop", link: "/shop" },
        ]}
      />
           <h1 className="my-5 font-bold text-4xl">Shop</h1>
      <Categories/>
   

    <Shop/>
    </div>
   </MainLayout>
  );
};

export default ShopPage;
