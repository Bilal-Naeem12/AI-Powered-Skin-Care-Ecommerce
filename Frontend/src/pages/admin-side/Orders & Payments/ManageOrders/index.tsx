// src/pages/admin/ManageOrders.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/component/admin/ui/table";
import Badge from "@/component/admin/ui/badge/Badge";
import useFetchAuthData from "@/hooks/useFetchAuthData";
import { Order, OrderStatus } from "@/types/Order";
import { Eye, Loader2, Pencil, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import OrderDetailModal from "./OrderDetail/OrderDetailModal";

import CancelOrderModal from "./CancelOrderModal";
import useUpdateAuthData from "@/hooks/usePutAuthData";
import usePutAuthData from "@/hooks/usePutAuthData";
import { toast } from "react-toastify";
import EditOrderModal from "./EditOrderModal";

const STATUS_VALUES: OrderStatus[] = [
  "Created",
  "Paid",
  "Cancelled",
];

// brand-colour helper
const brand = "text-[#FF69B4]";

export default function ManageOrders() {
  /* ── state ──────────────────────────────── */
  const [page, setPage] = useState(1);
  const limit = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
   const [reload, setReload] = useState(false);
const [selectedStatus, setSelectedStatus] = useState("All");

  /* ── debounce search ────────────────────── */
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  /* ── fetch ──────────────────────────────── */
const url =
  `${import.meta.env.VITE_API_BACKEND_URL}/orders?page=${page}&limit=${limit}` +
  (debouncedSearch ? `&q=${debouncedSearch}` : "") +
  (selectedStatus !== "All" ? `&status=${selectedStatus}` : "");


  const { data, loading, error } = useFetchAuthData<{
    orders: Order[];
    totalCount: number;
    limit: number;
  }>(url,reload);

  /* ── handlers ───────────────────────────── */
  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BACKEND_URL}/orders/${orderId}/status`,
        { status }
      );
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };
const [detailOrder, setDetailOrder] = useState<Order | null>(null);
const [editOrder,   setEditOrder]   = useState<Order | null>(null);
const [cancelOrder, setCancelOrder] = useState<Order | null>(null);


  /* ── ui ─────────────────────────────────── */
  return (
    <div className="overflow-hidden rounded-2xl border bg-white p-6 dark:bg-gray-900">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Manage Orders
        </h2>

        <input
          type="text"
          placeholder="Search order # or customer…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xs rounded-md border px-3 py-2 text-sm shadow-sm focus:border-[#FF69B4] focus:ring-[#FF69B4]/40 dark:bg-gray-800 dark:text-white"
        />
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-14">
          <Loader2 className="animate-spin" />
        </div>
      ) : error ? (
        <p className="py-6 text-center text-red-500">Error loading orders.</p>
      ) : (
        <>
        {/* Status Filter */}
<div className="mb-4 flex flex-wrap items-center gap-4">
  {["All", "Created", "Paid", "Cancelled"].map((status) => (
    <label key={status} className="flex items-center gap-2 text-sm font-medium">
      <input
        type="radio"
        name="statusFilter"
        value={status}
        checked={status === selectedStatus}
        onChange={() => setSelectedStatus(status)}
        className="h-4 w-4 text-[#FF69B4] focus:ring-[#FF69B4]"
      />
      {status}
    </label>
  ))}
</div>

          <Table>
            {/* table head with brand colour strip */}
            <TableHeader className="p-5 ">
              <TableRow>
                {["Order", "User", "Total", "Status", "Shipping", "Actions"].map(
                  (t) => (
                    <TableCell key={t} isHeader className="text-start">
                      <span >{t}</span>
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHeader>
<div className=" p-2"></div>
            <TableBody >
              {data?.orders?.map((order) => (
                <TableRow key={order._id}  >
                  {/* Order # */}
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>

                  {/* Customer */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          (order.userId as any)?.profileImage ||
                          "/images/avatar-placeholder.png"
                        }
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold">
                          {order.userId?.first_name} {order.userId?.last_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.userId?.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Total */}
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>

                  {/* Status – radio buttons */}
         <TableCell>
  {(() => {
    const currentStatus = order.statusHistory?.at(0)?.what || "Created";

    const color =
      currentStatus === "Paid"
        ? "success"
        : currentStatus === "Cancelled"
        ? "error"
        : "info"; // for "Created" or default

    return (
      <Badge size="sm" color={color}>
        {currentStatus}
      </Badge>
    );
  })()}
</TableCell>


                  {/* Shipping */}
                  <TableCell>
                    <Badge
                      size="sm"
                      color={
                        order.shippingId?.shippingStatus === "Delivered"
                          ? "success"
                          : order.shippingId?.shippingStatus === "Cancelled"
                          ? "error"
                          : "warning"
                      }
                    >
                      {order.shippingId?.shippingStatus || "Pending"}
                    </Badge>
                    <p className="text-[11px] text-gray-500">
                      {order.shippingId?.trackingNumber}
                    </p>
                  </TableCell>

                  {/* Actions */}
                 <TableCell className="whitespace-nowrap">
  <div className="flex items-center gap-2">
    {/* View */}
    <button
      title="View order"
      onClick={() => setDetailOrder(order)}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#FF69B4]/90 text-white hover:bg-[#FF69B4]"
    >
      <Eye size={18} />
    </button>

    {/* Edit */}
    <button
      title="Edit order"
       onClick={() => {
    console.log("Opening modal for:", order);
    setEditOrder(order);
  }}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/90 text-white hover:bg-amber-500"
    >
      <Pencil size={16} />
    </button>

    {/* Delete */}
    <button
      title="Delete order"
      onClick={() => setCancelOrder(order)}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/90 text-white hover:bg-red-500"
    >
      <Trash size={16} />
    </button>
  </div>
</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* pagination */}
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({
              length: Math.ceil(
                (data?.totalCount || 0) / (data?.limit || limit)
              ),
            }).map((_, i) => {
              const n = i + 1;
              return (
                <button
                  key={n}
                  onClick={() => handlePageChange(n)}
                  className={`h-8 w-8 rounded-full text-sm ${
                    page === n
                      ? "bg-[#FF69B4] text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-[#FF69B4]/10 hover:text-[#FF69B4]"
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </>
      )}
      <OrderDetailModal
  open={!!detailOrder}
  order={detailOrder}
  onClose={() => setDetailOrder(null)}
/>

<EditOrderModal
  open={!!editOrder}
  order={editOrder}
  onClose={() => setEditOrder(null)}
  onSuccess={() => {
    setEditOrder(null);     // close if not already closed
    setReload(r => !r);     // refetch list once
  }}
/>


<CancelOrderModal
  open={!!cancelOrder}
  order={cancelOrder}
  onClose={() => setCancelOrder(null)}
  onSuccess={() => {

    setCancelOrder(null);

     setReload(r => !r);
  }}
/>
    </div>
  );
}
