import React from "react";
import Button from "../../component/UI/Button";

const ProductCard = ({ product }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm sm:flex gap-4 my-4 ">
      <img
        src={product.image}
        alt={product.name}
        className="sm:w-1/5 object-cover my-4 sm:my-0 rounded-lg"
      />
      <div className="flex-1">
        <h4 className="text-lg font-bold">{product.name}</h4>
        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
        <div className="text-gray-800 font-bold">RS {product.price}/-</div>
        <p className="text-sm text-primary">{product.reason}</p>
        <Button variant="black" className="px-2 py-1 my-5">
          ADD TO CART
        </Button>
      </div>
    </div>
  );
};

const RecommendedProducts = ({ products }) => {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">Recommended Products</h3>
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
};

export default RecommendedProducts;
