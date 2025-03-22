const { body } = require("express-validator");

exports.validateNotificationData = [
    body("userId").notEmpty().withMessage("User ID is required"),
    body("type").isIn(["Order", "Payment", "Shipping", "Promotion", "Review", "System"])
        .withMessage("Invalid notification type"),
    body("relatedId").notEmpty().withMessage("Related ID is required"),
    body("relatedModel").isIn(["Order", "Payment", "Shipping", "Review"])
        .withMessage("Invalid related model"),
];
