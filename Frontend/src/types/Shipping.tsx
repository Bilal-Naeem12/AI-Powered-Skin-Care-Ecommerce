// types/Shipping.ts

import type { User } from "./User";
import type { Order } from "./Order";

export type ShippingStatus =
  | "Pending"
  | "Processing"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled"
  | "Returned";

export type Carrier = "DHL" | "FedEx" | "UPS" | "USPS" | "Other";

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface Shipping {
  _id: string;
  userId: string | User;
  orderId: string | Order;
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  carrier: Carrier;
  estimatedDeliveryDate?: string;
  shippingStatus: ShippingStatus;
  deliveryConfirmation: boolean;
  isDelayed: boolean;
  delayReason?: string | null;
  createdAt: string;
  updatedAt: string;
}
