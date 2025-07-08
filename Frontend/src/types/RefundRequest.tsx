import { Order } from "./Order";

export interface RefundRequest {
  _id: string;
  orderId: string | Order; // If you populate order, you’ll get full Order
  userId: string;          // User who made the request
  reason: "Item defective" | "Wrong item received" | "Changed my mind" | "Other";
  details?: string;
  images: string[];        // Array of proof image URLs
  status: "Pending" | "Approved" | "Rejected";
  reviewedBy?: string;     // Admin userId
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}
export interface RefundRequestPayload {
  reason: RefundRequest["reason"];
  details?: string;
  images: string[];
  username:string;
}
