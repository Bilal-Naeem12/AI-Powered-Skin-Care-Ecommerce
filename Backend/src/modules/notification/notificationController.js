const NotificationService = require("./notificationService");

// **🔹 Create a Notification**
exports.createNotification = async (req, res) => {
    try {
        const { userId, type, relatedId, relatedModel } = req.body;
        const notification = await NotificationService.createNotification(userId, type, relatedId, relatedModel);
        res.status(201).json({ message: "Notification created successfully", notification });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Get All Notifications for a User**
exports.getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await NotificationService.getUserNotifications(userId);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Mark a Notification as Read**
exports.markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await NotificationService.markAsRead(notificationId);
        res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Delete a Notification**
exports.deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await NotificationService.deleteNotification(notificationId);
        res.status(200).json({ message: "Notification deleted", notification });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
