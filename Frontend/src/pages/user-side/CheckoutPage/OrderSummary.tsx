import { productPrice } from "@/utils/product";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  RadioProps,
  Divider,
} from "@mui/material";
import useCartStore from "../../../store/CartStore";
import useOrderStore from "../../../store/OrderStore";
import { ShoppingCartItem as CartItem } from "@/types/CartItem";
import { PaymentGateway } from "@/types/Payment";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import usePostAuthData from "@/hooks/usePostAuthData";
import { useNavigate } from "react-router-dom";
import PageOverlay from "@/component/UI/PageOverlay";



const OrderSummary: React.FC = () => {
  const { cart, getTotalPrice ,clearCart} = useCartStore();

const [showOverlay, setShowOverlay] = useState(false);

const navigate = useNavigate();




  const subtotal = getTotalPrice().toFixed(2);

  return (
    <Box className="bg-white rounded-lg shadow-md py-6 px-4 sm:p-6">
      <h5 className="mb-6 text-2xl font-medium" >
        Order Summary
      </h5>
<div className=" overflow-y-auto max-h-[365px] my-10 px-5">
      {cart.map((item: CartItem) => (<React.Fragment key={`${item.product._id}-${item.selectedVariant ?? ""}`}>
        <Box
          key={typeof item.product === "string" ? item.product : item.product._id}
          className="flex justify-between items-center my-2"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <Box className="flex flex-col sm:flex-row justify-start items-start gap-4 w-1/2">
            {typeof item.product !== "string" && (
              <>
                <img
                  src={item.product.images?.[0] ?? "/assets/product_images/other.webp"}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <p className="text-sm">{item.product.name}</p>
              </>
            )}
          </Box>
          <p className=" text-center">
            {import.meta.env.VITE_API_CURRENCY_Symbol}  {typeof item.product === "string" ? 0 : productPrice(item.product, item.selectedVariant) * item.quantity}/-
          </p>
          
        </Box>
        <Divider/>
        </React.Fragment>
      ))}
</div>
      <Box className="flex justify-between items-center py-3 ">
        <Typography>Subtotal:</Typography>
        <Typography>{import.meta.env.VITE_API_CURRENCY_Symbol} {subtotal}/-</Typography>
      </Box>
      <Box className="flex justify-between items-center py-3 border-b">
        <Typography>Shipping:</Typography>
        <Typography>Free</Typography>
      </Box>
      <Box className="flex justify-between items-center py-3">
        <Typography>Total:</Typography>
        <Typography>{import.meta.env.VITE_API_CURRENCY_Symbol} {subtotal}/-</Typography>
      </Box>

   

      <PageOverlay show={showOverlay} />

    </Box>
  );
};

export default OrderSummary;
