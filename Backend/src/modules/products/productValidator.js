const { body, validationResult } = require("express-validator");

// **🔹 Validate Create Product Data**
exports.validateCreateProduct = [
    body("name")
        .notEmpty().withMessage("Product name is required")
        .trim()
        .isLength({ min: 3 }).withMessage("Product name must be at least 3 characters long"),

    body("description")
        .notEmpty().withMessage("Product description is required")
        .trim()
        .isLength({ min: 10 }).withMessage("Description should be at least 10 characters long"),

    body("category")
        .notEmpty().withMessage("Product category is required")
        .isIn(["Moisturizer", "Cleanser", "Serum", "Sunscreen", "Exfoliator", "Toner", "Mask", "Other"])
        .withMessage("Invalid category"),

    body("brand")
        .notEmpty().withMessage("Brand name is required")
        .trim()
        .isLength({ min: 2 }).withMessage("Brand name must be at least 2 characters long"),

    body("price")
        .isNumeric().withMessage("Price must be a number")
        .notEmpty().withMessage("Price is required")
        .custom(value => value >= 0).withMessage("Price cannot be negative"),

    body("stock")
        .isInt({ min: 0 }).withMessage("Stock cannot be negative"),

    body("images")
        .isArray({ min: 1 }).withMessage("At least one product image is required"),

    body("discount.percentage")
        .optional()
        .isNumeric().withMessage("Discount percentage must be a number")
        .custom(value => value >= 0 && value <= 100).withMessage("Discount percentage must be between 0 and 100"),

    // Optionally you can add more validation for variants, allergens, ingredients, etc.
];

// **🔹 Validate Update Product Data**
exports.validateUpdateProduct = [
    body("name")
        .optional()
        .isLength({ min: 3 }).withMessage("Product name must be at least 3 characters long"),

    body("description")
        .optional()
        .isLength({ min: 10 }).withMessage("Description should be at least 10 characters long"),

    body("price")
        .optional()
        .isNumeric().withMessage("Price must be a number")
        .custom(value => value >= 0).withMessage("Price cannot be negative"),

    body("stock")
        .optional()
        .isInt({ min: 0 }).withMessage("Stock cannot be negative"),

    body("images")
        .optional()
        .isArray({ min: 1 }).withMessage("At least one product image is required"),

    body("discount.percentage")
        .optional()
        .isNumeric().withMessage("Discount percentage must be a number")
        .custom(value => value >= 0 && value <= 100).withMessage("Discount percentage must be between 0 and 100"),

    // You can add validation for other fields like variants, allergens, ingredients, etc.
];

// **🔹 Validation Result Middleware**
exports.validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
