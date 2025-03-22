const { body } = require("express-validator");

exports.validateAuditLogData = [
    body("adminId").notEmpty().withMessage("Admin ID is required"),
    body("actionType").isIn(["User Management", "Order Management", "Product Management", "Discount Management", "Review Moderation", "System Configuration", "Payment Processing", "Security"])
        .withMessage("Invalid action type"),
    body("targetModel").isIn(["User", "Order", "Product", "Discount", "Review", "SystemConfig"]).withMessage("Invalid target model"),
    body("actionDescription").notEmpty().withMessage("Action description is required"),
    body("role").isIn(["Admin", "SuperAdmin", "Support"]).withMessage("Invalid role")
];
