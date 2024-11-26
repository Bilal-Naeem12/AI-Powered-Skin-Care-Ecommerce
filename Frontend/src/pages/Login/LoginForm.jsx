import React from "react";
import { useForm } from "react-hook-form";
import { Box, TextField, Button, Typography } from "@mui/material";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Submitted: ", data);
  };

  return (
    <Box className=" min-h-screen flex items-center justify-center my-10">
      <Box className="container mx-auto flex flex-col md:flex-row items-center gap-10 sm:gap-32 ">
        {/* Left Image Section */}
     
        <Box className="w-full md:w-[40%] flex justify-center">
          <img
            src="/assets/product_images/moisturizer.jpg" // Replace with your actual image path
            alt="Moisturizer"
            className="w-full max-w-full rounded-lg shadow-md"
          />
        </Box>

        {/* Right Login Form Section */}
        <Box
          className="sm:max-w-[80%]   "
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Log in to SkinCare Pro
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            className="mb-8 text-gray-500"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Enter your details below
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email or Phone Field */}
            <Box className="mb-6">
              <TextField
                fullWidth
                label="Email or Phone Number"
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
                {...register("email", {
                  required: "Email or phone number is required",
                  pattern: {
                    value:
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
            </Box>

            {/* Password Field */}
            <Box className="mb-6">
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type="password"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
              />
            </Box>

            {/* Login Button */}
            <Box className="mb-4">
              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "12px 0",
                  fontSize: "16px",
                  fontWeight: "bold",
                  fontFamily: "Poppins, sans-serif",
                  textTransform: "none",
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                }}
              >
                Log In
              </Button>
            </Box>

            {/* Forgot Password */}
            <Typography
              align="right"
              variant="body2"
              style={{
                color: "#E91E63",
                fontFamily: "Poppins, sans-serif",
                cursor: "pointer",
                fontWeight: "500",
              }}
              className="hover:underline"
            >
              Forget Password?
            </Typography>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm;
