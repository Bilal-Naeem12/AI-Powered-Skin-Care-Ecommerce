// types/Order.ts

import type { User } from "./User";
import type { Product } from "./Product";
import type { Payment } from "./Payment";
import type { Shipping } from "./Shipping";
import type { Invoice } from "./Invoice";
import { CartItem } from "./CartItem";



export type OrderStatus =
 | "Created"   // Order initiated, payment pending
  | "Paid"      // Payment completed, processing/shipping starts
  | "Cancelled" // Order cancelled before/after payment
  |  "Refunded"
export interface OrderStatusHistory {
  what: OrderStatus;
  updatedAt: string;
  updatedBy?: string | User;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId:  User;

  cartItems: CartItem[];
  totalAmount: number;

  paymentId?:  Payment;
  shippingId?:  Shipping;
  invoiceId?:  Invoice;

  payment?: Payment;
  shipping?: Shipping;
  invoice?: Invoice;

  statusHistory: OrderStatusHistory[];
  placedAt: string;
  createdAt: string;
  updatedAt: string;
  isCancelled?: boolean;
}
