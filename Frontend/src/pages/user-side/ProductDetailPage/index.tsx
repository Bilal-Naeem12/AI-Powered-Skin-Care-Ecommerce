import React from "react";
import ProductInfo from "./ProductInfo";

import RelatedProducts from "./RelatedProducts";
import MainLayout from "../../../component/Layout/MainLayout";

const ProductDetailPage = () => {
  
  return (
    <MainLayout>
    <div className="sm:container mx-auto w-full px-8 sm:px-4 py-8">
      {/* Product Info */}
      <ProductInfo />

      {/* Related Products */}
      <RelatedProducts  />
    </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
