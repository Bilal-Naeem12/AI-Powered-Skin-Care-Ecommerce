// types/Invoice.ts

import type { User } from "./User";
import type { Order } from "./Order";
import type { Payment } from "./Payment";

export type InvoiceStatus = "Paid" | "Unpaid" | "Refunded";
export type InvoicePaymentMethod =
  | "Credit Card"
  | "Debit Card"
  | "PayPal"
  | "Google Pay"
  | "Apple Pay"
  | "Bank Transfer";

export interface Invoice {
  _id: string;
  invoiceNumber: string;

  userId: string | User;
  orderId: string | Order;
  paymentId: string | Payment;

  invoiceDate: string;
  dueDate?: string;

  totalAmount: number;
  taxAmount?: number;
  discountAmount?: number;
  grandTotal: number;

  paymentMethod: InvoicePaymentMethod;
  transactionId: string;
  invoiceFileUrl?: string | null;

  status: InvoiceStatus;

  createdAt: string;
  updatedAt: string;
}
