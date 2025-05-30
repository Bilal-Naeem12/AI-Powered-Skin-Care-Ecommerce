import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import useFetchAuthData from "@/hooks/useFetchAuthData";
import { Order } from "@/types/Order";



const OrderDetailPage = () => {
    const { id } = useParams();
  const {
    data: order,
    loading,
    error,
  } = useFetchAuthData<Order>(
    `${import.meta.env.VITE_API_BACKEND_URL}/orders/${id}`
  );

   if (loading) return <p>Loading order details...</p>;
  if (error || !order) return <p className="text-red-500">Failed to load order.</p>;

  return (
    <div className=" mx-auto p-4 space-y-8 card bg-white">
      {/* Section 1: Ordered Items */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Ordered Items</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className=" font-semibold">Image</TableCell>
                <TableCell className=" font-semibold">Name</TableCell>
                <TableCell className=" font-semibold">Variant</TableCell>
                <TableCell className=" font-semibold">Unit Price</TableCell>
                <TableCell className=" font-semibold">Quantity</TableCell>
                <TableCell className=" font-semibold">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.cartItems.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <img
                      src={item.productId.images?.[0]}
                      alt={item.productId.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>{item.productId.name}</TableCell>
                  <TableCell>{item.selectedVariant || "-"}</TableCell>
                  <TableCell>${item.priceAtTimeOfOrder.toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    ${(item.priceAtTimeOfOrder * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      {/* Section 2: Shipping Info */}
      <section className="card bg-white shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
        <div className="space-y-1 text-sm">
          <p><strong>Address:</strong> {order?.shippingId?.shippingAddress.street}</p>
          <p><strong>City:</strong> {order?.shippingId?.shippingAddress.city}</p>
          <p><strong>Postal Code:</strong> {order?.shippingId?.shippingAddress.postal_code}</p>
          <p><strong>Country:</strong> {order?.shippingId?.shippingAddress.country}</p>
          {/* <p><strong>Contact:</strong> {order?.shippingId?.shippingAddress.}</p> */}
        </div>
      </section>

      {/* Section 3: Status History */}
   <section className="card bg-white shadow p-4">
        <h2 className="text-xl font-semibold mb-4 ">Order Status History</h2>
        <div className="space-y-2">
          {order.statusHistory.map((entry, index) => (
            <div key={index} className="text-sm border-b py-1">
              <p><strong>Status:</strong> {entry.what}</p>
              <p><strong>Updated At:</strong> {new Date(entry.updatedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OrderDetailPage;
