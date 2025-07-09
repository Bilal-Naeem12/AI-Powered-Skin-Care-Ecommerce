import { useEffect, useCallback } from "react";
import axios from "axios";
import useSocketStore from "@/store/SocketStore";
import useNotificationSocket from "@/hooks/useNotificationSocket";
import useNotificationStore from "@/store/NotificationStore";
import useUserStore from "@/store/UserStore";
import { NotificationItem } from "@/types/NotificationItem";

/**
 * NotificationProvider
 * 
 * - Connects the socket when user is logged in.
 * - Fetches latest notifications on mount.
 * - Listens for real-time notifications via useNotificationSocket.
 * - Disconnects and clears store on logout.
 */
const NotificationProvider = () => {
  const { isLoggedIn } = useUserStore();
  const { connectSocket, disconnectSocket, socket } = useSocketStore();
  const { setNotifications, addNotification, clearNotifications } = useNotificationStore();

  /**
   * Fetches initial notification history from backend.
   */
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get<NotificationItem[]>(
        `${import.meta.env.VITE_API_BACKEND_URL}/notifications`,
        { withCredentials: true }
      );
      // Keep only latest 20
      setNotifications(res.data.slice(0, 20));
    } catch (err) {
      console.error("❌ Failed to fetch notifications:", err);
    }
  }, [setNotifications]);

  /**
   * Manage socket lifecycle and history sync based on auth state.
   */
  useEffect(() => {
    if (isLoggedIn) {
      connectSocket();         // ✅ Open new socket
      fetchNotifications();    // ✅ Load latest from DB
    } else {
      disconnectSocket();      // ✅ Clean up
      clearNotifications();    // ✅ Clear local store
    }
  }, [isLoggedIn, connectSocket, disconnectSocket, fetchNotifications, clearNotifications]);

  /**
   * Attach real-time push handler.
   */
  useNotificationSocket((newNotif) => {
    console.log("✅ Socket push received:", newNotif);
    addNotification(newNotif);
  });

  return null; // This provider just wires side effects, no UI.
};

export default NotificationProvider;
