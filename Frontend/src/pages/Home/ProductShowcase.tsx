import React from "react";
import Button from "../../component/UI/Button";
import ProductCard from "../../component/UI/ProductCard";
import { MdArrowForward } from "react-icons/md";
import products from "@/dummyData/product"; // Import the dummy data
import  Product  from "@/types/Product"; // Import the Product type

const ProductShowcase: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold">Discover Your Perfect Skincare Match</h2>
          <p className="text-gray-600 mt-4">
            Explore our curated range of skincare essentials, designed to enhance and protect your
            skin's natural beauty.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product: Product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* All Products Button */}
        <div className="mt-12 text-center">
          <Button variant="secondary" className="flex items-center justify-center">
            All Products <MdArrowForward />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
