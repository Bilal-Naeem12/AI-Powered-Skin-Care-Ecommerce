import React from "react";
import Button from "./Button";
import useCartStore from "../../store/useCartStore"; // Import the Zustand store
import Product from "@/types/Product"; // Import the Product interface

// Define the prop types for the ProductCard component
interface ProductCardProps {
  product: Product; // The product prop is of type Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addProductToCart } = useCartStore(); // Access the addProductToCart action from the store

  const handleAddToCart = () => {
    addProductToCart(product); // Add the product to the cart when the button is clicked
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm sm:flex gap-4 my-4">
      <img
        src={product.images[0]} // Assuming the first image in the array is used
        alt={product.name}
        className="sm:w-1/5 object-cover my-4 sm:my-0 rounded-lg"
      />
      <div className="flex-1">
        <h4 className="text-lg font-bold">{product.name}</h4>
        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
        <div className="text-gray-800 font-bold">RS {product.price}/-</div>
        <p className="text-sm text-primary">{product.category}</p> {/* Assuming category is used here */}
        <Button variant="black" className="px-2 py-1 my-5" onClick={handleAddToCart}>
          ADD TO CART
        </Button>
      </div>
    </div>
  );
};

// Define the prop types for the RecommendedProducts component
interface RecommendedProductsProps {
  products: Product[]; // The products prop is an array of Product objects
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ products }) => {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">Recommended Products</h3>
      {products.map((product) => (
        // Use product._id as the key to ensure uniqueness and prevent re-render issues
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default RecommendedProducts;
