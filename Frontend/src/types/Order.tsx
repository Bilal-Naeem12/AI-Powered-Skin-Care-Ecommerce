// types/Order.ts

import type { User } from "./User";
import type { Product } from "./Product";
import type { Payment } from "./Payment";
import type { Shipping } from "./Shipping";
import type { Invoice } from "./Invoice";
import { CartItem } from "./CartItem";



export type OrderStatus =
  | "Created"
  | "Unpaid"
  | "Paid"
  | "Cancelled"
  | "Closed";

export interface OrderStatusHistory {
  what: OrderStatus;
  updatedAt: string;
  updatedBy?: string | User;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string | User;

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
