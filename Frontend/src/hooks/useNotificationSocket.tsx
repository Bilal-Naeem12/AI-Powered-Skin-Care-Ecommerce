// src/hooks/useNotificationSocket.ts
import { useEffect } from "react";
import { getSocket } from "@/utils/socket";
import { NotificationItem } from "@/types/NotificationItem";

const useNotificationSocket = (onReceive: (n: NotificationItem) => void) => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNotification = (notif: NotificationItem) => {
      onReceive(notif);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [onReceive]);
};

export default useNotificationSocket;
