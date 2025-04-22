import React from "react";
import Button from "./Button";
import { MdFavoriteBorder } from "react-icons/md"; // Importing icons
import { Link } from "react-router-dom";
import useCartStore from "../../store/useCartStore"; // Import Zustand store

const ProductCard = ({ product }) => {
  const { addProductToCart } = useCartStore(); // Access addProductToCart from Zustand store

  // Handle add to cart
  const handleAddToCart = () => {
    addProductToCart(product); // Add the product to the cart
  };

  return (
 
      <div className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
       <Link to={`/product/${product._id}`}>  {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />

        {/* Product Details */}
        <div className="p-4">
          <h3 className="text-lg font-bold">{product.name}</h3>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-gray-500 text-sm mt-2">{product.size}</p>
          <p className="text-gray-900 font-bold mt-2">Rs {product.price}/-</p>
        </div>
        </Link>  
        {/* Footer Section */}
        <div className="p-4 border-t flex justify-between items-center">
          <Button
            variant="black"
            className="px-4 py-2 text-sm"
            onClick={handleAddToCart} // Trigger the add to cart action
          >
            Add to your cart
          </Button>
          {/* Favorite Icon */}
          <MdFavoriteBorder
            className="text-pink-400 hover:text-pink-500   cursor-pointer text-xl"
            title="Add to Wishlist"
          />
        </div>
      </div>
 
  );
};

export default ProductCard;
