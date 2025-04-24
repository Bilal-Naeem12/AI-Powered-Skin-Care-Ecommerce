import React from "react";
import ProductCard from "@/component/UI/ProductCard";
import products  from "@/data/product";
const RelatedProducts = () => {
  

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
