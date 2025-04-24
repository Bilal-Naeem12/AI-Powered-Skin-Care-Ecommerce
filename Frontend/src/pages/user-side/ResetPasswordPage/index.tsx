import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Box, TextField, Button, Typography, Container } from "@mui/material";
import { Link } from "react-router-dom";

type ApiResponse = {
    message: string;
  };
type ResetPasswordFormData = {
  newPassword: string;
};

interface ResetPasswordPageProps {
  token: string;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ token }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>();
  const [resetComplete, setResetComplete] = useState(false);

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    try {
      const response = await axios.post<ApiResponse>(
        `${import.meta.env.VITE_API_BACKEND_URL}/users/reset-password`,
        { token, ...data }
      );
      
      // Handle success: reset complete
      if (response.status === 200) {
        toast.success(response.data.message); // Display success message from backend
        setResetComplete(true);  // Set flag to display success UI
      }
    } catch (error: any) {
      if (error.response) {
        // Handle specific errors based on backend response
        const message = error.response.data.message || "An error occurred. Please try again.";
        toast.error(message);  // Show error message from the backend
      } else {
        // Handle network or unexpected errors
        toast.error("Network error. Please try again.");
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 4, backgroundColor: "white", borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>Reset Password</Typography>
        
        {!resetComplete ? (
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <TextField
              {...register("newPassword", { required: "Password is required" })}
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ padding: "10px 0", fontWeight: "bold", textTransform: "none" }}
            >
              Reset Password
            </Button>
          </form>
        ) : (
          <Typography variant="h6" color="primary" align="center">
            Password reset successful! You can now login with your new password.
          {/* Create Account Button */}
                  <Link to="/">   <Box className="mb-4">
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
                         Vist Website
                       </Button>
                     </Box>
                     </Link>
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;
