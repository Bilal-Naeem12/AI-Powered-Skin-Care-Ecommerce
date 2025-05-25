import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, Typography, TextField, FormControlLabel, Checkbox } from "@mui/material";
import ButtonUI from "../../../component/UI/Button";
import useUserStore from "../../../store/useUserStore";
import useOrderStore from "../../../store/useOrderStore";

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
  const { user } = useUserStore();
  const { order, setOrder } = useOrderStore();

  const { control, handleSubmit, reset, watch } = useForm<BillingFormData>({
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
    const shippingAddress = {
      street: user.address.street,
      city: user.address.city,
      state: user.address.state,
      country: user.address.country,
      postal_code: user.address.postal_code,
    };
     reset({
        ...user.address,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone:user.phone || ""

      });

    // Immediately update order store with user's saved address
    setOrder({
      ...order,
      shipping: {
        ...order.shipping,
        shippingAddress,
      },
    });
  }
}, [user, reset, setOrder]);

  const onSubmit = (data: BillingFormData) => {
    const shippingAddress = {
      street: data.street,
      city: data.city,
      state: data.state,
      country: data.country,
      postal_code: data.postal_code,
    };
    setOrder({ shipping: { ...order.shipping, shippingAddress } });
    console.log("Shipping Address Saved:", shippingAddress);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
      <Typography variant="h5" fontWeight="bold" className="mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
        Billing Details
      </Typography>

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <Controller name="firstName" control={control} render={({ field }) => <TextField {...field} label="First Name*" fullWidth />} />
        <Controller name="lastName" control={control} render={({ field }) => <TextField {...field} label="Last Name*" fullWidth />} />
        <Controller name="street" control={control} render={({ field }) => <TextField {...field} label="Street*" fullWidth />} />
        <Controller name="city" control={control} render={({ field }) => <TextField {...field} label="City*" fullWidth />} />
        <Controller name="state" control={control} render={({ field }) => <TextField {...field} label="State*" fullWidth />} />
        <Controller name="country" control={control} render={({ field }) => <TextField {...field} label="Country*" fullWidth />} />
        <Controller name="postal_code" control={control} render={({ field }) => <TextField {...field} label="Postal Code*" fullWidth />} />
        <Controller name="phone" control={control} render={({ field }) => <TextField {...field} label="Phone Number*" fullWidth />} />
        <Controller name="email" control={control} render={({ field }) => <TextField {...field} label="Email Address*" fullWidth />} />
      </Box>

      <FormControlLabel
        control={
          <Controller
            name="saveInfo"
            control={control}
            render={({ field }) => <Checkbox {...field} checked={field.value} color="primary" />}
          />
        }
        label={<Typography style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>Save this information for faster checkout next time</Typography>}
        className="my-4"
      />

      <ButtonUI
        variant="black"
        className="w-full mt-4"
        type="submit"
        style={{ padding: "12px 0", fontSize: "16px", fontWeight: "bold", fontFamily: "Poppins, sans-serif" }}
      >
        Save Shipping Address
      </ButtonUI>
    </Box>
  );
};

export default BillingForm;
