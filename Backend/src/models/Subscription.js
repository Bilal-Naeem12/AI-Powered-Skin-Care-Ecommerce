const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    planName: {
        type: String,
        enum: ["Basic", "Standard", "Premium", "Custom"],
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
    },
    billingCycle: {
        type: String,
        enum: ["Monthly", "Quarterly", "Annually"],
        required: true
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    autoRenew: {
        type: Boolean,
        default: true
    },
    paymentMethod: {
        type: String,
        enum: ["Credit Card", "PayPal", "Google Pay", "Apple Pay"],
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ["Active", "Expired", "Canceled", "Failed"],
        default: "Active"
    },
    cancellationReason: {
        type: String,
        default: null
    },
    isRefunded: {
        type: Boolean,
        default: false
    },
    refundTransactionId: {
        type: String,
        default: null
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
SubscriptionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);
