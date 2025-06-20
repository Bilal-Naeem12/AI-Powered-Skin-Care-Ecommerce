import React from "react";

export const MyInfoCard = () => {
  return (
    <div
      style={{
        margin: "10px",
        padding: "15px",
        background: "#e6f0ff",
        border: "1px solid #b3d1ff",
        borderRadius: "8px",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {/* Image on the left */}
      <img
        src="/assets/inpainting.jpg" // Replace with your actual path
        alt="Sunscreen Tip"
        style={{
          width: "100px",
          height: "100px",
          objectFit:"contain",
          borderRadius: "6px",
        }}
      />

      
    </div>
  );
};
