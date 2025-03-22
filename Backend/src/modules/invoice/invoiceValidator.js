const { body } = require("express-validator");

exports.validateInvoiceData = [
    body("userId").notEmpty().withMessage("User ID is required"),
    body("orderId").notEmpty().withMessage("Order ID is required"),
    body("paymentId").notEmpty().withMessage("Payment ID is required"),
    body("totalAmount").isFloat({ gt: 0 }).withMessage("Total amount should be greater than 0"),
    body("grandTotal").isFloat({ gt: 0 }).withMessage("Grand total should be greater than 0"),
    body("status").isIn(["Paid", "Unpaid", "Refunded"]).withMessage("Invalid invoice status"),
    body("paymentMethod").isIn(["Credit Card", "Debit Card", "PayPal", "Google Pay", "Apple Pay", "Bank Transfer"])
        .withMessage("Invalid payment method")
];
