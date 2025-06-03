import React, { useEffect } from "react";
import BillingForm from "./BillingForm";
import OrderSummary from "./OrderSummary";
import MainLayout from "../../../component/Layout/MainLayout";
import { Box } from "@mui/material";
import useCartStore from "../../../store/useCartStore"; // Import the Zustand store
import useUserStore from "@/store/useUserStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CheckoutPage: React.FC = () => {

   const { isLoggedIn } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Login to proceed");
      console.log("hello")
      navigate("/login");
    }
  }, [isLoggedIn]);

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
