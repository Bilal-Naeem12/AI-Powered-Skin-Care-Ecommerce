import React from "react";
import { MdFavoriteBorder } from "react-icons/md"; // Importing icons
import { Link } from "react-router-dom";
import useCartStore from "../../store/useCartStore"; // Import Zustand store
import Button from "./Button"; // Import the Button component

// Importing the Product interface
import {Product} from "@/types/Product"; // Update the path based on where your Product interface is located

// Define the props for the ProductCard component
interface ProductCardProps {
  product: Product; // The product prop should be typed as the Product interface
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addProductToCart } = useCartStore(); // Access addProductToCart from Zustand store

  // Handle add to cart
  const handleAddToCart = () => {
    addProductToCart(product); // Add the product to the cart
  };

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
      <Link to={`/product/${product._id}`}> {/* Product Image */}
        <img
          src={product.images[0]} // Assuming images is an array and the first one is the main image
          alt={product.name}
          className="w-full h-48 object-cover"
        />

        {/* Product Details */}
        <div className="p-4">
          <h3 className="text-lg font-bold">{product.name}</h3>
          <p className="text-gray-600">{product.description}</p>
          {/* <p className="text-gray-500 text-sm mt-2">{product.variants}</p> Assuming the first variant is being used */}
          <p className="text-gray-900 font-bold mt-2">{import.meta.env.VITE_API_CURRENCY} {product.price}/-</p>
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
          className="text-pink-400 hover:text-pink-500 cursor-pointer text-xl"
          title="Add to Wishlist"
        />
      </div>
    </div>
  );
};

export default ProductCard;
