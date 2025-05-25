import React from "react";
import { Box, Typography } from "@mui/material";



const CartTotal = ({ subtotal }) => {
    const formattedSubtotal = parseFloat(subtotal).toFixed(2);

  return (
    <Box className="bg-white rounded-lg shadow-md p-6">
      <Typography
        variant="h5"
        fontWeight="bold"
        className="mb-6"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Cart Total
      </Typography>

      <Box className="flex justify-between items-center py-3 border-b">
        <Typography style={{ fontFamily: "Poppins, sans-serif" }}>
          Subtotal:
        </Typography>
        <Typography style={{ fontFamily: "Poppins, sans-serif" }}>
        {import.meta.env.VITE_API_CURRENCY_Symbol}  {formattedSubtotal}/-
        </Typography>
      </Box>
      <Box className="flex justify-between items-center py-3 border-b">
        <Typography style={{ fontFamily: "Poppins, sans-serif" }}>
          Shipping:
        </Typography>
        <Typography style={{ fontFamily: "Poppins, sans-serif" }}>Free</Typography>
      </Box>
      <Box className="flex justify-between items-center py-3">
        <Typography style={{ fontFamily: "Poppins, sans-serif" }}>
          Total:
        </Typography>
        <Typography style={{ fontFamily: "Poppins, sans-serif" }}>
        {import.meta.env.VITE_API_CURRENCY_Symbol}  {formattedSubtotal}/-
        </Typography>
      </Box>
    </Box>
  );
};

export default CartTotal;
