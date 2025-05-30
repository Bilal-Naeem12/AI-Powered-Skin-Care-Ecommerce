import React from "react";
import { X ,ForwardIcon} from "lucide-react";
import { Product } from "@/types/Product";
import OrderImageCarousel from "../../OrderImageCarousel";
import { Link } from "react-router-dom";
// import Image from "next/image";

interface CartItem {
  productId: Product;
  priceAtTimeOfOrder: number;
  quantity: number;
  selectedVariant?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  cartItems: any;
}

export default function LeaveReviewModal({ open, onClose, cartItems }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center ">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-10 relative max-h-4/5 overflow-y-auto">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold mb-4 text-center">Leave a review</h2>

        {/* All Item Thumbnails */}
        <div className="flex overflow-x-auto gap-2 mb-5 px-1 scrollbar-hide">
             <OrderImageCarousel cartItems={cartItems} width="w-full" />
        </div>

        {/* Review List */}
        <div className="divide-y  ">
          {cartItems.map((item: any , idx: number) => (
           
           

           <div
              key={idx}
              className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 px-1 rounded"
            >
              <div className="flex gap-3 items-center">
                <img
                  src={item.productId?.images?.[0]}
                  alt="Product"
                  className="w-12 h-12 object-cover rounded border"
                />
                <div className="flex flex-col text-sm">
                  <span className="font-medium line-clamp-1">
                    {item.productId?.name}
                  </span>
                  <span className="text-gray-500">
                    {item.selectedVariant || item.productId?.brand}
                  </span>
                </div>
              </div>
              <div className="text-sm  font-medium"><ForwardIcon/></div>
            </div>
           
          ))}
        </div>
      </div>
    </div>
  );
}
