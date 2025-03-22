const { body } = require("express-validator");

exports.validateSystemConfigUpdate = [
    body("siteName").optional().isString().withMessage("Site name must be a string"),
    body("paymentGateways").optional().isObject().withMessage("Payment gateways must be an object"),
    body("shippingOptions").optional().isArray().withMessage("Shipping options must be an array"),
    body("taxSettings").optional().isObject().withMessage("Tax settings must be an object"),
    body("emailNotifications").optional().isObject().withMessage("Email notifications settings must be an object"),
    body("featureToggles").optional().isObject().withMessage("Feature toggles must be an object")
];
