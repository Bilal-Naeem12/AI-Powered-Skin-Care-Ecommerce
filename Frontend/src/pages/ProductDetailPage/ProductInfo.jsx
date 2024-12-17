import React, { useState } from "react";
import { Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const ProductInfo = () => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantity = (type) => {
    setQuantity((prev) => (type === "increase" ? prev + 1 : Math.max(1, prev - 1)));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="relative">
          <img
            src="/assets/product_images/sun-screen.jpg" // Replace with real image
            alt="Product"
            className="rounded-lg w-full object-cover"
          />
          <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
            25% OFF
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Bluebell Dream Nourishing Cream</h1>
        <p className="text-lg font-semibold">Our Price Rs. 750.00</p>
        <div className="flex items-center gap-2">
          <IconButton onClick={() => handleQuantity("decrease")} size="small">
            <RemoveIcon />
          </IconButton>
          <span className="border px-4 py-1 rounded">{quantity}</span>
          <IconButton onClick={() => handleQuantity("increase")} size="small">
            <AddIcon />
          </IconButton>
        </div>
        <Button
          variant="contained"
          color="inherit"
          className="!bg-black !text-white hover:!bg-gray-800"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
