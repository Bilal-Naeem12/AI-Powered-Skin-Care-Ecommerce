import { useEffect } from "react";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { NotificationItem } from "@/types/NotificationItem";

/**
 * Custom hook to handle real-time notification subscription.
 * Uses Zustand store for the socket reference.
 * Attaches 'notifications:new' listener and handles handshake.
 */
const useNotificationSocket = (
  onReceive: (n: NotificationItem) => void
) => {
  const { user } = useUserStore();
  const { socket } = useSocketStore();

  console.log("🧩 Zustand socket ref:", socket?.id);

  // Optional debug: show if connected
  useEffect(() => {
    if (socket) {
      console.log("🔌 Socket connected:", socket.connected);
    }
  }, [socket]);

  useEffect(() => {
    if (!socket || !user) return;

    const handleNotification = (notif: NotificationItem) => {
      console.log("🔥 Got notif:", notif);
      onReceive(notif);
    };

    const handleConnect = () => {
      console.log("✅ Subscribed AFTER connect");
      socket.on("notifications:new", handleNotification);
      socket.emit("notifications:ready");
    };

    if (socket.connected) {
      console.log("✅ Subscribed immediately");
      socket.on("notifications:new", handleNotification);
      socket.emit("notifications:ready");
    } else {
      socket.on("connect", handleConnect);
    }

    return () => {
      socket.off("notifications:new", handleNotification);
      socket.off("connect", handleConnect);
    };
  }, [socket, user, onReceive]);
};

export default useNotificationSocket;
