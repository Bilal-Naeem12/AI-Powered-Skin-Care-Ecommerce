import React, { useEffect, useState } from "react";
import { Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import useCartStore from "../../../store/useCartStore"; // Import Zustand store
import Product from "@/types/Product";

// Define the ProductInfo component
const ProductInfo: React.FC = () => {
  // Access the cart store
  const { cart, updateProductQuantity, addProductToCart } = useCartStore();
  
  // Assuming that we are passing a product object
  const product :Product = {
    _id: "1", // ID as a string (instead of number)
    name: "Vitamin C Serum",
    description: "A Vitamin C-rich layering serum",
    category: "Serum", // Added the category field
    brand: "BrandName", // Added brand as it's a required field
    price: 820,
    discount: { percentage: 0, discountedPrice: 820 }, // Assuming no discount initially
    stock: 100, // Sample stock value
    isAvailable: true,
    variants: [
      { size: "60 ml", price: 820, stock: 100 },
    ],
    images: ["/assets/product_images/vitamin-c-serum.jpg"],
    ingredients: ["Vitamin C", "Hyaluronic Acid"],
    allergens: ["Fragrance"],
    aiSkinSuitability: ["Oily Skin", "Acne-Prone"],
    averageRating: 4.5,
    reviews: [],
    usageInstructions: "Apply a few drops on the face daily.",
    precautions: "Avoid direct contact with eyes.",
    soldCount: 150,
    isFeatured: true,
    isDeleted: false,
    createdAt: "2022-01-01T00:00:00Z",
    updatedAt: "2022-02-01T00:00:00Z",
  }
  // Find the product in the cart
  const cartItem = cart.find((item) => item.product._id === product._id);

  // Set the initial quantity to the value from the cart (if any)
  const initialQuantity = cartItem ? cartItem.quantity : 1;

  const [quantity, setQuantity] = useState<number>(initialQuantity);

  useEffect(() => {
    // Update the quantity in Zustand when it changes
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem]);

  const handleQuantity = (type: "increase" | "decrease") => {
    const newQuantity = type === "increase" ? quantity + 1 : Math.max(1, quantity - 1);
    setQuantity(newQuantity);

    // Update the quantity in the cart
    updateProductQuantity(product._id, newQuantity);
  };

  const handleAddToCart = () => {
    if (cartItem) {
      // If product is already in cart, update quantity
      updateProductQuantity(product._id, quantity);
    } else {
      // If product is not in cart, add it
      addProductToCart(product, quantity);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Side - Static Image with Scrollable Content */}
      <div className="sticky top-10 max-h-screen overflow-y-auto">
        <div className="relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="rounded-lg w-full h-[600px] object-cover overflow-hidden"
          />
          <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
            25% OFF
          </span>
        </div>
      </div>

      {/* Right Side - Product Info */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-lg font-semibold">Our Price Rs. {product.price}</p>
        <div className="flex items-center gap-2">
          <IconButton onClick={() => handleQuantity("decrease")} size="small">
            <RemoveIcon />
          </IconButton>
          <span className="border px-4 py-1 rounded">{quantity}</span>
          <IconButton onClick={() => handleQuantity("increase")} size="small">
            <AddIcon />
          </IconButton>
        </div>
        <Button
          variant="contained"
          color="inherit"
          className="!bg-black !text-white hover:!bg-gray-800"
          onClick={handleAddToCart} // Handle adding to the cart
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
