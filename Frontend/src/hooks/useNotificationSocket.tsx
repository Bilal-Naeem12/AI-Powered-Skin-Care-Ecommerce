import { useEffect } from "react";
import useSocketStore from "@/store/SocketStore";
import useUserStore from "@/store/UserStore";
import type { NotificationItem } from "@/types/NotificationItem";
export default function useNotificationSocket(onReceive: (n: NotificationItem) => void) {
  const userId = useUserStore(state => state.user?._id);
  const socket = useSocketStore(state => state.socket);
  useEffect(() => {
    if (!socket || !userId) return;
    const ready = () => socket.emit("notifications:ready");
    socket.on("notifications:new", onReceive);
    socket.on("connect", ready);
    if (socket.connected) ready();
    return () => { socket.off("notifications:new", onReceive); socket.off("connect", ready); };
  }, [socket, userId, onReceive]);
}
