const Notification = require("./notificationModel");
const { formatNotificationMessage, getRelatedModel } = require("./notificationUtils");

// **🔹 Create Notification**
exports.createNotification = async (userId, type, relatedId, relatedModel) => {
    const message = formatNotificationMessage(type, relatedModel, relatedId);
    const newNotification = new Notification({
        userId,
        type,
        message,
        relatedId,
        relatedModel: getRelatedModel(type),
    });

    await newNotification.save();
    return newNotification;
};

// **🔹 Get All Notifications for User**
exports.getUserNotifications = async (userId) => {
    return await Notification.find({ userId, isDeleted: false }).sort({ sentAt: -1 });
};

// **🔹 Mark Notification as Read**
exports.markAsRead = async (notificationId) => {
    const notification = await Notification.findById(notificationId);
    if (!notification) throw new Error("Notification not found");

    notification.isRead = true;
    await notification.save();
    return notification;
};

// **🔹 Delete Notification**
exports.deleteNotification = async (notificationId) => {
    const notification = await Notification.findById(notificationId);
    if (!notification) throw new Error("Notification not found");

    notification.isDeleted = true;
    await notification.save();
    return notification;
};
