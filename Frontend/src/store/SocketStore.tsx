// ✅ src/store/useSocketStore.ts

import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface SocketState {
  socket: Socket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,

  connectSocket: () => {
    // If already connected, disconnect first:
    const current = get().socket;
    if (current) {
      console.log("💥 Disconnecting old socket:", current.id);
      current.disconnect();
    }

    const s = io(import.meta.env.VITE_API_BACKEND_URL!.replace("/api", ""), {
      withCredentials: true,
    });

    s.connect();
    console.log("✅ New socket connecting...");

    set({ socket: s });
  },

  disconnectSocket: () => {
    const current = get().socket;
    if (current) {
      console.log("💥 Disconnecting socket:", current.id);
      current.disconnect();
      set({ socket: null });
    }
  },
}));

export default useSocketStore;
