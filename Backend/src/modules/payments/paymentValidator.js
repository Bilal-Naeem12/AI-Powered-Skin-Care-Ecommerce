const { body, validationResult } = require("express-validator");

// **🔹 Validate Create Payment Data**
exports.validateCreatePayment = [
    body("orderId")
        .notEmpty().withMessage("Order ID is required")
        .isMongoId().withMessage("Invalid Order ID format"),

    body("paymentGateway")
        .notEmpty().withMessage("Payment gateway is required")
        .isIn(["Stripe", "PayPal", "Google Pay", "Apple Pay", "Bank Transfer", "Cash on Delivery"])
        .withMessage("Invalid payment gateway"),

    body("transactionId")
        .notEmpty().withMessage("Transaction ID is required")
        .isLength({ min: 5 }).withMessage("Transaction ID must be at least 5 characters long"),

    body("amountPaid")
        .isNumeric().withMessage("Amount paid must be a number")
        .notEmpty().withMessage("Amount paid is required")
        .custom(value => value >= 0).withMessage("Amount paid cannot be negative"),

    body("paymentStatus")
        .optional()
        .isIn(["Pending", "Completed", "Failed", "Refunded"]).withMessage("Invalid payment status"),

    body("paymentMethodDetails")
        .optional()
        .isObject().withMessage("Payment method details must be an object")
];

// **🔹 Validate Refund Status Update**
exports.validateRefundStatus = [
    body("refundStatus")
        .notEmpty().withMessage("Refund status is required")
        .isIn(["Not Requested", "Requested", "Processed", "Rejected"])
        .withMessage("Invalid refund status"),

    body("refundTransactionId")
        .optional()
        .isLength({ min: 5 }).withMessage("Refund transaction ID must be at least 5 characters long")
];

// **🔹 Validation Result Middleware**
exports.validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
