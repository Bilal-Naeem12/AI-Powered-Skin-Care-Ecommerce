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
import useCartStore from "../../../store/useCartStore";
import useOrderStore from "../../../store/useOrderStore";
import { CartItem } from "@/types/CartItem";
import { PaymentGateway } from "@/types/Payment";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import usePostAuthData from "@/hooks/usePostAuthData";
import { useNavigate } from "react-router-dom";
import PageOverlay from "@/component/UI/PageOverlay";

const paymentGateways: PaymentGateway[] = [

  "Cash on Delivery",
];

const OrderSummary: React.FC = () => {
  const { cart, getTotalPrice ,clearCart} = useCartStore();
  const { order } = useOrderStore();
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>("Cash on Delivery");
const { postData, loading } = usePostAuthData<any, any>(); // adjust types if needed
const [showOverlay, setShowOverlay] = useState(false);

const navigate = useNavigate();



  const handlePlaceOrder =async () => {
    const payload = {
      userId: (order.userId as any)?._id || order.userId,
      cartItems: cart.map((item: CartItem) => ({
        productId: typeof item.product === "string" ? item.product : item.product._id,
        quantity: item.quantity,
        selectedVariant: item.selectedVariant,
        priceAtTimeOfOrder: typeof item.product === "string" ? 0 : item.product.price,
      })),
      paymentMethod: selectedGateway,
      payment: {
        paymentGateway: selectedGateway,
      },
      shippingAddress: order.shipping?.shippingAddress,
    };
   setShowOverlay(true); // Show loading screen

  await postData(
    `${import.meta.env.VITE_API_BACKEND_URL}/orders`,
    payload,
    "🎉 Order placed successfully!"
  );

  // Post success cleanup and redirect after overlay hides (2s)
  setTimeout(() => {
    clearCart();
    navigate("/");
  }, 2000);
  };

  const subtotal = getTotalPrice().toFixed(2);

  return (
    <Box className="bg-white rounded-lg shadow-md py-6 px-4 sm:p-6">
      <h5 className="mb-6 text-2xl font-medium" >
        Order Summary
      </h5>

      {cart.map((item: CartItem) => (<>
        <Box
          key={typeof item.product === "string" ? item.product : item.product._id}
          className="flex justify-between items-center my-2"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <Box className="flex flex-col sm:flex-row justify-start items-start gap-4 w-1/2">
            {typeof item.product !== "string" && (
              <>
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <p className="text-sm">{item.product.name}</p>
              </>
            )}
          </Box>
          <p className=" text-center">
            {import.meta.env.VITE_API_CURRENCY_Symbol}  {typeof item.product === "string" ? 0 : item.product.price * item.quantity}/-
          </p>
          
        </Box>
        <Divider/>
        </>
      ))}

      <Box className="flex justify-between items-center py-3 border-t">
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

      <Typography
        variant="h6"
        fontWeight="bold"
        className="mt-6"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Payment Method
      </Typography>
      <RadioGroup
        value={selectedGateway}
        onChange={(e) => setSelectedGateway(e.target.value as PaymentGateway)}
        className="mt-4"
      >
        {paymentGateways.map((gateway) => (
          <FormControlLabel
            key={gateway}
            value={gateway}
            control={<Radio />}
            label={gateway}
            style={{ fontFamily: "Poppins, sans-serif" }}
          />
        ))}
      </RadioGroup>

      <Button
        variant="contained"
        fullWidth
         disabled={loading}
        onClick={handlePlaceOrder}
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "12px 0",
          marginTop: "16px",
          fontFamily: "Poppins, sans-serif",
        }}
      >
  {loading ? "Placing Order..." : "Place Order"}
      </Button>

      <PageOverlay show={showOverlay} />

    </Box>
  );
};

export default OrderSummary;
