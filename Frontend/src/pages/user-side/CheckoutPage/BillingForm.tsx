import { productPrice } from "@/utils/product";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Button,
} from "@mui/material";
import ButtonUI from "../../../component/UI/Button";
import useUserStore from "../../../store/UserStore";
import useOrderStore from "../../../store/OrderStore";
import useCartStore from "@/store/CartStore";
import { useNavigate } from "react-router-dom";
import usePostAuthData from "@/hooks/usePostAuthData";
import { PaymentGateway } from "@/types/Payment";
import { ShoppingCartItem as CartItem } from "@/types/CartItem";
import PageOverlay from "@/component/UI/PageOverlay";

interface BillingFormData {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone: string;
  email: string;
  saveInfo: boolean;
}

const BillingForm = () => {
  const { user ,setUser} = useUserStore();
  const { order, setOrder } = useOrderStore();
  const { cart, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const { postData, loading } = usePostAuthData<any, any>();
  const [showOverlay, setShowOverlay] = useState(false);
 
  const [selectedGateway, setSelectedGateway] =
    useState<PaymentGateway>("Cash on Delivery");

  const paymentGateways: PaymentGateway[] = ["Cash on Delivery"];

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<BillingFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      street: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      phone: "",
      email: "",
      saveInfo: false,
    },
  });

  useEffect(() => {
    if (user?.address) {
      reset({
        ...user.address,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
      });


    }
  }, [user, reset, setOrder]);

  const handlePlaceOrder = async (data: BillingFormData) => {
    if (showOverlay || !user?._id || cart.length === 0) return;
    const shippingAddress = {
      street: data.street,
      city: data.city,
      state: data.state,
      country: data.country,
      postal_code: data.postal_code,
    };

    const payload = {
      userId: user._id,
      cartItems: cart.map((item: CartItem) => ({
        productId:
          typeof item.product === "string"
            ? item.product
            : item.product._id,
        quantity: item.quantity,
        selectedVariant: item.selectedVariant,
        priceAtTimeOfOrder:
          productPrice(item.product, item.selectedVariant),
      })),
      paymentMethod: selectedGateway,
      payment: {
        paymentGateway: selectedGateway,
      },
      shippingAddress,
    };

    setShowOverlay(true);

    const result = await postData(
      `${import.meta.env.VITE_API_BACKEND_URL}/orders`,
      payload,
      "🎉 Order placed successfully!"
    );
if (!result.ok) { setShowOverlay(false); return; }
if (data.saveInfo) {
  await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ✅ send cookies for authentication
    body: JSON.stringify({
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      email: data.email,
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        country: data.country,
        postal_code: data.postal_code,
      },
    }),
  })
    .then((res) => { if (!res.ok) throw new Error("Profile update failed"); return res.json(); })
    .then((res) => {
      console.log("📝 Profile updated:", res.message);
      setUser(res.user)
    })
    .catch((err) => {
      console.error("❌ Failed to update profile:", err);
    });
}
    clearCart();
    setShowOverlay(false);
    navigate("/");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handlePlaceOrder)}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        className="mb-6"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Billing Details
      </Typography>

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {/* Required Form Fields */}
        <Controller
          name="firstName"
          control={control}
          rules={{ required: "First Name is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="First Name*"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          rules={{ required: "Last Name is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Last Name*"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="street"
          control={control}
          rules={{ required: "Street is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Street*"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="city"
          control={control}
          rules={{ required: "City is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="City*"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="state"
          control={control}
          rules={{ required: "State is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="State*"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="country"
          control={control}
          rules={{ required: "Country is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Country*"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="postal_code"
          control={control}
          rules={{ required: "Postal Code is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Postal Code*"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          rules={{ required: "Phone Number is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Phone Number*"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Email Address*"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Box>

      {/* Save Info */}
      <FormControlLabel
        control={
          <Controller
            name="saveInfo"
            control={control}
            render={({ field }) => (
              <Checkbox {...field} checked={field.value} color="primary" />
            )}
          />
        }
        label={
          <Typography
            style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px" }}
          >
            Save this information for faster checkout next time
          </Typography>
        }
        className="my-4"
      />

      {/* Payment Gateway */}
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
        onChange={(e) =>
          setSelectedGateway(e.target.value as PaymentGateway)
        }
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

      {/* Submit Button */}
      <Button
        variant="contained"
        fullWidth
        type="submit"
        disabled={loading || showOverlay || cart.length === 0}
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

      {/* Overlay */}
      <PageOverlay show={showOverlay} />
    </Box>
  );
};

export default BillingForm;
