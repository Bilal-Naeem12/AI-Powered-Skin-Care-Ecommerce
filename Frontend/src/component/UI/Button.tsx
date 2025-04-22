import React from "react";
import { Button as MUIButton, ButtonProps as MUIButtonProps } from "@mui/material";

// Define the Button props type
interface ButtonProps extends Omit<MUIButtonProps, 'variant'> {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: "white" | "black" | "primary" | "secondary"; // Custom variants
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = "white", className, ...props }) => {
  // Variant Styles
  const variantStyles = {
    white: {
      border: "1px solid black",
      backgroundColor:"black",
      color: "white",
      "&:hover": {
        backgroundColor: "white",
        color: "black",
      },
    },
    black: {
      border: "1px solid black",
      backgroundColor:"white",
      color: "black",
      "&:hover": {
        border: "1px solid gray",
        backgroundColor: "gray",
        color: "white",
      },
    },
    primary: {
      backgroundColor: "#2563eb", // Tailwind's blue-600
      color: "white",
      "&:hover": {
        backgroundColor: "#1d4ed8", // Tailwind's blue-700
      },
    },
    secondary: {
      backgroundColor: "black",
      color: "white",
      "&:hover": {
    
      },
    },
  };

  return (
    <MUIButton
      onClick={onClick}
      variant="contained" // Default Material UI variant
      sx={{
        px: 3, // Padding x-axis
        py: 1.5, // Padding y-axis
        borderRadius: "8px",
        transition: "all 0.3s",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        ...variantStyles[variant], // Apply custom styles based on variant
      }}
      className={className}
      {...props}
    >
      {children}
    </MUIButton>
  );
};

export default Button;
