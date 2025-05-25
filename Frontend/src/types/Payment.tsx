// types/Payment.ts

import type { User } from "./User";
import type { Order } from "./Order";

export type PaymentGateway =
  | "Stripe"
  | "PayPal"
  | "Google Pay"
  | "Apple Pay"
  | "Bank Transfer"
  | "Cash on Delivery";

export type PaymentStatus = "Pending" | "Completed" | "Failed" | "Refunded";

export type RefundStatus = "Not Requested" | "Requested" | "Processed" | "Rejected";

export interface PaymentMethodDetails {
  cardType?: string | null;
  last4Digits?: string | null;
  paypalEmail?: string | null;
}

export interface Payment {
  _id: string;
  userId: string | User;
  orderId: string | Order;
  paymentGateway: PaymentGateway;
  transactionId?: string;
  amountPaid: number;
  currency: string;
  paymentStatus: PaymentStatus;
  refundStatus: RefundStatus;
  refundTransactionId?: string | null;
  paymentMethodDetails?: PaymentMethodDetails;
  webhookResponse?: any;
  createdAt: string;
  updatedAt: string;
}
