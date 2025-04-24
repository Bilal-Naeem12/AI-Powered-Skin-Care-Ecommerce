import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

// Zod Validation Schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
      "Invalid email address"
    ),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage: React.FC = () => {
  const [emailSent, setEmailSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema), // Using Zod for validation
  });

  // Handle form submission
  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      // Make POST request to send password reset email
      await axios.post(`${import.meta.env.VITE_API_BACKEND_URL}/users/request-password-reset`, {
        email: data.email,
      });

      setEmailSent(true); // If email is sent successfully
      toast.success("Password reset link has been sent to your email.");
    } catch (error) {
      toast.error("Error occurred. Please try again.");
    }
  };

  return (
    <Box className="bg-[#f8f8f8] min-h-screen flex items-center justify-center">
      <Box className="container mx-auto flex flex-col md:flex-row items-center gap-10 px-8 md:px-16 lg:px-24">
        {/* Left Image Section */}
        <Box className="w-full md:w-[40%] flex justify-center">
          <img
            src="/assets/product_images/moisturizer.jpg"  // Replace with actual image
            alt="Forgot Password"
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
            Forgot Your Password?
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
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

            {/* Submit Button */}
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
                Request Reset Link
              </Button>
            </Box>

            {/* Success message after submission */}
            {emailSent && (
              <Box className="mb-4">
                <Typography
                  variant="body1"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    textAlign: "center",
                    fontWeight: "500",
                    color: "#4caf50",
                  }}
                >
                  Check your email for the reset link!
                </Typography>
              </Box>
            )}

            {/* Links Section */}
            <Box className="flex justify-between mt-6">
              <Link to="/login" style={{ textDecoration: "none" }}>
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
                 
                >
                  Remember your password? <span className=" text-[#E91E63] "> Log in</span>
                </Typography>
              </Link>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
