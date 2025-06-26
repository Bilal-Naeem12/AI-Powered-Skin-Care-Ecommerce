const Notification = require("./notificationModel");
const { getIO } = require("../../socket"); // socket instance

/**
 * Create and push a notification
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
  role = null
}) => {
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
    target
  });

  const io = getIO();

  if (userId) {
    io.to(`user:${userId}`).emit("notifications:new", notif);
  }

  if (role) {
    io.to(`role:${role}`).emit("notifications:new", notif);
  }

  return notif;
};
