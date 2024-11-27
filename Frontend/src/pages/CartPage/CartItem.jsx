import React from "react";
import { Box, Typography, TextField, MenuItem } from "@mui/material";

const CartItem = ({ item, handleQuantityChange }) => {
  return (
    <Box className="flex justify-between items-center py-4 border-b">
      {/* Product Info */}
      <Box className="w-[30%] flex items-center gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <Typography style={{ fontFamily: "Poppins, sans-serif" }}>
          {item.name}
        </Typography>
      </Box>

      {/* Price */}
      <Typography
        className="w-[20%] text-center"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Rs {item.price}/-
      </Typography>

      {/* Quantity Dropdown */}
      <Box className="w-[20%] text-center">
        <TextField
          select
          value={item.quantity}
          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
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

      {/* Subtotal */}
      <Typography
        className="w-[20%] text-center"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Rs {item.price * item.quantity}/-
      </Typography>
    </Box>
  );
};

export default CartItem;
