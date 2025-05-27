import React from "react";
import { Order } from "@/types/Order";
import OrderImageCarousel from "./OrderImageCarousel";
import OrderActions from "./OrderActions";

interface Props {
  order: Order;
}

export default function OrderCard({ order }: Props) {
  const latestStatus = order.statusHistory?.at(-1);

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-500">
          Delivered on {new Date(order.placedAt).toLocaleDateString()}
        </span>
        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
          {latestStatus?.what}
        </span>
      </div>

      <OrderImageCarousel cartItems={order.cartItems} />

      <OrderActions orderId={order._id} />
    </div>
  );
}
