import React, { useState } from "react";
import { Order } from "@/types/Order";
import OrderImageCarousel from "./OrderImageCarousel";
// import OrderActions from "./OrderActions";
import { useNavigate } from "react-router-dom";
import LeaveReviewModal from "./sub-pages/LeaveReview/LeaveReviewModal";

interface Props {
  order: Order;
}

export default function OrderCard({ order }: Props) {
  const latestStatus = order.statusHistory?.at(-1);
  const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-500">
          Placed on {new Date(order.placedAt).toLocaleDateString()}
        </span>
        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
          {latestStatus?.what}
        </span>
      </div>
<div className="flex justify-between items-start ">
  
  <div className="">
      <OrderImageCarousel cartItems={order.cartItems} />
 <div className="flex  justify-between mt-5 gap-4">
      
      <p>{order.cartItems.length} items: <span className=" font-semibold">{ import.meta.env.VITE_API_CURRENCY_Symbol}{order.totalAmount.toFixed(2)}</span></p>
       <p>Order Id:  <span className=" font-semibold">{order.orderNumber}</span></p>
      
      </div>
      </div>
         <div className="  flex  flex-col flex-wrap gap-3">
      <button className="btn-primary  border rounded-full  bg-orange-400  px-3 py-1" onClick={() => navigate(`/track/${order._id}`)}>Track</button>
          <button className="btn-secondary border rounded-full  border-black px-3 py-1"       onClick={() => navigate(`${order._id}`)}>View Order Detail</button>
      <button className="btn-secondary border rounded-full  border-black px-3 py-1"     onClick={() => setShowModal(true)}>Leave a review</button>
      <button className="btn-secondary border rounded-full border-black px-3 py-1">Return/Refund</button>

    </div>
      </div>

     
      <LeaveReviewModal
        open={showModal}
        onClose={() => setShowModal(false)}
        cartItems={order.cartItems}
      />
    </div>
    
  );
}
