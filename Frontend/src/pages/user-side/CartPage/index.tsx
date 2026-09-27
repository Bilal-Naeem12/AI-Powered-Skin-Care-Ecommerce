import React from "react";
import { Box, Typography } from "@mui/material";
import MainLayout from "../../../component/Layout/MainLayout";
import CartItem from "./CartItem";
import CartTotal from "./CartTotal";
import CartActions from "./CartActions";
import useCartStore from "../../../store/CartStore"; // Import your Zustand store // Import Product type
import { Product } from "@/types/Product";

// Define the type for cart items
interface CartItemType {
  product: Product;  // The product type is from the Product interface
  selectedVariant?: string;
  quantity: number;  // Quantity of the product in the cart
}

const CartPage: React.FC = () => {
  // Access cart items, and actions from Zustand store
  const { cart, getTotalPrice, updateProductQuantity, removeProductFromCart } = useCartStore();

  // Handle quantity change
  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateProductQuantity(id, newQuantity);
  };

  // Calculate subtotal
  const subtotal = getTotalPrice();

  return (
    <MainLayout>
      <Box className="container mx-auto px-4 sm:px-6 py-10">
        <h4
     className="text-2xl  font-medium"
        >
          Shopping Cart
        </h4>

        <Box className="bg-white rounded-lg shadow-md p-6">
          {/* Render Cart Items */}
          {cart.length === 0 ? (
            <Typography variant="h6" className="text-center">Your cart is empty</Typography>
          ) : (
            cart.map((item: CartItemType) => (
              <CartItem
                key={`${item.product._id}-${item.selectedVariant ?? ""}`}
                item={item}
              />
            ))
          )}
        </Box>

        {/* Cart Totals */}
        <CartTotal subtotal={subtotal} />

        {/* Action Buttons */}
        <CartActions />
      </Box>
    </MainLayout>
  );
};

export default CartPage;
