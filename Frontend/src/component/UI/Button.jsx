import React from "react";
import { Button as MUIButton } from "@mui/material";

const Button = ({ children, onClick, variant = "white", className, ...props }) => {
  // Variant Styles
  const variantStyles = {
    white: {
      border: "1px solid white",
      color: "white",
      "&:hover": {
        backgroundColor: "white",
        color: "gray",
      },
    },
    black: {
      border: "1px solid black",
      color: "black",
      "&:hover": {
        backgroundColor: "black",
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
        backgroundColor: "gray",
      },
    },
  };

  return (
    <MUIButton
      onClick={onClick}
      sx={{
        px: 3, // Padding x-axis
        py: 1.5, // Padding y-axis
        borderRadius: "8px",
        transition: "all 0.3s",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        ...variantStyles[variant],
      }}
      className={className}
      {...props}
    >
      {children}
    </MUIButton>
  );
};

export default Button;
