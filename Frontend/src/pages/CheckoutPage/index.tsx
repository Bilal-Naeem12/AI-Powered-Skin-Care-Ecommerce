import React from "react";
import BillingForm from "./BillingForm";
import OrderSummary from "./OrderSummary";
import MainLayout from "../../component/Layout/MainLayout";
import { Box } from "@mui/material";
import useCartStore from "../../store/useCartStore"; // Import the Zustand store

const CheckoutPage: React.FC = () => {


  return (
    <MainLayout>
      <Box className="container mx-auto px-6 py-10 flex flex-col md:flex-row gap-10">
        {/* Billing Form */}
        <Box className="w-full md:w-[60%]">
          <BillingForm />
        </Box>

        {/* Order Summary */}
        <Box className="w-full md:w-[40%]">
          <OrderSummary  />
        </Box>
      </Box>
    </MainLayout>
  );
};

export default CheckoutPage;
