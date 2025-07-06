// socket.js
const { createServer } = require("http");
const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

let io;

// 🗂️ Store pending notifications per userId
const pendingNotifs = new Map();

/**
 * Initialize Socket.IO server with JWT auth + handshake support
 */
function init(app) {
  const httpServer = createServer(app);

  io = socketIO(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // ✅ Middleware for JWT auth
  io.use((socket, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie || "";
      const cookies = cookie.parse(rawCookie);
      const token = cookies["accessToken"]; // Or your cookie name!

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { userId, role } = decoded;

      socket.data.userId = userId;
      socket.data.role = role;

      next();
    } catch (err) {
      console.error("Socket auth error:", err.message);
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const { userId, role } = socket.data;

    console.log(`🔌 Socket connected: ${socket.id} (user:${userId} role: ${role})`);
    socket.join(`user:${userId}`);
    socket.join(`role:${role}`);

    // ✅ Handshake: client tells server it's ready to receive
    socket.on("notifications:ready", () => {
      console.log(`✅ Client is ready for notifications: ${socket.id}`);

      const pending = pendingNotifs.get(userId) || [];
      for (const notif of pending) {
        io.to(`user:${userId}`).emit("notifications:new", notif);
      }
      pendingNotifs.delete(userId);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return httpServer;
}

/**
 * Push a new notification, queue if client not ready yet.
 */
async function notify({
  kind,
  title,
  body = "",
  image = "",
  data = {},
  userId = null,
  role = null,
  NotificationModel, // pass your Mongoose model!
}) {
  if (!NotificationModel) throw new Error("Missing Notification model");

  const target = userId ? { scope: "user", userId } : { scope: "role", role };

  const notif = await NotificationModel.create({
    kind,
    title,
    body,
    image,
    data,
    target,
  });

  if (!io) throw new Error("Socket.io not initialized");

  if (userId) {
    // Check if any socket is in the room
    const room = io.sockets.adapter.rooms.get(`user:${userId}`);
    if (room && room.size > 0) {
      io.to(`user:${userId}`).emit("notifications:new", notif);
      console.log(`📣 Emitted immediately to user:${userId}`);
    } else {
      if (!pendingNotifs.has(userId)) pendingNotifs.set(userId, []);
      pendingNotifs.get(userId).push(notif);
      console.log(`📌 Queued notif for user:${userId}`);
    }
  }

  if (role) {
    io.to(`role:${role}`).emit("notifications:new", notif);
    console.log(`📣 Emitted to role:${role}`);
  }

  return notif;
}

/**
 * Access Socket.IO instance after init.
 */
function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

module.exports = { init, getIO, notify };
