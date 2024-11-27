import React from "react";
import BillingForm from "./BillingForm";
import OrderSummary from "./OrderSummary";
import MainLayout from "../../component/Layout/MainLayout";
import { Box } from "@mui/material";

const CheckoutPage = () => {
  const cartItems = [
    {
      id: 1,
      name: "Moisturizer",
      price: 499,
      quantity: 1,
      image: "/assets/product_images/moisturizer.jpg",
    },
    {
      id: 2,
      name: "Sun Screen",
      price: 349,
      quantity: 1,
      image: "/assets/product_images/sunscreen.jpg",
    },
  ];

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <MainLayout>
      <Box className="container mx-auto px-6 py-10 flex flex-col md:flex-row gap-10">
        {/* Billing Form */}
        <Box className="w-full md:w-[60%]">
          <BillingForm />
        </Box>

        {/* Order Summary */}
        <Box className="w-full md:w-[40%]">
          <OrderSummary cartItems={cartItems} subtotal={subtotal} />
        </Box>
      </Box>
    </MainLayout>
  );
};

export default CheckoutPage;
