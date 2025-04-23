import React from "react";
import { useForm } from "react-hook-form";
import { Box, TextField, Button, Typography } from "@mui/material";
import { FcGoogle } from "react-icons/fc"; // For Google icon
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import axios from "axios";
interface ApiResponse {
  message: string;
  // Add other properties from your API response here if needed
}
// Zod validation schema
const signupSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
      "Invalid email address"
    ),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be less than 20 characters long"),
});

// Use Zod to infer the type from the schema
type SignupData = z.infer<typeof signupSchema>;

const SignupForm: React.FC = () => {

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),  // Use Zod validation schema
  });

  // onSubmit handler
  const onSubmit = async (data: SignupData) => {
    try {
      // Making the API request for user signup
      const response = await axios.post<ApiResponse>(`${import.meta.env.VITE_API_BACKEND_URL}/users/register`, data);
    
      // Check the response and display success message
      if (response.status === 201) {
        // Handle success (e.g., show a success message, redirect user, etc.)
        console.log("Signup successful", response.data);
        toast.success(response.data.message || "Operation successful!");

        navigate("/login")
      }
    } catch (error: any) {
      // Check if the error response status is 400 (Bad Request)
      if (error.response?.status === 400) {
        // Show the error message from the server (from error.response.data.message)
        toast.error(error.response?.data.message || "Signup failed. Please try again.");
      } else {
        // Handle other types of errors (e.g., network errors)
        toast.error("An error occurred. Please try again.");
      }
      console.error("Error during signup:", error);
    }
    
  };

  return (
    <Box className="bg-[#f8f8f8] min-h-screen flex items-center justify-center">
      <Box className="container mx-auto flex flex-col md:flex-row items-center gap-10 px-8 md:px-16 lg:px-24">
        {/* Left Image Section */}
        <Box className="w-full md:w-[40%] flex justify-center">
          <img
            src="/assets/product_images/vitamin-c-serum.jpg" // Replace with your actual image path
            alt="Moisturizer"
            className="w-full max-w-lg rounded-lg shadow-md"
          />
        </Box>

        {/* Right Form Section */}
        <Box className="w-full md:w-[50%] bg-white p-8 md:p-10 lg:p-12 rounded-lg shadow-lg">
          <Typography
            variant="h4"
            fontWeight="bold"
            className="mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Create an account
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
            {/* First Name and Last Name Fields in a Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name Field */}
              <Box className="mb-6">
                <TextField
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                  {...register("first_name")}
                />
              </Box>

              {/* Last Name Field */}
              <Box className="mb-6">
                <TextField
                  fullWidth
                  label="Last Name"
                  variant="outlined"
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                  {...register("last_name")}
                />
              </Box>
            </div>

            {/* Email Field */}
            <Box className="mb-6">
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
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
                helperText={errors.password?.message}
                {...register("password")}
              />
            </Box>

            {/* Create Account Button */}
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
                Create Account
              </Button>
            </Box>

            {/* Google Signup Button */}
            <Box className="mb-4">
              <Button
                type="button"
                fullWidth
                variant="outlined"
                style={{
                  color: "#000",
                  padding: "12px 0",
                  fontSize: "16px",
                  fontWeight: "bold",
                  fontFamily: "Poppins, sans-serif",
                  textTransform: "none",
                  borderColor: "#ccc",
                }}
                startIcon={<FcGoogle />}
              >
                Sign up with Google
              </Button>
            </Box>

            {/* Already have an account */}
            <Typography
              align="center"
              variant="body2"
              style={{
                fontFamily: "Poppins, sans-serif",
                marginTop: "1rem",
                color: "#333",
              }}
            >
              Already have an account?{" "}
              <Link to="/login">
                <span
                  style={{
                    color: "#E91E63",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  className="hover:underline"
                >
                  Log in
                </span>
              </Link>
            </Typography>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default SignupForm;
