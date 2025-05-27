import React from "react";
import { useNavigate } from "react-router-dom";

export default function OrderActions({ orderId }: { orderId: string }) {
  const navigate = useNavigate();

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button className="btn-primary" onClick={() => navigate(`/track/${orderId}`)}>Track</button>
      <button className="btn-secondary">Leave a review</button>
      <button className="btn-secondary">Return/Refund</button>
      <button className="btn-outline">Buy this again</button>
    </div>
  );
}
