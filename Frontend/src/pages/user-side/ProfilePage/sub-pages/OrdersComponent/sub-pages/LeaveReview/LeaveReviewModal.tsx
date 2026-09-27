import React, { useState } from "react";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Product } from "@/types/Product";
import OrderImageCarousel from "../../OrderImageCarousel";
import ProductReviewPage from "./ProductReviewPage";

interface CartItem {
  productId: Product;
  quantity: number;
  priceAtTimeOfOrder: number;
  selectedVariant?: string;
  alreadyReviewed?: boolean;          // bring from server if available
}

interface Props {
  open: boolean;
  onClose: () => void;
  cartItems: any[];
}

export default function LeaveReviewModal({ open, onClose, cartItems }: Props) {
  const [active, setActive] = useState<CartItem | null>(null);

  if (!open) return null;

  /* slide-in / out classes */
  const listCls =
    "transition-transform duration-300 " +
    (active ? "-translate-x-full" : "translate-x-0");
  const reviewCls =
    "absolute inset-0 transition-transform duration-300 " +
    (active ? "translate-x-0" : "translate-x-full");

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-lg overflow-auto  h-4/5">
        {/* close */}
        <button className="absolute top-3 right-3" onClick={onClose}>
          <X />
        </button>

        {/* ---------- PANEL 1 : choose item ---------- */}
        <div className={listCls}>
          <h2 className="text-xl font-semibold mt-6 mb-4 text-center">
            Leave a review
          </h2>

          <div className="px-4 mb-5">
            <OrderImageCarousel cartItems={cartItems} width="w-full"/>
          </div>

          <div className="divide-y">
            {cartItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-gray-50"
                onClick={() => item.productId?._id && !item.alreadyReviewed && setActive(item)}
              >
                <div className="flex gap-3 items-center">
                  <img
                    src={item.productId?.images?.[0]}
                    className="w-12 h-12 object-cover rounded border"
                  />
                  <div className="text-sm">
                    <p className="font-medium line-clamp-1">
                      {item.productId?.name}
                    </p>
                    <p className="text-gray-500">
                      {item.selectedVariant || item.productId?.brand}
                    </p>
                  </div>
                </div>

                {item.alreadyReviewed ? (
                  <Check className="text-green-600" />
                ) : (
                  <ChevronRight className="text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ---------- PANEL 2 : write review ---------- */}
        {active?.productId && (
          <div className={reviewCls}>
            {/* back button */}
            <button
              className="absolute top-3 left-3"
              onClick={() => setActive(null)}
            >
              <ChevronLeft />
            </button>

            <div className="p-4">
              <ProductReviewPage
                product={{
                  id: active.productId._id,
                  name: active.productId.name,
                  image: active.productId.images?.[0],
                  variant: active.selectedVariant || active.productId.brand,
                  quantity: active.quantity,
                }}
                onSuccess={() => {
                  active.alreadyReviewed = true; // mark in memory
                  setActive(null);               // go back to list
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
