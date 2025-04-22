import React from "react";
import { Box, Typography, Button, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { CartItem } from "@/types/CartItem"; // Import CartItem type
import useCartStore from "../../store/useCartStore"; // Import Zustand store

const OrderSummary: React.FC = () => {
  // Access cart items and subtotal from Zustand store
  const { cart, getTotalPrice } = useCartStore();

  // Calculate subtotal dynamically based on cart items from Zustand store
  const subtotal = getTotalPrice();

  return (
    <Box className="bg-white rounded-lg shadow-md p-6">
      <Typography
        variant="h5"
        fontWeight="bold"
        className="mb-6"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Order Summary
      </Typography>

      {/* Cart Items */}
      {cart.map((item: CartItem) => (
        <Box
          key={item.product._id}
          className="flex justify-between items-center mb-4"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <Box className="flex items-center gap-4">
            <img
              src={item.product.images[0]}
              alt={item.product.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <Typography>{item.product.name}</Typography>
          </Box>
          <Typography>Rs {item.product.price * item.quantity}/-</Typography>
        </Box>
      ))}

      {/* Subtotal and Shipping */}
      <Box className="flex justify-between items-center py-3 border-t">
        <Typography>Subtotal:</Typography>
        <Typography>Rs {subtotal}/-</Typography>
      </Box>
      <Box className="flex justify-between items-center py-3 border-b">
        <Typography>Shipping:</Typography>
        <Typography>Free</Typography>
      </Box>
      <Box className="flex justify-between items-center py-3">
        <Typography>Total:</Typography>
        <Typography>Rs {subtotal}/-</Typography>
      </Box>

      {/* Payment Options */}
      <Typography
        variant="h6"
        fontWeight="bold"
        className="mt-6"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Payment Method
      </Typography>
      <RadioGroup defaultValue="cash" className="mt-4">
        <FormControlLabel
          value="bank"
          control={<Radio />}
          label="Bank"
          style={{ fontFamily: "Poppins, sans-serif" }}
        />
        <FormControlLabel
          value="cash"
          control={<Radio />}
          label="Cash on delivery"
          style={{ fontFamily: "Poppins, sans-serif" }}
        />
      </RadioGroup>

      {/* Place Order Button */}
      <Button
        variant="contained"
        fullWidth
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "12px 0",
          marginTop: "16px",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        Place Order
      </Button>
    </Box>
  );
};

export default OrderSummary;
