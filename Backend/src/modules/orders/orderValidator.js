const { body, validationResult } = require("express-validator");

// **🔹 Validate Order Creation Data**
exports.validateCreateOrder = [
    body("items")
        .isArray({ min: 1 }).withMessage("At least one product is required.")
        .custom((items) => {
            if (items.some(item => !item.productId || !item.quantity || item.quantity < 1)) {
                throw new Error("Each item must have a valid productId and quantity");
            }
            return true;
        }),

    body("paymentMethod")
        .isIn(["Credit Card", "Debit Card", "PayPal", "Google Pay", "Apple Pay", "Cash on Delivery"])
        .withMessage("Invalid payment method"),

    body("shippingAddress")
        .notEmpty().withMessage("Shipping address is required")
        .custom(value => {
            if (!value.street || !value.city || !value.state || !value.country || !value.postal_code) {
                throw new Error("All address fields (street, city, state, country, postal code) must be provided");
            }
            return true;
        }),

    body("paymentStatus")
        .isIn(["Pending", "Completed", "Failed", "Refunded"]).withMessage("Invalid payment status"),

    // Optionally validate other fields if required
];

// **🔹 Validate Order Status Update Data**
exports.validateUpdateOrderStatus = [
    body("status")
        .isIn(["Pending", "Shipped", "Delivered", "Cancelled"]).withMessage("Invalid order status"),
];

// **🔹 Validation Result Middleware**
exports.validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
