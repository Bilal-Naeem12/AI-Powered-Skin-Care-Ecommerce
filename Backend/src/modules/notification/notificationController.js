const Notification = require("./notificationModel");
const mongoose = require("mongoose");

// GET /api/notifications
exports.getAll = async (req, res) => {
  const userId = req.user.id;
  const roles = req.user.roles || [];

  const query = {
    $or: [
      { "target.scope": "user", "target.userId": userId },
      { "target.scope": "role", "target.role": { $in: roles } }
    ]
  };

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(30);

  res.status(200).json(notifications);
};

// GET /api/notifications/:id
exports.getOne = async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findById(id);
  if (!notification) return res.status(404).json({ message: "Not found" });

  res.status(200).json(notification);
};

// POST /api/notifications (manual or admin-triggered)
exports.create = async (req, res) => {
  const { kind, title, body, image, data, target } = req.body;
  if (!kind || !title || !target?.scope) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const notification = await Notification.create({
    kind, title, body, image, data, target
  });

  res.status(201).json(notification);
};

// PATCH /api/notifications/:id/read
exports.markAsRead = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  await Notification.updateOne(
    { _id: id, "readBy.userId": { $ne: userId } },
    { $push: { readBy: { userId, readAt: new Date() } } }
  );

  res.status(204).end();
};

// DELETE /api/notifications/:id (admin only)
exports.remove = async (req, res) => {
  const { id } = req.params;

  if (!req.user.roles?.includes("admin")) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await Notification.findByIdAndDelete(id);
  res.status(204).end();
};
