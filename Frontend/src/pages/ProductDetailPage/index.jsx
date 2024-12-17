import React from "react";
import ProductInfo from "./ProductInfo";
import ProductDescription from "./ProductDescription";
import RelatedProducts from "./RelatedProducts";
import MainLayout from "../../component/Layout/MainLayout";

const ProductDetailPage = () => {
  return (
    <MainLayout>
    <div className="container mx-auto px-4 py-8">
      {/* Product Info */}
      <ProductInfo />

      {/* Description */}
      <ProductDescription />

      {/* Related Products */}
      <RelatedProducts />
    </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
