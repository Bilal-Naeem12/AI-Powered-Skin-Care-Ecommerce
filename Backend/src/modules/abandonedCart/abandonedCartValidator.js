const { body, validationResult } = require("express-validator");

// **🔹 Validate Create Abandoned Cart**
exports.validateCreateAbandonedCart = [
    body("userId")
        .notEmpty().withMessage("User ID is required")
        .isMongoId().withMessage("Invalid User ID format"),

    body("cartItems")
        .isArray({ min: 1 }).withMessage("At least one item is required in the cart")
        .custom((items) => {
            for (let item of items) {
                if (!item.productId || !item.quantity || item.quantity < 1) {
                    throw new Error("Each item must have a valid product ID and quantity");
                }
            }
            return true;
        }),

    body("totalAmount")
        .isNumeric().withMessage("Total amount must be a number")
        .notEmpty().withMessage("Total amount is required"),

    body("discountOffered")
        .optional()
        .isNumeric().withMessage("Discount offered must be a number")
        .isInt({ min: 0 }).withMessage("Discount must be greater than or equal to 0")
];

// **🔹 Validation Result Middleware**
exports.validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
