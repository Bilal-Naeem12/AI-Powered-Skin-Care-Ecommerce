const { createServer } = require("http");
const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

/**
 * Initializes the Socket.IO server with JWT-based room joining
 * @param {Express.Application} app - your Express app
 * @returns {http.Server} - your HTTP server with socket
 */
function init(app) {
  const httpServer = createServer(app);

  io = socketIO(httpServer, {
    cors: {
      origin:  process.env.CLIENT_URL || "http://localhost:5173", // 🔒 Change to your frontend URL in production
      methods: ["GET", "POST"],
    },
  });

  // Authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Token missing"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { sub, role } = decoded;

      socket.data.userId = sub;
      socket.data.role = role;

      // Join user-specific room
      socket.join(`user:${sub}`);

      // Join all role-based rooms admin
      socket.join(`role:${role}`);

      next();
    } catch (err) {
      console.error("Socket auth error:", err.message);
      next(new Error("Unauthorized"));
    }
  });

  // Optional: log new connections
  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id} (user:${socket.data.userId})`);
    
    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return httpServer;
}

/**
 * Access Socket.IO instance after init
 * @returns {SocketIO.Server}
 */
function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

module.exports = { init, getIO };
