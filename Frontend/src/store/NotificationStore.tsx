// ✅ src/store/useNotificationStore.ts
import { create } from "zustand";
import { NotificationItem } from "@/types/NotificationItem";

interface NotificationState {
  notifications: NotificationItem[];
  setNotifications: (n: NotificationItem[]) => void;
  addNotification: (n: NotificationItem) => void;
  clearNotifications: () => void;
}

const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  setNotifications: (n) => set({ notifications: n }),
  addNotification: (n) =>
    set((state) => {
      const exists = state.notifications.some((item) => item._id === n._id);
      if (exists) return state;
          console.log("🔥 Zustand addNotification:", n);
      return {
        notifications: [n, ...state.notifications].slice(0, 20),
      };
    }),
  clearNotifications: () => set({ notifications: [] }),
}));

export default useNotificationStore;
