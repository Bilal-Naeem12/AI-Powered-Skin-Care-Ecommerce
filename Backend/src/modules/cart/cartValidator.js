const { body, param } = require('express-validator');

// **Validate Add Item to Cart Request**
exports.validateAddItem = [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
    body('selectedVariant').optional().isString().withMessage('Selected variant must be a string'),
];

// **Validate Remove Item from Cart Request**
exports.validateRemoveItem = [
    param('userId').notEmpty().withMessage('User ID is required'),
    param('productId').notEmpty().withMessage('Product ID is required'),
];

// **Validate Checkout Request**
exports.validateCheckout = [
    param('userId').notEmpty().withMessage('User ID is required'),
];
