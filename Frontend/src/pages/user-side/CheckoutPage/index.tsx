import React, { useEffect } from "react";
import BillingForm from "./BillingForm";
import OrderSummary from "./OrderSummary";
import MainLayout from "../../../component/Layout/MainLayout";
import { Box } from "@mui/material";
import useCartStore from "../../../store/CartStore"; // Import the Zustand store
import useUserStore from "@/store/UserStore";
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
  }, [isLoggedIn, navigate]);

  return (
    <MainLayout>
      <Box className=" mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col md:flex-row gap-10">
  {/* Billing Form */}
  <Box className="w-full md:w-[60%] overflow-y-auto  pr-2">
    <BillingForm />
  </Box>

  {/* Sticky Summary */}
  <Box className="w-full md:w-[40%] ">
    <div className="sticky top-24">
      <OrderSummary />
    </div>
  </Box>
</Box>
    </MainLayout>
  );
};

export default CheckoutPage;
