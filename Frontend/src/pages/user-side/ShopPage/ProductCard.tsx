import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="border rounded-lg shadow-xs p-4">
      <div className="relative mb-4">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-40 object-cover rounded-md"
        />
        <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-sm">
          {product.discount}
        </span>
      </div>
      <h3 className="font-bold mb-1">{product.title}</h3>
      <p className="text-gray-600 text-sm mb-2">{product.description}</p>
      <p className="font-bold text-lg">RS {product.price}/-</p>
      <p className="text-gray-500 text-sm">{product.size}</p>
    </div>
  );
};

export default ProductCard;
