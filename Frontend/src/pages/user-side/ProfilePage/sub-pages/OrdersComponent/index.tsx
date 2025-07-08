import React, { useState } from "react";
import OrderList from "./OrderList";
import { Card } from "@mui/material";

const tabs = [ "All","Created"   // Order initiated, payment pending
, "Paid"      // Payment completed, processing/shipping starts
  ,"Cancelled" // Order cancelled before/after payment
  , "Refunded"];

export default function OrdersComponent() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <Card className="px-2 sm:px-6 py-4 w-full bg-white min-h-1/2">
      <h2 className="text-2xl font-semibold mb-4 ">My Orders</h2>

      <div className="flex gap-4 border-b mb-5">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`pb-2 ${activeTab === tab ? "border-b-2 border-pink-500 text-pink-500" : "text-gray-500"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <OrderList statusFilter={activeTab} />
    </Card>
  );
}
