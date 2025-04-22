import React from "react";
import Button from "./Button";
import useCartStore from "../../store/useCartStore"; // Import the Zustand store

const ProductCard = ({ product }) => {
  const { addProductToCart } = useCartStore(); // Access the addProductToCart action from the store

  const handleAddToCart = () => {
    addProductToCart(product); // Add the product to the cart when the button is clicked
  };

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
        <Button variant="black" className="px-2 py-1 my-5" onClick={handleAddToCart}>
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
      {products.map((product) => (
        // Use product._id as the key to ensure uniqueness and prevent re-render issues
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default RecommendedProducts;
