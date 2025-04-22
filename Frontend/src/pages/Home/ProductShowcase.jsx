import React from "react";
import Button from "../../component/UI/Button";
import ProductCard from "../../component/UI/ProductCard";
import { MdArrowForward } from "react-icons/md";

const products = [
  {
    _id: 1, // Unique identifier for the product
    name: "Vitamin C Serum",
    description: "A Vitamin C-rich layering serum",
    size: "60 ml",
    price: 820, // Price as a number for better calculations
    image: "/assets/product_images/vitamin-c-serum.jpg",
  },
  {
    _id: 2, // Unique identifier for the product
    name: "Moisturizer",
    description: "Gives natural nourishment",
    size: "50 ml",
    price: 499,
    image: "/assets/product_images/moisturizer.jpg",
  },
  {
    _id: 3, // Unique identifier for the product
    name: "Sun Screen",
    description: "Face cream with sunscreen SPF10",
    size: "200 ml",
    price: 349,
    image: "/assets/product_images/sun-screen.jpg",
  },
  {
    _id: 4, // Unique identifier for the product
    name: "B3 Niacinamide Serum",
    description: "Overnight redeemer with Vitamins B",
    size: "60 ml",
    price: 999,
    image: "/assets/product_images/niacinamide-serum.jpg",
  },
];

const ProductShowcase = () => {
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
          {products.map((product) => (
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
