import React from "react";
import { Box, Typography, TextField, MenuItem, IconButton, ButtonGroup } from "@mui/material";
import { MdDelete } from "react-icons/md"; // Import delete icon
import useCartStore from "../../../store/useCartStore"; // Import the Zustand store
import {Product} from "@/types/Product"; // Import the Product interface
import { Minus } from "lucide-react";
import { Add } from "@mui/icons-material";

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
    <Box className="flex   justify-between items-center py-4 border-b">
      {/* Product Info */}
      <Box className="w-[30%] flex flex-col sm:flex-row  justify-center sm:justify-start  items-center gap-4">
        <img
          src={item.product.images[0]} // Assuming the first image is used as the main image
          alt={item.product.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <p className="text-xs sm:text-sm">
          {item.product.name}
       </p>
      </Box>

      {/* Price */}
      <p
        className="w-[20%] text-center text-sm"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {import.meta.env.VITE_API_CURRENCY_Symbol}  {item.product.price}/-
      </p>

      {/* Quantity Dropdown */}
     
<Box className="w-[120px] text-center ">
  <ButtonGroup size="small" variant="outlined" className="flex gap-2">
    <IconButton
      
      sx={{
        borderRadius: 1, 
       
      }}
      onClick={() =>
        handleQuantityChange(item.product._id, Math.max(1, item.quantity - 1))
      }
    >
      <Minus fontSize="small" />
    </IconButton>

    <TextField
    
      value={item.quantity}
      onChange={(e) => {
        const value = parseInt(e.target.value, 10);
        if (value > 0 && value <= 10) {
          handleQuantityChange(item.product._id, value);
        }
      }}
      inputProps={{
        readOnly:true,
        min: 1,
        max: 10,
        style: { textAlign: "center", width: "40px" },
      }}
      variant="outlined"
      size="small"
    />

  <IconButton
  sx={{
   
    borderRadius: 1, // ⏹️ square shape
    backgroundColor: "#000", // black background
    color: "#fff",           // white icon
    '&:hover': {
      backgroundColor: "#333", // darker on hover if you like
    },
  }}
  onClick={() =>
    handleQuantityChange(item.product._id, Math.min(10, item.quantity + 1))
  }
>
  <Add fontSize="small" />
</IconButton>

  </ButtonGroup>
</Box>

      {/* Total Price for this Item */}
      <p
        className="w-[20%] text-center  text-sm"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {import.meta.env.VITE_API_CURRENCY_Symbol}  {item.product.price * item.quantity}/-
      </p>

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
