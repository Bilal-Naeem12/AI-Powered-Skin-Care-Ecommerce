const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
    metricType: {
        type: String,
        enum: [
            "TotalSales", "TotalRevenue", "NewUsers", "ActiveUsers",
            "ReturningCustomers", "ProductViews", "MostPurchasedProducts",
            "AbandonedCarts", "AverageOrderValue", "SubscriptionGrowth",
            "RefundRate", "OrderCompletionRate", "CustomerRetentionRate"
        ],
        required: true
    },
    period: {
        type: String,
        enum: ["Daily", "Weekly", "Monthly", "Yearly"],
        required: true
    },
    value: {
        type: Number,
        required: true,
        min: [0, "Metric value cannot be negative"]
    },
    associatedEntity: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "entityModel",
        default: null
    },
    entityModel: {
        type: String,
        enum: ["Order", "User", "Product", "Subscription"],
        default: null
    },
    additionalData: {
        type: mongoose.Schema.Types.Mixed,
        default: {} // Stores JSON data for extra insights
    },
    trend: {
        type: String,
        enum: ["Increase", "Decrease", "Stable"],
        default: "Stable"
    },
    recordedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// **Middleware: Auto-update timestamps on save**
AnalyticsSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Analytics", AnalyticsSchema);
