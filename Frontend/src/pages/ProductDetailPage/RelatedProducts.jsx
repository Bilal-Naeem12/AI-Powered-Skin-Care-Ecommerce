import React from "react";
import ProductCard from "./ProductCard";

const RelatedProducts = () => {
  const products = Array(6).fill({
    id: 1,
    title: "Moisturizer",
    description: "Give Natural nourishment",
    price: "950",
    discount: "25% OFF",
    image: "/assets/product_images/moisturizer.jpg",
  });

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
