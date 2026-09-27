import { useEffect } from "react";
import axios from "axios";
import useSocketStore from "@/store/SocketStore";
import useNotificationSocket from "@/hooks/useNotificationSocket";
import useNotificationStore from "@/store/NotificationStore";
import useUserStore from "@/store/UserStore";
import type { NotificationItem } from "@/types/NotificationItem";

export default function NotificationProvider() {
  const userId = useUserStore(state => state.user?._id);
  const { connectSocket, disconnectSocket } = useSocketStore();
  const { addNotification, clearNotifications } = useNotificationStore();
  useEffect(() => {
    const controller = new AbortController();
    clearNotifications();
    if (userId) {
      connectSocket();
      axios.get<NotificationItem[]>(`${import.meta.env.VITE_API_BACKEND_URL}/notifications`, {
        withCredentials: true, signal: controller.signal,
      }).then(({ data }) => {
        if (controller.signal.aborted || !Array.isArray(data)) return;
        const live = useNotificationStore.getState().notifications;
        const combined = [...live, ...data];
        useNotificationStore.getState().setNotifications(combined.filter((n, i) => combined.findIndex(other => other._id === n._id) === i).slice(0, 20));
      }).catch(() => { /* A failed history fetch must not replace live notifications. */ });
    }
    return () => { controller.abort(); disconnectSocket(); };
  }, [userId, connectSocket, disconnectSocket, clearNotifications]);
  useNotificationSocket(addNotification);
  return null;
}
