import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"; // Import Zod
import { Box, TextField, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Importing toast
import axios from "axios";
import Cookies from 'js-cookie'; // You can use js-cookie to get cookies easily

// Define Zod schema for validation
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email or phone number is required")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
      "Invalid email address"
    ),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must not exceed 20 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>; // Type inference from Zod schema

const LoginForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // This hook is used for programmatic navigation

  // Setup react-hook-form with Zod schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema), // Use Zod resolver for validation
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Make the POST request using axios with withCredentials enabled
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URL}/users/login`,
        {
          email: data.email,
          password: data.password,
        },
        {
          withCredentials: true,  // Ensures cookies are sent and received
        }
      );

      // At this point, cookies are set by the backend (e.g., accessToken and refreshToken)
      // Retrieve the tokens from cookies (if set by the backend)
      // const accessToken = Cookies.get('accessToken');
      // const refreshToken = Cookies.get('refreshToken');
      // console.log(accessToken)
      // Check if the response was successful
      if (response.status === 200) {
        // Optionally, store tokens in localStorage (for example, if needed)
        // localStorage.setItem('accessToken', accessToken);
        // localStorage.setItem('refreshToken', refreshToken);

        // Navigate to the homepage
        navigate('/');

        // Show success notification
        toast.success('Login successful!');
      } else {
        // If login fails, show an error message
        toast.error('Invalid username or password');
      }
    } catch (err) {
      console.error(err);
      // Show error notification
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <Box className="bg-[#f8f8f8] min-h-screen flex items-center justify-center">
      <Box className="container mx-auto flex flex-col md:flex-row items-center gap-10 px-8 md:px-16 lg:px-24">
        {/* Left Image Section */}
        <Box className="w-full md:w-[40%] flex justify-center">
          <img
            src="/assets/product_images/moisturizer.jpg" // Replace with your actual image path
            alt="Moisturizer"
            className="w-full max-w-lg rounded-lg shadow-md"
          />
        </Box>

        {/* Right Login Form Section */}
        <Box className="w-full md:w-[50%] bg-white p-8 md:p-10 lg:p-12 rounded-lg shadow-lg">
          <Typography
            variant="h4"
            fontWeight="bold"
            className="mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Log in to SkinCare Pro
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
            {/* Email or Phone Field */}
            <Box className="mb-6">
              <TextField
                fullWidth
                label="Email or Phone Number"
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
                {...register("email")}
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
                {...register("password")}
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

            {/* Links Section */}
            <Box className="flex justify-between">
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <Typography
                  align="left"
                  variant="body2"
                  style={{
                    color: "#000",
                    textDecoration: "underline",
                    fontFamily: "Poppins, sans-serif",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                  className="hover:underline"
                >
                  Create a new account
                </Typography>
              </Link>

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
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm;
