import React from "react";

import { Product } from "@/types/Product";
import ProductCard from "@/component/UI/ProductCard";
interface ProductGridProps{

  products:Product[]
}
const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
