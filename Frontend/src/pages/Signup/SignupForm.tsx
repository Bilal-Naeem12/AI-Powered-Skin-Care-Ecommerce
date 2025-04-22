import React from "react";
import { useForm } from "react-hook-form";
import { Box, TextField, Button, Typography } from "@mui/material";
import { FcGoogle } from "react-icons/fc"; // For Google icon
import { Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod validation schema
const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
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
    .max(20, "Password must be less than 20 characters long"),
});

type SignupData = z.infer<typeof signupSchema>;

const SignupForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema), // Using Zod validation schema
  });

  const onSubmit = (data: SignupData) => {
    console.log("Form Submitted: ", data);
    // Add logic to handle form submission (e.g., send data to API)
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
            {/* Name Field */}
            <Box className="mb-6">
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register("name")}
              />
            </Box>

            {/* Email Field */}
            <Box className="mb-6">
              <TextField
                fullWidth
                label="Email or Phone Number"
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
