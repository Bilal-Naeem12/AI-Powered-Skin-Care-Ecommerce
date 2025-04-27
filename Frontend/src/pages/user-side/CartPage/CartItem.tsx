import React from "react";
import { Box, Typography, TextField, MenuItem, IconButton } from "@mui/material";
import { MdDelete } from "react-icons/md"; // Import delete icon
import useCartStore from "../../../store/useCartStore"; // Import the Zustand store
import {Product} from "@/types/Product"; // Import the Product interface

// Define the prop types for CartItem component
interface CartItemProps {
  item: {
    product: Product; // The product is typed as the Product interface
    quantity: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateProductQuantity, removeProductFromCart } = useCartStore(); // Access the actions from the Zustand store

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateProductQuantity(productId, newQuantity); // Update the quantity in the cart when changed
  };

  const handleDelete = (productId: string) => {
    removeProductFromCart(productId); // Remove the product from the cart when delete button is clicked
  };

  return (
    <Box className="flex justify-between items-center py-4 border-b">
      {/* Product Info */}
      <Box className="w-[30%] flex items-center gap-4">
        <img
          src={item.product.images[0]} // Assuming the first image is used as the main image
          alt={item.product.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <Typography style={{ fontFamily: "Poppins, sans-serif" }}>
          {item.product.name}
        </Typography>
      </Box>

      {/* Price */}
      <Typography
        className="w-[20%] text-center"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {import.meta.env.VITE_API_CURRENCY_Symbol}  {item.product.price}/-
      </Typography>

      {/* Quantity Dropdown */}
      <Box className="w-[20%] text-center">
        <TextField
          select
          value={item.quantity} // Update the value based on the quantity in the cart
          onChange={(e) =>
            handleQuantityChange(item.product._id, parseInt(e.target.value)) // Pass the correct _id for updating
          }
          size="small"
          variant="outlined"
        >
          {[...Array(10).keys()].map((q) => (
            <MenuItem key={q + 1} value={q + 1}>
              {q + 1}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Total Price for this Item */}
      <Typography
        className="w-[20%] text-center"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {import.meta.env.VITE_API_CURRENCY_Symbol}  {item.product.price * item.quantity}/-
      </Typography>

      {/* Delete Button */}
      <Box className="w-[10%] flex justify-center items-center">
        <IconButton
          onClick={() => handleDelete(item.product._id)} // Trigger product removal
          color="error"
        >
          <MdDelete className="text-xl" /> {/* Delete icon */}
        </IconButton>
      </Box>
    </Box>
  );
};

export default CartItem;
