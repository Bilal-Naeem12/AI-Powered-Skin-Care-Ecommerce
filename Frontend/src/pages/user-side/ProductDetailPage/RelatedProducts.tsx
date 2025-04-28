// src/components/Product/RelatedProducts.tsx
import React from "react";
import ProductCard from "@/component/UI/ProductCard";
import { Product } from "@/types/Product";
import { useParams } from "react-router-dom";
import useFetchData from "@/hooks/useFetchData";



const RelatedProducts: React.FC = ( ) => {
  const { id:productId } = useParams<{ id: string }>();
  const { data: related } = useFetchData<{ relatedProducts: Product[] }>(
    `${import.meta.env.VITE_API_BACKEND_URL}/products/${productId}/related`
  );
  if (!related) return null; // If no related products, don't render

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {related.relatedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
