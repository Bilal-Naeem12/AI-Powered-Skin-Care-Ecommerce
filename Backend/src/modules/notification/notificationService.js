const Notification = require("./notificationModel");
const { getIO } = require("../../socket");

/**
 * Create and push a notification.
 * @param {{
 *   kind: string,
 *   title: string,
 *   body?: string,
 *   image?: string,
 *   data?: object,
 *   userId?: string,
 *   role?: string
 * }}
 */
exports.notify = async ({
  kind,
  title,
  body = "",
  image = "",
  data = {},
  userId = null,
  role = null,
}) => {
  try {
  let target;

  if (userId) {
    target = { scope: "user", userId };
  } else if (role) {
    target = { scope: "role", role };
  } else {
    throw new Error("Notification must target userId or role");
  }

  const notif = await Notification.create({
    kind,
    title,
    body,
    image,
    data,
    target,
  });

  const io = getIO();

  if (userId) {
    const userRoom = io.sockets.adapter.rooms.get(`user:${userId}`);
    if (userRoom && userRoom.size > 0) {
      io.to(`user:${userId}`).emit("notifications:new", notif);
      console.log(`📣 Emitted to user:${userId}`);
    } else {
      console.log(`⚠️ No active sockets for user:${userId} — not emitted`);
      // Optionally: store to a queue here if you want to deliver later
    }
  }

  if (role) {
    const roleRoom = io.sockets.adapter.rooms.get(`role:${role}`);
    if (roleRoom && roleRoom.size > 0) {
      io.to(`role:${role}`).emit("notifications:new", notif);
      console.log(`📣 Emitted to role:${role}`);
    } else {
      console.log(`⚠️ No active sockets for role:${role} — not emitted`);
      // Optionally: store to a pending queue if you want to deliver later
    }
  }

  return notif;
  } catch (error) {
    console.error("Notification delivery failed", { name: error.name, code: error.code });
    return null;
  }
};
