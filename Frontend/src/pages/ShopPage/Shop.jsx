import React, { useState } from "react";
import FilterSidebar from "./FilterSidebar";
import ProductGrid from "./ProductGrid";
import SortOptions from "./SortOptions";

const Shop = () => {
  const [sortOption, setSortOption] = useState("relevance");
  const products = Array(25).fill({
    id: 1,
    title: "Moisturizer",
    description: "Give Natural nourishment",
    price: "950",
    size: "600ml",
    discount: "25% OFF",
    image: "/assets/product_images/moisturizer.jpg", // Replace with real image
  });

  return (
    <div className="container mx-auto my-14">
           
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar */}
        <FilterSidebar />

        <div className="flex-1">
          {/* Sorting Options */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Results (25)</h2>
            <SortOptions
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
          </div>

          {/* Product Grid */}
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
};

export default Shop;
