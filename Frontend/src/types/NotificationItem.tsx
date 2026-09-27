// src/types/Notification.ts
export type NotificationKind =
  | "ORDER_STATUS"           // user: order update
  | "ORDER_PLACED"           // user: confirmation
  | "ANALYSIS_RESULT"        // user: skin report ready
  | "PROMO"                  // user: marketing promo
  | "FEEDBACK_REPLY"         // user: ticket response

  | "NEW_USER"               // admin: new user signed up
  | "NEW_ORDER"              // admin: order placed
  | "STOCK_LOW"              // admin: inventory alert
  | "REPORT_RECEIVED"        // admin: complaint filed
  | "ANALYSIS_ALERT"         // admin: failed/flagged analysis

  | "ACCOUNT_SUSPENDED"      // account action
  | "ACCOUNT_RESTORED"
  | "ROLE_CHANGED"

  | "MANAGEMENT_ORDER_PLACED"
  |"MANAGEMENT_REFUND_REQUEST"
  |"CONTACT_MESSAGE"; // admin: internal order notification

  export interface ReadState {
  userId: string;
  readAt: string;
}

export interface NotificationItem {
  _id: string;
  kind: NotificationKind;
  data: { orderId?: string; skinHistoryId?: string };
  title: string;
  body?: string;
  image?: string;
  createdAt: string;
  readBy: ReadState[];
}