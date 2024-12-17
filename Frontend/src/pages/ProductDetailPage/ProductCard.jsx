import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="border rounded-lg p-2 shadow-sm">
      <div className="relative">
        <img src={product.image} alt={product.title} className="rounded-lg object-cover w-full" />
        <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
          {product.discount}
        </span>
      </div>
      <div className="mt-2">
        <h3 className="font-bold">{product.title}</h3>
        <p className="text-gray-500">{product.description}</p>
        <p className="font-bold">RS {product.price}/-</p>
      </div>
    </div>
  );
};

export default ProductCard;
