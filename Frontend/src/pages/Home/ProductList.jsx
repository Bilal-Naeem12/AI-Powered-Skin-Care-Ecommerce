import React from "react";
import Card from "../../component/UI/Card";

const ProductList = () => {
  const products = [
    {
      id: 1,
      name: "Vitamin C Serum",
      description: "A Vitamin C-rich layering serum.",
      price: "Rs 820/-",
      image: "/assets/product1.jpg",
    },
    {
      id: 2,
      name: "Moisturizer",
      description: "Gives natural nourishment.",
      price: "Rs 499/-",
      image: "/assets/product2.jpg",
    },
    {
      id: 3,
      name: "Sunscreen",
      description: "Face cream with sunscreen SPF10.",
      price: "Rs 349/-",
      image: "/assets/product3.jpg",
    },
  ];

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center">Our Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {products.map((product) => (
            <Card
              key={product.id}
              title={product.name}
              description={product.description}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
