const { body } = require("express-validator");

exports.validateGiftCardData = [
    body("code").notEmpty().withMessage("Gift card code is required"),
    body("amount").isFloat({ gt: 0 }).withMessage("Gift card amount must be greater than 0"),
    body("expirationDate").isDate().withMessage("Expiration date must be a valid date"),
    body("status").isIn(["Active", "Used", "Expired"]).withMessage("Invalid gift card status"),
    body("recipientId").optional().isMongoId().withMessage("Invalid recipient ID")
];
