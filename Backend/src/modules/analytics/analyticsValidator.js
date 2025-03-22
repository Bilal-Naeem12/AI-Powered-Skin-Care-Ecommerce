const { body, param } = require("express-validator");

exports.validateAnalyticsData = [
    body("metricType")
        .isIn(["TotalSales", "TotalRevenue", "NewUsers", "ActiveUsers", "ReturningCustomers", "ProductViews", "MostPurchasedProducts", "AbandonedCarts", "AverageOrderValue", "SubscriptionGrowth", "RefundRate", "OrderCompletionRate", "CustomerRetentionRate"])
        .withMessage("Invalid metric type"),
    body("period")
        .isIn(["Daily", "Weekly", "Monthly", "Yearly"])
        .withMessage("Invalid period"),
    body("value")
        .isNumeric()
        .withMessage("Value must be a number")
        .isFloat({ min: 0 })
        .withMessage("Value must be non-negative"),
    body("associatedEntity")
        .optional()
        .isMongoId()
        .withMessage("Invalid entity ID"),
    body("entityModel")
        .optional()
        .isIn(["Order", "User", "Product", "Subscription"])
        .withMessage("Invalid entity model")
];
