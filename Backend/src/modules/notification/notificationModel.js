const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["Order", "Payment", "Shipping", "Promotion", "Review", "System"],
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "relatedModel",
        default: null // Reference to related order, payment, or other model
    },
    relatedModel: {
        type: String,
        enum: ["Order", "Payment", "Shipping", "Review"],
        default: null
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// **Middleware: Auto-update timestamps on save**
NotificationSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Notification", NotificationSchema);
