const express = require("express");
const {
    createNotification,
    getUserNotifications,
    markAsRead,
    deleteNotification
} = require("./notificationController");

const router = express.Router();

// **🔹 Route to Create a New Notification**
router.post("/create", createNotification);

// **🔹 Route to Get All Notifications for a User**
router.get("/:userId", getUserNotifications);

// **🔹 Route to Mark a Notification as Read**
router.put("/:notificationId/read", markAsRead);

// **🔹 Route to Delete a Notification**
router.delete("/:notificationId", deleteNotification);

module.exports = router;
