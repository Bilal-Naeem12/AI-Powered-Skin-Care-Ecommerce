import React from "react";
import { CartItem } from "@/types/CartItem";

interface Props {
  cartItems: CartItem[];
}

export default function OrderImageCarousel({ cartItems }: Props) {
  return (
    <div className="flex overflow-x-auto space-x-3 pb-2">
      {cartItems?.map((item, i) => (
        <img
          key={i}
          src={(item.product as any)?.image}
          alt="Product"
          className="h-20 w-20 rounded object-cover"
        />
      ))}
    </div>
  );
}
