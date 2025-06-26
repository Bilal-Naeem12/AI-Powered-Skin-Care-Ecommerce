// src/types/Notification.ts

export type NotificationKind =
  | "ORDER_STATUS"
  | "ORDER_PLACED"
  | "ANALYSIS_RESULT"
  | "PROMO"
  | "ACCOUNT_SUSPENDED"
  | "ACCOUNT_RESTORED"
  | "ROLE_CHANGED";


  export interface ReadState {
  userId: string;
  readAt: string;
}

export interface NotificationItem {
  _id: string;
  kind: NotificationKind;
  title: string;
  body?: string;
  image?: string;
  createdAt: string;
  readBy: ReadState[];
}