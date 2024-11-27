import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import MainLayout from "../../component/Layout/MainLayout";
import CartItem from "./CartItem";
import CartTotal from "./CartTotal";
import CartActions from "./CartActions";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Sun Screen",
      price: 349,
      quantity: 1,
      image: "/assets/product_images/sun-screen.jpg",
    },
    {
        id: 2,
        name: "Serum",
        price: 499,
        quantity: 2,
        image: "/assets/product_images/niacinamide-serum.jpg",
      },
    {
      id: 2,
      name: "Moisturizer",
      price: 1200,
      quantity: 2,
      image: "/assets/product_images/moisturizer.jpg",
    },
    {
        id: 1,
        name: "Vitamin C",
        price: 500,
        quantity: 1,
        image: "/assets/product_images/vitamin-c-serum.jpg",
      },
   
  ]);

  // Handle quantity change
  const handleQuantityChange = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: parseInt(newQuantity) } : item
      )
    );
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

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
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              handleQuantityChange={handleQuantityChange}
            />
          ))}
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
