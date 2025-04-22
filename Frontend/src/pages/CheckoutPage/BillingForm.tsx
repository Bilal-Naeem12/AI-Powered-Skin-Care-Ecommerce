import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import ButtonUI from "../../component/UI/Button";

const BillingForm = () => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      streetAddress: "",
      apartment: "",
      city: "",
      phone: "",
      email: "",
      saveInfo: false,
    },
  });

  const onSubmit = (data) => {
    console.log("Billing Details Submitted:", data);
  };

  const saveInfo = watch("saveInfo");

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg shadow-md p-8"
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        className="mb-6"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Billing Details
      </Typography>

      {/* First Name */}
      <Controller
        name="firstName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="First Name*"
            variant="outlined"
            fullWidth
            className="mb-4"
          />
        )}
      />

      {/* Last Name */}
      <Controller
        name="lastName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Last Name*"
            variant="outlined"
            fullWidth
            className="mb-4"
          />
        )}
      />

      {/* Street Address */}
      <Controller
        name="streetAddress"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Street Address*"
            variant="outlined"
            fullWidth
            className="mb-4"
          />
        )}
      />

      {/* Apartment (Optional) */}
      <Controller
        name="apartment"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Apartment, floor, etc. (optional)"
            variant="outlined"
            fullWidth
            className="mb-4"
          />
        )}
      />

      {/* City */}
      <Controller
        name="city"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Town/City*"
            variant="outlined"
            fullWidth
            className="mb-4"
          />
        )}
      />

      {/* Phone Number */}
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Phone Number*"
            variant="outlined"
            fullWidth
            className="mb-4"
          />
        )}
      />

      {/* Email Address */}
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email Address*"
            variant="outlined"
            fullWidth
            className="mb-4"
          />
        )}
      />

      {/* Save Info Checkbox */}
      <FormControlLabel
        control={
          <Controller
            name="saveInfo"
            control={control}
            render={({ field }) => (
              <Checkbox {...field} checked={saveInfo} color="primary" />
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
        className="mb-4"
      />

      {/* Place Order Button */}
      <ButtonUI
        variant="black"
        className="w-full mt-4"
        type="submit"
        style={{
          padding: "12px 0",
          fontSize: "16px",
          fontWeight: "bold",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        Place Order
      </ButtonUI>
    </Box>
  );
};

export default BillingForm;
