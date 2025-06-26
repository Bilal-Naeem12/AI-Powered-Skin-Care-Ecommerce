import { io, Socket } from "socket.io-client";

let socket: Socket;

export const createSocket = (token: string): Socket => {
  socket = io(import.meta.env.VITE_API_BACKEND_URL!.replace("/api", ""), {
    auth: { token },
    autoConnect: false,
    withCredentials: true,
  });

  return socket;
};

export const getSocket = () => socket;