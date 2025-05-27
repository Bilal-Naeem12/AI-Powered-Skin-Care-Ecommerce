import React from "react";
import useFetchAuthData from "@/hooks/useFetchAuthData";
import { Order } from "@/types/Order";
import OrderCard from "./OrderCard";

interface Props {
  statusFilter: string;
}

export default function OrderList({ statusFilter }: Props) {
  const { data: orders, loading } = useFetchAuthData<Order[]>(
    `${import.meta.env.VITE_API_BACKEND_URL}/orders/customer`
  );

  if (loading) return <p>Loading orders...</p>;
  if (!orders || orders.length === 0) return <p>No orders found.</p>;

  const filtered = statusFilter === "All"
    ? orders
    : orders.filter(order =>
        order.statusHistory?.at(-1)?.what === statusFilter
      );

  return (
    <div className="mt-6 space-y-6 ">
      {filtered.map(order => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
}
