import React from "react";
import { Box, Typography } from "@mui/material";
import MainLayout from "../../component/Layout/MainLayout";
import CartItem from "./CartItem";
import CartTotal from "./CartTotal";
import CartActions from "./CartActions";
import useCartStore from "../../store/useCartStore"; // Import your Zustand store

const CartPage = () => {
  // Access cart items, and actions from Zustand store
  const { cart, getTotalPrice, updateProductQuantity, removeProductFromCart } = useCartStore();

  // Handle quantity change
  const handleQuantityChange = (id, newQuantity) => {
    updateProductQuantity(id, newQuantity);
  };

  // Calculate subtotal
  const subtotal = getTotalPrice();

  return (
    <MainLayout>
      <Box className="container mx-auto px-6 py-10">
        <Typography
          variant="h4"
          fontWeight="bold"
          className="mb-6"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Shopping Cart
        </Typography>

        <Box className="bg-white rounded-lg shadow-md p-6">
          {/* Render Cart Items */}
          {cart.length === 0 ? (
            <Typography variant="h6" className="text-center">Your cart is empty</Typography>
          ) : (
            cart.map((item) => (
              <CartItem
                key={item.product._id}
                item={item}
                handleQuantityChange={handleQuantityChange}
                removeProductFromCart={removeProductFromCart} // Pass remove function
              />
            ))
          )}
        </Box>

        {/* Cart Totals */}
        <CartTotal subtotal={subtotal} />

        {/* Action Buttons */}
        <CartActions />
      </Box>
    </MainLayout>
  );
};

export default CartPage;
