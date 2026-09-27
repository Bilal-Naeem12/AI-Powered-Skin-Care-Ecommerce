import React, { useState } from "react";
import { Order } from "@/types/Order";
import OrderImageCarousel from "./OrderImageCarousel";
// import OrderActions from "./OrderActions";
import { useNavigate } from "react-router-dom";
import LeaveReviewModal from "./sub-pages/LeaveReview/LeaveReviewModal";
import RefundRequestModal from "./sub-pages/Refund";

interface Props {
  order: Order;
}

export default function OrderCard({ order }: Props) {
  const latestStatus = order.statusHistory?.at(0);
  const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-500">
          Placed on {new Date(order.placedAt).toLocaleDateString()}
        </span>
      <span
  className={`px-2 py-1 text-xs rounded ${
    latestStatus?.what === "Created"
      ? "bg-orange-100 text-orange-700"
      : latestStatus?.what === "Paid"
      ? "bg-green-100 text-green-700"
      : latestStatus?.what === "Cancelled"
      ? "bg-red-100 text-red-700"
      : latestStatus?.what === "Refunded"
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-100 text-gray-700"
  }`}
>
  {latestStatus?.what}
</span>

      </div>
<div className="flex flex-col gap-5 sm:flex-row justify-between sm:items-start ">
  
  <div className="">
      <OrderImageCarousel cartItems={order.cartItems} />
 <div className="flex  flex-col  sm:flex-row justify-between mt-5 gap-4">
      
      <p>{order.cartItems.length} items: <span className=" font-semibold">{ import.meta.env.VITE_API_CURRENCY_Symbol}{order.totalAmount.toFixed(2)}</span></p>
       <p>Order Id:  <span className=" font-semibold">{order.orderNumber}</span></p>
      
      </div>
      </div>
   <div className="flex flex-col flex-wrap gap-3">
  {/* TRACK */}
  <button
    className="btn-primary border rounded-full bg-orange-400 px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
    onClick={() => navigate(`/profile-page/orders/${order._id}`)}
    disabled={!["Paid"].includes(latestStatus?.what ?? "")}
  >
    Track
  </button>

  {/* VIEW DETAILS - always enabled */}
  <button
    className="btn-secondary border rounded-full border-black px-3 py-1"
    onClick={() => navigate(`${order._id}`)}
  >
    View Order Detail
  </button>

  {/* LEAVE REVIEW */}
  <button
    className="btn-secondary border rounded-full border-black px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
    onClick={() => setShowModal(true)}
    disabled={!["Paid", "Refunded"].includes(latestStatus?.what ?? "")}
  >
    Leave a Review
  </button>

  {/* RETURN/REFUND */}
  <button
    className="btn-secondary border rounded-full border-black px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
    onClick={() => setShowRefundModal(true)}
    disabled={!["Paid"].includes(latestStatus?.what ?? "")}
  >
    Return/Refund
  </button>
</div>

      </div>

     
      <LeaveReviewModal
        open={showModal}
        onClose={() => setShowModal(false)}
        cartItems={order.cartItems}
      />

    <RefundRequestModal
  open={showRefundModal}
  onClose={() => setShowRefundModal(false)}
  orderId={order._id}
/>
    </div>
    
  );
}
