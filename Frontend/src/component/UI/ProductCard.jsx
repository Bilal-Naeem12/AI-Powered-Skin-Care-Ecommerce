import React from "react";
import Button from "./Button";
import { MdFavoriteBorder } from "react-icons/md"; // Importing icons
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
  <Link to={`/product/${product.id}`}>   <div className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
      {/* Product Image */}
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />

      {/* Product Details */}
      <div className="p-4">
        <h3 className="text-lg font-bold">{product.name}</h3>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-gray-500 text-sm mt-2">{product.size}</p>
        <p className="text-gray-900 font-bold mt-2">{product.price}</p>
      </div>

      {/* Footer Section */}
      <div className="p-4 border-t flex justify-between items-center">
        <Button variant="black" className="px-4 py-2 text-sm">
          Add to your cart
        </Button>
        {/* Favorite Icon */}
        <MdFavoriteBorder
          className="text-gray-400 hover:text-pink-500 cursor-pointer text-xl"
          title="Add to Wishlist"
        />
      </div>
    </div>
    </Link>
  );
};

export default ProductCard;
